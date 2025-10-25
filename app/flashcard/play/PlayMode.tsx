"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type Card = {
  id: number;
  category_id: number | null;
  question: string;
  answer: string;
};

type Props = {
  cards: Card[];
};

export default function PlayMode({ cards }: Props) {
  const supabase = createClient();

  const [shuffledCards, setShuffledCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [gameOver, setGameOver] = useState(false);

  // Shuffle cards on start
  useEffect(() => {
    setShuffledCards(shuffleArray(cards));
  }, [cards]);

  // Shuffle helper
  const shuffleArray = (arr: Card[]) => {
    return [...arr].sort(() => Math.random() - 0.5);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentCard = shuffledCards[currentIndex];
    if (!currentCard) return;

    const isCorrect =
      userAnswer.trim().toLowerCase() === currentCard.answer.toLowerCase();

    // Save attempt to Supabase
    await supabase
      .from("attempts")
      .insert([{ card_id: currentCard.id, is_correct: isCorrect }]);

    setFeedback(isCorrect ? "correct" : "incorrect");

    // Move to next card after 1s
    setTimeout(() => {
      setUserAnswer("");
      setFeedback(null);
      if (currentIndex + 1 < shuffledCards.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setGameOver(true);
      }
    }, 1000);
  };

  const handleTryAgain = () => {
    setShuffledCards(shuffleArray(cards));
    setCurrentIndex(0);
    setUserAnswer("");
    setFeedback(null);
    setGameOver(false);
  };

  return (
    <div className="p-4 border rounded space-y-4">
      {!gameOver ? (
        <>
          <h2 className="text-xl font-bold">
            Question {currentIndex + 1} / {shuffledCards.length}
          </h2>
          <p className="mb-2">{shuffledCards[currentIndex]?.question}</p>

          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer..."
              className="border p-2 rounded w-full"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:opacity-90">
              Submit
            </button>
          </form>

          {feedback && (
            <p
              className={`font-semibold ${
                feedback === "correct" ? "text-green-600" : "text-red-600"
              }`}
            >
              {feedback === "correct"
                ? "Correct!"
                : `Incorrect! Correct answer: ${shuffledCards[currentIndex].answer}`}
            </p>
          )}
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold">Game Over!</h2>
          <StatsSummary cards={shuffledCards} />
          <button
            onClick={handleTryAgain}
            className="bg-green-600 text-white px-4 py-2 rounded hover:opacity-90"
          >
            Try Again
          </button>
        </>
      )}
    </div>
  );
}

// Component to show correct/incorrect summary
function StatsSummary({ cards }: { cards: Card[] }) {
  const [attempts, setAttempts] = useState<{ is_correct: boolean }[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await supabase
        .from("attempts")
        .select("*")
        .in("card_id", cards.map((c) => c.id));
      setAttempts(data || []);
    };
    fetchStats();
  }, [cards]);

  const totalCorrect = attempts.filter((a) => a.is_correct).length;
  const totalIncorrect = attempts.filter((a) => !a.is_correct).length;

  return (
    <div>
      <p>Correct: {totalCorrect}</p>
      <p>Incorrect: {totalIncorrect}</p>
    </div>
  );
}