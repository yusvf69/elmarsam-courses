// quizType.ts
import { defineType, defineField } from "sanity";

export const quizType = defineType({
  name: "quiz",
  title: "Quiz",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Quiz Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "questions",
      title: "Questions",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "answers",
              title: "Answers",
              type: "array",
              of: [{ type: "string" }],
              validation: (Rule) => Rule.required().min(2),
            }),
            defineField({
              name: "questionType",
              title: "Question Type",
              type: "string",
              options: {
                list: [
                  { title: "Multiple Choice", value: "multiple-choice" },
                  { title: "Written Answer", value: "written-answer" },
                  { title: "Image Based", value: "image-based" },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "correctAnswers",
              title: "Correct Answers",
              type: "array",
              of: [{ type: "number" }],
              validation: (Rule) => Rule.required().min(0),
              description: "Indices of the correct answers in the answers array",
              hidden: ({ parent }) => parent?.questionType !== "multiple-choice",
            }),
            defineField({
              name: "imageUrl",
              title: "Image URL",
              type: "string",
              hidden: ({ parent }) => parent?.questionType !== "image-based",
            }),
          ]
        },
      ],
    }),
  ],
});