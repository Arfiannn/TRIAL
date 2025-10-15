import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { BookOpen, FileText } from "lucide-react";
import { toast } from "sonner";

export interface Material {
  id: number;
  courseId: number;
  title: string;
  description: string;
  createdAt: Date;
  fileUrl: string;
}

interface MaterialListProps {
  materials: Material[];
}

export default function MaterialList({ materials }: MaterialListProps) {

  return (
    <div className="space-y-4">
      {materials.map((m) => (
        <Card
          key={m.id}
          className="bg-gray-800/50 border-gray-700 hover:border-blue-500 transition flex flex-row items-center"
        >
          <div className="w-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-400" />
                <CardTitle className="text-white">{m.title}</CardTitle>
              </div>
              <CardDescription className="text-gray-400 text-sm">
                Dibuat pada {m.createdAt.toLocaleDateString("id-ID")}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-gray-300 text-sm pb-3">{m.description}</p>

              <Button
                onClick={() => {
                  if (m.fileUrl) {
                    window.open(m.fileUrl, "_blank");
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
