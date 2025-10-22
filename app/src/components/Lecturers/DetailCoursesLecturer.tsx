import { useNavigate, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AssignmentTab from "./AssignmentLecturer";
import MaterialTab from "./MaterialLecturer";
import { toast } from "sonner";
import type { Course } from "@/types/Course";
import type { Users } from "@/types/User";
import { getCoursesById } from "../services/Course";
import { getAllUser } from "../services/User";
import type { Major } from "@/types/Major";
import { getMajor } from "../services/Major";

export default function DetailCourseLecturer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [students, setStudents] = useState<Users[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        if (!id) return;

        const [courseData, studentData, majorsData] = await Promise.all([
          getCoursesById(Number(id)),
          getAllUser(),
          getMajor(),
        ]);

        const mahasiswa = studentData.filter((u) => u.roleId === 3);

        setCourse(courseData);
        setStudents(mahasiswa);
        setMajors(majorsData)
      } catch (err: any) {
        console.error(err);
        toast.error("Gagal memuat data mata kuliah atau mahasiswa");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return <p className="text-gray-400 text-center mt-10">Memuat data...</p>;
  }

  const major = majors.find((m) => m.id_major === course?.majorId);

  if (!course) {
    return (
      <p className="text-gray-400 text-center mt-10">
        Mata kuliah tidak ditemukan.
      </p>
    );
  }

  return (
    <div className="space-y-6 text-white">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{course.name_course}</h1>
          <p className="text-gray-400">
            {major?.name_major} • {course.sks} SKS
            <span className="inline-block border border-blue-600 rounded-xl px-3 bg-blue-900/50 text-blue-200 ml-3">
              Semester {course.semester}
            </span>
          </p>
        </div>
        <Button
          onClick={() => navigate(-1)}
          className="bg-gray-700 hover:bg-gray-600"
        >
          ← Kembali
        </Button>
      </div>

      <Tabs defaultValue="assignment" className="space-y-4">
        <TabsList className="inline-block bg-gray-800 border border-gray-700 gap-1 rounded-md p-1">
          <TabsTrigger
            value="assignment"
            className="text-gray-300 px-3 py-1.5 rounded-md data-[state=active]:text-black data-[state=active]:bg-gray-300"
          >
            Buat Tugas
          </TabsTrigger>
          <TabsTrigger
            value="material"
            className="text-gray-300 px-3 py-1.5 rounded-md data-[state=active]:text-black data-[state=active]:bg-gray-300"
          >
            Buat Materi
          </TabsTrigger>
          <TabsTrigger
            value="participant"
            className="text-gray-300 px-3 py-1.5 rounded-md data-[state=active]:text-black data-[state=active]:bg-gray-300"
          >
            Mahasiswa
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assignment">
          <AssignmentTab courseId={course.id_course} />
        </TabsContent>

        <TabsContent value="material">
          <MaterialTab courseId={course.id_course} />
        </TabsContent>

        <TabsContent value="participant" className="space-y-4">
          <h2 className="text-xl font-semibold text-white mb-2">
            Daftar Mahasiswa
          </h2>

          {students.length === 0 ? (
            <p className="text-gray-400">Belum ada mahasiswa yang terdaftar.</p>
          ) : (
            <div className="grid gap-4">
              {students.map((student) => (
                <Card
                  key={student.id_user}
                  className="bg-gray-800/50 border-gray-700 rounded-lg"
                >
                  <CardContent className="flex justify-between items-center p-4">
                    <div>
                      <p className="text-white font-medium">{student.name}</p>
                      <p className="text-gray-400 text-sm">
                        {student.email} - {major?.name_major}
                      </p>
                    </div>
                    <p className="bg-blue-900/50 border border-blue-700 rounded-xl text-white px-3 text-[13px]">
                      Terdaftar
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
