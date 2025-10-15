import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "../auth/AuthContext";

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  const currentSemester = user!.semester ?? 1;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Mahasiswa</h1>
          <p className="text-gray-400">Selamat datang, {user?.name}</p>

          <Badge variant="secondary" className="bg-blue-900/50 text-blue-200">
            Semester {currentSemester}
          </Badge>
        </div>
      </div>

      {/* TABS */}
      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger
            value="courses"
            className="text-gray-300 data-[state=active]:text-black data-[state=active]:bg-gray-300"
          >
            Course Aktif
          </TabsTrigger>
          <TabsTrigger
            value="archived"
            className="text-gray-300 data-[state=active]:text-black data-[state=active]:bg-gray-300"
          >
            Arsip Course
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
        </TabsContent>

        <TabsContent value="archived" className="space-y-4">
        </TabsContent>
      </Tabs>
    </div>
  );
};
