// WrittenAnswerQuiz.tsx
"use client";

import { useState } from "react";

interface WrittenAnswerQuizProps {
  question: any; // Replace 'any' with the actual type of your question object
  onAnswerSubmit: (answer: string) => void;
}

const WrittenAnswerQuiz = ({ question, onAnswerSubmit }: WrittenAnswerQuizProps) => {
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    onAnswerSubmit(answer);
  };

  return (
    <div className="mb-4">
      <p className="font-semibold text-lg mb-2">{question.question}</p>
      <textarea
        className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200"
        rows={4}
        placeholder="Type your answer here..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 mt-4"
      >
        Submit Answer
      </button>
    </div>
  );
};

export default WrittenAnswerQuiz;