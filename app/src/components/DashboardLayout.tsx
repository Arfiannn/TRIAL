import { Navigate, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";

export default function DashboardLayout() {
  const { user, logout } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
    }

  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      {/* Header */}
      <header className="bg-gray-900/50 border-b border-gray-800 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">Trial Portal</h1>
              <div className="hidden md:block">
                <span className="text-gray-400">|</span>
                <span className="ml-2 text-gray-300 capitalize">
                  {user.role}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 hidden sm:block">{user.name}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="border-gray-400 text-gray-300 bg-transparent hover:bg-gray-800"
              >
                <LogOut className="h-4 w-4 text-red-500" />
                <p className="text-red-500">Logout</p>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Halaman anak akan muncul di sini */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
