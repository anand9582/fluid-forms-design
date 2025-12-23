import { PlusCircle } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";


const actions = [
  { icon: PlusCircle, label: "Add Device" },
  { icon: PlusCircle, label: "Add Widget" },
  { icon: PlusCircle, label: "Support" },
];

export function QuickActions() {
  return (
    <Card className="border border-border/80 shadow-none overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between py-3 bg-bgprimary  rounded-t px-4">
        <CardTitle className="font-roboto font-medium uppercase tracking-wide text-textgray">
             QUICK ACTION  
        </CardTitle>
      </CardHeader>

      <div className="bg-white rounded-xl p-3">
        <div className="grid grid-cols-3 gap-2">
          {actions.map((action, index) => (
            <button
              key={action.label}
              className={`flex flex-col items-center gap-2 p-2 h-24 justify-center rounded  transition-colors group
                ${
                  index === 0
                    ? " bg-[#DBEAFE]"
                    : "border-gray-200 hover:bg-gray-50 hover:border-blue-200 bg-[#F1F5F9]"
                }
              `}
            >
              <div>
                <action.icon className="w-6 h-6 text-[#525252]"
                />
              </div>

              <span
                className={`text-fontSize14px font-medium transition-colors font-roboto text-textgraylight mt-1
                `}
              >
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
