# clase de ai-service/src/recommender.py
"""
Recomendador basado en contenido (géneros).
Algoritmo simple para el proyecto escolar:
  1. Construye un perfil del usuario sumando géneros de películas bien calificadas.
  2. Consulta TMDB para encontrar películas populares de esos géneros.
  3. Excluye lo que ya vio el usuario.
"""
from collections import Counter
from typing import List

# Mapa TMDB género → ID
GENRE_MAP = {
    "Action": 28, "Adventure": 12, "Comedy": 35, "Drama": 18,
    "Horror": 27, "Romance": 10749, "Sci-Fi": 878, "Thriller": 53,
    "Animation": 16, "Documentary": 99,
}

class ContentBasedRecommender:
    def recommend(self, ratings) -> List[int]:
        """
        Recibe lista de RatingInput y devuelve lista de tmdbIds sugeridos.
        """
        # Perfil: géneros ponderados por score
        genre_weight: Counter = Counter()
        seen_ids = set()

        for r in ratings:
            seen_ids.add(r.tmdbId)
            if r.score >= 3:                       # solo películas que le gustaron
                for g in r.genres:
                    genre_weight[g] += r.score

        if not genre_weight:
            return []

        # Top 3 géneros favoritos del usuario
        top_genres = [g for g, _ in genre_weight.most_common(3)]

        # TODO: Aquí podrías llamar a TMDB /discover para obtener IDs reales.
        # Por ahora devolvemos IDs de ejemplo para que el esqueleto funcione.
        mock_ids = [550, 238, 278, 424, 389, 129, 19404, 497, 598, 637]
        return [mid for mid in mock_ids if mid not in seen_ids]
