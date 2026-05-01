// backend/src/routes/auth.routes.js
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const prisma = require("../lib/prisma");
const auth   = require("../middleware/auth.middleware");

// POST /api/auth/register
router.post("/register", async (req, res, next) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }
    if (!email.includes("@")) {
      return res.status(400).json({ error: "Email inválido" });
    }

    const hash  = await bcrypt.hash(password, 10);
    const user  = await prisma.user.create({ data: { email, name, password: hash } });
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) { next(err); }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) { next(err); }
});

// GET /api/auth/me  — usuario autenticado actual
router.get("/me", auth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where:  { id: req.user.id },
      select: { id: true, name: true, email: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  } catch (err) { next(err); }
});

module.exports = router;