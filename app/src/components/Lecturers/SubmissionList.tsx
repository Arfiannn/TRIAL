import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileCheck2, FileX, Eye, ArrowLeft, ClockAlert } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getAssignmentById } from "../services/Assignment";
import { getAllSubmissions, getSubmissionFile } from "../services/Submission";
import { getAllUser } from "../services/User";
import { getMajor } from "../services/Major";
import { getCoursesByIdForLecturer } from "../services/Course";

interface StudentSubmission {
  id_user: number;
  name: string;
  email: string;
  major: string;
  id_submission?: number | null; 
  file_name?: string | null;
  hasSubmitted: boolean;
  isLate: boolean;
  submitted_at?: string;
  file_url?: string | null;
  text?: string;
}

export default function SubmissionStudentPage() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const [students, setStudents] = useState<StudentSubmission[]>([]);
  const [assignmentTitle, setAssignmentTitle] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("Semua");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      if (!assignmentId) return;

      try {
        setLoading(true);

        const assignment = await getAssignmentById(Number(assignmentId));
        setAssignmentTitle(assignment.title);

        const [submissions, users, course, majors] = await Promise.all([
          (await getAllSubmissions()) || [],
          getAllUser(),
          getCoursesByIdForLecturer(assignment.courseId),
          getMajor(),
        ]);

        if (!course) {
          toast.error("Course tidak ditemukan untuk assignment ini");
          return;
        }

        const mahasiswa = users.filter(
          (u) =>
            u.roleId === 3 &&
            u.majorId === course.majorId &&
            u.semester === course.semester
        );

        const mergedData = mahasiswa.map((stu) => {
          const submission = submissions?.find?.(
            (s) =>
              s.assignmentId === Number(assignmentId) &&
              s.studentId === stu.id_user
          );

          const isLate =
            submission && assignment.deadline
              ? new Date(submission.submitted_at).getTime() >
                new Date(assignment.deadline).getTime()
              : false;

          return {
            id_user: stu.id_user,
            id_submission: submission?.id_submission ?? null,
            name: stu.name,
            email: stu.email,
            file_name: submission?.file_name || null,
            major:
              majors.find((m) => m.id_major === stu.majorId)?.name_major || "Unknown",
            hasSubmitted: !!submission,
            isLate,
            submitted_at: submission?.submitted_at
              ? new Date(submission.submitted_at).toISOString()
              : undefined,
            file_url: submission?.file_url,
            text: submission?.description || "",
          };
        });

        setStudents(mergedData);
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Gagal memuat data submission mahasiswa");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [assignmentId]);

  const filteredStudents = students.filter((s) => {
    if (filterStatus === "Semua") return true;
    if (filterStatus === "Submitted") return s.hasSubmitted && !s.isLate;
    if (filterStatus === "Terlambat") return s.hasSubmitted && s.isLate;
    if (filterStatus === "Belum Dikirim") return !s.hasSubmitted;
    return true;
  });

  async function handleViewFile(id: number) {
    try {
      const { blob, contentType } = await getSubmissionFile(id);
      const fileURL = URL.createObjectURL(blob);

      if (contentType === "application/pdf") {
        window.open(fileURL, "_blank");
      } else {
        const link = document.createElement("a");
        link.href = fileURL;
        link.download = `submission-${id}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Submission Mahasiswa
          </h1>
          <p className="text-gray-400 text-sm">
            Tugas: <span className="font-semibold">{assignmentTitle}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate(-1)}
            className="bg-gray-700 hover:bg-gray-600 text-white flex gap-1"
          >
            <ArrowLeft size={16} /> Kembali
          </Button>
        </div>
      </div>

      <div className="flex justify-end">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-gray-200">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border border-gray-700 text-gray-200">
            <SelectItem value="Semua">Semua</SelectItem>
            <SelectItem value="Submitted">Sudah Dikirim</SelectItem>
            <SelectItem value="Terlambat">Terlambat</SelectItem>
            <SelectItem value="Belum Dikirim">Belum Dikirim</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <p className="text-gray-400 italic text-center">Memuat data...</p>
      ) : filteredStudents.length === 0 ? (
        <p className="text-gray-400 italic">
          Tidak ada mahasiswa dengan status "{filterStatus}".
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((s) => (
            <Card
              key={s.id_user}
              className="bg-gray-800/50 border border-gray-700 hover:border-blue-700 transition-all"
            >
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white text-lg">{s.name}</CardTitle>
                  {s.hasSubmitted ? (
                    <Badge
                      className={`flex gap-1 ${
                        s.isLate
                          ? "bg-yellow-700 text-white"
                          : "bg-green-700 text-white"
                      }`}
                    >
                      {s.isLate ? (
                        <>
                          <ClockAlert size={14} /> Terlambat
                        </>
                      ) : (
                        <>
                          <FileCheck2 size={14} /> Submitted
                        </>
                      )}
                    </Badge>
                  ) : (
                    <Badge className="bg-red-700 text-white flex gap-1">
                      <FileX size={14} /> Not Submitted
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-gray-300 text-sm mb-1">{s.email}</p>
                <p className="text-gray-400 text-xs mb-3">{s.major}</p>

                {s.hasSubmitted && (
                  <div className="grid gap-2">
                    <p className="text-gray-400 text-sm">
                      Dikirim:{" "}
                      {s.submitted_at &&
                        new Date(s.submitted_at).toLocaleString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                    </p>

                    {s.text && (
                      <div className="p-3 border border-gray-700 bg-gray-900/50 rounded-md text-gray-300 text-sm">
                        <p className="font-semibold text-blue-400 mb-1">
                          Jawaban:
                        </p>
                        <p className="whitespace-pre-line">{s.text}</p>
                      </div>
                    )}

                    {s.file_url && s.id_submission && (
                      <Button
                        size="sm"
                        className="bg-gray-700 border border-gray-600 text-white flex gap-1"
                        onClick={() => handleViewFile(s.id_submission!)}
                      >
                        <Eye size={14} /> {s.file_name || "Lihat File Submission"}
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
