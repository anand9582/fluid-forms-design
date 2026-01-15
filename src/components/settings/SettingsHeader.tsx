// import { ArrowLeft, Settings } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface SettingsHeaderProps {
//   title?: string;
//   breadcrumb?: string;
//   onBack?: () => void;
//   showBackground?: boolean;
//   showActions?: boolean;
// }

// export function SettingsHeader({
//   title = "Settings",
//   breadcrumb,
//   description,
//   onBack,
//   showBackground = true,
//   showActions = true,
// }: SettingsHeaderProps) {
//   return (
//     <header
//       className={cn(
//         "px-4 py-2",
//         showBackground && "border-b border-border"
//       )}
//     >
//       {/* ROW 1 */}
//       <div className="flex items-center gap-3">
//         {onBack && (
//           <button
//             onClick={onBack}
//             className="p-1.5 rounded-md hover:bg-muted transition-colors"
//           >
//             <ArrowLeft size={18} className="text-muted-foreground" />
//           </button>
//         )}

//         <div className="flex items-center gap-2">
//           <span className="font-semibold text-foreground">{title}</span>
//         </div>

//         {showActions && (
//           <div className="ml-auto">
//             {/* future buttons here */}
//           </div>
//         )}
//       </div>

//       {/* DESCRIPTION */}
//       {description && (
//         <p className="text-sm text-muted-foreground mt-1">
//           {description}
//         </p>
//       )}

//       {/* BREADCRUMB */}
//       {breadcrumb && (
//         <div className="flex items-center text-sm text-muted-foreground">
//           <span>{title}</span>
//           <span className="mx-2">›</span>
//           <span className="text-foreground font-medium">{breadcrumb}</span>
//         </div>
//       )}
//     </header>
//   );
// }



import { ArrowLeft, Settings } from "lucide-react";

interface SettingsHeaderProps {
  title?: string;
  breadcrumb?: string;
  onBack?: () => void;
}

export function SettingsHeader({
  title = "Settings",
  breadcrumb = "Manage Users",
  onBack,
}: SettingsHeaderProps) {
  return (
    <header className="bg-card border-b border-border px-4 py-2">
      
      {/* ROW 1 */}
      <div className="flex items-center gap-3 h-10">
        <button
          onClick={onBack}
          className="p-1.5 rounded-md hover:bg-muted transition-colors"
        >
          <ArrowLeft size={18} className="text-muted-foreground" />
        </button>

        <div className="flex items-center gap-2">
          <Settings size={18} className="text-muted-foreground" />
          <span className="font-semibold text-foreground">{title}</span>
        </div>
      </div>

      {/* ROW 2 (Breadcrumb) */}
      <div className="flex items-center text-sm text-muted-foreground pl-9">
        <span>{title}</span>
        <span className="mx-2">›</span>
        <span className="text-foreground font-roboto font-medium">{breadcrumb}</span>
      </div>
    </header>
  );
}