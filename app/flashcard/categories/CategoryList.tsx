"use client";

import { useState } from "react";

type Category = { id: number; name: string };

type Props = {
  categories: Category[];
  onDelete: (id: number) => void;
  onUpdate: (id: number, name: string) => void;
};

export default function CategoryList({ categories, onDelete, onUpdate }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newName, setNewName] = useState("");

  return (
    <ul className="space-y-2">
      {categories.map((c) => (
        <li key={c.id} className="flex items-center justify-between border p-2 rounded">
          {editingId === c.id ? (
            <>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="border p-1 rounded flex-1"
              />
              <button
                onClick={() => {
                  onUpdate(c.id, newName);
                  setEditingId(null);
                }}
                className="text-green-600 hover:underline ml-2"
              >
                Save
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="text-gray-500 hover:underline ml-2"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <span className="flex-1">{c.name}</span>
              <button
                onClick={() => {
                  setEditingId(c.id);
                  setNewName(c.name);
                }}
                className="text-blue-600 hover:underline ml-2"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(c.id)}
                className="text-red-500 hover:underline ml-2"
              >
                Delete
              </button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}