// src/components/ProtectedRoute.jsx

// IMPORTACIONS
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// ESTILS
const LOADING_MSG = "h-screen flex items-center justify-center text-gray-500";

export default function ProtectedRoute({ children }) {
  // CONTEXT
  const { isAuthenticated, loading } = useContext(AuthContext);

  // ESTAT DE CARREGA
  if (loading) {
    return <div className={LOADING_MSG}>Checking session...</div>;
  }

  // REDIRECCIO SI NO ESTA AUTENTICAT
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // RENDERITZAT PROTEGIT
  return children;
}