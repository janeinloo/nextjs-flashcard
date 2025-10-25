"use client";

import { useEffect, useState } from "react";
import PlayMode from "./PlayMode";
import { createClient } from "@/lib/supabase/client";

type Card = {
  id: number;
  question: string;
  answer: string;
  category_id: number | null;
};

export default function PlayPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchCards = async () => {
      const { data } = await supabase
        .from("cards")
        .select("*");
      setCards(data || []);
    };

    fetchCards();
  }, [supabase]);

  return <PlayMode cards={cards} />;
}