import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Clock, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AddCourseDialog from "@/components/AddCoursesDialog";
import ValidationDialog from "../ValidationDialog";
import type { Course } from "@/types/Course";
import type { Major } from "@/types/Major";
import { deleteCourse, getAllCourses } from "../services/Course";
import { getMajor } from "../services/Major";
import type { Users } from "@/types/User";
import { getAllUser } from "../services/User";

export default function CoursesTab() {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [lecturers, setLecturers] = useState<Users[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try{
        const [courses, majors, lecturers] = await Promise.all([
          getAllCourses(),
          getMajor(),
          getAllUser(),
        ])
        const dosen = lecturers.filter((l) => l.roleId === 2);
        setCourses(courses);
        setMajors(majors);
        setLecturers(dosen);
      } catch (err) {
        console.error(err);
        toast.error("Gagal memuat data mata kuliah, program studi dan dosen");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [])

  const handleAddCourse = (course: any) => {
    // Jika sedang edit → replace data
    if (editData) {
      setCourses((prev) => prev.map((c) => (c.id_course === course.id_course ? course : c)));
      setEditData(null);
    } else {
      setCourses((prev) => [...prev, course]);
    }
  };

  const editCourse = (course: any) => {
    setEditData(course);
    setOpenAddDialog(true);
  };

  const handleDeleteCourse = async (id: number, name: string) => {
    try{
      await deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c.id_course !== id));
      toast.warning(`Mata kuliah: ${name} berhasil dihapus!`);
    } catch (err:any) {
      toast.error(err.message || "Gagal menghapus mata kuliah");
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Manajemen Mata Kuliah</h2>
        <Button
          onClick={() => {
            setEditData(null);
            setOpenAddDialog(true);
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Tambah Mata Kuliah
        </Button>

        <AddCourseDialog
          open={openAddDialog}
          onClose={() => {
            setOpenAddDialog(false);
            setEditData(null);
          }}
          onSave={handleAddCourse}
          editData={editData}
        />
      </div>

      {/* === LIST COURSE === */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => {
          const major = majors.find((m) => m.id_major === course.majorId);

          const lecturer = lecturers.find((l) => l.id_user === course.lecturerId)

          return (
            <Card key={course.id_course} className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div>
                  <div className="flex gap-3 items-end">
                    <CardTitle className="text-white text-xl">
                      {course.name_course}
                    </CardTitle>
                    <p className="text-gray-400 text-[13px] text-end">
                      | {course.sks} SKS
                    </p>
                  </div>

                  <CardDescription className="text-gray-400">
                    <div className="flex gap-2 items-center py-2">
                      <p className="text-[13px]">
                        {major?.name_major || "Jurusan tidak ditemukan"}
                      </p>
                      <p className="inline-block border border-blue-600 text-blue-300 rounded-xl text-[13px] px-3">
                        Semester {course.semester ?? 1}
                      </p>
                    </div>

                    <div className="flex gap-2 items-center">
                      <User size={15} />
                      <p className="text-[13px]">{lecturer?.name}</p>
                    </div>
                    <div className="flex gap-2 items-center py-2">
                      <Calendar size={15} />
                      <p className="text-[13px]">{course.day}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Clock size={15} />
                      <p className="text-[13px]">
                        {course.start_time} - {course.end_time}
                      </p>
                    </div>
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-gray-300 text-sm line-clamp-1">
                  {course.description}
                </p>
                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editCourse(course)}
                    className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedCourse(course)
                      setOpenDeleteDialog(true)}
                    }
                    className="border-red-600 bg-red-600 text-white hover:bg-red-700"
                  >
                    Hapus
                  </Button>

                  <ValidationDialog 
                    title={`Apakah Anda Yakin MengHapus Mata Kuliah: ${selectedCourse?.name_course ?? ""}?`}
                    open={openDeleteDialog}
                    onClose={() => setOpenDeleteDialog(false)}
                    onVal={() => {
                      handleDeleteCourse(selectedCourse.id_course, selectedCourse.name_course)
                      setOpenDeleteDialog(false);
                    }}
                    valName="Hapus"
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
