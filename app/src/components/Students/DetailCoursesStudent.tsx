import { useNavigate, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockCourses, mockAssignments, mockMaterials, mockUser, mockMajor } from "@/utils/mockData";
import { Button } from "../ui/button";
import MaterialList from "./MaterialStudent";
import AssignmentList from "./AssignmentStudent";

export default function DetailCoursesStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = mockCourses.find((c) => c.id === Number(id));

  if (!course) {
    return (
      <p className="text-gray-400 text-center mt-10">
        Mata kuliah tidak ditemukan.
      </p>
    );
  }

  // 🧠 Cari dosen pengajar
  const lecturer = mockUser.find(
    (u) => u.id === course.lecturerId && u.role === "dosen"
  );

  // 🧠 Cari jurusan berdasarkan majorId dari course
  const majorData = mockMajor.find((m) => m.id === course.majorId);

  // Filter materi dan tugas berdasarkan courseId
  const materials = mockMaterials.filter((m) => m.courseId === Number(id));
  const assignments = mockAssignments.filter((a) => a.courseId === Number(id));

  return (
    <div className="space-y-6 text-white">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{course.name}</h1>
          <p className="text-gray-400">
            {majorData?.name || "Jurusan tidak diketahui"} • {course.credits} SKS • {lecturer?.name || "Dosen belum ditentukan"}
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
          {materials.length > 0 || assignments.length > 0 ? (
            <div className="grid gap-4">
              {materials.length > 0 && <MaterialList materials={materials} />}
              {assignments.length > 0 && <AssignmentList assignments={assignments} />}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Belum ada materi dan tugas.</p>
          )}
        </TabsContent>

        <TabsContent value="material" className="space-y-4">
          {materials.length > 0 ? (
            <MaterialList materials={materials} />
          ) : (
            <p className="text-gray-400 text-sm">Belum ada materi.</p>
          )}
        </TabsContent>
          {assignments.length > 0 ? (
            <AssignmentList assignments={assignments} />
          ) : (
            <p className="text-gray-400 text-sm">Belum ada tugas.</p>
          )}
        <TabsContent value="assignment" className="space-y-4">
        </TabsContent>
      </Tabs>
    </div>
  );
}