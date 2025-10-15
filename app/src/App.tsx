import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import { AuthProvider } from "./auth/AuthContext";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./components/DashboardLayout";
import DetailCourseLecturer from "./Lecturers/DetailCoursesLecturer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <Routes>

            <Route path="/" element={<Auth />} />
            <Route path="/student/register" element={<Auth />} />
            <Route path="/lecturer/register" element={<Auth />} />

            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/lecturer/detailcourses/:id" element={<DetailCourseLecturer />} />
            </Route>

            <Route path="*" element={<Navigate to="/auth" replace />} />

          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
