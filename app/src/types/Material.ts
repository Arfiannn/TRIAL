export interface Material {
  id_material: number;
  courseId: number;
  title: string;
  description: string;
  file?: File | null;
  file_url?: string | null;
  file_type?: string | null;
  created_at: Date;
}

export interface MaterialInput {
  courseId: number;
  title: string;
  description: string;
  file?: File | null;
  file_url?: string | null;
  file_type?: string | null;
  created_at: Date;
}