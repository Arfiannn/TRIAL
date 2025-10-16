import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockUser, mockCourses, mockUserApproved, } from '@/utils/mockData';
import { Users, UserCheck, BookOpen, Settings, } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import ApprovalsTab from './ApprovalsSection';
import StudentsTab from './StudentSection';
import LecturersTab from './LecturerSection';
import CoursesTab from './CoursesSection';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  
  const approvedUsers = mockUserApproved.map((u) => u.userId);

  const pendingApprovals = mockUser.filter(
    (u) => !approvedUsers.includes(u.id)
  );

  const approvedStudents = mockUser.filter(
    (u) => approvedUsers.includes(u.id) && u.role === "mahasiswa"
  );

  // 🔹 Ambil daftar semester unik dari mahasiswa aktif
  const activeSemestersSet = new Set(
    approvedStudents
      .filter((s) => s.semester !== undefined && s.semester !== null)
      .map((s) => s.semester)
  );

  // 🔹 Konversi ke array kalau ingin digunakan
  const activeSemesters = Array.from(activeSemestersSet);


  const stats = {
    totalUsers: mockUserApproved.length,
    pendingApprovals: pendingApprovals.length,
    totalCourses: mockCourses.length,
    activeSemesters: activeSemesters.length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Administrator</h1>
          <p className="text-gray-400">Selamat datang, {user?.name}</p>
          <Badge variant="secondary" className="mt-2 bg-purple-900/50 text-purple-200">
            Administrator
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#1e2745ff] border border-blue-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-200">Total Pengguna</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent className='flex flex-row gap-2 items-end'>
            <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
            <p className="text-xs text-blue-300">Mahasiswa, Dosen, Admin</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1e2745ff] border border-blue-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-200">Pending Approval</CardTitle>
            <UserCheck className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent className='flex flex-row gap-2 items-end'>
            <div className="text-2xl font-bold text-white">{stats.pendingApprovals}</div>
            <p className="text-xs text-orange-300">Menunggu persetujuan</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1e2745ff] border border-blue-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-200">Total Mata Kuliah</CardTitle>
            <BookOpen className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent className='flex flex-row gap-2 items-end'>
            <div className="text-2xl font-bold text-white">{stats.totalCourses}</div>
            <p className="text-xs text-green-300">Semua semester</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1e2745ff] border border-blue-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-200">Semester Aktif</CardTitle>
            <Settings className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent className='flex flex-row gap-2 items-end'>
            <div className="text-2xl font-bold text-white">{stats.activeSemesters}</div>
            <p className="text-xs text-purple-300">Program Studi</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="approvals" className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="approvals" className="text-gray-300 data-[state=active]:text-black data-[state=active]:bg-gray-300">
            Persetujuan Pengguna
          </TabsTrigger>
          <TabsTrigger value="student" className="text-gray-300 data-[state=active]:text-black data-[state=active]:bg-gray-300">
            Data Mahasiswa
          </TabsTrigger>
          <TabsTrigger value="lecturer" className="text-gray-300 data-[state=active]:text-black data-[state=active]:bg-gray-300">
            Data Dosen 
          </TabsTrigger>
          <TabsTrigger value="courses" className="text-gray-300 data-[state=active]:text-black data-[state=active]:bg-gray-300">
            Mata Kuliah
          </TabsTrigger>
        </TabsList>

        <TabsContent value="approvals" className="space-y-4">
          {ApprovalsTab()}
        </TabsContent>

        <TabsContent value="student" className="space-y-4">
          {StudentsTab()}
        </TabsContent>

        <TabsContent value="lecturer" className="space-y-4">
          {LecturersTab()}
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          {CoursesTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
};