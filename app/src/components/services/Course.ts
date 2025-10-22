import { COURSE_BASE_URL } from "@/lib/api";
import type { Course, CourseInput } from "@/types/Course";

export async function createCourse(params: CourseInput): Promise<Course> {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${COURSE_BASE_URL}/admin/courses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Gagal membuat mata kuliah");
  }

  const data = await res.json();
  return data.data;
}

export async function updateCourse(
  id_course: number,
  params: Partial<CourseInput>
): Promise<Course> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${COURSE_BASE_URL}/admin/courses/${id_course}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || "Gagal memperbarui mata kuliah");
  }

  const data = await response.json();
  return data.data;
}

export async function getAllCourses(): Promise<Course[]> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${COURSE_BASE_URL}/admin/courses`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });

  if (!res.ok) throw new Error('Gagal menemukan mata kuliah');

  const data = await res.json();
  return data.data || [];
}

export async function deleteCourse(id: number): Promise<void> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${COURSE_BASE_URL}/admin/courses/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) throw new Error("Unauthorized: Token tidak valid atau sudah kadaluarsa");
  if (!res.ok) throw new Error("Gagal menghapus user pending");
}

