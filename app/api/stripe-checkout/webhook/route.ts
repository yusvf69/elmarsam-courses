import { NextResponse } from "next/server";
import { verifyPaymobHmac } from "@/lib/paymob";
import { getStudentByClerkId } from "@/sanity/lib/student/getStudentByClerkId";
import { createEnrollment } from "@/sanity/lib/student/createEnrollment";

// Repurposed: handle Paymob transaction notifications
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const obj = body?.obj ?? {};

    const isValid = verifyPaymobHmac({
      amount_cents: obj.amount_cents,
      created_at: obj.created_at,
      currency: obj.currency,
      error_occured: obj.error_occured,
      has_parent_transaction: obj.has_parent_transaction,
      id: obj.id,
      integration_id: obj.integration_id,
      is_3d_secure: obj.is_3d_secure,
      is_auth: obj.is_auth,
      is_capture: obj.is_capture,
      is_refunded: obj.is_refunded,
      is_standalone_payment: obj.is_standalone_payment,
      is_voided: obj.is_voided,
      merchant_order_id: obj.merchant_order_id,
      order: obj.order?.id ?? obj.order,
      owner: obj.owner,
      pending: obj.pending,
      source_data_pan: obj.source_data?.pan,
      source_data_sub_type: obj.source_data?.sub_type,
      source_data_type: obj.source_data?.type,
      success: obj.success,
      hmac: body?.hmac,
    });

    if (!isValid) {
      return new NextResponse("Invalid HMAC", { status: 400 });
    }

    if (obj.success !== true) {
      return new NextResponse("Ignored non-successful transaction", { status: 200 });
    }

    const merchantOrderId: string = obj.merchant_order_id || "";
    const [courseId, userId] = merchantOrderId.split("-");

    if (!courseId || !userId) {
      return new NextResponse("Missing metadata", { status: 400 });
    }

    const student = await getStudentByClerkId(userId);
    if (!student.data) {
      return new NextResponse("Student not found", { status: 400 });
    }

    await createEnrollment({
      studentId: student.data._id,
      courseId,
      paymentId: String(obj.id),
      amount: Number(obj.amount_cents) / 100,
    });

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Error in Paymob webhook handler:", error);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }
}
