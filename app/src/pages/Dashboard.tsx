import { AdminDashboard } from "@/Administrators/AdminDashboard";
import { useAuth } from "@/auth/AuthContext";
import { Navigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  switch (user.role) {
    case "administrator":
      return <AdminDashboard />;
    default:
      return <div className="text-white">Role tidak dikenali</div>;
  }
}
