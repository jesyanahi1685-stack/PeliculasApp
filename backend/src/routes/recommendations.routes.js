// backend/src/routes/recommendations.routes.js
const router = require("express").Router();
const axios  = require("axios");
const prisma = require("../lib/prisma");
const auth   = require("../middleware/auth.middleware");

const AI_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

// GET /api/recommendations  — recomendaciones personalizadas
router.get("/", auth, async (req, res, next) => {
  try {
    // Obtener historial de ratings del usuario
    const ratings = await prisma.rating.findMany({
      where:   { userId: req.user.id },
      include: { movie: true },
    });

    // Llamar al servicio de IA
    const { data } = await axios.post(`${AI_URL}/recommend`, {
      userId:  req.user.id,
      ratings: ratings.map(r => ({ tmdbId: r.movie.tmdbId, score: r.score, genres: r.movie.genres })),
    });

    res.json(data); // { recommendations: [{ tmdbId, title, reason }] }
  } catch (err) { next(err); }
});

module.exports = router;
