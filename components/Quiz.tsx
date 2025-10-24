// Quiz.tsx
"use client";

import { useState, useEffect } from "react";
import MultipleChoiceQuiz from "./MultipleChoiceQuiz";
import WrittenAnswerQuiz from "./WrittenAnswerQuiz";
import ImageBasedQuiz from "./ImageBasedQuiz";

interface QuizProps {
  quiz: any;
  lessonId: string;
}

const Quiz = ({ quiz, lessonId }: QuizProps) => {
  const [answers, setAnswers] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const passingPercentage = 30;

  useEffect(() => {
    if (showResults && score < passingPercentage) {
      // Reset state for quiz repetition
      setAnswers([]);
      setScore(0);
      setShowResults(false);
      setAttempts((prevAttempts) => prevAttempts + 1);
    }
  }, [showResults, score, passingPercentage]);

  const handleAnswerSelect = (questionIndex: number, answerIndices: number[]) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndices;
    setAnswers(newAnswers);
  };

  const handleWrittenAnswerSubmit = (questionIndex: number, answer: string) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleImageAnswerSubmit = (questionIndex: number, imageUrl: string) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = imageUrl;
    setAnswers(newAnswers);
  };

  const calculateScore = () => {
    let correctAnswersCount = 0;
    quiz.questions.forEach((question: any, index: number) => {
      if (question.questionType === "multiple-choice") {
        const correctAnswers = question.correctAnswers || [];
        const selectedAnswers = answers[index] || [];

        const isCorrect =
          correctAnswers.length === selectedAnswers.length &&
          correctAnswers.every((correctAnswer: number) =>
            selectedAnswers.includes(correctAnswer)
          );

        if (isCorrect) {
          correctAnswersCount++;
        }
      } else {
        // For other question types, implement scoring logic as needed
        // This is a placeholder, so it doesn't affect the score
      }
    });

    return (correctAnswersCount / quiz.questions.length) * 100;
  };

  const handleSubmit = async () => {
    const calculatedScore = calculateScore();
    setScore(calculatedScore);
    setShowResults(true);

    // Implement submit logic here, taking into account the different question types
    // and the corresponding answers.
    // You'll need to update the submitQuizAction to handle the new data structure.
    // For now, just display the answers in the console.
    console.log("Answers:", answers);
    console.log("Score:", calculatedScore);

    // const result = await submitQuizAction(lessonId, answers);

    // if (result?.success) {
    //   setScore(result.score);
    //   setShowResults(true);
    // } else {
    //   // Handle error
    //   console.error(result?.error);
    //   alert("Failed to submit quiz. Please try again.");
    // }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {quiz && quiz.questions ? (
        <>
          {quiz.questions.map((question: any, questionIndex: number) => {
            switch (question.questionType) {
              case "multiple-choice":
                return (
                  <MultipleChoiceQuiz
                    key={questionIndex}
                    question={question}
                    onAnswerSelect={(answerIndices) =>
                      handleAnswerSelect(questionIndex, answerIndices)
                    }
                  />
                );
              case "written-answer":
                return (
                  <WrittenAnswerQuiz
                    key={questionIndex}
                    question={question}
                    onAnswerSubmit={(answer) =>
                      handleWrittenAnswerSubmit(questionIndex, answer)
                    }
                  />
                );
              case "image-based":
                return (
                  <ImageBasedQuiz
                    key={questionIndex}
                    question={question}
                    onAnswerSubmit={(imageUrl) =>
                      handleImageAnswerSubmit(questionIndex, imageUrl)
                    }
                  />
                );
              default:
                return <p key={questionIndex}>Unsupported question type.</p>;
            }
          })}

          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Submit
          </button>

          {showResults && (
            <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-lg">
              <p className="font-semibold">
                You scored {score.toFixed(2)}% out of 100%
              </p>
              {score < passingPercentage && (
                <p className="text-red-500">
                  You need to score at least {passingPercentage}% to pass. Please try again.
                </p>
              )}
            </div>
          )}
          {attempts > 0 && (
            <p className="mt-2 text-sm text-gray-500">
              Attempt: {attempts + 1}
            </p>
          )}
        </>
      ) : (
        <p>No quiz available for this lesson.</p>
      )}
    </div>
  );
};

export default Quiz;