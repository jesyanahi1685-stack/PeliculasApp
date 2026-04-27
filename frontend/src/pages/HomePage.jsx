// frontend/src/pages/HomePage.jsx
import { useEffect, useState } from "react";
import { getMovies } from "../services/api";

export default function HomePage() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    getMovies().then(r => setMovies(r.data.movies));
  }, []);

  return (
    <main>
      <h1>🎬 Movie Recommender</h1>
      <div className="grid">
        {movies.map(m => (
          <div key={m.id} className="card">
            <img src={`https://image.tmdb.org/t/p/w300${m.posterPath}`} alt={m.title} />
            <h3>{m.title}</h3>
            <p>⭐ {m.avgRating?.toFixed(1) ?? "–"}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
