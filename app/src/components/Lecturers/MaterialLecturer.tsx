import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { BookOpen, Upload, Plus, FileText, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import ValidationDialog from "../ValidationDialog";
import type { Material, MaterialInput } from "@/types/Material";
import type { Course } from "@/types/Course";
import { getCoursesByLecturer } from "../services/Course";
import { createMaterial, deleteMaterial, getAllMaterialForLecturer, getMaterialFile, updateMaterial } from "../services/Material";

interface Props {
  courseId: number;
}

export default function MaterialTab({ courseId }: Props) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [, setLoading] = useState(false);

  const [newMaterial, setNewMaterial] = useState({
    title: "",
    description: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Material | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [materialsRes, coursesRes] = await Promise.all([
          getAllMaterialForLecturer(),
          getCoursesByLecturer(),
        ]);

        const filteredMaterials = materialsRes.filter(
          (m) => m.courseId === courseId
        );
        setMaterials(filteredMaterials);
        setCourses(coursesRes);
      } catch (err: any) {
        console.error(err);
        toast.error("Gagal memuat materi dan mata kuliah");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [courseId]);

  const course = courses.find((c) => c.id_course === courseId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setFileUrl(URL.createObjectURL(selected));
      toast.info(`File dipilih: ${selected.name}`);
    }
  };

  const handleFileClick = () => fileRef.current?.click();

  const handleOpenDialog = (material?: Material) => {
    if (material) {
      setEditing(material);
      setNewMaterial({
        title: material.title,
        description: material.description,
      });
      setFile(null);
      setFileUrl(material.file_url || null);
    } else {
      setEditing(null);
      setNewMaterial({
        title: "",
        description: "",
      });
      setFile(null);
      setFileUrl(null);
    }
    setIsDialogOpen(true);
  };

  const handleSaveMaterial = async () => {
    if (!newMaterial.title || !newMaterial.description) {
      toast.error("Lengkapi semua field materi!");
      return;
    }

    try {
      if (editing) {
        const updatedInput: Partial<MaterialInput> = {
          title: newMaterial.title,
          description: newMaterial.description,
          file: file || null,
        };

        const updated = await updateMaterial(editing.id_material, updatedInput);

        setMaterials((prev) =>
          prev.map((m) =>
            m.id_material === editing.id_material ? updated : m
          )
        );

        toast.success(`Materi "${newMaterial.title}" berhasil diperbarui!`);
      } else {
        const newInput: MaterialInput = {
          courseId,
          title: newMaterial.title,
          description: newMaterial.description,
          file: file || null,
          created_at: new Date(),
        };

        const created = await createMaterial(newInput);

        setMaterials((prev) => [...prev, created]);
        toast.success(`Materi "${newMaterial.title}" berhasil dibuat!`);
      }
      setEditing(null);
      setFile(null);
      setFileUrl(null);
      setIsDialogOpen(false);
    } catch (err: any) {
      console.error("❌ Gagal simpan material:", err);
      toast.error(err.message || "Terjadi kesalahan saat menyimpan materi");
    }
  };

  async function handleViewFile(id: number) {
    try {
      const { blob, contentType } = await getMaterialFile(id);
      const fileURL = URL.createObjectURL(blob);

      if (contentType === "application/pdf") {
        window.open(fileURL, "_blank");
      } else {
        const link = document.createElement("a");
        link.href = fileURL;
        link.download = `material-${id}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  const handleDeleteMaterial = async (id: number, title: string) => {
    try { 
      await deleteMaterial(id);
      setMaterials((prev) =>prev.filter((a) => a.id_material !== id));
      toast.success(`Materi: ${title} berhasil dihapus!`);
    } catch (err:any) {
      toast.error(err.message || "Gagal menghapus materi");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editing ? "Edit Materi" : "Tambah Materi Baru"}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {editing
                  ? `Ubah materi ${editing.title}`
                  : `Tambahkan materi pembelajaran untuk ${course?.name_course || "mata kuliah"}`}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <Label className="text-gray-200">Judul Materi</Label>
              <Input
                value={newMaterial.title}
                onChange={(e) =>
                  setNewMaterial({ ...newMaterial, title: e.target.value })
                }
                className="bg-gray-800 border-gray-700 text-white"
              />

              <Label className="text-gray-200">Konten</Label>
              <Textarea
                value={newMaterial.description}
                onChange={(e) =>
                  setNewMaterial({ ...newMaterial, description: e.target.value })
                }
                className="bg-gray-800 border-gray-700 text-white"
                rows={5}
              />

              <div className="flex items-end gap-3">
                <div className="w-full">
                  <Label className="text-gray-200">Upload File</Label>
                  <input
                    ref={fileRef}
                    type="file"
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

                {(file || fileUrl) && (
                  <div>
                    <Button
                      variant="ghost"
                      className="bg-gray-800 border border-gray-700 inline-flex text-white"
                      onClick={() => window.open(fileUrl!, "_blank")}
                    >
                      <FileText size={16} className="mr-1 text-blue-400" />
                      {file ? file.name : newMaterial.title}
                    </Button>
                  </div>
                )}
              </div>

              <Button
                onClick={handleSaveMaterial}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Simpan Materi
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <div className="flex justify-end items-center">
          <Button
            onClick={() => handleOpenDialog()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" /> Tambah Materi
          </Button>
        </div>

        {materials.length === 0 ? (
          <p className="text-gray-400 text-center py-6">
            Belum ada materi yang dibuat.
          </p>
        ) : (
          <div className="grid gap-4">
            {materials.map((m) => (
              <Card
                key={m.id_material}
                className="bg-gray-800/50 border-gray-700"
              >
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-blue-400" />
                      <CardTitle className="text-white">{m.title}</CardTitle>
                    </div>
                    <Badge className="bg-gray-600 border-gray-300">
                      {new Date(m.created_at).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-300 mb-2">{m.description}</p>

                  {m.file_url && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-gray-700 border border-gray-600 text-white"
                      onClick={() => handleViewFile(m.id_material)}
                    >
                      <FileText /> {m.title}
                    </Button>
                  )}

                  <div className="flex justify-end gap-2 mt-2">
                    <Button
                      onClick={() => handleOpenDialog(m)}
                      className="bg-amber-700 hover:bg-amber-800 border border-amber-600 flex gap-2"
                    >
                      <Edit className="h-4 w-4" /> Edit
                    </Button>

                    <Button
                      onClick={() => {
                        setSelectedMaterial(m);
                        setOpenDeleteDialog(true);
                      }}
                      className="bg-red-700 border border-red-600 flex gap-2"
                    >
                      <Trash2 className="h-4 w-4" /> Hapus
                    </Button>

                    <ValidationDialog
                      title={`Apakah anda yakin Menghapus Materi: ${selectedMaterial?.title ?? ""}? `}
                      open={openDeleteDialog}
                      onClose={() => setOpenDeleteDialog(false)}
                      onVal={() => {
                        if (selectedMaterial) {
                          handleDeleteMaterial(
                            selectedMaterial.id_material,
                            selectedMaterial.title
                          );
                        }
                        setOpenDeleteDialog(false);
                      }}
                      valName="Hapus"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
