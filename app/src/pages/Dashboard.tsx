import { Navigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  } 

  return <div className="text-white">Role tidak dikenali</div>; 
}
