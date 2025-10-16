import React, { useRef, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, FileText, Upload, File, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import type { Assignment } from "@/types";
import { mockCourses } from "@/utils/mockData";

interface AssignmentListProps {
  assignments: Assignment[];
}

export default function AssignmentList({ assignments }: AssignmentListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submissionText, setSubmissionText] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState<number[]>([]); // simpan ID tugas yang sudah dikumpulkan
  const [submittedFiles, setSubmittedFiles] = useState<Record<number, { name: string; url: string }>>({});
  const [submittedTexts, setSubmittedTexts] = useState<Record<number, string>>({});

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast.info(`File dipilih: ${file.name}`);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmitAssignment = () => {
    if (!submissionText.trim() && !selectedFile) {
      toast.error("Silakan isi jawaban atau upload file terlebih dahulu");
      return;
    }

    if (selectedAssignment) {
      toast.success(`Tugas "${selectedAssignment.title}" berhasil dikumpulkan!`);
      setSubmitted((prev) => [...prev, selectedAssignment.id]);
    }

    if (selectedAssignment && selectedFile) {
      const fileURL = URL.createObjectURL(selectedFile);
      setSubmittedFiles((prev) => ({
        ...prev,
        [selectedAssignment.id]: { name: selectedFile.name, url: fileURL },
      }));
    }

    if (selectedAssignment && submissionText.trim()) {
      setSubmittedTexts((prev) => ({
        ...prev,
        [selectedAssignment.id]: submissionText.trim(),
      }));
    }

    console.log("📁 File dikirim:", selectedFile);
    console.log("📝 Jawaban:", submissionText);

    setSubmissionText("");
    setSelectedFile(null);
    setSelectedAssignment(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="grid gap-4">
      {assignments.map((assignment) => {
        const isSubmitted = submitted.includes(assignment.id);

        const course = mockCourses.find((c) => c.id === assignment.courseId);

        return (
          <Card key={assignment.id} className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-orange-400" />
                  <CardTitle className="text-white">{assignment.title}</CardTitle>
                </div>
                <Badge
                  variant={
                    new Date(assignment.dueDate) < new Date()
                      ? "destructive"
                      : "default"
                  }
                  className={
                    new Date(assignment.dueDate) < new Date()
                      ? ""
                      : "bg-green-900/50 text-green-200"
                  }
                >
                  {new Date(assignment.dueDate) < new Date()
                    ? "Terlambat"
                    : isSubmitted
                      ? <div className="flex items-center gap-2">
                        <CheckCircle size={13} />
                        Terkirim
                      </div>
                      : "Belum Terkumpul"
                  }
                </Badge>
              </div>
              <CardDescription className="text-gray-400">
                {course?.name}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-gray-300">{assignment.description}</p>
              <Button
                onClick={() => {
                  if (assignment.fileUrl) {
                    window.open(assignment.fileUrl, "_blank");
                  } else {
                    toast.error("File tugas belum tersedia!");
                  }
                }}
                className="bg-gray-700 border border-gray-600 text-white"
              >
                <div className="flex items-center gap-2">
                  <File />
                  {assignment.title}
                </div>
              </Button>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Deadline:{" "}
                  {new Date(assignment.dueDate).toLocaleString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              {isSubmitted ? (
                  <div className="space-y-3">
                    {submittedFiles[assignment.id] && (
                      <Button
                        className="flex items-center justify-between border border-blue-700 rounded-md p-3 bg-blue-900/20 "
                        onClick={() => {
                          const fileData = submittedFiles[assignment.id];
                          if (fileData?.url) {
                            window.open(fileData.url, "_blank");
                          } else {
                            toast.error("File tidak ditemukan!");
                          }
                        }}
                      >
                        <div className="flex items-center gap-2 text-sm text-blue-300">
                          <File className="h-4 w-4 text-blue-400" />
                          <p>{submittedFiles[assignment.id]?.name}</p>
                        </div>
                      </Button>
                    )}

                    {/* ✅ Jika ada jawaban teks */}
                    {submittedTexts[assignment.id] && (
                      <div className="border border-gray-600 bg-gray-900/10 rounded-md p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <p className="text-gray-400 text-sm">Jawaban teks terkirim</p>
                        </div>
                        <p className="text-gray-200 text-sm whitespace-pre-wrap">
                          {submittedTexts[assignment.id]}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full bg-orange-600 hover:bg-orange-700"
                        onClick={() => setSelectedAssignment(assignment)}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Kumpulkan Tugas
                      </Button>
                    </DialogTrigger>
  
                    <DialogContent className="bg-gray-900 border-gray-700">
                      <DialogHeader>
                        <DialogTitle className="text-white">
                          Kumpulkan Tugas
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                          {selectedAssignment?.title} -{" "}
                          {course?.name}
                        </DialogDescription>
                      </DialogHeader>
  
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Tulis jawaban atau keterangan tugas Anda di sini..."
                          value={submissionText}
                          onChange={(e) => setSubmissionText(e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                          rows={6}
                        />
  
                        {/* Input file tersembunyi */}
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileSelect}
                          className="hidden"
                        />
  
                        {/* Tombol upload file */}
                        {selectedFile == null && (
                          <Button
                            onClick={handleUploadClick}
                            className="bg-gray-700 border border-gray-500 w-full"
                          >
                            <div className="flex gap-2 items-center">
                              <Upload className="h-4 w-4" />
                              <p>Upload File</p>
                            </div>
                          </Button>
                        )}
  
                        {/* Tampilkan nama file yang dipilih */}
                        {selectedFile && (
                          <div className="inline-block text-sm text-gray-300 border border-gray-500 rounded-sm py-2 px-2">
                            <File className="inline-block w-4 h-4 mr-2 text-blue-400" />
                            {selectedFile?.name}
                          </div>
                        )}
  
                        <div className="flex gap-2 justify-end">
                          <Button
                            onClick={handleSubmitAssignment}
                            className="bg-blue-600 hover:bg-blue-800"
                          >
                            Kirim Tugas
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                            className="border-gray-600 text-gray-300 hover:bg-gray-800 text-black"
                          >
                            Batal
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )
              }
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
