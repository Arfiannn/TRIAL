import { COURSE_BASE_URL } from "@/lib/api";
import type { Material, MaterialInput } from "@/types/Material";

export async function getAllMaterial(): Promise<Material[]> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${COURSE_BASE_URL}/lecturer/materials`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Gagal memuat materi");
  }

  const data = await res.json();
  return data.data;
}


export async function createMaterial(input: MaterialInput): Promise<Material> {
  const token = localStorage.getItem("token");
  const formData = new FormData();

  formData.append("courseId", String(input.courseId));
  formData.append("title", input.title);
  formData.append("description", input.description);

  if (input.file) {formData.append("file_url", input.file)};

  const res = await fetch(`${COURSE_BASE_URL}/lecturer/materials`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gagal upload material: ${errorText}`);
  }

  const data = await res.json();
  return data.data || data;
}

export async function updateMaterial(
  id: number, 
  input: Partial<MaterialInput>
): Promise<Material> {
  const token = localStorage.getItem("token");
  const formData = new FormData();

  if (input.title) formData.append("title", input.title);
  if (input.description) formData.append("description", input.description);
  if (input.file) {
    formData.append("file_url", input.file);
  }

  const res = await fetch(`${COURSE_BASE_URL}/lecturer/materials/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gagal update material: ${errorText}`);
  }

  const data = await res.json();
  return data.data;
}

export async function deleteMaterial(id: number): Promise<void> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${COURSE_BASE_URL}/lecturer/materials/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) throw new Error("Unauthorized: Token tidak valid atau sudah kadaluarsa");
  if (!res.ok) throw new Error("Gagal menghapus tugas");
}

export async function getMaterialFile(id: number): Promise<{ blob: Blob; contentType: string }> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${COURSE_BASE_URL}/lecturer/materials/${id}/file`, {
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