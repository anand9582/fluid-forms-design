import { LayoutGrid, Headphones } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const AddDeviceIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22 12H2"
      stroke="#525252"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.45 5.11L2 12V18C2 18.5304 2.21071 19.0391 2.58579 19.4142C2.96086 19.7893 3.46957 20 4 20H20C20.5304 20 21.0391 19.7893 21.4142 19.4142C21.7893 19.0391 22 18.5304 22 18V12L18.55 5.11C18.3844 4.77679 18.1292 4.49637 17.813 4.30028C17.4967 4.10419 17.1321 4.0002 16.76 4H7.24C6.86792 4.0002 6.50326 4.10419 6.18704 4.30028C5.87083 4.49637 5.61558 4.77679 5.45 5.11Z"
      stroke="#525252"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 16H6.01"
      stroke="#525252"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 16H10.01"
      stroke="#525252"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const CameraIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.7502 12H20.3822C20.5525 12.0001 20.7201 12.0437 20.8689 12.1267C21.0177 12.2098 21.1428 12.3294 21.2324 12.4744C21.3219 12.6194 21.3729 12.7848 21.3806 12.955C21.3883 13.1252 21.3523 13.2946 21.2762 13.447L19.2422 17.516C19.165 17.6702 19.0494 17.8018 18.9064 17.8981C18.7634 17.9944 18.5979 18.0521 18.426 18.0656C18.2541 18.0791 18.0817 18.0479 17.9254 17.9751C17.7692 17.9022 17.6344 17.7903 17.5342 17.65L15.4102 14.68"
      stroke="#525252" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17.1058 9.05301C17.3429 9.17166 17.5231 9.37954 17.6069 9.63099C17.6907 9.88244 17.6713 10.1569 17.5528 10.394L14.4468 16.605C14.3881 16.7225 14.3068 16.8273 14.2075 16.9133C14.1083 16.9994 13.9931 17.065 13.8684 17.1065C13.7438 17.148 13.6122 17.1646 13.4812 17.1552C13.3502 17.1459 13.2223 17.1108 13.1048 17.052L3.60984 12.3C2.92017 11.9526 2.39619 11.3462 2.15256 10.6134C1.90892 9.88064 1.96548 9.08119 2.30984 8.39001L3.68984 5.60001C3.86184 5.25723 4.09968 4.95169 4.38978 4.70084C4.67987 4.44999 5.01654 4.25875 5.38056 4.13803C5.74458 4.01731 6.12881 3.96948 6.51131 3.99727C6.89381 4.02506 7.2671 4.12793 7.60984 4.30001L17.1058 9.05301Z"
      stroke="#525252" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 19H5.76C6.13273 19.0026 6.49877 18.901 6.81682 18.7066C7.13487 18.5122 7.39228 18.2329 7.56 17.9L9 15"
      stroke="#525252" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 21V17" stroke="#525252" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 9H7.01" stroke="#525252" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Support = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.9 20C9.80858 20.9791 12.0041 21.2442 14.0909 20.7478C16.1777 20.2513 18.0186 19.0258 19.2818 17.2922C20.545 15.5585 21.1474 13.4307 20.9806 11.2922C20.8137 9.15361 19.8886 7.14497 18.3718 5.62819C16.855 4.11142 14.8464 3.18625 12.7078 3.01942C10.5693 2.85258 8.44147 3.45505 6.70782 4.71825C4.97417 5.98145 3.74869 7.82231 3.25222 9.90911C2.75575 11.9959 3.02094 14.1914 4 16.1L2 22L7.9 20Z"
      stroke="#525252"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.08984 9.00001C9.32495 8.33167 9.789 7.76811 10.3998 7.40914C11.0106 7.05016 11.7287 6.91894 12.427 7.03872C13.1253 7.15849 13.7587 7.52153 14.2149 8.06353C14.6712 8.60554 14.9209 9.29153 14.9198 10C14.9198 12 11.9198 13 11.9198 13"
      stroke="#525252"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 17H12.01"
      stroke="#525252"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);



const actions = [
  { icon: AddDeviceIcon, label: "Add Storage" },
  { icon: CameraIcon, label: "Add Device" },
  { icon: Support, label: "Support" },
];

export function QuickActions() {
  return (
    <Card className="border border-border/80 shadow-none overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-bgprimary p-2 rounded-t">
        <CardTitle className="text-sm font-roboto font-medium uppercase tracking-wide text-textgray">
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
                <action.icon
                />
              </div>

              <span
                className={`text-[13px] font-medium transition-colors font-roboto mt-1
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
