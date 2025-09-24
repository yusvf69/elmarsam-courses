"use server";

import { buildPaymobIframeUrl, createPaymobOrder, createPaymobPaymentKey } from "@/lib/paymob";
import { urlFor } from "@/sanity/lib/image";
import getCourseById from "@/sanity/lib/courses/getCourseById";
import { createStudentIfNotExists } from "@/sanity/lib/student/createStudentIfNotExists";
import { clerkClient } from "@clerk/nextjs/server";
import { createEnrollment } from "@/sanity/lib/student/createEnrollment";

export async function createStripeCheckout(
  courseId: string,
  userId: string,
) {
  try {
    // 1. Query course details from Sanity
    const course = await getCourseById(courseId);
    const clerkUser = await (await clerkClient()).users.getUser(userId);
    const { emailAddresses, firstName, lastName, imageUrl } = clerkUser;
    const email = emailAddresses[0]?.emailAddress;

    if (!emailAddresses || !email) {
      throw new Error("User details not found");
    }

    if (!course) {
      throw new Error("Course not found");
    }

    // mid step - create a user in sanity if it doesn't exist
    const user = await createStudentIfNotExists({
      clerkId: userId,
      email: email || "",
      firstName: firstName || email,
      lastName: lastName || "",
      imageUrl: imageUrl || "",
    });

    if (!user) {
      throw new Error("User not found");
    }

    // 2. Validate course data and prepare price for gateway
    if (!course.price && course.price !== 0) {
      throw new Error("Course price is not set");
    }
    const priceInCents = Math.round(course.price * 100);

    // if course is free, create enrollment and redirect to course page (BYPASS PAYMENT)
    if (priceInCents === 0) {
      await createEnrollment({
        studentId: user._id,
        courseId: course._id,
        paymentId: "free",
        amount: 0,
      });

      return { url: `/courses/${course.slug?.current}` };
    }

    const { title, description, image, slug } = course;

    if (!title || !description || !image || !slug) {
      throw new Error("Course data is incomplete");
    }

    // 3. Create Paymob order and payment key, then return iframe URL
    const merchantOrderId = `${course._id}-${userId}-${Date.now()}`;
    const orderId = await createPaymobOrder({
      merchantOrderId,
      amountCents: priceInCents,
    });

    const integrationId = Number(process.env.PAYMOB_CARD_INTEGRATION_ID || NaN);

    const paymentKey = await createPaymobPaymentKey({
      orderId,
      amountCents: priceInCents,
      email,
      firstName: firstName || "",
      lastName: lastName || "",
      integrationId: Number.isFinite(integrationId) ? integrationId : undefined,
    });

    const url = buildPaymobIframeUrl(paymentKey, {
      successUrl: `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/courses/${slug.current}`,
      errorUrl: `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/courses/${slug.current}?canceled=true`,
    });
    return { url };
  } catch (error) {
    console.error("Error in createStripeCheckout:", error);
    throw new Error(`Failed to create checkout session: ${(error as Error).message}`);
  }
}
