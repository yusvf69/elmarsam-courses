"use server";

import { uncompleteLessonById } from "@/sanity/lib/lessons/uncompleteLessonById";
import { sanityFetch } from "@/sanity/lib/live";
import { revalidateTag } from "next/cache";

type LessonQueryResult = {
  module?: {
    course?: {
      _id: string;
    };
  };
};

export async function uncompleteLessonAction(
  lessonId: string,
  clerkId: string,
) {
  console.log("uncompleteLessonAction lessonId:", lessonId, "clerkId:", clerkId);
  try {
    await uncompleteLessonById({
      lessonId,
      clerkId,
    });
    console.log("uncompleteLessonAction uncompleteLessonById called");

    const raw = await sanityFetch({
      query: `*[_type == "lesson" && _id == $lessonId][0]{"module": module->{"course": course->{_id}}}`,
      params: { lessonId },
    });

    // Normalize possible response shapes:
    // - Some helpers return the result directly: { module: { ... } }
    // - Others return { data: { module: { ... } } }
    const lesson = (raw && typeof raw === "object" && "data" in (raw as any))
      ? (raw as any).data as LessonQueryResult | null
      : (raw as LessonQueryResult | null);

    console.log("uncompleteLessonAction lesson:", lesson);

    const courseId = lesson?.module?.course?._id;
    if (courseId) {
      revalidateTag(`course-progress:${courseId}`);
      revalidateTag(`course:${courseId}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error uncompleting lesson:", error);
    throw error;
  }
}