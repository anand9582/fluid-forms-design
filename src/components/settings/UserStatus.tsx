import { Button } from "@/components/ui/button";
import type { User } from "@/lib/types";

interface UserStatusProps {
  status: User["status"];
  onClick?: () => void;
}

export const UserStatus = ({ status, onClick }: UserStatusProps) => {
  const styles: Record<
    User["status"],
    {
      wrapper: string;
      dot: string;
      text: string;
    }
  > = {
    Active: {
      wrapper: "bg-green-100 hover:bg-green-200",
      dot: "bg-green-600",
      text: "text-green-700",
    },
    Inactive: {
      wrapper: "bg-gray-100 hover:bg-gray-200",
      dot: "bg-gray-500",
      text: "text-gray-600",
    },
    Locked: {
      wrapper: "bg-red-50 hover:bg-red-100",
      dot: "bg-red-600",
      text: "text-red-700",
    },
    "Reset required": {
      wrapper: "bg-orange-50 hover:bg-orange-100",
      dot: "bg-orange-600",
      text: "text-orange-700",
    },
  };

  const current = styles[status];

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={`h-auto px-3 py-1 rounded-full flex items-center gap-2 ${current.wrapper}`}
    >
      <span className={`w-2 h-2 rounded-full ${current.dot}`} />
      <span className={`text-sm font-medium ${current.text}`}>
        {status}
      </span>
    </Button>
  );
};
