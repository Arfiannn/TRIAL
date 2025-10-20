import { BASE_URL } from "@/lib/apiAuth";
import type { Major } from "@/types/Major";

export async function getMajor(): Promise<Major[]> {
  const res = await fetch(`${BASE_URL}/majors`);
  if (!res.ok) throw new Error("Gagal menemukan program studi");

  const data = await res.json();
  return data.majors || [];
}
