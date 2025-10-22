import { AUTH_BASE_URL } from "@/lib/api";
import type { Faculty } from "@/types/Faculty";


export async function getFaculty(): Promise<Faculty[]> {
  const res = await fetch(`${AUTH_BASE_URL}/faculties`);
  if (!res.ok) throw new Error('Gagal menemukan fakultas');

  const data = await res.json();
  return data.faculties || [];
}
