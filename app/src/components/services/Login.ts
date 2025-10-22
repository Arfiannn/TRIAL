import { AUTH_BASE_URL } from "@/lib/api";
import type { Users } from "@/types/User";

export interface LoginResponse {
  token: string;
  user: Users;
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${AUTH_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Login gagal, periksa email dan password");
  }

  const data: LoginResponse = await res.json();
  return data;
}
