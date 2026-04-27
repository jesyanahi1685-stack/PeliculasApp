// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage          from "./pages/HomePage";
import LoginPage         from "./pages/LoginPage";
import RegisterPage      from "./pages/RegisterPage";
import MovieDetailPage   from "./pages/MovieDetailPage";
import RecommendPage     from "./pages/RecommendPage";
import WatchlistPage     from "./pages/WatchlistPage";
import { useAuth }       from "./hooks/useAuth";

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"             element={<HomePage />} />
        <Route path="/login"        element={<LoginPage />} />
        <Route path="/register"     element={<RegisterPage />} />
        <Route path="/movies/:id"   element={<MovieDetailPage />} />
        <Route path="/recommend"    element={<PrivateRoute><RecommendPage /></PrivateRoute>} />
        <Route path="/watchlist"    element={<PrivateRoute><WatchlistPage /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
