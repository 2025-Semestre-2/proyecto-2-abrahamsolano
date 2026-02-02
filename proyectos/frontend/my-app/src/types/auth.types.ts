export type UserRole = "cliente" | "empresa" | "administrador";

export interface AuthUser {
  role: UserRole;
  id: string;
  name: string;
  email?: string;
}

export type OnLoginCallback = (user: AuthUser) => void;