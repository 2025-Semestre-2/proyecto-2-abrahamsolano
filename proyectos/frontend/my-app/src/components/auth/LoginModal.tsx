import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Mail, Lock, Phone, MapPin, Loader2, User } from "lucide-react";
import { OnLoginCallback, UserRole, AuthUser } from "@/types/auth.types";
import { login, register, getErrorMessage } from "@/services/api";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: UserRole;
  onLogin: OnLoginCallback;
}

export function LoginModal({ isOpen, onClose, type, onLogin }: LoginModalProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);

  // Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regLocation, setRegLocation] = useState("");
  const [regName, setRegName] = useState("");

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(loginEmail)) {
      toast.error("Por favor ingresa un correo válido");
      return;
    }

    if (!validatePassword(loginPassword)) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const response = await login(loginEmail, loginPassword, type === 'empresa' ? 'empresa' : 'cliente');
      
      const user: AuthUser = {
        role: type,
        id: loginEmail,
        name: loginEmail.split("@")[0] || "Usuario",
        email: loginEmail,
      };

      onLogin(user);
      toast.success(`¡Bienvenido, ${user.name}!`);
      
      // Limpiar
      setLoginEmail("");
      setLoginPassword("");
      onClose();
    } catch (error) {
      console.error('Login error:', error);
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(regEmail)) {
      toast.error("Por favor ingresa un correo válido");
      return;
    }

    if (!validatePassword(regPassword)) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (!regName.trim()) {
      toast.error("Por favor ingresa un nombre");
      return;
    }

    if (!regPhone.trim()) {
      toast.error("Por favor ingresa un teléfono");
      return;
    }

    if (type === "empresa" && !regLocation.trim()) {
      toast.error("Por favor ingresa la ubicación");
      return;
    }

    setLoading(true);

    try {
      const extra = type === "empresa" 
        ? { nombre_empresa: regName, ubicacion: regLocation, telefono: regPhone }
        : { nombre: regName, telefono: regPhone };

      await register(regEmail, regPassword, type === 'empresa' ? 'empresa' : 'cliente', extra);
      
      toast.success("¡Registro exitoso! Ahora inicia sesión");
      setIsLoginMode(true);
      
      // Auto-fill login email
      setLoginEmail(regEmail);
      setLoginPassword("");
      
      // Limpiar registro
      setRegEmail("");
      setRegPassword("");
      setRegPhone("");
      setRegLocation("");
      setRegName("");
    } catch (error) {
      console.error('Register error:', error);
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isLoginMode ? "Iniciar Sesión" : "Registrarse"} como {
              type === "empresa" ? "Empresa" : 
              type === "administrador" ? "Administrador" : 
              "Cliente"
            }
          </DialogTitle>
          <DialogDescription>
            {isLoginMode
              ? "Ingresa tus credenciales para continuar"
              : "Completa la información para crear tu cuenta"}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={isLoginMode ? "login" : "register"} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" onClick={() => setIsLoginMode(true)}>
              Iniciar Sesión
            </TabsTrigger>
            <TabsTrigger value="register" onClick={() => setIsLoginMode(false)}>
              Registrarse
            </TabsTrigger>
          </TabsList>

          {/* LOGIN */}
          <TabsContent value="login">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="ejemplo@correo.com"
                    className="pl-10"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>

              {/* Datos de prueba */}
              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded mt-4">
                <p className="font-semibold mb-1">Datos de prueba:</p>
                <p>Cliente: cliente@test.com / 123456</p>
                <p>Empresa: empresa@test.com / 123456</p>
              </div>
            </form>
          </TabsContent>

          {/* REGISTER */}
          <TabsContent value="register">
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reg-name">
                  {type === "empresa" ? "Nombre de la empresa" : "Nombre completo"}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="reg-name"
                    placeholder={type === "empresa" ? "Mi Hotel S.A." : "Juan Pérez"}
                    className="pl-10"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-email">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="ejemplo@correo.com"
                    className="pl-10"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-phone">Teléfono</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="reg-phone"
                    type="tel"
                    placeholder="+506 8888 8888"
                    className="pl-10"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {type === "empresa" && (
                <div className="space-y-2">
                  <Label htmlFor="reg-location">Ubicación en Limón</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="reg-location"
                      placeholder="Puerto Viejo, Cahuita, etc."
                      className="pl-10"
                      value={regLocation}
                      onChange={(e) => setRegLocation(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  "Registrarse"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}