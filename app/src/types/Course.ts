export interface Course {
  id_course: number;
  lecturerId: number;
  majorId: number;
  semester: number;
  name_course: string;
  description: string;
  sks: number;
  day: string;
  start_time: string;
  end_time: string;
}

export interface CourseInput {
  lecturerId?: number;
  majorId: number;
  semester: string;
  namecourse: string;
  description: string;
  sks: number;
  day: string;
  start_time?: string; // format "HH:mm"
  end_time?: string;   // format "HH:mm"
}