// quizResultType.ts
import { defineType, defineField } from "sanity";

export const quizResultType = defineType({
  name: "quizResult",
  title: "Quiz Result",
  type: "document",
  fields: [
    defineField({
      name: "student",
      title: "Student",
      type: "reference",
      to: [{ type: "student" }],
    }),
    defineField({
      name: "lesson",
      title: "Lesson",
      type: "reference",
      to: [{ type: "lesson" }],
    }),
    defineField({
      name: "score",
      title: "Score",
      type: "number",
    }),
  ],
});