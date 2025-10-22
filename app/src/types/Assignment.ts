export interface Assignment {
  id_assignment: number;
  courseId: number;
  title: string;
  description: string;
  deadline: string;
  file_url: string | null;
  file_type?: string | null;
  created_at: Date;
}

export interface AssignmentInput {
  courseId: number;
  title: string;
  description: string;
  deadline: string; // format: "YYYY-MM-DD HH:mm:ss"
  file?: File | null;
  file_url?: string | null;
  file_type?: string | null;
}