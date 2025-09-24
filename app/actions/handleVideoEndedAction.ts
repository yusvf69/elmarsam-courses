"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { completeLessonAction } from "./completeLessonAction";
import getCourseById from "@/sanity/lib/courses/getCourseById";
import { currentUser } from "@clerk/nextjs/server";

// تعريف الأنواع
interface Lesson {
  _id: string;
  // أضف خصائص أخرى إذا احتجت
}

interface Module {
  lessons?: Lesson[];
  // أضف خصائص أخرى إذا احتجت
}

export async function handleVideoEndedAction(
  courseId: string,
  lessonId: string,
) {
  const user = await currentUser();
  if (!user) {
    return;
  }

  await completeLessonAction(lessonId, user.id);

  revalidateTag(`course-progress:${courseId}`);
  revalidateTag(`course:${courseId}`);

  const course = await getCourseById(courseId);
  if (!course || !course.modules) {
    return;
  }

  // استخدم الأنواع هنا
  const allLessons = (course.modules as Module[]).flatMap((module) => module.lessons || []);
  const currentLessonIndex = allLessons.findIndex(
    (lesson) => lesson._id === lessonId,
  );

  if (currentLessonIndex !== -1 && currentLessonIndex < allLessons.length - 1) {
    const nextLesson = allLessons[currentLessonIndex + 1];
    redirect(`/dashboard/courses/${courseId}/lessons/${nextLesson._id}`);
  }
}
