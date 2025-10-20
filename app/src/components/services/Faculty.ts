import { BASE_URL } from "@/lib/apiAuth";

export interface Faculty {
  id: number;
  name: string;
}

export async function getFaculty(): Promise<Faculty[]> {
  const res = await fetch(`${BASE_URL}/faculties`);
  if (!res.ok) throw new Error('Gagal menemukan fakultas');

  const data = await res.json();
  return data.faculties || [];
}
