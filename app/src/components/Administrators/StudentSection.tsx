import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoveUp, UserCheck } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import DetailDialog from "@/components/DetailDialog";
import ValidationDialog from "../ValidationDialog";
import type { Users } from "@/types/User";
import type { Major } from "@/types/Major";
import { getAllUser, updateUserSemester } from "../services/User";
import { getMajor } from "../services/Major";

export default function StudentsTab() {

  const [majorFilter, setMajorFilter] = useState<string>("Semua");
  const [semesterFilter, setSemesterFilter] = useState<string>("Semua");
  const [students, setStudents] = useState<Users[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Users | null>(null);
  const [selectedStuSem, setSelectedStuSem] = useState<Users | null>(null);
  const [openSemesterDialog, setOpenSemesterDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Ambil daftar major dari mockMajor
  const availableMajors = ["Semua", ...majors.map((m) => m.name_major)];
  const availableSemester = ["Semua", ...Array.from({ length: 14 }, (_, i) => (i + 1).toString())];

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [users, majors] = await Promise.all([
          getAllUser(),
          getMajor()
        ])
        const mahasiswa = users.filter((u) => u.roleId === 3);
        setStudents(mahasiswa);
        setMajors(majors)
      } catch (err) {
        console.error(err);
        toast.error("Gagal memuat data mahasiswa dan program studi");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // ✅ Filter mahasiswa berdasarkan majorId dan semester
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const studentMajorName = majors.find((m) => m.id_major === s.majorId)?.name_major;

      const matchMajor = majorFilter === "Semua" || studentMajorName === majorFilter;
      const matchSemester =
        semesterFilter === "Semua" ||
        s.semester?.toString() === semesterFilter.toString();

      return matchMajor && matchSemester;
    });
  }, [students, majorFilter, semesterFilter]);

  // ✅ Fungsi naik semester
  const handleNaikSemester = async (id: number) => {
    const student = students.find((s) => s.id_user === id);
    if (!student) return;

    const newSemester = (student.semester ?? 1) + 1;

    try {
      const updated = await updateUserSemester(id, newSemester);

      // Update state
      setStudents((prev) =>
        prev.map((s) => (s.id_user === id ? updated : s))
      );

      toast.success(`${student.name} naik ke semester ${newSemester}`);
    } catch (err) {
      console.error(err);
      toast.error("Gagal menaikkan semester mahasiswa");
    }
  };

  return (
    <>
      {/* Filter Section */}
      <div className="flex flex-row justify-between items-center mb-4 gap-3">
        <Badge variant="secondary" className="bg-gray-600 border-gray-400 text-white h-6">
          Total : {filteredStudents.length} Mahasiswa
        </Badge>

        <div className="flex flex-row gap-3">
          {/* Filter Major */}
          <Select
            value={majorFilter}
            onValueChange={(val) => {
              setMajorFilter(val);
              setSemesterFilter("Semua");
            }}
          >
            <SelectTrigger className="w-[220px] bg-gray-800 border border-gray-700 text-gray-200">
              <SelectValue placeholder="Pilih Jurusan" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border border-gray-700 text-gray-200">
              {availableMajors.map((major) => (
                <SelectItem
                  key={major}
                  value={major}
                  className="text-gray-200 hover:bg-gray-700"
                >
                  {major === "Semua" ? "Semua Prodi" : major}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filter Semester */}
          <Select value={semesterFilter} onValueChange={setSemesterFilter}>
            <SelectTrigger className="w-[220px] bg-gray-800 border border-gray-700 text-gray-200">
              <SelectValue placeholder="Pilih Semester" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border border-gray-700 text-gray-200">
              {availableSemester.map((semester) => (
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
      </div>

      {/* Daftar Mahasiswa */}
      {filteredStudents.map((student) => {
        const majorData = majors.find((m) => m.id_major === student.majorId);

        return (
          <Card
            key={student.id_user}
            className="bg-gray-800/50 border-gray-700 mb-3"
            onClick={() => setSelectedStudent(student)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">{student.name}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {student.email} • {majorData?.name_major || "Belum memilih jurusan"}
                  </CardDescription>
                </div>
                <div className="flex gap-3 items-center">
                  <Badge className="border-blue-600 text-blue-300" variant="outline">
                    Semester {student.semester ?? 1}
                  </Badge>
                  <Button
                    size="sm"
                    disabled={(student.semester ?? 1) >= 14}
                    className="bg-blue-800 hover:bg-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStuSem(student)
                      setOpenSemesterDialog(true);
                    }}
                  >
                    <MoveUp className="mr-2 h-4 w-4" />
                    Naik Semester
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* <p className="text-sm text-gray-400">
                Mendaftar: {new Date(student.createdAt).toLocaleDateString("id-ID")}
              </p> */}
            </CardContent>
          </Card>
        );
      })}

      <ValidationDialog
        open={openSemesterDialog}
        title={
          selectedStuSem
            ? `Apakah Anda yakin menaikkan ${selectedStuSem.name} ke semester ${(selectedStuSem.semester ?? 1) + 1}?`
            : "Konfirmasi Kenaikan Semester"
        }
        onClose={() => setOpenSemesterDialog(false)}
        onVal={() => {
          if (selectedStuSem) {
            handleNaikSemester(selectedStuSem.id_user);
          }
          setOpenSemesterDialog(false);
        }}
        confir
        valName="Naik"
      />

      {/* Jika kosong */}
      {!loading && filteredStudents.length === 0 && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="pt-6 text-center">
            <UserCheck className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">Tidak ada mahasiswa ditemukan</p>
          </CardContent>
        </Card>
      )}

      <DetailDialog
        open={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        data={selectedStudent}
        title="Detail Mahasiswa"
        description="Informasi lengkap mahasiswa terdaftar."
      />
    </>
  );
}