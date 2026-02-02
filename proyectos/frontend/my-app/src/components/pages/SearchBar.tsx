import { useState } from "react";
import "@/styles/searchbar.css";   

type SearchBarProps = {
  onSearch?: (query: string) => void;
};

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch?.(query);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Buscar por ubicación o nombre..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button onClick={handleSearch}>
        Buscar
      </button>
    </div>
  );
}