import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

import Dashboard from "./pages/dashboard/Dashboard";
import DevicesPage from "./pages/devices/DevicesPage";
import OwnersPage from "./pages/owners/OwnersPage";
// import ProvidersPage from "./pages/providers/ProvidersPage";
// import RentalContractsPage from "./pages/rentalContracts/RentalContractsPage";
import ComingSoon from "./pages/coming-soon/ComingSoon";

import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/devices" element={<DevicesPage />} />
            <Route path="/owners" element={<OwnersPage />} />
            {/* <Route path="/providers" element={<ProvidersPage />} /> */}
            {/* <Route path="/rental-contracts" element={<RentalContractsPage />} /> */}

            {/* Coming soon */}
            <Route path="/legacy-devices" element={<ComingSoon />} />
            <Route path="/owner-history" element={<ComingSoon />} />
            <Route path="/device-incidents" element={<ComingSoon />} />
            <Route path="/invoices" element={<ComingSoon />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
