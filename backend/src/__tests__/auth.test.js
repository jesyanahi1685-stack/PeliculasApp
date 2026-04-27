// backend/src/__tests__/auth.test.js
const request = require("supertest");
const app     = require("../index");

describe("Auth endpoints", () => {
  it("POST /api/auth/register — debería crear usuario y devolver token", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email:    "test@example.com",
      name:     "Test User",
      password: "password123",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  it("POST /api/auth/login — credenciales incorrectas → 401", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email:    "noexiste@example.com",
      password: "wrong",
    });
    expect(res.statusCode).toBe(401);
  });
});
