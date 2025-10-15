import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCheck } from "lucide-react";
import DetailDialog from "@/components/DetailDialog";
import { mockUser, mockMajor, mockFaculty, mockUserApproved } from "@/utils/mockData";

export default function LecturersTab() {

  const approvedUserIds = mockUserApproved.map((u) => u.userId);

  const [lecturer] = useState(
    mockUser.filter(
      (u) => u.role === "dosen" && approvedUserIds.includes(u.id)
    )
  );

  const [facultyFilter, setFacultyFilter] = useState<string>("Semua");
  const [selectedLecturer, setSelectedLecturer] = useState<any>(null);

  // ✅ Ambil daftar fakultas dari mockFaculty
  const availableFaculties = ["Semua", ...mockFaculty.map((f) => f.name)];

  // ✅ Filter berdasarkan fakultas
  const filteredLecturer = lecturer.filter((lecturer) => {
    if (facultyFilter === "Semua") return true;

    // cari jurusan dosen
    const major = mockMajor.find((m) => m.id === lecturer.majorId);
    if (!major) return false;

    // cari fakultas jurusan tersebut
    const faculty = mockFaculty.find((f) => f.id === major.facultyId);
    return faculty?.name === facultyFilter;
  });

  return (
    <>
      {/* Filter Fakultas */}
      <div className="flex justify-between items-center mb-4">
        <Badge
          variant="secondary"
          className="bg-gray-600 border-gray-400 text-white h-6"
        >
          Total : {filteredLecturer.length} Dosen
        </Badge>

        <Select value={facultyFilter} onValueChange={setFacultyFilter}>
          <SelectTrigger className="w-[220px] bg-gray-800 border border-gray-700 text-gray-200">
            <SelectValue placeholder="Pilih Fakultas" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border border-gray-700 text-gray-200">
            {availableFaculties.map((faculty) => (
              <SelectItem
                key={faculty}
                value={faculty}
                className="text-gray-200 hover:bg-gray-700"
              >
                {faculty === "Semua" ? "Semua Fakultas" : faculty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Daftar Dosen */}
      {filteredLecturer.map((lecturer) => {
        // cari jurusan dosen berdasarkan majorId
        const major = mockMajor.find((m) => m.id === lecturer.majorId);

        return (
          <Card
            key={lecturer.id}
            className="bg-gray-800/50 border-gray-700 mb-3 hover:border-blue-700 cursor-pointer transition"
            onClick={() => setSelectedLecturer(lecturer)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">{lecturer.name}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {lecturer.email} • {major?.name || "Belum ada jurusan"}
                  </CardDescription>
                </div>
                <Badge
                  className="border-blue-600 text-blue-300"
                  variant="outline"
                >
                  Dosen
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Mendaftar:{" "}
                {new Date(lecturer.createdAt).toLocaleDateString("id-ID")}
              </p>
            </CardContent>
          </Card>
        );
      })}

      {/* Jika kosong */}
      {filteredLecturer.length === 0 && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="pt-6 text-center">
            <UserCheck className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">Tidak ada dosen ditemukan</p>
          </CardContent>
        </Card>
      )}

      {/* Dialog Detail */}
      <DetailDialog
        open={!!selectedLecturer}
        onClose={() => setSelectedLecturer(null)}
        data={selectedLecturer}
        title="Detail Dosen"
        description="Informasi lengkap dosen terdaftar."
      />
    </>
  );
}
