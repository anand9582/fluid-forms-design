import { DeviceTreeSelect, DeviceNode } from "@/components/ui/device-tree-select";
import { FormikProps } from "formik";
import { AddUserFormValues } from "../AddUserSheet";

/* ---------------- MOCK DATA ---------------- */

const mockDeviceData: DeviceNode[] = [
  {
    id: "hq",
    name: "Headquarters HQ",
    type: "group",
    deviceCount: 8,
    children: [
      {
        id: "hq-sub",
        name: "Headquarters HQ",
        type: "group",
        children: [
          { id: "cam-1", name: "Main entrance cam 1", type: "device", status: "online" },
          { id: "cam-2", name: "Reception Desk Cam 2", type: "device", status: "online" },
          { id: "cam-3", name: "Main entrance cam 3", type: "device", status: "offline" },
          { id: "cam-4", name: "Main entrance cam 4", type: "device", status: "online" },
        ],
      },
      {
        id: "hq2",
        name: "Headquarters HQ 2",
        type: "group",
        children: [
          { id: "cam-5", name: "Main entrance cam 5", type: "device", status: "offline" },
          { id: "cam-6", name: "Reception Desk Cam 6", type: "device", status: "online" },
        ],
      },
    ],
  },
  {
    id: "warehouse",
    name: "Warehouse 1",
    type: "group",
    deviceCount: 12,
    children: [
      { id: "wh-cam-1", name: "Warehouse Cam 1", type: "device", status: "online" },
      { id: "wh-cam-2", name: "Warehouse Cam 2", type: "device", status: "online" },
    ],
  },
];

/* ---------------- PROPS TYPE ---------------- */

interface CameraAssignmentStepProps {
  currentStep: number;
  totalSteps: number;
  formik: FormikProps<AddUserFormValues>;
}

/* ---------------- COMPONENT ---------------- */

export function CameraAssignmentStep({
  currentStep,
  totalSteps,
  formik,
}: CameraAssignmentStepProps) {
  const handleInputChange = (value: string[]) => {
    formik.setFieldValue("cameraIds", value);
    // Explicitly set field touched so validation kicks in on change if needed
    formik.setFieldTouched("cameraIds", true, false);
  };

  const assignedCount = formik.values.cameraIds?.length || 0;





  return (
    <div className="space-y-4">
      {/* HEADER ROW */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-blue-600 uppercase">
          Step {currentStep + 1} of {totalSteps}
        </p>

        {assignedCount > 0 && (
          <span className="text-sm font-medium text-blue-600 flex items-center gap-1">
            <span className="h-5 w-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
              {assignedCount}
            </span>
            Cameras Assigned
          </span>
        )}
      </div>

      <DeviceTreeSelect
        data={mockDeviceData}
        selectedIds={formik.values.cameraIds || []}
        onSelectionChange={handleInputChange}
        searchPlaceholder="Search cameras, buildings or areas..."
        selectionLabel="Cameras Assigned"
      />
      
      {formik.touched.cameraIds && formik.errors.cameraIds && (
         <p className="text-red-500 text-xs mt-1">
           {typeof formik.errors.cameraIds === "string" ? formik.errors.cameraIds : "At least one camera must be selected"}
         </p>
      )}
    </div>
  );
}
