import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CustomGridBuilderProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (layout: string) => void;
}

export function CustomGridBuilder({
  open,
  onClose,
  onConfirm,
}: CustomGridBuilderProps) {
  const [hoveredCols, setHoveredCols] = useState(0);
  const [hoveredRows, setHoveredRows] = useState(0);
  const [selectedCols, setSelectedCols] = useState(0);
  const [selectedRows, setSelectedRows] = useState(0);

  const maxCols = 8;
  const maxRows = 8;

  const handleHover = (col: number, row: number) => {
    setHoveredCols(col);
    setHoveredRows(row);
  };

  const handleSelect = (col: number, row: number) => {
    setSelectedCols(col);
    setSelectedRows(row);
  };

  const handleConfirm = () => {
    if (selectedCols && selectedRows) {
      onConfirm(`${selectedCols}x${selectedRows}`);
      reset();
      onClose();
    }
  };

  const reset = () => {
    setHoveredCols(0);
    setHoveredRows(0);
    setSelectedCols(0);
    setSelectedRows(0);
  };

  const displayCols = selectedCols || hoveredCols;
  const displayRows = selectedRows || hoveredRows;

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={reset}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white w-[420px] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b mb-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Custom Grid Builder
              </h2>
              <p className="text-sm text-slate-600 font-roboto font-regular">
                Hover to select grid dimensions (Max 8x8)
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-sm bg-gray-100 hover:bg-slate-300"
              onClick={() => {
                reset();
                onClose();
              }}
            >
              <X className="h-4 w-4 text-slate-600" />
            </Button>
          </div>

          {/* Grid Area */}
          <div className="px-6 pb-6 flex flex-col items-center">
            <div className="bg-[#f1f5f9] p-3 rounded border border-blue-100">
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `repeat(${maxCols}, 1fr)`,
                  gap: "4px",
                }}
                onMouseLeave={() => {
                  if (!selectedCols) {
                    setHoveredCols(0);
                    setHoveredRows(0);
                  }
                }}
              >
                {Array.from({ length: maxRows }).map((_, rowIndex) =>
                  Array.from({ length: maxCols }).map((_, colIndex) => {
                    const col = colIndex + 1;
                    const row = rowIndex + 1;
                    const active =
                      col <= displayCols && row <= displayRows;

                    return (
                      <div
                        key={`${row}-${col}`}
                        onMouseEnter={() => handleHover(col, row)}
                        onClick={() => handleSelect(col, row)}
                        className={cn(
                          "w-8 h-8 rounded border cursor-pointer transition-colors",
                          active
                            ? "bg-blue-500 border-blue-600"
                            : "bg-white border-slate-200 hover:border-slate-300"
                        )}
                      />
                    );
                  })
                )}
              </div>
            </div>

            {/* Dimension */}
            <div className="mt-4 text-base font-semibold tracking-wide text-slate-900">
              {displayCols && displayRows
                ? `${displayCols} X ${displayRows}`
                : "Select grid size"}
            </div>

            {/* Info Box */}
            <div className="mt-4 px-4 py-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-xs text-gray-500 font-roboto font-medium">
                Large grids (e.g., 8x8) may impact workstation performance
                and video stream decoding latency.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-center gap-3 px-6 pb-5">
            <Button
              variant="outline"
              className="px-6"
              onClick={() => {
                reset();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button
              className="px-6"
              disabled={!selectedCols || !selectedRows}
              onClick={handleConfirm}
            >
              Confirm selection
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
