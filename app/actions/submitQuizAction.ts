// submitQuizAction.ts
"use server";

import { currentUser } from "@clerk/nextjs/server";
import { getStudentByClerkId } from "@/sanity/lib/student/getStudentByClerkId";
import { client } from "@/sanity/lib/client";

export const submitQuizAction = async (
  lessonId: string,
  answers: number[]
) => {
  const user = await currentUser();

  if (!user?.id) {
    return {
      error: "Unauthorized",
    };
  }

  try {
    const student = await getStudentByClerkId(user.id);

    if (!student) {
      return {
        error: "Student not found",
      };
    }

    const lesson = await client.fetch(
      `*[_type == "lesson" && _id == $lessonId][0]{
        _id,
        quiz->{
          _id,
          questions[]{
            question,
            answers,
            correctAnswer
          }
        }
      }`,
      { lessonId }
    );

    if (!lesson) {
      return {
        error: "Lesson not found",
      };
    }

    if (!lesson.quiz) {
      return {
        error: "Quiz not found for this lesson",
      };
    }

    let correctAnswers = 0;
    lesson.quiz.questions.forEach((question: any, index: number) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = correctAnswers / lesson.quiz.questions.length;

    // Create a new document type called "quizResult"
    // and store the student's ID, lesson ID, and score.
    await client.create({
      _type: "quizResult",
      student: {
        _type: "reference",
        _ref: student.data._id,
      },
      lesson: {
        _type: "reference",
        _ref: lessonId,
      },
      score,
    });

    return {
      success: true,
      score,
    };
  } catch (error: any) {
    console.error(error);
    return {
      error: error.message || "Something went wrong",
    };
  }
};