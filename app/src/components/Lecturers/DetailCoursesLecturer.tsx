import { useNavigate, useParams } from "react-router-dom";
import { mockCourses, mockMajor, mockUser, mockUserApproved } from "@/utils/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "../ui/card";
import AssignmentTab from "./AssignmentLecturer";
import MaterialTab from "./MaterialLecturer";

export default function DetailCourseLecturer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = mockCourses.find((c) => c.id === Number(id));

  const [students] = useState(
    mockUserApproved
      .map((a) => mockUser.find((u) => u.id === a.userId))
      .filter(
        (u) =>
          u &&
          u.role === "mahasiswa" &&
          u.majorId === course?.majorId &&
          u.semester === course?.semester
      )
  )

  const major = mockMajor.find((m) => m.id === course?.majorId);

  if (!course) {
    return (
      <p className="text-gray-400 text-center mt-10">
        Mata kuliah tidak ditemukan.
      </p>
    );
  }

  return (
    <div className="space-y-6 text-white">
      <div className="flex justify-between items-center ">
        <div>
          <h1 className="text-2xl font-bold text-white">{course.name}</h1>
          <p className="text-gray-400">
            {major?.name} • {course.credits} SKS
            <p className="inline-block border border-blue-600 rounded-xl px-3 bg-blue-900/50 text-blue-200 ml-3">
              Semester {course.semester}
            </p>
          </p>
        </div>
        <Button
          onClick={() => navigate(-1)}
          className="bg-gray-700 hover:bg-gray-600"
        >
          ← Kembali
        </Button>
      </div>
      <Tabs defaultValue="assignment" className="space-y-4">
        <TabsList className="inline-block bg-gray-800 border border-gray-700 gap-1 rounded-md p-1">
          <TabsTrigger
            value="assignment"
            className="text-gray-300 px-3 py-1.5 rounded-md data-[state=active]:text-black data-[state=active]:bg-gray-300"
          >
            Buat Tugas
          </TabsTrigger>
          <TabsTrigger
            value="material"
            className="text-gray-300 px-3 py-1.5 rounded-md data-[state=active]:text-black data-[state=active]:bg-gray-300"
          >
            Buat Materi
          </TabsTrigger>
          <TabsTrigger
            value="participant"
            className="text-gray-300 px-3 py-1.5 rounded-md data-[state=active]:text-black data-[state=active]:bg-gray-300"
          >
            Mahasiswa
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assignment">
          <AssignmentTab courseId={course.id} />
        </TabsContent>

        <TabsContent value="material">
          <MaterialTab courseId={course.id} courseName={course.name} />
        </TabsContent>

        <TabsContent value="participant" className="space-y-4">
          <h2 className="text-xl font-semibold text-white mb-2">
            Daftar Mahasiswa
          </h2>
          <div className="grid gap-4">
            {students.map((student) => (
              <Card
                key={student?.id}
                className="bg-gray-800/50 border-gray-700 rounded-lg"
              >
                <CardContent className="flex justify-between items-center p-4">
                  <div>
                    <p className="text-white font-medium">{student?.name}</p>
                    <p className="text-gray-400 text-sm">{student?.email} - {major?.name}</p>
                  </div>
                  <p className="bg-blue-900/50 border border-blue-700 rounded-xl text-white px-3 text-[13px]">Terdaftar</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}