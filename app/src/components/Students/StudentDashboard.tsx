import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  mockCourses,
  mockUser,
  mockUserApproved,
  mockMajor,
} from "@/utils/mockData";
import { Archive, BookOpen, Calendar, Clock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Button } from "../ui/button";

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const currentSemester = user!.semester ?? 1;
  const currentMajorId = user!.majorId;

  // 🔍 Ambil nama jurusan berdasarkan majorId mahasiswa
  const majorData = mockMajor.find((m) => m.id === currentMajorId);
  // 🔍 Filter course berdasarkan jurusan & semester
  const currentCourses = mockCourses.filter(
    (course) =>
      course.majorId === currentMajorId && course.semester === currentSemester
  );

  const archivedCourses = mockCourses.filter(
    (course) =>
      course.majorId === currentMajorId && course.semester < currentSemester
  );

  const handleToDetailCourses = (courseId: number) => {
    navigate(`/student/detailcourses/${courseId}`);
  };

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
          <div className="grid gap-4 md:grid-cols-3">
            {currentCourses.map((course) => {
              const approved = mockUserApproved.find(
                (a) => a.userId === course.lecturerId
              );
              const lecturer = approved
                ? mockUser.find((u) => u.id === approved.userId)
                : null;

              return (
                <Card
                  key={course.id}
                  className="bg-gray-800/50 border-gray-700 cursor-pointer hover:border-blue-500 transition"
                  onClick={() => handleToDetailCourses(course.id)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-blue-400" />
                      <CardTitle className="text-white">{course.name}</CardTitle>
                    </div>
                    <CardDescription className="text-gray-400">
                      {majorData?.name} | {course.credits} SKS
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="text-gray-400">
                    <div className="flex gap-2 items-center">
                      <User size={15} className="text-gray-400" />
                      <p className="text-[13px] text-gray-400">
                        {lecturer ? lecturer.name : "Belum disetujui admin"}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center py-2">
                      <Calendar size={15} className="text-gray-400" />
                      <p className="text-[13px] text-gray-400">{course.day}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Clock size={15} className="text-gray-400" />
                      <p className="text-[13px] text-gray-400">
                        {course.startTime} - {course.endTime}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {currentCourses.length === 0 && (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="pt-6 text-center">
                <BookOpen className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">
                  Tidak ada mata kuliah aktif untuk semester ini.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
                    <div className="grid gap-4 md:grid-cols-2">
            {archivedCourses.map((course) => {
              const approved = mockUserApproved.find(
                (a) => a.userId === course.lecturerId
              );
              const lecturer = approved
                ? mockUser.find((u) => u.id === approved.userId)
                : null;

              return (
                <Card key={course.id} className="bg-gray-800/30 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Archive className="h-5 w-5 text-gray-500" />
                      <CardTitle className="text-gray-300">
                        {course.name}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-gray-500">
                      {course.credits} SKS •{" "}
                      {lecturer ? lecturer.name : "Belum disetujui admin"}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <p className="text-gray-400 text-sm">
                      {course.description}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Badge
                        variant="outline"
                        className="border-gray-600 text-gray-400"
                      >
                        Semester {course.semester} (Selesai)
                      </Badge>
                    </div>
                    <div className="mt-4">
                      <Button
                        onClick={() => handleToDetailCourses(course.id)}
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-800 text-black"
                      >
                        Lihat Arsip
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {archivedCourses.length === 0 && (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="pt-6 text-center">
                <Archive className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">
                  Belum ada mata kuliah yang diselesaikan.
                </p>
              </CardContent>
            </Card>
          )}
        <TabsContent value="archived" className="space-y-4">
        </TabsContent>
      </Tabs>
    </div>
  );
};
