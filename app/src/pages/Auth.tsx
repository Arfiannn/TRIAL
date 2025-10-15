import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useLocation, useNavigate } from "react-router-dom";

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();

  // Deteksi path aktif
  const isLogin = location.pathname === "/";

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {isLogin ? (
          <LoginForm
            onSwitchToRegister={() => navigate("/student/register")}
          />
        ) : (
          <RegisterForm onSwitchToLogin={() => navigate("/")} />
        )}
      </div>
    </div>
  );
}
