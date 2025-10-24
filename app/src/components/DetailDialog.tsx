
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DetailDialogProps {
  open: boolean;
  onClose: () => void;
  data?: any;
  title?: string;
  description?: string;
}

export default function DetailDialog({
  open,
  onClose,
  data,
  title = "Detail Pengguna",
  description = "Informasi lengkap data pengguna.",
}: DetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border border-gray-700 text-gray-200 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">{title}</DialogTitle>
          <DialogDescription className="text-gray-400">{description}</DialogDescription>
        </DialogHeader>

        {data ? (
          <div className="space-y-3 mt-4">
            <p>
              <span className="font-semibold text-gray-300">Nama:</span> {data.name}
            </p>
            <p>
              <span className="font-semibold text-gray-300">Email:</span> {data.email}
            </p>
            {data.role && (
              <p>
                <span className="font-semibold text-gray-300">Role:</span> {data.role}
              </p>
            )}
            {data.major && (
              <p>
                <span className="font-semibold text-gray-300">Program Studi:</span> {data.major}
              </p>
            )}
            {data.faculty != null && (
              <p>
                <span className="font-semibold text-gray-300">Fakultas:</span> {data.faculty}
              </p>
            )}
            {data.semester === 0 && (
              <p>
                <span className="font-semibold text-gray-300">Semester:</span> {data.semester}
              </p>
            )}
            <p>
              <span className="font-semibold text-gray-300">Tanggal Daftar:</span>{" "}
              {new Date(data.created_at).toLocaleDateString("id-ID")}
            </p>
          </div>
        ) : (
          <p className="text-gray-400 text-sm mt-4">Tidak ada data tersedia.</p>
        )}

        <DialogFooter className="mt-6">
          <Button onClick={onClose} className="bg-gray-700 hover:bg-gray-600">
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
