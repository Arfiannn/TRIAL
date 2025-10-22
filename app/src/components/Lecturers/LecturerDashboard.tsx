import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Course } from '@/types/Course';
import type { Major } from '@/types/Major';
import { getCoursesByLecturer } from '../services/Course';
import { getMajor } from '../services/Major';
import { toast } from 'sonner';
import { formatTime } from '../FormatTime';

export const LecturerDashboard: React.FC = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const navigate = useNavigate();
  const [semesterFilter, setSemesterFilter]  = useState<string>("Semua");
  const [courses, setCourses] = useState<Course[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect (() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [courses, majors] = await Promise.all([
          getCoursesByLecturer(),
          getMajor(),
        ])
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
  }, [])

 const teachingCourses = useMemo(() => {
    return courses.filter((course) => course.lecturerId === user.id_user);
  }, [user]);

  // 🔹 Ambil semester unik dari daftar course dosen ini
  const availableSemesters = useMemo(() => {
    const uniqueSemesters = Array.from(
      new Set(teachingCourses.map((c) => c.semester))
    ).sort((a, b) => a - b); // urut dari kecil ke besar

    return ["Semua", ...uniqueSemesters.map((s) => s.toString())];
  }, [teachingCourses]);

  // 🔹 Filter course berdasarkan semester yang dipilih
  const filteredCourses = useMemo(() => {
    if (semesterFilter === "Semua") return teachingCourses;
    return teachingCourses.filter(
      (course) => course.semester.toString() === semesterFilter
    );
  }, [teachingCourses, semesterFilter]);


  const handleToDetailCourses = (courseId: number) => {
    navigate(`/lecturer/detailcourses/${courseId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Dosen</h1>
          <p className="text-gray-400">Selamat datang, {user?.name}</p>
          <Badge variant="secondary" className="mt-2 bg-green-900/50 text-green-200">
            Dosen Pengajar
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="courses" className="text-gray-300 data-[state=active]:text-black data-[state=active]:bg-gray-300">
            Mata Kuliah
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <div className='flex justify-end '>
            <Select value={semesterFilter} onValueChange={setSemesterFilter}>
              <SelectTrigger className="w-[220px] bg-gray-800 border border-gray-700 text-gray-200">
                <SelectValue placeholder="Pilih Semester" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border border-gray-700 text-gray-200">
                {availableSemesters.map((semester) => (
                  <SelectItem
                    key={semester}
                    value={semester.toString()}
                    className="text-gray-200 hover:bg-gray-700"
                  >
                    {semester === "Semua" ? "Semua Semester" : `Semester ${semester}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredCourses.map((course) => {
              const major = majors.find((m) => m.id_major === course.majorId)

              return (
                <Card 
                  key={course.id_course} 
                  className="bg-gray-800/50 border-gray-700"
                  onClick={() => handleToDetailCourses(course.id_course)}
                >
                  <CardHeader>
                    <div className='flex items-end'>
                      <div className='flex items-center gap-2'>
                        <BookOpen className="h-5 w-5 text-blue-400" />
                        <CardTitle className="text-white">{course.name_course}</CardTitle>
                      </div>
                      <p className='text-gray-400 ml-3 text-[13px]'>| {course.sks} SKS</p>
                    </div>
                    <CardDescription className='text-gray-400 flex gap-2'>
                      <Badge variant="outline" className="border-blue-600 text-blue-300">
                        Semester {course.semester}
                      </Badge>
                      {major?.name_major}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-gray-400">
                    <div className='flex gap-3 items-center'>
                      
                    </div>
                    <div className="flex gap-2 items-center py-2">
                      <Calendar
                        size={15}
                        className="text-gray-400"
                      />
                      <p className="text-[13px] text-gray-400"> {course.day}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Clock
                        size={15}
                        className="text-gray-400"
                      />
                      <p className="text-[13px] text-gray-400"> {formatTime(course.start_time)} - {formatTime(course.end_time)}</p>
                    </div>
                    <p className="text-gray-300 text-sm mt-4">{course.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          {!loading && teachingCourses.length === 0 && (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="pt-6 text-center">
                <BookOpen className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Tidak ada mata kuliah yang diajar</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};