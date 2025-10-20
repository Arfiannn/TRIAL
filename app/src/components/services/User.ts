import { BASE_URL } from "@/lib/apiAuth";
import type { User } from "@/types/User";

export async function approvePendingUser(pending_id: number): Promise<User> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/admin/approve/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    
    body: JSON.stringify({ pending_id }),
  });

  if (res.status === 401)
    throw new Error("Unauthorized: Token tidak valid atau sudah kadaluarsa");
  if (!res.ok) throw new Error("Gagal menyetujui user pending");

  const data = await res.json().catch(() => ({}));
  return data.user as User;
}

export async function getAllUser(): Promise<User[]> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/admin/users`, {
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
  return data.active_users || [];
}

export async function updateUserSemester(userId: number, newSemester: number): Promise<User> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/admin/user/${userId}/semester`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ semester: newSemester }),
  });

  if (res.status === 401) throw new Error("Unauthorized: Token tidak valid atau sudah kadaluarsa");
  if (!res.ok) throw new Error("Gagal mengupdate semester mahasiswa");

  const data = await res.json();
  return data.user as User;
}