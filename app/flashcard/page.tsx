
import Link from "next/link";

export default function FlashcardLanding() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Flashcard App</h1>
      <nav className="flex flex-col gap-4">
        <Link href="/flashcard/categories" className="btn">Manage Categories</Link>
        <Link href="/flashcard/cards" className="btn">Manage Cards</Link>
        <Link href="/flashcard/play" className="btn">Play Mode</Link>
        <Link href="/flashcard/stats" className="btn">Statistics</Link>
      </nav>
    </div>
  );
}