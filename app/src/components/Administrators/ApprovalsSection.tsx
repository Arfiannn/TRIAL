import { useEffect, useMemo, useState } from "react";
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
import { mockMajor } from "@/utils/mockData"; // ✅ tambah mockMajor
import { toast } from "sonner";
import DetailDialog from "@/components/DetailDialog";
import ValidationDialog from "../ValidationDialog";
import type { Major } from "@/types/Major";
import type { UserPending } from "@/types/UserPanding";
import { deletePendingUser, getAllUserPending } from "../services/UserPending";
import { getMajor } from "../services/Major";
import { approvePendingUser } from "../services/User";

export default function pendingsTab() {
  const [roleFilter, setRoleFilter] = useState<"mahasiswa" | "dosen">("mahasiswa");
  const [majorFilter, setMajorFilter] = useState<string>("Semua");
  const [users, setUsers] = useState<UserPending[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserPending | null>(null);
  const [openApvDialog, setOpenApvDialog] = useState(false);
  const [openDelDialog, setOpenDelDialog] = useState(false);
  const [selected, setSelected] = useState<any>(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [userData, majorData] = await Promise.all([
          getAllUserPending(),
          getMajor(),
        ]);
        setUsers(userData);
        setMajors(majorData);
      } catch (err: any) {
        toast.error(err.message || "Gagal memuat data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);


  // ✅ Ambil daftar jurusan dari mockMajor + tambahkan "Semua"
  const availableMajors = ["Semua", ...majors.map((m) => m.name_major)];

  const filteredUsersPending = useMemo(() => {
    return users.filter((u) => {
      // roleId: 3 = mahasiswa, 2 = dosen
      const isMahasiswa = u.roleId === 3;
      const isDosen = u.roleId === 2;

      // 🔹 Filter berdasarkan tab aktif
      if (roleFilter === "mahasiswa" && !isMahasiswa) return false;
      if (roleFilter === "dosen" && !isDosen) return false;

      // 🔹 Jika mahasiswa, bisa difilter berdasarkan jurusan
      if (roleFilter === "mahasiswa" && majorFilter !== "Semua") {
        const majorName = majors.find((m) => m.id_major === u.majorId)?.name_major;
        return majorName === majorFilter;
      }

      return true;
    });
  }, [users, roleFilter, majorFilter, majors]);


  // ✅ Setujui user (hapus dari list)
  const handleApproveUser = async (id: number, name: string) => {
    try {
      const newUser = await approvePendingUser(id); // 🚀 memanggil BE dan menerima user baru
      setUsers((prev) => prev.filter((u) => u.id_pending !== id)); // hapus dari list pending
      toast.success(`${name} berhasil disetujui dan ditambahkan ke data pengguna`);
      console.log("✅ User baru:", newUser);
    } catch (err: any) {
      toast.error(err.message || "Gagal menyetujui user pending");
    }
  };

  // ✅ Tolak user (hapus dari list)
  const handleRejectUser = async (id: number, name: string) => {
    try {
      await deletePendingUser(id); // ✅ panggil API backend
      setUsers((prev) => prev.filter((u) => u.id_pending !== id));
      toast.error(`${name} berhasil ditolak dan dihapus dari daftar pending`);
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus user pending");
    }
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
            {filteredUsersPending.length} menunggu
          </Badge>
        </h2>

        <div className="grid gap-4">
          {filteredUsersPending.map((pending) => {
            const majorData = majors.find((m) => m.id_major === pending.majorId);

            return (
              <Card
                key={pending.id_pending}
                onClick={() => setSelected(pending)}
                className="bg-gray-800/50 border-gray-700"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">{pending.name}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {pending.email} • {majorData?.name_major}
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
                      {new Date(pending.created_at).toLocaleDateString("id-ID")}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUser(pending);
                          setOpenApvDialog(true);
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Setujui
                      </Button>

                      <ValidationDialog 
                        open={openApvDialog}
                        title={`Apakah Anda Yakin Menyetujui ${selectedUser?.name ?? ""}? `}
                        onClose={() => setOpenApvDialog(false)}
                        onVal={() => handleApproveUser(selectedUser!.id_pending, selectedUser!.name)}
                        valName="Setujui"
                        confir
                      />

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUser(pending);
                          setOpenDelDialog(true);
                        }}
                      >
                        <XCircle className="h-4 w-4" />
                        Tolak
                      </Button>

                      <ValidationDialog 
                        open={openDelDialog}
                        title={`Apakah Anda Yakin Menghapus ${selectedUser?.name ?? ""}? `}
                        onClose={() => setOpenDelDialog(false)}
                        onVal={() => handleRejectUser(selectedUser!.id_pending, selectedUser!.name)}
                        valName="Hapus"
                      />

                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {!loading && filteredUsersPending.length === 0 && (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="pt-6 text-center">
                <UserCheck className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Tidak ada pending pending</p>
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
            {filteredUsersPending.length} menunggu
          </Badge>
        </h2>

        <div className="grid gap-4">
          {filteredUsersPending.map((pending) => {
            const majorData = mockMajor.find((m) => m.id === pending.majorId);

            return (
              <Card
                key={pending.id_pending}
                onClick={() => setSelected(pending)}
                className="bg-gray-800/50 border-gray-700"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">{pending.name}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {pending.email} • {majorData?.name}
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
                      Mendaftar: {new Date(pending.created_at).toLocaleDateString("id-ID")}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUser(pending)
                          setOpenApvDialog(true);
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Setujui
                      </Button>

                      <ValidationDialog 
                        open={openApvDialog}
                        title={`Apakah Anda Yakin Menyetujui ${selectedUser?.name ?? ""}? `}
                        onClose={() => setOpenApvDialog(false)}
                        onVal={() => handleApproveUser(selectedUser!.id_pending, selectedUser!.name)}
                        valName="Setujui"
                        confir={true}
                      />

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUser(pending)
                          setOpenDelDialog(true);
                        }}
                      >
                        <XCircle className="h-4 w-4" />
                        Tolak
                      </Button>

                      <ValidationDialog 
                        open={openDelDialog}
                        title={`Apakah Anda Yakin Menghapus ${selectedUser?.name ?? ""}? `}
                        onClose={() => setOpenDelDialog(false)}
                        onVal={() => handleRejectUser(selectedUser!.id_pending, selectedUser!.name)}
                        valName="Hapus"
                      />

                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {!loading && filteredUsersPending.length === 0 && (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="pt-6 text-center">
                <UserCheck className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Tidak ada pending pending</p>
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
