import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ProtectedRoute, AdminRoute, BarberRoute } from "./components/layout/Guards";

import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import Servicos from "./pages/public/Servicos";
import Agendamento from "./pages/public/Agendamento";
import MeusAgendamentos from "./pages/public/MeusAgendamentos";
import BarberLogin from "./pages/public/BarberLogin";
import Perfil from "./pages/public/Perfil";

import Dashboard from "./pages/admin/Dashboard";
import AdminBarbeiros from "./pages/admin/Barbeiros";
import AdminServicos from "./pages/admin/Servicos";
import AdminAgendamentos from "./pages/admin/Agendamentos";

import BarberArea from "./pages/barber/BarberArea";

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/criar-conta" replace />} />
            <Route path="/inicio" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login-barbeiro" element={<BarberLogin />} />
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
              path="/meus-agendamentos"
              element={
                <ProtectedRoute>
                  <MeusAgendamentos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/perfil"
              element={
                <ProtectedRoute>
                  <Perfil />
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

            <Route
              path="/barbeiro"
              element={
                <BarberRoute>
                  <BarberArea />
                </BarberRoute>
              }
            />

            <Route path="*" element={<Navigate to="/inicio" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
