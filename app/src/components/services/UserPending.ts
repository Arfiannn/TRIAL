import { BASE_URL } from "@/lib/apiAuth";

export interface UserPending {
  id_pending: number;
  facultyId: number;
  majorId: number;
  name: string;
  email: string;
  password: string;
  roleId: number;
}

export async function createUserPandingStudent(data: Omit<UserPending, "id_pending" | "roleId">): Promise<UserPending> {
  const res = await fetch(`${BASE_URL}/auth/register/mahasiswa`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gagal membuat mahasiswa: ${err}`);
  }

  return res.json();
}

export async function createUserPandingLecturer(data: Omit<UserPending, "id_pending" | "roleId">): Promise<UserPending> {
  const res = await fetch(`${BASE_URL}/auth/register/dosen`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gagal membuat dosen: ${err}`);
  }

  return res.json();
}
