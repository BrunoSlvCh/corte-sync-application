import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ProtectedRoute, AdminRoute } from "./components/layout/Guards";

import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import Servicos from "./pages/public/Servicos";
import Agendamento from "./pages/public/Agendamento";

import Dashboard from "./pages/admin/Dashboard";
import AdminBarbeiros from "./pages/admin/Barbeiros";
import AdminServicos from "./pages/admin/Servicos";
import AdminAgendamentos from "./pages/admin/Agendamentos";

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/criar-conta" element={<Register />} />
            <Route path="/servicos" element={<Servicos />} />
            <Route
              path="/agendamento"
              element={
                <ProtectedRoute>
                  <Agendamento />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/barbeiros"
              element={
                <AdminRoute>
                  <AdminBarbeiros />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/servicos"
              element={
                <AdminRoute>
                  <AdminServicos />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/agendamentos"
              element={
                <AdminRoute>
                  <AdminAgendamentos />
                </AdminRoute>
              }
            />

            <Route path="*" element={<Home />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
