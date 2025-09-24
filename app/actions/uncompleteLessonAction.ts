"use server";

import { uncompleteLessonById } from "@/sanity/lib/lessons/uncompleteLessonById";
import { sanityFetch } from "@/sanity/lib/live";
import { revalidateTag } from "next/cache";

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

    const lesson = await sanityFetch<{ module: { course: { _id: string } } }>({
      query: `*[_type == "lesson" && _id == $lessonId][0]{"module": module->{"course": course->{_id}}}`,
      params: { lessonId },
    });
    console.log("uncompleteLessonAction lesson.data:", lesson.data);

    if (lesson.data?.module?.course?._id) {
      revalidateTag(`course-progress:${lesson.data.module.course._id}`);
      revalidateTag(`course:${lesson.data.module.course._id}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error uncompleting lesson:", error);
    throw error;
  }
}
