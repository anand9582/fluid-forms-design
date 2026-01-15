import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Harddrive,
  Cctv,
  Support
} from "@/components/ui/icons";

const actions = [
  { icon: Harddrive, label: "Add Device" },
  { icon: Cctv, label: "Add Widget" },
  { icon: Support, label: "Support" },
];

export function QuickActions() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0); 

  return (
    <Card className="border border-border/80 shadow-none overflow-hidden">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between py-3 bg-bgprimary rounded-t px-4">
        <CardTitle className="font-roboto font-medium uppercase tracking-wide text-textgray">
            QUICK ACTION
        </CardTitle>
      </CardHeader>

      {/* Content */}
      <div className="bg-white rounded-xl p-3">
        <div className="grid grid-cols-3 gap-2">
          {actions.map((action, index) => {
            const isActive = activeIndex === index;

            return (
              <button
                key={action.label}
                onClick={() => setActiveIndex(index)}
                className={`flex flex-col items-center gap-2 p-2 h-24 justify-center rounded
                  transition-all
                  ${
                    isActive
                      ? "bg-[#DBEAFE] border border-blue-200"
                      : "bg-[#F1F5F9] border border-gray-200 hover:bg-[#DBEAFE] hover:border-blue-200"
                  }
                `}
              >
                <action.icon
                  className={`w-6 h-6 ${
                    isActive ? "text-textgraylight" : "text-[#525252]"
                  }`}
                />

                <span
                  className={`text-fontSize14px font-medium font-roboto mt-1
                    ${
                      isActive
                        ? "text-textgraylight"
                        : "text-textgraylight"
                    }
                  `}
                >
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}  no active only hover show 