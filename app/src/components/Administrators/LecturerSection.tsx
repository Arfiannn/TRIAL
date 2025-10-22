import { useEffect, useState } from "react";
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
import type { Users } from "@/types/User";
import type { Faculty } from "@/types/Faculty";
import { getAllUser } from "../services/User";
import { getFaculty } from "../services/Faculty";
import { toast } from "sonner";
import type { Major } from "@/types/Major";
import { getMajor } from "../services/Major";

export default function LecturersTab() {


  const [lecturer, setLecturer] = useState<Users[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([])
  const [majors, setMajors] = useState<Major[]>([]);
  const [facultyFilter, setFacultyFilter] = useState<string>("Semua");
  const [selectedLecturer, setSelectedLecturer] = useState<Users | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Ambil daftar fakultas dari mockFaculty
  const availableFaculties = ["Semua", ...faculties.map((f) => f.name_faculty)];

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try{
        const [users, faculties, majors] = await Promise.all([
          getAllUser(),
          getFaculty(),
          getMajor()
        ])
        const dosen = users.filter((u) => u.roleId === 2);
        setLecturer(dosen);
        setFaculties(faculties);
        setMajors(majors)
      } catch (err) {
        console.error(err);
        toast.error("Gagal memuat data dosen dan fakultas");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // ✅ Filter berdasarkan fakultas
  const filteredLecturer = lecturer.filter((lecturer) => {
    if (facultyFilter === "Semua") return true;

    // cari jurusan dosen
    const major = majors.find((m) => m.id_major === lecturer.majorId);
    if (!major) return false;

    // cari fakultas jurusan tersebut
    const faculty = faculties.find((f) => f.id_faculty === major.facultyId);
    return faculty?.name_faculty === facultyFilter;
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
        const major = majors.find((m) => m.id_major === lecturer.majorId);

        return (
          <Card
            key={lecturer.id_user}
            className="bg-gray-800/50 border-gray-700 mb-3 hover:border-blue-700 cursor-pointer transition"
            onClick={() => setSelectedLecturer(lecturer)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">{lecturer.name}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {lecturer.email} • {major?.name_major || "Belum ada jurusan"}
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
              {/* <p className="text-sm text-gray-400">
                Mendaftar:{" "}
                {new Date(lecturer.createdAt).toLocaleDateString("id-ID")}
              </p> */}
            </CardContent>
          </Card>
        );
      })}

      {/* Jika kosong */}
      {!loading && filteredLecturer.length === 0 && (
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
