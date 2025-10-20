export interface User {
  id: number;
  roleId: number;
  facultyId?: number
  majorId?: number;
  name: string;
  email: string;
  password: string;
  semester: number;
}