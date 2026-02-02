import { Button } from "@/components/ui/button";
import { Menu, Building2, User, LogOut, ShieldCheck, Waves } from "lucide-react";
import { AuthUser, UserRole } from "@/types/auth.types";   // Asegúrate de tener este import

interface NavbarProps {
  onOpenLoginModal: (type: UserRole) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  user?: AuthUser | null;
}

export function Navbar({
  onOpenLoginModal,
  isLoggedIn,
  onLogout,
  user,
}: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 max-w-7xl mx-auto">

          {/* Logo con escudo */}
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 flex items-center justify-center shadow-md">
              <Waves className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                Limón Stays
              </span>
              <p className="text-xs text-gray-600 font-medium">
                Costa Rica • Caribe
              </p>
            </div>
          </div>

          {/* Menú desktop */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              // Usuario logueado
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2.5 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-200">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="flex flex-col text-sm">
                    <span className="font-medium text-gray-800">
                      {user?.name || "Usuario"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {user?.role === "administrador"
                        ? "Administrador"
                        : user?.role === "empresa"
                        ? "Empresa"
                        : "Cliente"}
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                  onClick={onLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar sesión
                </Button>
              </div>
            ) : (
              // No logueado → botones de acceso
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-emerald-700"
                  onClick={() => onOpenLoginModal("empresa")}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Para Empresas
                </Button>

                <Button
                  variant="outline"
                  className="border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                  onClick={() => onOpenLoginModal("cliente")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Iniciar Sesión
                </Button>

                <Button
                  variant="default"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm"
                  onClick={() => onOpenLoginModal("administrador")}
                >
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Administrador
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu (puedes expandirlo después) */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6 text-gray-700" />
          </Button>
        </div>
      </div>
    </nav>
  );
}