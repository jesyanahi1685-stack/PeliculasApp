# 🎬 Movie Recommender — Proyecto Escolar

Aplicación de recomendación de películas con arquitectura de tres servicios:
**Backend** (Node/Express + Prisma), **Frontend** (React/Vite) y **AI Service** (Python/FastAPI).

---

## Arquitectura

```
┌──────────────┐     REST      ┌───────────────┐     HTTP      ┌──────────────┐
│   Frontend   │ ─────────────▶│    Backend    │ ─────────────▶│  AI Service  │
│  React/Vite  │               │ Express+Prisma│               │   FastAPI    │
│   :5173      │               │    :3001      │               │    :8000     │
└──────────────┘               └──────┬────────┘               └──────────────┘
                                      │ Prisma ORM
                                      ▼
                               ┌──────────────┐
                               │  PostgreSQL  │
                               │   :5432      │
                               └──────────────┘
```

## Inicio rápido

### 1. Clonar y configurar entorno
```bash
git clone <tu-repo>
cd movie-recommender
cp .env.example .env
# Edita .env con tus valores (el default funciona para desarrollo)
```

### 2. Levantar todo con Docker
```bash
docker compose up --build
```

La primera vez instala dependencias e inicia los tres servicios + la BD automáticamente.

### 3. Aplicar migraciones y sembrar datos
```bash
# En otra terminal (con los contenedores corriendo)
docker compose exec backend npx prisma migrate dev --name init
docker compose exec backend npm run db:seed
```

### 4. Abrir la app
| Servicio     | URL                          |
|--------------|------------------------------|
| Frontend     | http://localhost:5173        |
| Backend API  | http://localhost:3001/api    |
| AI Service   | http://localhost:8000/docs   |

---

## Comandos útiles

```bash
# Ver logs de un servicio
docker compose logs -f backend

# Reiniciar un servicio
docker compose restart ai-service

# Abrir Prisma Studio (explorador visual de la BD)
docker compose exec backend npx prisma studio

# Correr tests del backend
docker compose exec backend npm test

# Correr tests del AI service
docker compose exec ai-service pytest tests/ -v
```

---

## CI/CD (GitHub Actions)

Los tres workflows en `.github/workflows/` se activan automáticamente:

| Workflow          | Trigger                        | Qué hace                            |
|-------------------|--------------------------------|-------------------------------------|
| `backend.yml`     | Push/PR en `backend/` o `prisma/` | Lint → Test → Build Docker       |
| `frontend.yml`    | Push/PR en `frontend/`         | Lint → Build prod → Build Docker    |
| `ai-service.yml`  | Push/PR en `ai-service/`       | Lint → Pytest → Build Docker        |

Para que el push a Docker Hub funcione, agrega estos **Secrets** en tu repo:
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

---

## Stack tecnológico

| Capa        | Tecnología                        |
|-------------|-----------------------------------|
| Frontend    | React 18, Vite, React Router      |
| Backend     | Node 20, Express, JWT, bcryptjs   |
| ORM         | **Prisma** (PostgreSQL)           |
| Base datos  | PostgreSQL 16 (Docker)            |
| AI Service  | Python 3.11, FastAPI, scikit-learn|
| CI/CD       | GitHub Actions                    |
| Contenedores| Docker + Docker Compose           |
