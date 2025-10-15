import { AdminDashboard } from "@/components/Lecturers/Administrators/AdminDashboard";
import { useAuth } from "@/components/auth/AuthContext";
import { LecturerDashboard } from "@/components/Lecturers/LecturerDashboard";
import { Navigate } from "react-router-dom";

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
    default:
      return <div className="text-white">Role tidak dikenali</div>;
  }
}
