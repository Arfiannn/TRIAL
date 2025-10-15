import { useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, UserCheck } from "lucide-react";
import { mockUser, mockUserApproved, mockMajor } from "@/utils/mockData"; // ✅ tambah mockMajor
import { toast } from "sonner";
import DetailDialog from "@/components/DetailDialog";

export default function ApprovalsTab() {
  const [roleFilter, setRoleFilter] = useState<"mahasiswa" | "dosen">("mahasiswa");
  const [majorFilter, setMajorFilter] = useState<string>("Semua");
  const [user, setUser] = useState(mockUser);
  const [selected, setSelected] = useState<any>(null);

  // ✅ Ambil semua userId yang sudah disetujui
  const approvedUserIds = mockUserApproved.map((u) => u.userId);

  // ✅ Ambil daftar jurusan dari mockMajor + tambahkan "Semua"
  const availableMajors = ["Semua", ...mockMajor.map((m) => m.name)];

  // ✅ Filter user yang belum disetujui dan sesuai role & major
  const filteredApprovals = user.filter((approval) => {
    // hanya tampilkan yang belum disetujui admin
    const notApproved = !approvedUserIds.includes(approval.id);
    if (!notApproved) return false;

    // filter role (mahasiswa / dosen)
    if (approval.role !== roleFilter) return false;

    // filter major jika mahasiswa
    if (roleFilter === "mahasiswa" && majorFilter !== "Semua") {
      const userMajor = mockMajor.find((m) => m.id === approval.majorId)?.name;
      return userMajor === majorFilter;
    }
    return true;
  });

  // ✅ Setujui user (hapus dari list)
  const handleApproveUser = (id: number, name: string) => {
    setUser((prev) => prev.filter((u) => u.id !== id));
    toast.success(`${name} berhasil disetujui`);
  };

  // ✅ Tolak user (hapus dari list)
  const handleRejectUser = (id: number, name: string) => {
    setUser((prev) => prev.filter((u) => u.id !== id));
    toast.error(`${name} ditolak`);
  };

  return (
    <Tabs defaultValue="mahasiswa" onValueChange={(v) => setRoleFilter(v as any)}>
      <div className="flex justify-between items-center mb-4">
        {/* TAB SWITCH */}
        <TabsList className="bg-gray-800 border border-gray-700">
          <TabsTrigger
            value="mahasiswa"
            className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-blue-500"
          >
            Mahasiswa
          </TabsTrigger>
          <TabsTrigger
            value="dosen"
            className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-blue-500"
          >
            Dosen
          </TabsTrigger>
        </TabsList>

        {/* FILTER JURUSAN */}
        {roleFilter === "mahasiswa" && (
          <Select value={majorFilter} onValueChange={setMajorFilter}>
            <SelectTrigger className="w-[220px] bg-gray-800 border border-gray-700 text-gray-200">
              <SelectValue placeholder="Pilih Jurusan" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border border-gray-700 text-gray-200">
              {availableMajors.map((major) => (
                <SelectItem
                  key={major}
                  value={major}
                  className="text-gray-200 hover:bg-gray-700"
                >
                  {major}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* === TAB MAHASISWA === */}
      <TabsContent value="mahasiswa" className="space-y-4">
        <h2 className="text-xl font-semibold text-white flex justify-between items-center">
          Pending Mahasiswa
          <Badge variant="secondary" className="bg-gray-600 border-gray-400 text-white">
            {filteredApprovals.length} menunggu
          </Badge>
        </h2>

        <div className="grid gap-4">
          {filteredApprovals.map((approval) => {
            const majorData = mockMajor.find((m) => m.id === approval.majorId);

            return (
              <Card
                key={approval.id}
                onClick={() => setSelected(approval)}
                className="bg-gray-800/50 border-gray-700"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">{approval.name}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {approval.email} • {majorData?.name}
                      </CardDescription>
                    </div>
                    <Badge className="border-blue-600 text-blue-300">
                      Mahasiswa
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400">
                      Mendaftar:{" "}
                      {new Date(approval.createdAt).toLocaleDateString("id-ID")}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApproveUser(approval.id, approval.name);
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Setujui
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRejectUser(approval.id, approval.name);
                        }}
                      >
                        <XCircle className="h-4 w-4" />
                        Tolak
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {filteredApprovals.length === 0 && (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="pt-6 text-center">
                <UserCheck className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Tidak ada pending approval</p>
              </CardContent>
            </Card>
          )}
        </div>

        <DetailDialog
          open={selected}
          onClose={() => setSelected(null)}
          data={selected}
          title="Detail Calon Mahasiswa"
          description="Informasi lengkap calon mahasiswa"
        />
      </TabsContent>

      {/* === TAB DOSEN === */}
      <TabsContent value="dosen" className="space-y-4">
        <h2 className="text-xl font-semibold text-white flex justify-between items-center">
          Pending Dosen
          <Badge variant="secondary" className="bg-gray-600 border-gray-400 text-white">
            {filteredApprovals.length} menunggu
          </Badge>
        </h2>

        <div className="grid gap-4">
          {filteredApprovals.map((approval) => {
            const majorData = mockMajor.find((m) => m.id === approval.majorId);

            return (
              <Card
                key={approval.id}
                onClick={() => setSelected(approval)}
                className="bg-gray-800/50 border-gray-700"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">{approval.name}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {approval.email} • {majorData?.name}
                      </CardDescription>
                    </div>
                    <Badge className="border-blue-600 text-blue-300">
                      Dosen
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400">
                      Mendaftar: {new Date(approval.createdAt).toLocaleDateString("id-ID")}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApproveUser(approval.id, approval.name)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Setujui
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRejectUser(approval.id, approval.name)}
                      >
                        <XCircle className="h-4 w-4" />
                        Tolak
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {filteredApprovals.length === 0 && (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="pt-6 text-center">
                <UserCheck className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Tidak ada pending approval</p>
              </CardContent>
            </Card>
          )}

          <DetailDialog
            open={selected}
            onClose={() => setSelected(null)}
            data={selected}
            title="Detail Calon Dosen"
            description="Informasi lengkap calon dosen"
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
