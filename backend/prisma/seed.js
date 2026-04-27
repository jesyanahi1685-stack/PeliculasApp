// prisma/seed.js
// Ejecutar: node prisma/seed.js  (desde la carpeta raíz del proyecto)
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const SEED_MOVIES = [
  { tmdbId: 550,   title: "Fight Club",       genres: ["Drama", "Thriller"],   releaseYear: 1999 },
  { tmdbId: 238,   title: "The Godfather",    genres: ["Drama", "Crime"],      releaseYear: 1972 },
  { tmdbId: 278,   title: "The Shawshank Redemption", genres: ["Drama"],       releaseYear: 1994 },
  { tmdbId: 19404, title: "Dilwale Dulhania Le Jayenge", genres: ["Romance", "Drama"], releaseYear: 1995 },
  { tmdbId: 129,   title: "Spirited Away",    genres: ["Animation", "Adventure"], releaseYear: 2001 },
];

async function main() {
  console.log("🌱 Sembrando base de datos...");

  for (const movie of SEED_MOVIES) {
    await prisma.movie.upsert({
      where:  { tmdbId: movie.tmdbId },
      update: {},
      create: { ...movie, posterPath: `/placeholder/${movie.tmdbId}.jpg` },
    });
  }

  console.log(`✅ ${SEED_MOVIES.length} películas insertadas`);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
