"use client";

import { useState, useEffect } from "react";

type Card = {
  id: number;
  question: string;
  answer: string;
};

type Props = {
  cards: Card[];
};

export default function PlayMode({ cards }: Props) {
  const [shuffledCards, setShuffledCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // Funktsioon shuffle ja start anew
  const startGame = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setCurrentIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setUserAnswer("");
    setFeedback(null);
    setIsGameOver(false);
  };

  useEffect(() => {
    if (cards.length > 0) startGame();
  }, [cards]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentCard = shuffledCards[currentIndex];
    if (!currentCard) return;

    if (userAnswer.trim().toLowerCase() === currentCard.answer.trim().toLowerCase()) {
      setFeedback("✅ Correct!");
      setCorrectCount((prev) => prev + 1);
    } else {
      setFeedback(`❌ Incorrect! Correct answer: ${currentCard.answer}`);
      setWrongCount((prev) => prev + 1);
    }

    setUserAnswer("");

    setTimeout(() => {
      setFeedback(null);
      if (currentIndex + 1 >= shuffledCards.length) {
        setIsGameOver(true);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    }, 1000);
  };

  if (shuffledCards.length === 0) return <p>No cards available.</p>;

  if (isGameOver) {
    return (
      <div className="max-w-md mx-auto border p-4 rounded text-center space-y-4">
        <h2 className="text-xl font-bold">🎉 Game Over!</h2>
        <p>
          You answered {correctCount} / {shuffledCards.length} correctly.
        </p>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:opacity-90"
          onClick={startGame}
        >
          Try Again
        </button>
      </div>
    );
  }

  const currentCard = shuffledCards[currentIndex];

  return (
    <div className="max-w-md mx-auto border p-4 rounded space-y-4">
      <h2 className="text-xl font-bold">Flashcard Play Mode (Random)</h2>

      <p className="font-semibold">{currentCard.question}</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Your answer..."
          className="border p-2 rounded"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:opacity-90">
          Submit
        </button>
      </form>

      {feedback && <p className="font-semibold">{feedback}</p>}

      <p className="font-semibold">
        Correct: {correctCount} / {shuffledCards.length} | Wrong: {wrongCount}
      </p>
    </div>
  );
}