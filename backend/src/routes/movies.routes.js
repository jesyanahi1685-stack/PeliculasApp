// backend/src/routes/movies.routes.js
const router  = require("express").Router();
const prisma  = require("../lib/prisma");
const auth    = require("../middleware/auth.middleware");
const { obtenerPeliculas } = require("../lib/tmdb");

// GET /api/movies  — listar con paginación
router.get("/", async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip  = (page - 1) * limit;

    const [movies, total] = await Promise.all([
      prisma.movie.findMany({ skip, take: limit, orderBy: { avgRating: "desc" } }),
      prisma.movie.count(),
    ]);
    res.json({ movies, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

// GET /api/movies/popular — películas desde TMDb
router.get("/popular", async (req, res, next) => {
  try {
    const peliculas = await obtenerPeliculas();
    res.json(peliculas);
  } catch (err) {
    next(err);
  }
});


// GET /api/movies/:id
router.get("/:id", async (req, res, next) => {
  try {
    const movie = await prisma.movie.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { ratings: { include: { user: { select: { name: true } } } } },
    });
    if (!movie) return res.status(404).json({ error: "Película no encontrada" });
    res.json(movie);
  } catch (err) { next(err); }
});

// POST /api/movies/:id/rate  (requiere auth)
router.post("/:id/rate", auth, async (req, res, next) => {
  try {
    const { score } = req.body; // 1–5
    const movieId   = parseInt(req.params.id);
    const userId    = req.user.id;

    const rating = await prisma.rating.upsert({
      where:  { userId_movieId: { userId, movieId } },
      update: { score },
      create: { score, userId, movieId },
    });

    // Recalcular promedio
    const { _avg } = await prisma.rating.aggregate({ where: { movieId }, _avg: { score: true } });
    await prisma.movie.update({ where: { id: movieId }, data: { avgRating: _avg.score } });

    res.json(rating);
  } catch (err) { next(err); }
});

module.exports = router;
