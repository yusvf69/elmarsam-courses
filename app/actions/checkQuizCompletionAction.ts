// checkQuizCompletionAction.ts
import { getLessonCompletions } from "@/sanity/lib/lessons/getLessonCompletions";

export async function checkQuizCompletionAction(lessonId: string, userId: string): Promise<boolean> {
  try {
    const lessonCompletionsData = await getLessonCompletions(userId, lessonId);
    const lessonCompletions = lessonCompletionsData.completedLessons;
    return lessonCompletions.some((completion: any) => completion.quizPassed);
  } catch (error) {
    console.error("Failed to check quiz completion:", error);
    return false;
  }
}