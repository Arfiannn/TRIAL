import { OPERATIONAL_BASE_URL } from "@/lib/api";
import type { Assignment, AssignmentInput } from "@/types/Assignment";

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

export async function getAssignmentById(id: number): Promise<Assignment> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${OPERATIONAL_BASE_URL}/assignments/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gagal mengambil assignment: ${errorText}`);
  }

  const data = await res.json();
  return data; // backend langsung kirim objek assignment, bukan { data: {...} }
}

export async function createAssignment(input: AssignmentInput): Promise<Assignment> {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("courseId", String(input.courseId));
  formData.append("title", input.title);
  formData.append("description", input.description);
  formData.append("deadline", input.deadline);
  if (input.file) formData.append("file_url", input.file);

  const res = await fetch(`${OPERATIONAL_BASE_URL}/assignments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error("Gagal membuat tugas");
  const result = await res.json();
  return result.data || result;
}

export async function updateAssignment(
  id: number,
  data: Partial<AssignmentInput>
): Promise<Assignment> {
  const token = localStorage.getItem("token");
  const formData = new FormData();

  if (data.title) formData.append("title", data.title);
  if (data.description) formData.append("description", data.description);
  if (data.deadline) formData.append("deadline", data.deadline);

  if (data.file) formData.append("file_url", data.file);

  const res = await fetch(`${OPERATIONAL_BASE_URL}/assignments/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "Gagal memperbarui tugas");
  }

  const result = await res.json();
  return result.data || result;
}

export async function deleteAssignment(id: number): Promise<void> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${OPERATIONAL_BASE_URL}/assignments/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) throw new Error("Unauthorized: Token tidak valid atau sudah kadaluarsa");
  if (!res.ok) throw new Error("Gagal menghapus tugas");
}

export async function getAssignmentFile(id: number): Promise<{ blob: Blob; contentType: string }> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${OPERATIONAL_BASE_URL}/assignments/${id}/file`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gagal mengambil file: ${errorText}`);
  }

  const blob = await res.blob();
  const contentType = res.headers.get("Content-Type") || "application/octet-stream";

  return { blob, contentType };
}