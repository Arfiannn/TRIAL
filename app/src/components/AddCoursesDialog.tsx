import { useState, useEffect } from "react";
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
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import TimeKeeper from "react-timekeeper";
import type { Users } from "@/types/User";
import type { Faculty } from "@/types/Faculty";
import type { Major } from "@/types/Major";
import { getAllUser } from "./services/User";
import { getFaculty } from "./services/Faculty";
import { getMajor } from "./services/Major";
import { createCourse, updateCourse } from "./services/Course";

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
  const [isTimePickerOpen, setIsTimePickerOpen] = useState<"start_time" | "end_time" | false>(false);
  const [lecturer, setLecturer] = useState<Users[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([])
  const [majors, setMajors] = useState<Major[]>([]);
  const [loading, setLoading] = useState(false);

  const sksOption = ["2", "3", "4", "5", "6"];
  const semesterOption = Array.from({ length: 7 }, (_, i) => (i + 1).toString());
  const dayOption = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  const availaleFaculties = ["Semua", ...faculties.map((f) => f.name_faculty)];

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

  const filteredLecturer = lecturer.filter((lecturer) => {
    if (facultyFilter === "Semua") return true;

    // cari jurusan dosen
    const major = majors.find((m) => m.id_major === lecturer.majorId);
    if (!major) return false;

    // cari fakultas jurusan tersebut
    const faculty = faculties.find((f) => f.id_faculty === major.facultyId);
    return faculty?.name_faculty === facultyFilter;
  });

  useEffect(() => {
    if (editData) {
      setName(editData.name_course || "");
      setDescription(editData.description || "");
      setSelectedCredits(editData.sks?.toString() || "");
      setSelectedSemester(editData.semester?.toString() || "");
      setSelectedMajor(editData.majorId?.toString() || "");
      setSelectedDay(editData.day || "");
      setStartTime(editData.start_time || "");
      setEndTime(editData.end_time|| "");

      const Lecturer = lecturer.find((u) => u.id_user === editData.lecturerId);
      const Major = majors.find((m) => m.id_major === Lecturer?.majorId);
      const Faculty = faculties.find((f) => f.id_faculty === Major?.facultyId);

      setSelectedLecturer(Lecturer ? Lecturer.id_user.toString() : "");
      setFacultyFilter(Faculty?.name_faculty || "Semua");
    } else {
      resetForm();
    }
  }, [editData]);

  const handleSubmit = async () => {
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

    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    if (endMinutes <= startMinutes) {
      toast.error("Jam selesai harus lebih besar dari jam mulai!");
      return;
    }

    const payload = {
      lecturerId: parseInt(selectedLecturer),
      majorId: parseInt(selectedMajor),
      semester: parseInt(selectedSemester),
      name_course: name,
      description,
      sks: parseInt(selectedCredits),
      day: selectedDay,
      start_time: startTime, // ✅ format ISO lengkap
      end_time: endTime
    };

    try {
      if (isEdit && editData?.id_course) {
        // ✳️ MODE EDIT
        const updated = await updateCourse(editData.id_course, payload);
        toast.success(`Mata kuliah "${updated.name_course}" berhasil diperbarui!`);
        onSave(updated); // update di parent
      } else {
        // ➕ MODE CREATE
        const created = await createCourse(payload);
        toast.success(`Mata kuliah "${created.name_course}" berhasil ditambahkan!`);
        onSave(created); // tambahkan ke parent list
      }

      resetForm();
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Terjadi kesalahan saat menyimpan data");
    }
  };

  const resetForm = () => {
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
  };

  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

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
                <Select value={facultyFilter} onValueChange={setFacultyFilter}>
                  <SelectTrigger className="h-8 bg-gray-800 border-gray-600 text-gray-200 text-sm">
                    <SelectValue placeholder="Pilih fakultas" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    {availaleFaculties.map((faculty) => (
                      <SelectItem key={faculty} value={faculty}>
                        {faculty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator className="bg-gray-700 my-1" />

              {!loading && filteredLecturer.length > 0 ? (
                filteredLecturer.map((lecturer) => {
                  const major = majors.find((m) => m.id_major === lecturer.majorId);
                  return (
                    <SelectItem
                      key={lecturer.id_user}
                      value={lecturer.id_user.toString()}
                      className="text-white py-2 text-sm flex justify-between"
                    >
                      {lecturer.name}
                      <span className="text-gray-400 text-x ml-2">
                        | {major?.name_major}
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
                    <SelectItem key={m.id_major} value={m.id_major.toString()}>
                      {m.name_major}
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
              <Select value={selectedCredits} onValueChange={setSelectedCredits}>
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
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
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

          {/* Hari & Jam */}
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
              <div className="flex gap-3 items-center">
                {/* Jam Mulai */}
                <div className="w-full">
                  <Button
                    variant="outline"
                    className="w-full bg-gray-800 border-gray-700 text-white justify-start"
                    onClick={() => setIsTimePickerOpen("start_time")}
                  >
                    {startTime || "Pilih Jam Mulai"}
                  </Button>
                </div>

                <span className="text-gray-400 mt-2">–</span>

                {/* Jam Selesai */}
                <div className="w-full">
                  <Button
                    variant="outline"
                    className="w-full bg-gray-800 border-gray-700 text-white justify-start"
                    onClick={() => setIsTimePickerOpen("end_time")}
                  >
                    {endTime || "Pilih Jam Selesai"}
                  </Button>
                </div>
              </div>

              {/* Modal TimeKeeper */}
              {isTimePickerOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
                  <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-lg">
                    <h3 className="text-white mb-3 text-center text-lg font-semibold">
                      {isTimePickerOpen === "start_time"
                        ? "Pilih Jam Mulai"
                        : "Pilih Jam Selesai"}
                    </h3>

                    <TimeKeeper
                      time={
                        isTimePickerOpen === "start_time"
                          ? startTime || "08:00"
                          : endTime || "10:00"
                      }
                      hour24Mode
                      switchToMinuteOnHourSelect
                      onChange={(data) => {
                        const selected = data.formatted24;
                        if (isTimePickerOpen === "start_time") {
                          setStartTime(selected);
                        } else {
                          setEndTime(selected);
                        }
                      }}
                      doneButton={() => (
                        <Button
                          className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => setIsTimePickerOpen(false)}
                        >
                          Simpan Jam
                        </Button>
                      )}
                    />
                  </div>
                </div>
              )}
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
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-600 text-black hover:bg-gray-700"
          >
            Batal
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            {isEdit ? "Simpan Perubahan" : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
