"use server";

import { getLessonCompletionStatus } from "@/sanity/lib/lessons/getLessonCompletionStatus";

export async function getLessonCompletionStatusAction(
  lessonId: string,
  clerkId: string
) {
  try {
    console.log("getLessonCompletionStatusAction lessonId:", lessonId, "clerkId:", clerkId);
    const completionStatus = await getLessonCompletionStatus(lessonId, clerkId);
    console.log("getLessonCompletionStatusAction completionStatus:", completionStatus);
    return completionStatus;
  } catch (error) {
    console.error("Error getting lesson completion status:", error);
    return false;
  }
}
