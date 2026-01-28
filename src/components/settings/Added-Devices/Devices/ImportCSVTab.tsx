import { Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ImportCSVTab() {
  return (
    <div className="p-6">
      <div
        className="
          mx-auto
          w-[730px]
          h-[280px]
          rounded-md
          bg-white
          p-10
          text-center
          border-dashed-4
        "
      >
        <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
          <Upload className="h-5 w-5 text-blue-600" />
        </div>

        <p className="font-roboto font-medium text-md">
          Click to upload or drag and drop
        </p>
          <p className="mt-1 text-xs text-muted-foreground">
            CSV files only (max 5MB)
          </p>

        <div className="mt-7">
          <Button variant="outline" size="sm" className="font-roboto font-normal rounded-lg bg-white shadow-sm ">
            <Download className="h-4 w-4" />
            Download Sample Template
          </Button>
        </div>
      </div>
    </div>
  );
}
