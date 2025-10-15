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
import { mockMaterials } from "@/utils/mockData";
import { useAuth } from "@/components/auth/AuthContext";

interface Material {
  id: number;
  courseId: number;
  title: string;
  description: string;
  file?: File | null;
  fileUrl?: string | null;
  createdAt: Date;
  createdBy?: number;
}

interface Props {
  courseId: number;
  courseName: string;
}

export default function MaterialTab({ courseId, courseName }: Props) {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);

  useEffect(() => {
    const filtered = mockMaterials.filter(m => m.courseId === courseId);
    setMaterials(filtered);
  }, [courseId]);

  const [newMaterial, setNewMaterial] = useState({ 
    title: "", 
    description: "" 
  });
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Material | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const url = URL.createObjectURL(selected);
      setFileUrl(url);
      toast.info(`File dipilih: ${selected.name}`);
    }
  };
  const handleFileClick = () => fileRef.current?.click();

  const handleOpenDialog = (materials?: Material) => {
    if (materials) {
      setEditing(materials);
      setNewMaterial({
        title: materials.title,
        description: materials.description,
      })
      setFile(null);
      setFileUrl(materials.fileUrl || null);
    } else {
      setEditing(null);
      setNewMaterial({
        title: "",
        description: "",
      })
      setFile(null);
      setFileUrl(null);
    }
    setIsDialogOpen(true);
  }

  const handleSaveMaterial = () => {
    if (!newMaterial.title || !newMaterial.description) {
      toast.error("Lengkapi semua field materi!");
      return;
    }

    if(editing) {
      const update = {
        ...editing,
        ...newMaterial,
        file,
        fileUrl: file ? fileUrl : editing.fileUrl,
      };
      setMaterials((prev) => 
        prev.map((m) => (m.id === editing.id ? update : m))
      );
      toast.success(`Materi "${newMaterial.title}" berhasil diperbarui!`);

      setIsDialogOpen(false);
    } else {

      const newDataMaterial: Material = {
        id: Date.now(),
        courseId,
        title: newMaterial.title,
        description: newMaterial.description,
        file,
        fileUrl,
        createdAt: new Date(),
        createdBy: user?.id,
      };
      setMaterials((prev) => [...prev, newDataMaterial]);
      toast.success(`Materi "${newMaterial.title}" berhasil dibuat!`);
  
      setEditing(null);
      setFile(null);
      setFileUrl(null);
      setIsDialogOpen(false);
    }


  };

  const handleDeleteMaterial = (id: number) => {
    if (confirm("Yakin ingin menghapus materi ini?")) {
      setMaterials((prev) => prev.filter((a) => a.id !== id));
      toast.success("Materi berhasil dihapus!");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Tambah Materi Baru</DialogTitle>
              <DialogDescription className="text-gray-400">
                Tambahkan materi pembelajaran untuk {courseName}
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
                      <FileText size={16} className="mr-1 text-blue-400" />{file ? file.name : newMaterial.title}
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
              <Card key={m.id} className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-blue-400" />
                      <CardTitle className="text-white">{m.title}</CardTitle>
                    </div>
                    <Badge className="bg-gray-600 border-gray-300">
                      {new Date(m.createdAt).toLocaleDateString("id-ID")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-2">{m.description}</p>
                  {m.file && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-gray-700 border border-gray-600 text-white"
                      onClick={() => window.open(m.fileUrl || "#", "_blank")}
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
                    onClick={() => handleDeleteMaterial(m.id)}
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
      </div>

    </div>
  );
}
