"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type Card = {
  id: number;
  question: string;
  answer: string;
};

export default function PlayMode() {
  const supabase = createClient();
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    const { data } = await supabase.from("cards").select("id, question, answer");
    if (data) {
      setCards(data.sort(() => Math.random() - 0.5));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentCard = cards[currentIndex];
    if (!currentCard) return;

    const isCorrect =
      userAnswer.trim().toLowerCase() === currentCard.answer.trim().toLowerCase();

    await supabase.from("attempts").insert({
      card_id: currentCard.id,
      is_correct: isCorrect,
      attempt_at: new Date().toISOString(),
    });

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      setFeedback("✅ Correct!");
    } else {
      setIncorrectCount((prev) => prev + 1);
      setFeedback(`❌ Incorrect! Correct answer: ${currentCard.answer}`);
    }

    setUserAnswer("");

    if (currentIndex === cards.length - 1) {
      setTimeout(() => setShowResults(true), 800);
    } else {
      setTimeout(() => {
        setFeedback("");
        setCurrentIndex((prev) => prev + 1);
      }, 800);
    }
  };

  const handleRestart = () => {
    setCorrectCount(0);
    setIncorrectCount(0);
    setCurrentIndex(0);
    setFeedback("");
    setShowResults(false);
    setUserAnswer("");
    fetchCards();
  };

  if (cards.length === 0) {
    return <p className="text-center text-gray-500 mt-10">No cards found.</p>;
  }

  if (showResults) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <div className="bg-white border rounded-2xl shadow-lg p-6 max-w-md">
          <h2 className="text-2xl font-bold mb-4">Game Over 🎉</h2>
          <p className="text-lg mb-4">
            You got <span className="font-semibold">{correctCount}</span> correct and{" "}
            <span className="font-semibold">{incorrectCount}</span> incorrect out of{" "}
            {cards.length}.
          </p>
          <button
            onClick={handleRestart}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:opacity-90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="max-w-lg mx-auto p-6 border rounded-lg shadow mt-6">
      <h2 className="text-xl font-semibold mb-4 text-center">Flashcard Quiz</h2>

      <p className="mb-4 text-center text-gray-600">
        Question {currentIndex + 1} of {cards.length}
      </p>

      <p className="text-lg font-medium mb-4 text-center">
        {currentCard.question}
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Your answer..."
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:opacity-90 w-full"
        >
          Submit
        </button>
      </form>

      {feedback && (
        <p
          className={`mt-3 text-center font-semibold ${
            feedback.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {feedback}
        </p>
      )}
    </div>
  );
}