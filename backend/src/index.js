// backend/src/index.js
const express = require("express");
const cors = require("cors");

const authRoutes        = require("./routes/auth.routes");
const movieRoutes       = require("./routes/movies.routes");
const recommendRoutes   = require("./routes/recommendations.routes");
const watchlistRoutes   = require("./routes/watchlist.routes");

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middlewares globales ─────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

// ─── Rutas ────────────────────────────────────────────────
app.use("/api/auth",            authRoutes);
app.use("/api/movies",          movieRoutes);
app.use("/api/recommendations", recommendRoutes);
app.use("/api/watchlist",       watchlistRoutes);

// ─── Health check ─────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// ─── Error handler global ─────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "Error interno" });
});

app.listen(PORT, () => console.log(`Backend corriendo en http://localhost:${PORT}`));

module.exports = app; // para tests con supertest
