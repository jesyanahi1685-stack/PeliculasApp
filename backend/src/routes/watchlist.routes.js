// backend/src/routes/watchlist.routes.js
const router = require("express").Router();
const prisma = require("../lib/prisma");
const auth   = require("../middleware/auth.middleware");

router.use(auth); // todas las rutas requieren login

// GET /api/watchlist
router.get("/", async (req, res, next) => {
  try {
    const list = await prisma.watchlist.findMany({
      where:   { userId: req.user.id },
      include: { movie: true },
      orderBy: { addedAt: "desc" },
    });
    res.json(list);
  } catch (err) { next(err); }
});

// POST /api/watchlist/:movieId
router.post("/:movieId", async (req, res, next) => {
  try {
    const entry = await prisma.watchlist.create({
      data: { userId: req.user.id, movieId: parseInt(req.params.movieId) },
    });
    res.status(201).json(entry);
  } catch (err) { next(err); }
});

// DELETE /api/watchlist/:movieId
router.delete("/:movieId", async (req, res, next) => {
  try {
    await prisma.watchlist.delete({
      where: { userId_movieId: { userId: req.user.id, movieId: parseInt(req.params.movieId) } },
    });
    res.status(204).end();
  } catch (err) { next(err); }
});

module.exports = router;
