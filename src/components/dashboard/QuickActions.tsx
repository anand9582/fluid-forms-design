import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  Harddrive,
  Cctv,
  Support
} from "@/components/ui/icons";

const actions = [
  { icon: Cctv, label: "Add Device", route: "/settings/devices/adddevices" },
  { icon: Harddrive, label: "Add Storage", route: "/settings/storage" },
  { icon: Support, label: "Support", route: "/settings/api" },
];

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <Card className="border border-border/80 shadow-none overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between py-3 bg-bgprimary rounded-t px-4">
        <CardTitle className="font-roboto font-medium uppercase tracking-wide text-textgray">
          QUICK ACTION
        </CardTitle>
      </CardHeader>

      <div className="bg-white rounded-xl p-3">
        <div className="grid grid-cols-3 gap-2">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.route)}  
              className="
                group flex flex-col items-center justify-center gap-2 h-24 p-2 rounded
                bg-[#F1F5F9]
                transition-all
                hover:bg-[#DBEAFE] hover:border-blue-200
              "
            >
              <action.icon
                className="
                  w-6 h-6 text-[#525252]
                  transition-colors
                  group-hover:text-textgraylight
                "
              />

              <span className="text-fontSize13px font-medium font-roboto mt-1 text-textgraylight">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
