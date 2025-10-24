import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import { AuthProvider } from "./context/AuthContext";
import { UserRefreshProvider } from "./context/UserRefreshContext"; // ⬅️ Tambahkan ini
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./components/DashboardLayout";
import DetailCourseLecturer from "./components/Lecturers/DetailCoursesLecturer";
import SubmissionStudentPage from "./components/Lecturers/SubmissionList";
import DetailCoursesStudent from "./components/Students/DetailCoursesStudent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <UserRefreshProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>

              <Route path="/" element={<Auth />} />
              <Route path="/student/register" element={<Auth />} />
              <Route path="/lecturer/register" element={<Auth />} />

              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route
                  path="/lecturer/detailcourses/:id"
                  element={<DetailCourseLecturer />}
                />
                <Route
                  path="/lecturer/submissionStudent/:assignmentId"
                  element={<SubmissionStudentPage />}
                />
                <Route
                  path="/student/detailcourses/:id"
                  element={<DetailCoursesStudent />}
                />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </UserRefreshProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
