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
import { FileText, Upload, Plus, File, Edit, Trash2, Clock } from "lucide-react";
import { toast } from "sonner";
import { mockAssignments, mockCourses } from "@/utils/mockData";
import { useNavigate } from "react-router-dom";
import type { Assignment } from "@/types";

interface Props {
  courseId: number;
}

export default function AssignmentTab({ courseId }: Props) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Assignment | null>(null);

  const course = mockCourses.find((c) => c.id === courseId);

  useEffect(() => {
    const filtered = mockAssignments.filter((a) => a.courseId === courseId);
    setAssignments(filtered);
  }, [courseId]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    dueTime: "",
    maxScore: 100,
  });

  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const navigate = useNavigate();

  const handleToListSubmission = (assignmentId: number) => {
    navigate(`/lecturer/submissionStudent/${assignmentId}`);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (selected) {
      setFile(selected);
      const url = URL.createObjectURL(selected);
      setFileUrl(url);
      toast.success(`File "${selected.name}" berhasil dipilih`);
    }
  };

  const handleFileClick = () => fileRef.current?.click();

  const handleOpenDialog = (assignment?: Assignment) => {
    if (assignment) {
      setEditing(assignment);
      const date = new Date(assignment.dueDate);
      setFormData({
        title: assignment.title,
        description: assignment.description,
        dueDate: date.toISOString().split("T")[0],
        dueTime: date.toTimeString().slice(0, 5), // ambil HH:mm
        maxScore: assignment.maxScore,
      });
      setFile(null);
      setFileUrl(assignment.fileUrl || null);
    } else {
      setEditing(null);
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        dueTime: "",
        maxScore: 100,
      });
      setFile(null);
      setFileUrl(null);
    }
    setIsDialogOpen(true);
  };

  /** ===================== SAVE ===================== */
  const handleSaveAssignment = () => {
    if (!formData.title || !formData.description || !formData.dueDate) {
      toast.error("Lengkapi semua field tugas!");
      return;
    }

    // 🔹 Gabungkan tanggal dan jam jadi satu objek Date
    const dueDateTime = formData.dueTime
      ? new Date(`${formData.dueDate}T${formData.dueTime}`)
      : new Date(`${formData.dueDate}T23:59`);

    if (editing) {
      const updated = {
        ...editing,
        ...formData,
        dueDate: dueDateTime,
        fileUrl: file ? fileUrl : editing.fileUrl,
      };
      setAssignments((prev) =>
        prev.map((a) => (a.id === editing.id ? updated : a))
      );
      toast.success(`Tugas "${formData.title}" berhasil diperbarui!`);
    } else {
      const newAssignment: Assignment = {
        id: Date.now(),
        courseId,
        title: formData.title,
        description: formData.description,
        dueDate: dueDateTime,
        maxScore: formData.maxScore,
        fileUrl,
        createdAt: new Date(),
      };
      setAssignments((prev) => [...prev, newAssignment]);
      toast.success(`Tugas "${formData.title}" berhasil dibuat!`);
    }

    setIsDialogOpen(false);
    setEditing(null);
    setFile(null);
    setFileUrl(null);
  };

  const handleDeleteAssignment = (id: number) => {
    if (confirm("Yakin ingin menghapus tugas ini?")) {
      setAssignments((prev) => prev.filter((a) => a.id !== id));
      toast.success("Tugas berhasil dihapus!");
    }
  };

  return (
    <div className="space-y-4">
      {/* === Tombol Tambah === */}
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
              key={a.id}
              className="bg-gray-800/50 border-gray-700"
              onClick={() => handleToListSubmission(a.id)}
            >
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-orange-400" />
                    <CardTitle className="text-white">{a.title}</CardTitle>
                  </div>
                  <Badge className="bg-gray-600 border-gray-300 text-white">
                    Deadline:{" "}
                    {new Date(a.dueDate) < new Date()
                      ? `${new Date(a.dueDate).toLocaleString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })} (Selesai)`
                      : new Date(a.dueDate).toLocaleString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                  </Badge>
                </div>
                <CardDescription className="text-gray-400">
                  {course?.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-2">{a.description}</p>

                {a.fileUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-gray-700 border border-gray-600 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(a.fileUrl || "#", "_blank");
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
                      handleDeleteAssignment(a.id);
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
                : `Buat tugas untuk mata kuliah ${course?.name}`}
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

            <div className="grid grid-cols-3 gap-4">
              {/* === PILIH TANGGAL === */}
              <div>
                <Label className="text-gray-200">Tanggal Deadline</Label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              {/* === PILIH JAM (muncul setelah tanggal dipilih) === */}
              {formData.dueDate && (
                <div>
                  <Label className="text-gray-200 flex items-center gap-1">
                    <Clock size={14} /> Jam Deadline
                  </Label>
                  <Input
                    type="time"
                    value={formData.dueTime}
                    onChange={(e) =>
                      setFormData({ ...formData, dueTime: e.target.value })
                    }
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              )}

              <div>
                <Label className="text-gray-200">Nilai Maksimal</Label>
                <Input
                  type="number"
                  value={formData.maxScore}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxScore: parseInt(e.target.value),
                    })
                  }
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-200">Upload File</Label>
              <input
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

            {/* Menampilkan file lama atau baru */}
            {(file || fileUrl) && (
              <div>
                <Button
                  variant="ghost"
                  className="bg-gray-800 border border-gray-700 inline-flex text-white"
                  onClick={() => window.open(fileUrl!, "_blank")}
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
