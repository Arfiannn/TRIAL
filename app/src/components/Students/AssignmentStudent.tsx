import React, { useEffect, useRef, useState } from "react";
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
import { mockCourses } from "@/utils/mockData";
import type { Assignment } from "@/types/Assignment";
import { getAssignmentFile } from "../services/Assignment";
import { createSubmission, getAllSubmissions } from "../services/Submission"

interface AssignmentListProps {
  assignments: Assignment[];
}

export default function AssignmentList({ assignments }: AssignmentListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submissionText, setSubmissionText] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState<number []>([]);
  const [submittedFiles, setSubmittedFiles] = useState<Record<number, { name: string; url: string }>>({});
  const [submittedTexts, setSubmittedTexts] = useState<Record<number, string>>({});

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const submissions = await getAllSubmissions();

        // Ambil ID assignment yang sudah dikumpulkan
        const submittedIds = submissions.map((s) => s.assignmentId);
        setSubmitted(submittedIds);

        // 📝 Mapping jawaban teks & file
        const fileMap: Record<number, { name: string; url: string }> = {};
        const textMap: Record<number, string> = {};

        submissions.forEach((s) => {
          if (s.file_url) {
            fileMap[s.assignmentId] = {
              name: s.file_url.split("/").pop() || "file",
              url: s.file_url,
            };
          }
          if (s.description) {
            textMap[s.assignmentId] = s.description;
          }
        });

        setSubmittedFiles(fileMap);
        setSubmittedTexts(textMap);

      } catch (err: any) {
        console.error(err);
        toast.error(err.message);
      }
    };

    fetchSubmissions();
  }, []);

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

  const handleSubmitAssignment = async () => {
    if (!submissionText.trim() && !selectedFile) {
      toast.error("Silakan isi jawaban atau upload file terlebih dahulu");
      return;
    }

    if (!selectedAssignment) return;

    try {
      const res = await createSubmission({
        assignmentId: selectedAssignment.id_assignment,
        description: submissionText,
        file: selectedFile || null,
      });

      toast.success(`Tugas "${selectedAssignment.title}" berhasil dikumpulkan ✅`);
      setSubmitted((prev) => [...prev, selectedAssignment.id_assignment]);

      if (selectedFile) {
        const file_url = URL.createObjectURL(selectedFile);
        setSubmittedFiles((prev) => ({
          ...prev,
          [selectedAssignment.id_assignment]: {
            name: selectedFile.name,
            url: file_url,
          },
        }));
      }

      if (submissionText.trim()) {
        setSubmittedTexts((prev) => ({
          ...prev,
          [selectedAssignment.id_assignment]: submissionText.trim(),
        }));
      }

      console.log("📤 Response BE:", res);
    } catch (error: any) {
      toast.error(error.message || "Gagal mengumpulkan tugas ❌");
    } finally {
      setSubmissionText("");
      setSelectedFile(null);
      setSelectedAssignment(null);
      setIsDialogOpen(false);
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

  return (
    <div className="grid gap-4">
      {assignments.map((assignment) => {
        const isSubmitted = submitted.includes(assignment.id_assignment);

        const course = mockCourses.find((c) => c.id === assignment.courseId);

        return (
          <Card key={assignment.id_assignment} className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-orange-400" />
                  <CardTitle className="text-white">{assignment.title}</CardTitle>
                </div>
                <Badge
                  variant={
                    new Date(assignment.deadline) < new Date()
                      ? "destructive"
                      : "default"
                  }
                  className={
                    new Date(assignment.deadline) < new Date()
                      ? ""
                      : "bg-green-900/50 text-green-200"
                  }
                >
                  {new Date(assignment.deadline) < new Date()
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
                  if (assignment.file_url) {
                    handleViewFile(assignment.id_assignment);
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
                  {new Date(assignment.deadline).toLocaleString("id-ID", {
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
                    {submittedFiles[assignment.id_assignment] && (
                      <Button
                        className="flex items-center justify-between border border-blue-700 rounded-md p-3 bg-blue-900/20 "
                        onClick={() => {
                          const fileData = submittedFiles[assignment.id_assignment];
                          if (fileData?.url) {
                            handleViewFile(assignment.id_assignment);
                          } else {
                            toast.error("File tidak ditemukan!");
                          }
                        }}
                      >
                        <div className="flex items-center gap-2 text-sm text-blue-300">
                          <File className="h-4 w-4 text-blue-400" />
                          <p>Lihat Submission</p>
                        </div>
                      </Button>
                    )}

                    {submittedTexts[assignment.id_assignment] && (
                      <div className="border border-gray-600 bg-gray-900/10 rounded-md p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <p className="text-gray-400 text-sm">Jawaban teks terkirim</p>
                        </div>
                        <p className="text-gray-200 text-sm whitespace-pre-wrap">
                          {submittedTexts[assignment.id_assignment]}
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
  
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileSelect}
                          className="hidden"
                        />
  
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
