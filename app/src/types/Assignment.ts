export interface Assignment {
  id_assigment: number;
  courseId: number;
  title: string;
  description: string;
  deadline: Date;
  fileUrl: string | null;
  file_type?: string;
  createdAt: Date;
}