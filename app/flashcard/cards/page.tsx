"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import CardForm from "./CardForm";
import CardList from "./CardList";

type Category = { id: number; name: string };
type Card = { id: number; category_id: number; question: string; answer: string };

export default function CardsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchCards();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*");
    setCategories(data ?? []);
  };

  const fetchCards = async () => {
    const { data } = await supabase.from("cards").select("*");
    setCards(data ?? []);
  };

  const addCard = async (categoryId: number, question: string, answer: string) => {
    await supabase.from("cards").insert([{ category_id: categoryId, question, answer }]);
    fetchCards();
  };

  const updateCard = async (id: number, category_id: number, question: string, answer: string) => {
  await supabase
    .from("cards")
    .update({ category_id, question, answer })
    .eq("id", id);
  fetchCards();
};

  const deleteCard = async (id: number) => {
    await supabase.from("cards").delete().eq("id", id);
    fetchCards();
  };

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4">
      <h1 className="text-2xl font-bold">Manage Cards</h1>
      <CardForm categories={categories} onAdd={addCard} />
      <CardList
      cards={cards}
      categories={categories}
      onDelete={deleteCard}
      onUpdate={updateCard}
/>
    </div>
  );
}
