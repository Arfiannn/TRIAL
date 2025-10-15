import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, User, Mail, Lock } from "lucide-react";
import InputWithIcon from "@/components/InputWithIcon";
import { mockFaculty, mockMajor } from "@/utils/mockData";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { useAuth } from "./AuthContext";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSwitchToLogin,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState<string>("");
  const [selectedMajor, setSelectedMajor] = useState<string>("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { register, isLoading } = useAuth();

  const faculty = useMemo(() => mockFaculty, []);
  const major = useMemo(() => mockMajor, []);

  const role = useMemo(() => {
      if (location.pathname.includes("/student/register")) return "Mahasiswa";
      if (location.pathname.includes("/lecturer/register")) return "Dosen";
      return "Pengguna";
    }, [location.pathname]);

  const filteredMajors = useMemo(() => {
    if (!selectedFaculty) return [];
    return major.filter((m) => m.facultyId === Number(selectedFaculty));
  }, [selectedFaculty, major]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    if (!selectedFaculty || !selectedMajor) {
      setError("Pilih fakultas dan program studi terlebih dahulu");
      return;
    }

    const success = await register(email, password, name, "mahasiswa");
    if (success) {
      setSuccess(true);
    } else {
      setError("Gagal mendaftar. Silakan coba lagi.");
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        onSwitchToLogin();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [success, onSwitchToLogin]);

  if (success) {
    return (
      <Card className="w-full max-w-md bg-gray-900/50 border-gray-800">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <div>
              <h3 className="text-lg font-semibold text-white">
                Pendaftaran Berhasil!
              </h3>
              <p className="text-gray-400 mt-2">
                Akun Anda telah terdaftar dan menunggu persetujuan admin.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Mengalihkan ke halaman login...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md bg-[#161B2C] border-gray-800">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-white">
          Register {role}
        </CardTitle>
        <CardDescription className="text-center text-gray-400">
          Buat akun baru untuk mengakses sistem
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert className="bg-red-900/50 border-red-800">
            <AlertDescription className="text-red-200">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputWithIcon
            label="Nama Lengkap"
            placeholder="Masukkan nama lengkap"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftIcon={<User size={18} />}
          />

          <InputWithIcon
            label="Email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail size={18} />}
            isEmail
          />

          <div className="grid grid-cols-2 gap-2"> 
            <div className="space-y-1">
              <Label className="text-sm font-medium text-white">Pilih Fakultas</Label>
              <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
                <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                  <SelectValue placeholder="Pilih Fakultas" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {faculty.map((f) => (
                    <SelectItem key={f.id} value={f.id.toString()}>
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedFaculty && (
              <div className="space-y-1">
                <Label className="text-sm font-medium text-white">Pilih Program Studi</Label>
                <Select value={selectedMajor} onValueChange={setSelectedMajor}>
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="Pilih Program Studi" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    {filteredMajors.map((m) => (
                      <SelectItem key={m.id} value={m.id.toString()}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <InputWithIcon
              label="Password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isPassword
              leftIcon={<Lock size={18} />}
            />
            <InputWithIcon
              label="Konfirmasi Password"
              placeholder="Ulangi password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              isPassword
              leftIcon={<Lock size={18} />}
            />
          </div>


          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mendaftar...
              </>
            ) : (
              "Daftar"
            )}
          </Button>
        </form>

        <div className="flex justify-center text-blue-400">
          <p>
            Sudah punya akun?{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-blue-400 hover:text-blue-300 hover:underline pl-1"
            >
              Login di sini
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
