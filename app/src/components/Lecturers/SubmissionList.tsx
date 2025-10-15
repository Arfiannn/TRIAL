import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileCheck2, FileX, Eye, ArrowLeft } from "lucide-react";
import {
  mockUser,
  mockAssignments,
  mockSubmissions,
  mockCourses,
  mockUserApproved,
  mockMajor,
} from "@/utils/mockData";

export default function SubmissionStudentPage() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const [students, setStudents] = useState<any[]>([]);
  const [assignmentTitle, setAssignmentTitle] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!assignmentId) return;

    // ✅ Ambil assignment dan course terkait
    const assignment = mockAssignments.find(
      (a) => a.id === Number(assignmentId)
    );
    if (!assignment) return;

    setAssignmentTitle(assignment.title);

    const course = mockCourses.find((c) => c.id === assignment.courseId);
    if (!course) return;

    const approvedStudents = mockUserApproved.map(
      (a) => mockUser.find((u) => u.id === a.userId)).filter(
        (u) =>
          u &&
          u.role === "mahasiswa" &&
          u.majorId === course.majorId &&
          u.semester === course.semester
    );

    // ✅ Gabungkan dengan data submission
    const mergedData = approvedStudents.map((stu) => {
      const submission = mockSubmissions.find(
        (s) =>
          s.assignmentId === Number(assignmentId) && s.studentId === stu?.id
      );

      return {
        id: stu?.id,
        name: stu?.name,
        email: stu?.email,
        major: mockMajor.find((m) => m.id === stu?.majorId)?.name || "Unknown",
        hasSubmitted: !!submission,
        submittedAt: submission?.submittedAt,
        fileUrl: submission?.fileUrl,
      };
    });

    setStudents(mergedData);
  }, [assignmentId]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Submission Mahasiswa
          </h1>
          <p className="text-gray-400 text-sm">
            Tugas: <span className="font-semibold">{assignmentTitle}</span>
          </p>
        </div>
        <Button
          onClick={() => navigate(-1)}
          className="bg-gray-700 hover:bg-gray-600 text-white flex gap-1"
        >
          <ArrowLeft size={16} /> Kembali
        </Button>
      </div>

      {students.length === 0 ? (
        <p className="text-gray-400 italic">
          Tidak ada mahasiswa yang terdaftar di semester ini atau belum diapprove.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((s) => (
            <Card
              key={s.id}
              className="bg-gray-800/50 border border-gray-700 hover:border-blue-700 transition-all"
            >
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white text-lg">{s.name}</CardTitle>
                  {s.hasSubmitted ? (
                    <Badge className="bg-green-700 text-white flex gap-1">
                      <FileCheck2 size={14} /> Submitted
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
                  <div className="flex items-end justify-between">
                    <p className="text-gray-400 text-sm">
                      Dikirim:{" "}
                      {s.submittedAt &&
                        new Date(s.submittedAt).toLocaleDateString("id-ID")}
                    </p>
                    <Button
                      size="sm"
                      className="bg-gray-700 border border-gray-600 text-white flex gap-1"
                      onClick={() => window.open(s.fileUrl || "#", "_blank")}
                    >
                      <Eye size={14} /> Lihat Submission
                    </Button>
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
