"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import CategoryForm from "./CategoryForm";
import CategoryList from "./CategoryList";

type Category = {
  id: number;
  name: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*");
    setCategories(data ?? []);
  };

  const addCategory = async (name: string) => {
    await supabase.from("categories").insert([{ name }]);
    fetchCategories();
  };

  const updateCategory = async (id: number, name: string) => {
  await supabase.from("categories").update({ name }).eq("id", id);
  fetchCategories();
};

  const deleteCategory = async (id: number) => {
    await supabase.from("categories").delete().eq("id", id);
    fetchCategories();
  };

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4">
      <h1 className="text-2xl font-bold">Manage Categories</h1>
      <CategoryForm onAdd={addCategory} />
      <CategoryList
      categories={categories}
      onDelete={deleteCategory}
      onUpdate={updateCategory}
/>
    </div>
  );
}