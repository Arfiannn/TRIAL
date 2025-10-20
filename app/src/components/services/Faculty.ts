import { BASE_URL } from "@/lib/apiAuth";
import type { Faculty } from "@/types/Faculty";


export async function getFaculty(): Promise<Faculty[]> {
  const res = await fetch(`${BASE_URL}/faculties`);
  if (!res.ok) throw new Error('Gagal menemukan fakultas');

  const data = await res.json();
  return data.faculties || [];
}
