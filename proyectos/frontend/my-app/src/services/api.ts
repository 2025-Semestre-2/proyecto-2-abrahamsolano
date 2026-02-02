const API_URL = "http://localhost:3001/api";

export async function login(
  email: string,
  password: string,
  type: "cliente" | "empresa"
) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      type,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.error || "Error al iniciar sesión");
  }

  return response.json();
}

export async function register(
  email: string,
  password: string,
  type: "cliente" | "empresa",
  extra: Record<string, any>
) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      type,
      ...extra,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.error || "Error al registrar");
  }

  return response.json();
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Ocurrió un error inesperado";
}
