"use client";

import { useState } from "react";

type Card = {
  id: number;
  category_id: number | null;
  question: string;
  answer: string;
};

type Props = {
  cards: Card[];
  categories: { id: number; name: string }[];
  onDelete: (id: number) => void;
  onUpdate: (id: number, category_id: number, question: string, answer: string) => void;
};

export default function CardList({ cards, categories, onDelete, onUpdate }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editCategoryId, setEditCategoryId] = useState<string>("");
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");

  return (
    <ul className="space-y-2">
      {cards.map((card) => (
        <li
          key={card.id}
          className="border p-2 rounded flex flex-col md:flex-row md:items-center md:justify-between gap-2"
        >
          {editingId === card.id ? (
            <>
              <select
                value={editCategoryId}
                onChange={(e) => setEditCategoryId(e.target.value)}
                className="border p-1 rounded"
              >
                <option value="" disabled>
                  Select category
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id.toString()}>
                    {c.name}
                  </option>
                ))}
              </select>

              <input
                value={editQuestion}
                onChange={(e) => setEditQuestion(e.target.value)}
                className="border p-1 rounded flex-1"
                placeholder="Question"
              />
              <input
                value={editAnswer}
                onChange={(e) => setEditAnswer(e.target.value)}
                className="border p-1 rounded flex-1"
                placeholder="Answer"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (!editCategoryId) return;
                    onUpdate(
                      card.id,
                      Number(editCategoryId),
                      editQuestion,
                      editAnswer
                    );
                    setEditingId(null);
                  }}
                  className="text-green-600 hover:underline"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-gray-500 hover:underline"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex-1">
                <p className="font-semibold">{card.question}</p>
                <p className="text-gray-600">{card.answer}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingId(card.id);
                    setEditCategoryId(card.category_id?.toString() || "");
                    setEditQuestion(card.question);
                    setEditAnswer(card.answer);
                  }}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(card.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}