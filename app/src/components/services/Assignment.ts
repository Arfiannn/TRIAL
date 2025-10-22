import { OPERATIONAL_BASE_URL } from "@/lib/api";
import type { Assignment } from "@/types/Assignment";

export async function getAllAssignments(): Promise<Assignment[]> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${OPERATIONAL_BASE_URL}/assignments`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // kalau endpoint dilindungi JWT
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gagal memuat assignments: ${errText}`);
  }

  const data = await res.json();
  return data;
}