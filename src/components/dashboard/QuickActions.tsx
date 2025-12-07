import { Plus, LayoutGrid, Headphones } from "lucide-react";

const actions = [
  { icon: Plus, label: "Add Device" },
  { icon: LayoutGrid, label: "Add Widget" },
  { icon: Headphones, label: "Support" },
];

export function QuickActions() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm animate-fade-in" style={{ animationDelay: "0.15s" }}>
      <h3 className="font-semibold text-gray-900 text-sm mb-3">QUICK ACTION</h3>
      <div className="grid grid-cols-3 gap-2">
        {actions.map((action) => (
          <button
            key={action.label}
            className="flex flex-col items-center gap-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-blue-200 transition-colors group"
          >
            <div className="w-9 h-9 rounded-full border-2 border-dashed border-gray-300 group-hover:border-blue-400 flex items-center justify-center transition-colors">
              <action.icon className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <span className="text-[10px] font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
