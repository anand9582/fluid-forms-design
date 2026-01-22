// Custom Grid Builder Component
// Hover-to-select grid builder with max 8x8 dimensions

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CustomGridBuilderProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (layout: string) => void;
}

export function CustomGridBuilder({ open, onClose, onConfirm }: CustomGridBuilderProps) {
  const [hoveredCols, setHoveredCols] = useState(0);
  const [hoveredRows, setHoveredRows] = useState(0);
  const [selectedCols, setSelectedCols] = useState(0);
  const [selectedRows, setSelectedRows] = useState(0);

  const maxCols = 8;
  const maxRows = 8;

  const handleCellHover = (col: number, row: number) => {
    setHoveredCols(col);
    setHoveredRows(row);
  };

  const handleCellClick = (col: number, row: number) => {
    setSelectedCols(col);
    setSelectedRows(row);
  };

  const handleConfirm = () => {
    if (selectedCols > 0 && selectedRows > 0) {
      onConfirm(`${selectedCols}x${selectedRows}`);
      resetState();
      onClose();
    }
  };

  const handleCancel = () => {
    resetState();
    onClose();
  };

  const resetState = () => {
    setHoveredCols(0);
    setHoveredRows(0);
    setSelectedCols(0);
    setSelectedRows(0);
  };

  const displayCols = selectedCols > 0 ? selectedCols : hoveredCols;
  const displayRows = selectedRows > 0 ? selectedRows : hoveredRows;

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
        onClick={handleCancel}
      />
      
      {/* Modal - slides from top */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-scale-in">
        <div className="bg-card rounded-xl shadow-xl border border-border w-[400px] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 pb-0">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Custom Grid Builder</h3>
              <p className="text-sm text-muted-foreground">Hover to select grid dimensions (Max 8x8)</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full"
              onClick={handleCancel}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Grid Selector */}
          <div className="p-6 flex flex-col items-center">
            <div 
              className="grid gap-1"
              style={{ 
                gridTemplateColumns: `repeat(${maxCols}, 1fr)`,
              }}
              onMouseLeave={() => {
                if (selectedCols === 0) {
                  setHoveredCols(0);
                  setHoveredRows(0);
                }
              }}
            >
              {Array.from({ length: maxRows }).map((_, rowIndex) => (
                Array.from({ length: maxCols }).map((_, colIndex) => {
                  const col = colIndex + 1;
                  const row = rowIndex + 1;
                  const isHighlighted = col <= displayCols && row <= displayRows;
                  const isSelected = selectedCols > 0 && col <= selectedCols && row <= selectedRows;
                  
                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={cn(
                        "w-8 h-8 rounded-md border-2 cursor-pointer transition-all duration-100",
                        isHighlighted 
                          ? "bg-primary border-primary" 
                          : "bg-muted/50 border-border hover:border-muted-foreground/30"
                      )}
                      onMouseEnter={() => handleCellHover(col, row)}
                      onClick={() => handleCellClick(col, row)}
                    />
                  );
                })
              ))}
            </div>

            {/* Dimension Display */}
            <div className="mt-4 text-lg font-semibold text-foreground">
              {displayCols > 0 && displayRows > 0 ? `${displayCols} X ${displayRows}` : "Select grid size"}
            </div>

            {/* Warning message for large grids */}
            <div className="mt-3 px-4 py-2 bg-primary/10 rounded-lg border border-primary/20 text-center">
              <p className="text-sm text-muted-foreground">
                Large grids (e.g., 8x8) may impact workstation performance and video stream decoding latency.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center gap-3 p-4 pt-0">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="px-6"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={selectedCols === 0 || selectedRows === 0}
              className="px-6"
            >
              Confirm selection
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
