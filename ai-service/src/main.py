# clase de ai-service/src/main.py
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import httpx, os

from .recommender import ContentBasedRecommender

app   = FastAPI(title="Movie Recommender AI Service")
model = ContentBasedRecommender()

TMDB_API_KEY = os.getenv("TMDB_API_KEY", "")
TMDB_BASE    = "https://api.themoviedb.org/3"

# ─── Schemas ──────────────────────────────────────────────
class RatingInput(BaseModel):
    tmdbId: int
    score:  int
    genres: List[str]

class RecommendRequest(BaseModel):
    userId:  int
    ratings: List[RatingInput]

# ─── Rutas ────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/recommend")
async def recommend(body: RecommendRequest):
    """
    Genera recomendaciones usando filtrado basado en contenido
    (géneros + ratings del usuario).
    """
    if not body.ratings:
        return {"recommendations": [], "message": "Califica algunas películas primero"}

    recommendations = model.recommend(body.ratings)

    # Enriquecer con datos de TMDB si hay API key
    enriched = []
    async with httpx.AsyncClient() as client:
        for tmdb_id in recommendations[:10]:
            try:
                if TMDB_API_KEY:
                    r = await client.get(f"{TMDB_BASE}/movie/{tmdb_id}", params={"api_key": TMDB_API_KEY})
                    data = r.json()
                    enriched.append({
                        "tmdbId": tmdb_id,
                        "title":  data.get("title"),
                        "reason": "Basado en tus géneros favoritos",
                    })
                else:
                    enriched.append({"tmdbId": tmdb_id, "title": f"Movie {tmdb_id}", "reason": "Recomendado"})
            except Exception:
                continue

    return {"recommendations": enriched}
