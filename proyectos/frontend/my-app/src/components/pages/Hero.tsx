import "@/styles/hero.css";
import { SearchBar } from "@/components/pages/SearchBar";

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Encuentra tu próximo espacio</h1>
        <p>Renta habitaciones sin estrés</p>
      </div>

      <div className="hero-search">
        <SearchBar />
      </div>
    </section>
  );
}
