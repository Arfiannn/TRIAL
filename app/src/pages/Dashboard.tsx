import { AdminDashboard } from "@/components/Administrators/AdminDashboard";
import { LecturerDashboard } from "@/components/Lecturers/LecturerDashboard";
import { StudentDashboard } from "@/components/Students/StudentDashboard";
import { Navigate } from "react-router-dom";

export default function Dashboard() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  switch (user.roleId) {
    case 1:
      return <AdminDashboard />;
    case 2:
      return <LecturerDashboard />;
    case 3:
      return <StudentDashboard />;
    default:
      return <div className="text-white text-center mt-10">Role tidak dikenali</div>;
  }
}
