"use server";

import { completeLessonById } from "@/sanity/lib/lessons/completeLessonById";
import { sanityFetch } from "@/sanity/lib/live";
import { revalidateTag } from "next/cache";

export async function completeLessonAction(lessonId: string, clerkId: string) {
  console.log("completeLessonAction lessonId:", lessonId, "clerkId:", clerkId);
  try {
    const result = await completeLessonById({
      lessonId,
      clerkId,
    });
    console.log("completeLessonAction result:", result);

    const lesson = await sanityFetch<{ module: { course: { _id: string } } }>({
      query: `*[_type == "lesson" && _id == $lessonId][0]{"module": module->{"course": course->{_id}}}`,
      params: { lessonId },
    });
    console.log("completeLessonAction lesson.data:", lesson.data);

    if (lesson.data?.module?.course?._id) {
      revalidateTag(`course-progress:${lesson.data.module.course._id}`);
      revalidateTag(`course:${lesson.data.module.course._id}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error completing lesson:", error);
    return { success: false, error: "Failed to complete lesson" };
  }
}
