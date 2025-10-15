import { Button } from "@/components/ui/button";
import { mockCourses, mockMajor, mockUser, mockUserApproved } from "@/utils/mockData"; // ✅ tambahkan mockMajor
import { BookOpen, Calendar, Clock, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AddCourseDialog from "@/components/AddCoursesDialog";

export default function CoursesTab() {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [courses, setCourses] = useState(mockCourses);

  const handleAddCourse = (course: any) => {
    // Jika sedang edit → replace data
    if (editData) {
      setCourses((prev) => prev.map((c) => (c.id === course.id ? course : c)));
      setEditData(null);
    } else {
      setCourses((prev) => [...prev, course]);
    }
  };

  const editCourse = (course: any) => {
    setEditData(course);
    setOpenAddDialog(true);
  };

  const deleteCourse = (id: number) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    toast.warning("Mata kuliah berhasil dihapus!");
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
          // ✅ cari jurusan berdasarkan majorId
          const major = mockMajor.find((m) => m.id === course.majorId);

          const approved = mockUserApproved.find(
            (a) => a.userId === course.lecturerId
          );
          const lecturer = approved
            ? mockUser.find((u) => u.id === approved.userId)
            : null;

          return (
            <Card key={course.id} className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div>
                  <div className="flex gap-3 items-end">
                    <CardTitle className="text-white text-xl">
                      {course.name}
                    </CardTitle>
                    <p className="text-gray-400 text-[13px] text-end">
                      | {course.credits} SKS
                    </p>
                  </div>

                  <CardDescription className="text-gray-400">
                    <div className="flex gap-2 items-center py-2">
                      {/* ✅ tampilkan nama jurusan dari mockMajor */}
                      <p className="text-[13px]">
                        {major?.name || "Jurusan tidak ditemukan"}
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
                        {course.startTime} - {course.endTime}
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
                    onClick={() => deleteCourse(course.id)}
                    className="border-red-600 bg-red-600 text-white hover:bg-red-700"
                  >
                    Hapus
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
