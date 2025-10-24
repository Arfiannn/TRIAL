import { useNavigate, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import MaterialList from "./MaterialStudent";
import AssignmentList from "./AssignmentStudent";
import type { Course } from "@/types/Course";
import { useEffect, useState } from "react";
import type { Users } from "@/types/User";
import type { Major } from "@/types/Major";
import type { Material } from "@/types/Material";
import { getAllUser } from "../services/User";
import { getMajor } from "../services/Major";
import { getAllMaterialsForStudent } from "../services/Material";
import { toast } from "sonner";
import { getCoursesByIdForStudent } from "../services/Course";
import type { Assignment } from "@/types/Assignment";
import { getAllAssignments } from "../services/Assignment";

export default function DetailCoursesStudent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course | null>(null);
  const [lecturers, setLecturers] = useState<Users []>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [assignments, setAssignments] = useState<Assignment []>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        if (!id) return;

        const [courseData, lecturerData, majorsData, materialsData, assignmentData] = await Promise.all([
          getCoursesByIdForStudent(Number(id)),
          getAllUser(),
          getMajor(),
          getAllMaterialsForStudent(Number(id)),
          getAllAssignments()
        ]);

        const dosen = lecturerData.filter(
          (u) => u.roleId === 2 && u.id_user === courseData.lecturerId
        );
        const filtered = assignmentData.filter((a) => a.courseId === Number(id));
        setCourses(courseData);
        setLecturers(dosen);
        setMajors(majorsData);
        setMaterials(materialsData);  
        setAssignments(filtered); 
      } catch (err: any) {
        console.error(err);
        toast.error("Gagal memuat data mata kuliah atau materi");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (!courses) {
    return (
      <p className="text-gray-400 text-center mt-10">
        Mata kuliah tidak ditemukan.
      </p>
    );
  }

  const lecturer = lecturers.find((l) => l.id_user === courses.lecturerId);
  const major = majors.find((m) => m.id_major === courses.majorId);
  // const assignments = mockAssignments.filter((a) => a.courseId === Number(id));

  return (
    <div className="space-y-6 text-white">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{courses.name_course}</h1>
          <p className="text-gray-400">
            {major?.name_major || "Jurusan tidak diketahui"} • {courses.sks} SKS • {lecturer?.name|| "Dosen belum ditentukan"}
          </p>
        </div>
        <Button
          onClick={() => navigate(-1)}
          className="bg-gray-700 hover:bg-gray-600"
        >
          ← Kembali
        </Button>
      </div>

      {/* TABS */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-gray-800 border border-gray-700 gap-1 rounded-md p-1">
          <TabsTrigger
            value="all"
            className="text-gray-300 px-3 py-1.5 rounded-md data-[state=active]:text-black data-[state=active]:bg-gray-300"
          >
            Materi & Tugas
          </TabsTrigger>
          <TabsTrigger
            value="material"
            className="text-gray-300 px-3 py-1.5 rounded-md data-[state=active]:text-black data-[state=active]:bg-gray-300"
          >
            Materi
          </TabsTrigger>
          <TabsTrigger
            value="assignment"
            className="text-gray-300 px-3 py-1.5 rounded-md data-[state=active]:text-black data-[state=active]:bg-gray-300"
          >
            Tugas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Materi</h2>

          {!loading && (materials.length > 0 || assignments.length > 0) ? (
            <div className="grid gap-4">
              {materials.length > 0 && <MaterialList materials={materials} />}
              {assignments.length > 0 && <AssignmentList assignments={assignments} />}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Belum ada materi dan tugas.</p>
          )}
        </TabsContent>

        <TabsContent value="material" className="space-y-4">
          {!loading && materials.length > 0 ? (
            <MaterialList materials={materials} />
          ) : (
            <p className="text-gray-400 text-sm">Belum ada materi.</p>
          )}
        </TabsContent>

        <TabsContent value="assignment" className="space-y-4">
          {!loading && assignments.length > 0 ? (
            <AssignmentList assignments={assignments} />
          ) : (
            <p className="text-gray-400 text-sm">Belum ada tugas.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}