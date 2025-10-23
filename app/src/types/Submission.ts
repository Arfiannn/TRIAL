export interface Submission {
  id_submission: number;
  studentId: number;
  assignmentId: number;
  description?: string;
  status?: string;
  file?: File | null;
  file_url?: string | null;
  file_type?: string | null;
  submittedAt: Date;
}