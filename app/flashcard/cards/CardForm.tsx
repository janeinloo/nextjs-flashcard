"use client";

import { useState, useEffect } from "react";

type Props = {
  categories: { id: number; name: string }[];
  onAdd: (categoryId: number, question: string, answer: string) => void;
};

export default function CardForm({ categories, onAdd }: Props) {
  const [categoryId, setCategoryId] = useState<string>("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (categories.length > 0) {
      setCategoryId(categories[0].id.toString());
    }
  }, [categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim() || !categoryId) return;
    onAdd(Number(categoryId), question, answer);
    setQuestion("");
    setAnswer("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 border p-4 rounded">
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className="border p-2 rounded w-full"
      >
        {categories.map((c) => (
          <option key={c.id} value={c.id.toString()}>
            {c.name}
          </option>
        ))}
      </select>

      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Question..."
        className="border p-2 rounded w-full"
      />

      <input
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Answer..."
        className="border p-2 rounded w-full"
      />

      <button className="bg-green-600 text-white px-4 py-2 rounded hover:opacity-90">
        Add Card
      </button>
    </form>
  );
}