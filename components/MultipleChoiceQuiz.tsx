// MultipleChoiceQuiz.tsx
"use client";

import { useState } from "react";

interface MultipleChoiceQuizProps {
  question: any; // Replace 'any' with the actual type of your question object
  onAnswerSelect: (answerIndices: number[]) => void;
}

const MultipleChoiceQuiz = ({ question, onAnswerSelect }: MultipleChoiceQuizProps) => {
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswers.includes(answerIndex)) {
      setSelectedAnswers(selectedAnswers.filter((index) => index !== answerIndex));
    } else {
      setSelectedAnswers([...selectedAnswers, answerIndex]);
    }
  };

  return (
    <div className="mb-4">
      <p className="font-semibold text-lg mb-2">{question.question}</p>
      {question.answers.map((answer: string, answerIndex: number) => (
        <label
          key={answerIndex}
          className={`flex items-center p-3 rounded border border-gray-300 hover:bg-gray-50 transition-colors duration-200 ${
            selectedAnswers.includes(answerIndex)
              ? "bg-blue-100 border-blue-500"
              : ""
          }`}
        >
          <input
            type="checkbox"
            name={`question-${question.id}`}
            value={answerIndex}
            checked={selectedAnswers.includes(answerIndex)}
            onChange={() => handleAnswerSelect(answerIndex)}
            className="mr-2 focus:ring-0"
          />
          <span>{answer}</span>
        </label>
      ))}
      <button
        onClick={() => onAnswerSelect(selectedAnswers)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 mt-4"
      >
        Submit Answer
      </button>
    </div>
  );
};

export default MultipleChoiceQuiz;