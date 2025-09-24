import { defineQuery } from "groq";
import { sanityFetch } from "../live";
import { getStudentByClerkId } from "../student/getStudentByClerkId";

export async function getLessonCompletionStatus(
  lessonId: string,
  clerkId: string
) {
  console.log("getLessonCompletionStatus lessonId:", lessonId, "clerkId:", clerkId);
  // First get the student's Sanity ID
  const student = await getStudentByClerkId(clerkId);
  console.log("getLessonCompletionStatus student:", student);
  if (!student?.data?._id) {
    throw new Error("Student not found");
  }

  const completionStatusQuery = defineQuery(`*[_type == "lessonCompletion" && student._ref == $studentId && lesson._ref == $lessonId][0] {
    ...
  }`);

  console.log("getLessonCompletionStatus completionStatusQuery:", completionStatusQuery);

  const result = await sanityFetch({
    query: completionStatusQuery,
    params: { studentId: student.data._id, lessonId },
  });
  console.log("getLessonCompletionStatus result:", result);
  return result.data !== null;
}
