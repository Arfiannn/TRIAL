import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { BookOpen, FileText } from "lucide-react";
import { toast } from "sonner";
import type { Material } from "@/types/Material";
import { viewMateriFileStudent } from "../services/Material";

interface MaterialListProps {
  materials: Material[];
}

export default function MaterialList({ materials }: MaterialListProps) {
  
  async function handleViewFile(id: number) {
    try {
      const { blob, contentType } = await viewMateriFileStudent(id);
      const fileURL = URL.createObjectURL(blob);

      if (contentType === "application/pdf") {
        window.open(fileURL, "_blank");
      } else {
        const link = document.createElement("a");
        link.href = fileURL;
        link.download = `material-${id}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  return (
    <div className="space-y-4">
      {materials.map((m) => (
        <Card
          key={m.id_material}
          className="bg-gray-800/50 border-gray-700 hover:border-blue-500 transition flex flex-row items-center"
        >
          <div className="w-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-400" />
                <CardTitle className="text-white">{m.title}</CardTitle>
              </div>
              <CardDescription className="text-gray-400 text-sm">
                Dibuat pada{" "}
                  {new Date(m.created_at).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                  ,{" "}
                  {new Date(m.created_at).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-gray-300 text-sm pb-3">{m.description}</p>

              <Button
                onClick={() => {
                  if (m.file_url) {
                    handleViewFile(m.id_material);
                  } else {
                    toast.error("File materi belum tersedia!");
                  }
                }}
                className="bg-gray-700 border border-gray-600 text-white"
              >
                <div className="flex items-center gap-2">
                  <FileText />
                  {m.title}
                </div>
              </Button>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );
}
