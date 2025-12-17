"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

interface HomeSearchBarProps {
  placeholder?: string;
  initialQuery?: string;
}

const HomeSearchBar = ({
  placeholder = "Parça adı, OEM kodu veya marka ile arayın...",
  initialQuery = "",
}: HomeSearchBarProps) => {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-2 w-full max-w-xl"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 border border-gray-600/60 bg-gray-900/50 text-white px-3 py-2 rounded-md text-sm placeholder:text-gray-500"
        placeholder={placeholder}
      />
      <button
        type="submit"
        className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-sm font-medium text-white"
      >
        Ara
      </button>
    </form>
  );
};

export default HomeSearchBar;
