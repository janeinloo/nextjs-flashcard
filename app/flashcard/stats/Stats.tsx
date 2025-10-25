"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Attempt = {
  id: string;
  card_id: number;
  is_correct: boolean;
  attempt_at: string;
};

export default function Stats() {
  const supabase = createClient();
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  useEffect(() => {
    const fetchAttempts = async () => {
      const { data } = await supabase.from("attempts").select("*");
      setAttempts(data || []);
    };
    fetchAttempts();
  }, []);

  const totalCorrect = attempts.filter(a => a.is_correct).length;
  const totalIncorrect = attempts.filter(a => !a.is_correct).length;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Statistics</h2>
      <p>Correct: {totalCorrect}</p>
      <p>Incorrect: {totalIncorrect}</p>
    </div>
  );
}