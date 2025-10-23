import { OPERATIONAL_BASE_URL } from "@/lib/api";
import type { Submission } from "@/types/Submission";

export async function getAllSubmissions(): Promise<Submission[]> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${OPERATIONAL_BASE_URL}/submission`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gagal mengambil data submission: ${errorText}`);
  }

  const data = await res.json();

  return data;
}