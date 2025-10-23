export interface UserPending {
  id_pending: number;
  facultyId: number;
  majorId: number;
  roleId: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
}