import { client } from "../adminClient";
import { sanityFetch } from "../live";
import groq from "groq";

interface UncompleteLessonParams {
  lessonId: string;
  clerkId: string;
}

export async function uncompleteLessonById({
  lessonId,
  clerkId,
}: UncompleteLessonParams) {
  console.log("uncompleteLessonById lessonId:", lessonId, "clerkId:", clerkId);
  // Get Sanity student ID from Clerk ID
  const student = await sanityFetch({
    query: groq`*[_type == "student" && clerkId == $clerkId][0]._id`,
    params: { clerkId },
  });
  console.log("uncompleteLessonById student:", student);

  if (!student.data) {
    throw new Error("Student not found");
  }

  // Find and delete the lesson completion record
  // Fetch the lesson completion ID
  const completionToDelete = await sanityFetch({
    query: groq`*[_type == "lessonCompletion" && student._ref == $studentId && lesson._ref == $lessonId][0]._id`,
    params: { studentId: student.data, lessonId },
  });

  if (completionToDelete.data) {
    console.log("uncompleteLessonById deleting completion with ID:", completionToDelete.data);
    await client.delete(completionToDelete.data);
  } else {
    console.log("uncompleteLessonById No lesson completion found to delete");
  }
}
