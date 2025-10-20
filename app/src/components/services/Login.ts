import { BASE_URL } from "@/lib/apiAuth";
import type { User } from "@/types/User";

export interface LoginResponse {
  token: string;
  user: User;
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
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
