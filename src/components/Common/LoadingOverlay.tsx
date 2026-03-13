import React from "react";

interface LoadingOverlayProps {
  text?: string;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ text = "Trying to connect...", className = "" }) => {
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center bg-black/40 z-10 ${className}`}
    >
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 border-t-transparent mb-2"></div>
      <div className="text-blue-500 text-sm">{text}</div>
    </div>
  );
};