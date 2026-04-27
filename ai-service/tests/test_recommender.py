# ai-service/tests/test_recommender.py
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from src.recommender import ContentBasedRecommender

def make_rating(tmdb_id, score, genres):
    class R:
        pass
    r = R()
    r.tmdbId = tmdb_id
    r.score  = score
    r.genres = genres
    return r

def test_recommend_returns_list():
    model   = ContentBasedRecommender()
    ratings = [make_rating(550, 5, ["Drama", "Thriller"])]
    result  = model.recommend(ratings)
    assert isinstance(result, list)

def test_recommend_excludes_seen():
    model   = ContentBasedRecommender()
    seen_id = 550
    ratings = [make_rating(seen_id, 5, ["Drama"])]
    result  = model.recommend(ratings)
    assert seen_id not in result

def test_recommend_empty_ratings():
    model  = ContentBasedRecommender()
    result = model.recommend([])
    assert result == []
