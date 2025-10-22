import { AUTH_BASE_URL } from "@/lib/api";
import type { UserPending } from "@/types/UserPanding";

export async function getAllUserPending(): Promise<UserPending[]> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${AUTH_BASE_URL}/admin/users/pending`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error("Unauthorized: Token tidak valid atau sudah kadaluarsa");
    throw new Error("Gagal menemukan User Pending");
  }

  const data = await res.json();
  return data.pending_users || [];
}

// 🧩 Delete pending user berdasarkan ID
export async function deletePendingUser(id: number): Promise<void> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${AUTH_BASE_URL}/admin/pending/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) throw new Error("Unauthorized: Token tidak valid atau sudah kadaluarsa");
  if (!res.ok) throw new Error("Gagal menghapus user pending");
}
