import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import DevicesPage from "./pages/devices/DevicesPage";
import OwnersPage from "./pages/owners/OwnersPage";
import ProvidersPage from "./pages/providers/ProvidersPage";
import ContractsPage from "./pages/rentalContracts/ContractsPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="devices" element={<DevicesPage />} />
            <Route path="owners" element={<OwnersPage />} />
            
            <Route path="providers" element={<ProvidersPage />} />
            <Route path="rental-contracts" element={<ContractsPage/>} />
            
            <Route path="legacy-devices" element={<div>Legacy Devices Coming Soon</div>} />
            <Route path="owner-history" element={<div>Owner History Coming Soon</div>} />
            <Route path="device-incidents" element={<div>Device Incidents Coming Soon</div>} />
            <Route path="invoices" element={<div>Invoices Coming Soon</div>} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}