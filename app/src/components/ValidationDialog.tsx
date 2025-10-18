import { Dialog, DialogContent, DialogFooter, DialogHeader } from "./ui/dialog";
import { Button } from "./ui/button";

interface ValidationDialog {
  open: boolean;
  title: string;
  onClose: () => void;
  onVal : () => void;
  confir?: boolean;
  valName: string;
}

export default function ValidationDialog({
  open,
  title,
  onClose,
  onVal,
  confir,
  valName,
}: ValidationDialog) {
  const isConfir = !!confir
  
  return (
    <Dialog open={open} onOpenChange={(onClose)}>
      <DialogContent onClick={(e) => e.stopPropagation()} className="bg-gray-900 border border-gray-700 text-gray-200">
        <DialogHeader className="text-xl text-white">
          {title}
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="border-gray-600 text-black hover:bg-gray-700 bg-white"
          >
            Batal
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onVal();
              onClose();
            }}
            className={`text-white ${isConfir ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"}`}
          >
            {valName}
          </Button>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}