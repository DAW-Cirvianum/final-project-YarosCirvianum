// src/App.jsx

// LIBRARIES
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// CONTEXT & LAYOUT
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

// PAGES - AUTH
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// PAGES - APP
import Dashboard from "./pages/dashboard/Dashboard";
import DevicesPage from "./pages/devices/DevicesPage";
import OwnersPage from "./pages/owners/OwnersPage";
import ProvidersPage from "./pages/providers/ProvidersPage";
import ContractsPage from "./pages/rentalContracts/ContractsPage";
import ComingSoon from "./pages/coming-soon/ComingSoon";

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* PROTECTED ROUTES */}
            <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              
              {/* CORE MODULES */}
              <Route path="devices" element={<DevicesPage />} />
              <Route path="owners" element={<OwnersPage />} />
              <Route path="providers" element={<ProvidersPage />} />
              <Route path="rental-contracts" element={<ContractsPage />} />
              
              {/* PLACEHOLDERS */}
              <Route path="legacy-devices" element={<ComingSoon />} />
              <Route path="owner-history" element={<ComingSoon />} />
              <Route path="device-incidents" element={<ComingSoon />} />
              <Route path="invoices" element={<ComingSoon />} />
            </Route>

            {/* FALLBACK */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}