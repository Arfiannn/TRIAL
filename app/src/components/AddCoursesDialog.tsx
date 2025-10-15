import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockUser, mockMajor, mockFaculty, mockUserApproved } from "@/utils/mockData";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

interface AddCourseDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (course: any) => void;
  editData?: any;
}

export default function AddCourseDialog({
  open,
  onClose,
  onSave,
  editData,
}: AddCourseDialogProps) {
  const isEdit = !!editData;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedLecturer, setSelectedLecturer] = useState("");
  const [facultyFilter, setFacultyFilter] = useState("Semua");
  const [selectedCredits, setSelectedCredits] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const sksOption = ["2", "3", "4", "5", "6"];
  const semesterOption = Array.from({ length: 7 }, (_, i) => (i + 1).toString());
  const dayOption = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  // ✅ Ambil semua fakultas dari dosen
  const faculties = ["Semua", ...mockFaculty.map((f) => f.name)]
  const approvedUserIds = mockUserApproved.map((a) => a.userId);

  // ✅ Ambil dosen yang sesuai fakultas filter
  const lecturers = useMemo(() => {
    return mockUser.filter((u) => {
      // hanya dosen
      if (u.role !== "dosen") return false;

      // hanya yang sudah di-approved
      if (!approvedUserIds.includes(u.id)) return false;

      // kalau tidak difilter fakultas → tampilkan semua
      if (facultyFilter === "Semua") return true;

      // 🔹 cari jurusan (major) dosen ini
      const major = mockMajor.find((m) => m.id === u.majorId);
      if (!major) return false;

      // 🔹 cari fakultas dari jurusan tersebut
      const faculty = mockFaculty.find((f) => f.id === major.facultyId);
      if (!faculty) return false;

      // ✅ hanya tampilkan jika nama fakultas cocok dengan filter
      return faculty.name === facultyFilter;
    });
  }, [facultyFilter, approvedUserIds]);

  // ✅ Ambil jurusan dari mockMajor
  const majors = useMemo(() => mockMajor, []);

  // preload data saat edit
  useEffect(() => {
    if (editData) {
      setName(editData.name || "");
      setDescription(editData.description || "");
      setSelectedCredits(editData.credits?.toString() || "");
      setSelectedSemester(editData.semester?.toString() || "");
      setSelectedMajor(editData.majorId?.toString() || "");
      setSelectedDay(editData.day || "");
      setStartTime(editData.startTime || "");
      setEndTime(editData.endTime || "");

      const lecturer = mockUser.find((u) => u.id === editData.lecturerId);
      const major = mockMajor.find((m) => m.id === lecturer?.majorId);
      const faculty = mockFaculty.find((f) => f.id === major?.facultyId);

      setSelectedLecturer(lecturer ? lecturer.id.toString() : "");
      setFacultyFilter(faculty?.name || "Semua");
    } else {
      setName("");
      setDescription("");
      setSelectedLecturer("");
      setFacultyFilter("Semua");
      setSelectedCredits("");
      setSelectedSemester("");
      setSelectedMajor("");
      setSelectedDay("");
      setStartTime("");
      setEndTime("");
    }
  }, [editData]);

  const handleSubmit = () => {
    if (
      !name ||
      !description ||
      !selectedLecturer ||
      !selectedCredits ||
      !selectedSemester ||
      !selectedMajor ||
      !selectedDay ||
      !startTime ||
      !endTime
    ) {
      toast.error("Semua field wajib diisi!");
      return;
    }

    const lecturerData = mockUser.find(
      (u) => u.id.toString() === selectedLecturer
    );

    const majorData = mockMajor.find(
      (m) => m.id.toString() === selectedMajor
    );

    const newCourse = {
      id: isEdit ? editData.id : Date.now(),
      name,
      description,
      lecturerId: lecturerData?.id,
      credits: parseInt(selectedCredits),
      semester: parseInt(selectedSemester),
      majorId: parseInt(selectedMajor),
      day: selectedDay,
      startTime,
      endTime,
      // ✅ Untuk tampilan cepat (opsional)
      lecturerName: lecturerData?.name,
      major: majorData?.name,
    };

    onSave(newCourse);
    toast.success(
      isEdit
        ? `Mata kuliah "${name}" berhasil diperbarui!`
        : `Mata kuliah "${name}" berhasil ditambahkan!`
    );
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border border-gray-700 text-gray-200 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">
            {isEdit ? "Edit Mata Kuliah" : "Tambah Mata Kuliah"}
          </DialogTitle>
        </DialogHeader>

        {/* === PILIH DOSEN === */}
        <div className="space-y-2">
          <Label className="text-gray-300">Pilih Dosen</Label>
          <Select value={selectedLecturer} onValueChange={setSelectedLecturer}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Pilih dosen pengampu" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white max-h-80 overflow-y-auto">
              <div className="px-3 py-2 border-b border-gray-700 sticky top-0 bg-gray-900 z-10">
                <Label className="text-xs text-gray-400 mb-1 block">
                  Filter Fakultas
                </Label>
                <Select
                  value={facultyFilter}
                  onValueChange={setFacultyFilter}
                >
                  <SelectTrigger className="h-8 bg-gray-800 border-gray-600 text-gray-200 text-sm">
                    <SelectValue placeholder="Pilih fakultas" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    {faculties.map((faculty) => (
                      <SelectItem key={faculty} value={faculty}>
                        {faculty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator className="bg-gray-700 my-1" />

              {lecturers.length > 0 ? (
                lecturers.map((lecturer) => {
                  // ✅ Cari nama jurusan berdasarkan majorId
                  const major = mockMajor.find((m) => m.id === lecturer.majorId);

                  return (
                    <SelectItem
                      key={lecturer.id}
                      value={lecturer.id.toString()}
                      className="text-white py-2 text-sm flex justify-between"
                    >
                      {lecturer.name} 
                      <span className="text-gray-400 text-x ml-2">
                        | {major?.name}
                      </span>
                    </SelectItem>
                  );
                })
              ) : (
                <div className="px-3 py-2 text-gray-400 text-sm">
                  Tidak ada dosen di fakultas ini
                </div>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* === FORM FIELD === */}
        <div className="space-y-4 mt-4">
          {/* Nama & Major */}
          <div className="flex flex-row gap-3">
            <div className="space-y-2 w-full">
              <Label className="text-gray-300">Nama Mata Kuliah</Label>
              <Input
                placeholder="Contoh: Algoritma dan Pemrograman"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2 w-full">
              <Label className="text-gray-300">Program Studi</Label>
              <Select value={selectedMajor} onValueChange={setSelectedMajor}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Pilih Program Studi" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {majors.map((m) => (
                    <SelectItem key={m.id} value={m.id.toString()}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* SKS & Semester */}
          <div className="flex flex-row gap-3">
            <div className="space-y-2 w-full">
              <Label className="text-gray-300">Jumlah SKS</Label>
              <Select
                value={selectedCredits}
                onValueChange={setSelectedCredits}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Pilih jumlah SKS" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {sksOption.map((sks) => (
                    <SelectItem key={sks} value={sks}>
                      {sks} SKS
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 w-full">
              <Label className="text-gray-300">Semester</Label>
              <Select
                value={selectedSemester}
                onValueChange={setSelectedSemester}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Pilih semester" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {semesterOption.map((s) => (
                    <SelectItem key={s} value={s}>
                      Semester {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Hari & Waktu */}
          <div className="flex flex-row gap-3">
            <div className="space-y-2 w-full">
              <Label className="text-gray-300">Hari</Label>
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Pilih hari" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {dayOption.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 w-full">
              <Label className="text-gray-300">Jam</Label>
              <div className="flex gap-2">
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <span className="text-gray-400 mt-2">–</span>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
          </div>

          {/* Deskripsi */}
          <div className="space-y-2">
            <Label className="text-gray-300">Deskripsi Mata Kuliah</Label>
            <Textarea
              placeholder="Masukkan deskripsi singkat..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            {isEdit ? "Simpan Perubahan" : "Simpan"}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-600 text-black hover:bg-gray-700"
          >
            Batal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
