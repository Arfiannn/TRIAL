import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Upload, Plus, File, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import TimeKeeper from "react-timekeeper"
import ValidationDialog from "../ValidationDialog";
import type { Assignment } from "@/types/Assignment";
import { createAssignment, deleteAssignment, getAllAssignments, getAssignmentFile, updateAssignment } from "../services/Assignment";
import type { Major } from "@/types/Major";
import { getMajor } from "../services/Major";

interface Props {
  courseId: number;
}

export default function AssignmentTab({ courseId }: Props) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Assignment | null>(null);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false)
  const [, setTempDate] = useState<string>("")
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); 
  const [, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAssignments() {
      setLoading(true);
      try {
        const [assignments, majors] = await Promise.all([
          getAllAssignments(),
          getMajor(),
        ])
        const filtered = assignments.filter((a) => a.courseId === courseId);
        setAssignments(filtered);
        setMajors(majors);
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Gagal memuat data tugas");
      } finally {
        setLoading(false);
      }
    }

    fetchAssignments();
  }, []);

  const course = majors.find((c) => c.id_major === courseId);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadlineDate: "",
    deadlineTime: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [file_url, setFileUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const navigate = useNavigate();

  const handleToListSubmission = (assignmentId: number) => {
    navigate(`/lecturer/submissionStudent/${assignmentId}`);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (selected) {
      setFile(selected);
      setFileUrl(URL.createObjectURL(selected));
      toast.success(`File "${selected.name}" berhasil dipilih`);
    }
  };

  const handleFileClick = () => fileRef.current?.click();

  const handleOpenDialog = (assignment?: Assignment) => {
    if (assignment) {
      setEditing(assignment);
      const date = new Date(assignment.deadline);
      setFormData({
        title: assignment.title,
        description: assignment.description,
        deadlineDate: date.toISOString().split("T")[0],
        deadlineTime: date.toTimeString().slice(0, 5),
      });
      setFile(null);
      setFileUrl(assignment.file_url || null);
    } else {
      setEditing(null);
      setFormData({
        title: "",
        description: "",
        deadlineDate: "",
        deadlineTime: "",
      });
      setFile(null);
      setFileUrl(null);
    }
    setIsDialogOpen(true);
  };

  const handleSaveAssignment = async () => {
    if (!formData.title || !formData.description || !formData.deadlineDate) {
      toast.error("Lengkapi semua field tugas!");
      return;
    }

    const formattedDeadline = `${formData.deadlineDate} ${formData.deadlineTime || "23:59"}:00`;

    try {
      if (editing) {
        const fileUrlToUse = file ? file_url : editing.file_url;
        const fileTypeToUse = file ? file.type : editing.file_type;

        const updated = await updateAssignment(editing.id_assignment, {
          title: formData.title,
          description: formData.description,
          deadline: formattedDeadline,
          file: file || null,
          file_url: fileUrlToUse || "",
          file_type: fileTypeToUse || "",
        });

        setAssignments((prev) =>
          prev.map((a) =>
            a.id_assignment === editing.id_assignment ? updated : a
          )
        );
        toast.success(`Tugas "${formData.title}" berhasil diperbarui!`);
      } else {
        const created = await createAssignment({
          courseId,
          title: formData.title,
          description: formData.description,
          deadline: formattedDeadline,
          file: file || null,
        });

        setAssignments((prev) => [...prev, created]);
        toast.success(`Tugas "${formData.title}" berhasil dibuat!`);
      }

      setIsDialogOpen(false);
      setEditing(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Terjadi kesalahan saat menyimpan tugas");
    }
  };

  async function handleViewFile(id: number) {
    try {
      const { blob, contentType } = await getAssignmentFile(id);
      const fileURL = URL.createObjectURL(blob);

      if (contentType === "application/pdf") {
        window.open(fileURL, "_blank");
      } else {
        const link = document.createElement("a");
        link.href = fileURL;
        link.download = `assignment-${id}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  const handleDeleteAssignment = async (id: number, title: string) => {
    try{
      await deleteAssignment(id);
      setAssignments((prev) => prev.filter((a) => a.id_assignment !== id));
      toast.success(`Tugas: ${title} berhasil dihapus!`);
    } catch (err:any) {
      toast.error(err.message || "Gagal menghapus tugas");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center">
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" /> Tambah Tugas
        </Button>
      </div>

      {/* === List Tugas === */}
      {assignments.length === 0 ? (
        <p className="text-gray-400 text-center py-6">
          Belum ada tugas yang dibuat.
        </p>
      ) : (
        <div className="grid gap-4">
          {assignments.map((a) => (
            <Card
              key={a.id_assignment}
              className="bg-gray-800/50 border-gray-700"
              onClick={() => handleToListSubmission(a.id_assignment)}
            >
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-orange-400" />
                    <CardTitle className="text-white">{a.title}</CardTitle>
                  </div>
                  <Badge className="bg-gray-600 border-gray-300 text-white">
                    Deadline:{" "}
                    {(() => {
                      const date = new Date(a.deadline);

                      const formatted = date.toLocaleString("id-ID", {
                        timeZone: "Asia/Makassar",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      });

                      return date < new Date() ? `${formatted} (Selesai)` : formatted;
                    })()}
                  </Badge>
                </div>
                <CardDescription className="text-gray-400">
                  {course?.name_major}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-2">{a.description}</p>

                {a.file_url && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-gray-700 border border-gray-600 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewFile(a.id_assignment)
                    }}
                  >
                    <File className="h-4 w-4" /> {a.title}
                  </Button>
                )}

                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDialog(a);
                    }}
                    className="bg-amber-700 hover:bg-amber-800 border border-amber-600 flex gap-2"
                  >
                    <Edit className="h-4 w-4" /> Edit
                  </Button>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAssignment(a)
                      setOpenDeleteDialog(true);
                    }}
                    className="bg-red-700 border border-red-600 flex gap-2"
                  >
                    <Trash2 className="h-4 w-4" /> Hapus
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ValidationDialog 
        title={`Apakah anda Yakin menghapus Tugas: ${selectedAssignment?.title ?? ""}? `}
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onVal={() => {
          if(selectedAssignment) {
            handleDeleteAssignment(selectedAssignment.id_assignment, selectedAssignment.title);
          }
          setOpenDeleteDialog(false);
        }}
        valName="Hapus"
      
      />

      {/* === DIALOG === */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editing ? "Edit Tugas" : "Tambah Tugas Baru"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {editing
                ? `Ubah detail tugas ${editing.title}`
                : `Buat tugas untuk mata kuliah ${course?.name_major}`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label className="text-gray-200">Judul</Label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="bg-gray-800 border-gray-700 text-white"
            />

            <Label className="text-gray-200">Deskripsi</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="bg-gray-800 border-gray-700 text-white"
              rows={4}
            />

            <div className="flex flex-row gap-4">
              {/* === PILIH TANGGAL === */}
              <div className="col-span-2 flex gap-2 items-end">
                <div className="flex-1">
                  <Label className="text-gray-200">Tanggal Deadline</Label>
                  <Input
                    type="date"
                    value={formData.deadlineDate}
                    onChange={(e) => {
                      const selectedDate = e.target.value;
                      setTempDate(selectedDate);
                      setFormData({ ...formData, deadlineDate: selectedDate });
                      setIsTimePickerOpen(true); // buka popup jam
                    }}
                    className="bg-gray-800 border-gray-700 text-white cursor-pointer"
                  />
                </div>

                {formData.deadlineTime && (
                  <Input
                    type="text"
                    readOnly
                    placeholder="--:--"
                    value={formData.deadlineTime}
                    className="w-[90px] bg-gray-800 border-gray-700 text-white text-center cursor-default"
                  />
                )}
              </div>

              {/* === NILAI MAKSIMAL === */}
              <div className="w-full">
                <Label className="text-gray-200">Upload File</Label>
                <Input
                  type="file"
                  ref={fileRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  onClick={handleFileClick}
                  className="bg-gray-800 border border-gray-700 w-full flex gap-2 items-center justify-center"
                >
                  <Upload className="h-4 w-4" />
                  Pilih File
                </Button>
              </div>

              {/* === POPUP JAM ANALOG === */}
              {isTimePickerOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
                  <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-lg">
                    <h3 className="text-white mb-3 text-center text-lg font-semibold">
                      Pilih Jam Deadline
                    </h3>
                    <TimeKeeper
                      time={formData.deadlineTime || "12:00"}
                      hour24Mode
                      switchToMinuteOnHourSelect
                      onChange={(data) => {
                        const selectedTime = data.formatted24;
                        setFormData((prev) => ({
                          ...prev,
                          deadlineTime: selectedTime, // simpan langsung jam (string "HH:mm")
                        }));
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

            {/* Menampilkan file lama atau baru */}
            {(file || file_url) && (
              <div>
                <Button
                  variant="ghost"
                  className="bg-gray-800 border border-gray-700 inline-flex text-white"
                  onClick={() => window.open(file_url!, "_blank")}
                >
                  <File size={16} className="mr-1 text-blue-400" />
                  {file ? file.name : formData.title}
                </Button>
              </div>
            )}

            <Button
              onClick={handleSaveAssignment}
              className={`w-full ${
                editing
                  ? "bg-yellow-700 hover:bg-yellow-800"
                  : "bg-blue-600 hover:bg-blue-800"
              }`}
            >
              {editing ? "Simpan Perubahan" : "Simpan Tugas"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
