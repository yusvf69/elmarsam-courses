// ImageBasedQuiz.tsx
"use client";

import { useState } from "react";

interface ImageBasedQuizProps {
  question: any; // Replace 'any' with the actual type of your question object
  onAnswerSubmit: (imageUrl: string) => void;
}


interface ImageBasedQuizProps {
  question: any;
  onAnswerSubmit: (imageUrl: string) => void;
}

const ImageBasedQuiz = ({ question, onAnswerSubmit }: ImageBasedQuizProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (selectedImage) {
      onAnswerSubmit(selectedImage);
    } else {
      alert("Please upload an image.");
    }
  };

  return (
    <div className="mb-4">
      <p className="font-semibold text-lg mb-2">{question.question}</p>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-2"
      />
      {selectedImage && (
        <img src={selectedImage} alt="Selected" className="max-w-xs max-h-40" />
      )}
      <button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 mt-4"
      >
        Submit Answer
      </button>
    </div>
  );
};

export default ImageBasedQuiz;