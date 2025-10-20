import { BASE_URL } from "@/lib/apiAuth";

export interface Major {
  id: number;
  facultyId: number;
  name: string;
}

export async function getMajor(): Promise<Major[]> {
  const res = await fetch(`${BASE_URL}/majors`);
  if (!res.ok) throw new Error("Gagal menemukan program studi");

  const data = await res.json();
  return data.majors || [];
}
