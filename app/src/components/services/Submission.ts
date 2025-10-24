import { OPERATIONAL_BASE_URL } from "@/lib/api";
import type { Submission, SubmissionInput } from "@/types/Submission";

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

export async function createSubmission(data: SubmissionInput): Promise<Submission> {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("assignmentId", String(data.assignmentId));
  formData.append("description", data.description);
  if (data.file) {
    formData.append("file_url", data.file);
  }

  const res = await fetch(`${OPERATIONAL_BASE_URL}/submission`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Gagal mengumpulkan tugas");
  }

  const result = await res.json();
  return result.data;
}

export async function getSubmissionFile(id: number): Promise<{ blob: Blob; contentType: string }> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${OPERATIONAL_BASE_URL}/submission/${id}/file`, {
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