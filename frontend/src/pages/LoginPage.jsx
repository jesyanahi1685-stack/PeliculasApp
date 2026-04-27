// frontend/src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../services/api";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const [form, setForm]   = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login }         = useAuth();
  const navigate          = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { data } = await loginApi(form);
      login(data.token, data.user);
      navigate("/");
    } catch {
      setError("Correo o contraseña incorrectos");
    }
  }

  return (
    <main>
      <h2>Iniciar sesión</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email"    placeholder="Email"      value={form.email}    onChange={e => setForm({...form, email: e.target.value})} required />
        <input type="password" placeholder="Contraseña" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
        <button type="submit">Entrar</button>
      </form>
    </main>
  );
}
