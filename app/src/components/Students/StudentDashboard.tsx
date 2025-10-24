import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Archive, BookOpen, Calendar, Clock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import type { Course } from "@/types/Course";
import type { Major } from "@/types/Major";
import { getCoursesByStudent } from "../services/Course";
import { getMajor } from "../services/Major";
import { toast } from "sonner";
import type { Users } from "@/types/User";
import { getAllUser } from "../services/User";
import { formatTime } from "../FormatTime";

export const StudentDashboard: React.FC = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [lecturers, setLecturers] = useState<Users []>([]);
  const [loading, setLoading] = useState(false);

  useEffect (() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [courses, majors, lecturer] = await Promise.all([
          getCoursesByStudent(),
          getMajor(),
          getAllUser(),
        ])
        const approvedLecturers = lecturer.filter((u) => u.roleId === 2);
        setLecturers(approvedLecturers);
        setCourses(courses);
        setMajors(majors);
      } catch (err) {
        console.error(err);
        toast.error("Gagal memuat data mata kuliah dan program studi");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const currentSemester = user!.semester ?? 1;
  const currentMajorId = user!.majorId;

  const majorData = majors.find((m) => m.id_major === currentMajorId);

  const currentCourses = courses.filter(
    (course) => course.semester === currentSemester
  );

  const archivedCourses = courses.filter(
    (course) =>course.semester < currentSemester
  );

  const handleToDetailCourses = (courseId: number) => {
    navigate(`/student/detailcourses/${courseId}`);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Mahasiswa</h1>
          <p className="text-gray-400">Selamat datang, {user?.name}</p>

          <Badge variant="secondary" className="bg-blue-900/50 text-blue-200">
            Semester {currentSemester}
          </Badge>
        </div>
      </div>

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
              const dosen = lecturers.find((u) => u.id_user === course.lecturerId);

              return (
                <Card
                  key={course.id_course}
                  className="bg-gray-800/50 border-gray-700 cursor-pointer hover:border-blue-500 transition"
                  onClick={() => handleToDetailCourses(course.id_course)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-blue-400" />
                      <CardTitle className="text-white">{course.name_course}</CardTitle>
                    </div>
                    <CardDescription className="text-gray-400">
                      {majorData?.name_major} | {course.sks} SKS
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="text-gray-400">
                    <div className="flex gap-2 items-center">
                      <User size={15} className="text-gray-400" />
                      <p className="text-[13px] text-gray-400">
                        {dosen ? dosen.name : "Belum disetujui admin"}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center py-2">
                      <Calendar size={15} className="text-gray-400" />
                      <p className="text-[13px] text-gray-400">{course.day}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Clock size={15} className="text-gray-400" />
                      <p className="text-[13px] text-gray-400">
                        {formatTime(course.start_time)} - {formatTime(course.end_time)}
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
        <TabsContent value="archived" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {archivedCourses.map((course) => {

              const lecturer = lecturers.find((u) => u.id_user === course.lecturerId);

              return (
                <Card key={course.id_course} className="bg-gray-800/30 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Archive className="h-5 w-5 text-gray-500" />
                      <CardTitle className="text-gray-300">
                        {course.name_course}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-gray-500">
                      {course.sks} SKS •{" "}
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
                        onClick={() => handleToDetailCourses(course.id_course)}
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

          {!loading && archivedCourses.length === 0 && (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="pt-6 text-center">
                <Archive className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">
                  Belum ada mata kuliah yang diselesaikan.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
