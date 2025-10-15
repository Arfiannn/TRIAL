import { useState, useMemo } from "react";
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
import { mockUser, mockUserApproved, mockMajor } from "@/utils/mockData"; // ⬅️ ambil semua sumber
import DetailDialog from "@/components/DetailDialog";

export default function StudentsTab() {
  // ✅ Ambil hanya mahasiswa yang sudah disetujui (ada di userApprove)
  const approvedUserIds = mockUserApproved.map((u) => u.userId);

  const [students, setStudents] = useState(
    mockUser.filter(
      (u) => u.role === "mahasiswa" && approvedUserIds.includes(u.id)
    )
  );

  const [majorFilter, setMajorFilter] = useState<string>("Semua");
  const [semesterFilter, setSemesterFilter] = useState<string>("Semua");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // ✅ Ambil daftar major dari mockMajor
  const availableMajors = ["Semua", ...mockMajor.map((m) => m.name)];
  const availableSemester = ["Semua", ...Array.from({ length: 14 }, (_, i) => (i + 1).toString())];

  // ✅ Filter mahasiswa berdasarkan majorId dan semester
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const studentMajorName = mockMajor.find((m) => m.id === s.majorId)?.name;

      const matchMajor = majorFilter === "Semua" || studentMajorName === majorFilter;
      const matchSemester =
        semesterFilter === "Semua" ||
        s.semester?.toString() === semesterFilter.toString();

      return matchMajor && matchSemester;
    });
  }, [students, majorFilter, semesterFilter]);

  // ✅ Fungsi naik semester
  const handleNaikSemester = (id: number) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, semester: (s.semester ?? 1) + 1 } : s
      )
    );

    const student = students.find((s) => s.id === id);
    if (student) {
      toast.success(`${student.name} naik ke semester ${(student.semester ?? 1) + 1}`);
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
        const majorData = mockMajor.find((m) => m.id === student.majorId);

        return (
          <Card
            key={student.id}
            className="bg-gray-800/50 border-gray-700 mb-3"
            onClick={() => setSelectedStudent(student)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">{student.name}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {student.email} • {majorData?.name || "Belum memilih jurusan"}
                  </CardDescription>
                </div>
                <div className="flex gap-3 items-center">
                  <Badge className="border-blue-600 text-blue-300" variant="outline">
                    Semester {student.semester ?? 1}
                  </Badge>
                  <Button
                    size="sm"
                    className="bg-blue-800 hover:bg-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNaikSemester(student.id);
                    }}
                  >
                    <MoveUp className="mr-2 h-4 w-4" />
                    Naik Semester
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Mendaftar: {new Date(student.createdAt).toLocaleDateString("id-ID")}
              </p>
            </CardContent>
          </Card>
        );
      })}

      {/* Jika kosong */}
      {filteredStudents.length === 0 && (
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