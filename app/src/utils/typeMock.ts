export interface Faculty {
  id: number;
  name: string;
}

export interface Role {
  id: number,
  name: string,
}

export interface Major {
  id: number;
  facultyId: number;
  name: string;
}

export interface User {
  id: number;
  majorId?: number;
  name: string;
  email: string;
  password: string;
  role: 'mahasiswa' | 'dosen' | 'administrator';
  semester?: number;
  createdAt: Date;
}

export interface UserApproved {
  id: number;
  userId: number;
}

export interface Course {
  id: number;
  majorId: number;
  lecturerId?: number;
  name: string;
  semester: number;
  credits: number;
  description?: string;
  day: string;
  startTime: string;
  endTime: string;
}

export interface Assignment {
  id: number;
  courseId: number;
  title: string;
  description: string;
  dueDate: Date;
  fileUrl: string | null;
  createdAt: Date;
}

export interface Material {
  id: number;
  courseId: number;
  title: string;
  description: string;
  fileUrl: string | null;
  createdAt: Date;
}

export interface Submission {
  id: number;
  studentId: number;
  assignmentId: number;
  text?: string;
  fileUrl?: string;
  submittedAt: Date;
}