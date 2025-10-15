import { AdminDashboard } from "@/components/Administrators/AdminDashboard";
import { useAuth } from "@/components/auth/AuthContext";
import { LecturerDashboard } from "@/components/Lecturers/LecturerDashboard";
import { Navigate } from "react-router-dom";
import { StudentDashboard } from "@/components/Students/StudentDashboard";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  switch (user.role) {
    case "administrator":
      return <AdminDashboard />;
    case "dosen":
      return <LecturerDashboard />;
    case "mahasiswa":
      return <StudentDashboard />;
    default:
      return <div className="text-white">Role tidak dikenali</div>;
  }
}
