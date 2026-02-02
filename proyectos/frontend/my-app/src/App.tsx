// src/App.tsx
import { useState } from "react";
import { Navbar } from "./components/layout/Navbar";
import { LandingPage } from "./components/pages/LandingPage";
import { LoginModal } from "./components/auth/LoginModal";
import { RoomDetailPage } from "./components/room/RoomDetailPage";
import { HospitalityDashboard } from "./components/mantenimiento/hospitality/HospitalityDashboard";
import { AdminDashboard } from "./components/mantenimiento/AdminDashboard";
import { AuthUser, UserRole, OnLoginCallback } from "@/types/auth.types";
import type { Room } from "@/components/room/room.types";

function App() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginType, setLoginType] = useState<UserRole>("cliente");
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const handleLogin: OnLoginCallback = (user) => {
    setCurrentUser(user);
    console.log("Login exitoso:", user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleSelectRoom = (room: Room) => {
    setSelectedRoom(room);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToList = () => {
    setSelectedRoom(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isLoggedIn = !!currentUser;

  return (
    <>
      {/* Navbar siempre visible */}
      <Navbar
        onOpenLoginModal={(type: UserRole) => {
          setLoginType(type);
          setLoginOpen(true);
        }}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        user={currentUser}
      />

      {/* Contenido principal */}
      {isLoggedIn ? (
        <main className="min-h-screen bg-gray-50 pt-16 md:pt-20">
          {currentUser.role === "empresa" && (
            <HospitalityDashboard onBack={handleLogout} />
          )}

          {currentUser.role === "cliente" && (
            <div className="max-w-7xl mx-auto px-6 py-12 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Bienvenido, {currentUser.name}
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Panel de cliente (en desarrollo) — pronto podrás ver reservas, favoritos y más
              </p>
            </div>
          )}

          {currentUser.role === "administrador" && (
            <AdminDashboard onBack={handleLogout} />
          )}
        </main>
      ) : selectedRoom ? (
        <RoomDetailPage room={selectedRoom} onBack={handleBackToList} />
      ) : (
        <LandingPage onRoomClick={handleSelectRoom} />
      )}

      {/* Modal de login */}
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        type={loginType}
        onLogin={handleLogin}
      />
    </>
  );
}

export default App;