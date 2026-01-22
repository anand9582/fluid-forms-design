"use client";

import { FormikProps } from "formik";
import { AddUserFormValues } from "../AddUserSheet";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface RoleAssignmentStepProps {
  formik: FormikProps<AddUserFormValues>;
  currentStep: number;
  totalSteps: number;
}

const roles = [
  {
    value: "super_admin",
    title: "Super Admin",
    description: "Full access to all system settings, users, and devices.",
  },
  {
    value: "super_admin_2",
    title: "Super Admin 2",
    description: "Full access to all system settings, users, and devices.",
  },
];

export function RoleAssignmentStep({
  formik,
  currentStep,
  totalSteps,
}: RoleAssignmentStepProps) {
  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <p className="text-xs font-semibold text-blue-600 uppercase">
        Step {currentStep + 1} of {totalSteps}
      </p>

      {/* Role Type */}
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div className="col-span-1">
    <Label className="block mb-2">Role Type</Label>
    <Select
      value={formik.values.roleType}
      onValueChange={(value) =>
        formik.setFieldValue("roleType", value)
      }
    >
      <SelectTrigger>
        <SelectValue placeholder="Select role type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="administrator">Administrator</SelectItem>
      </SelectContent>
    </Select>
  </div>

</div>

      {/* Available Roles */}
      <div className="space-y-3">
        <Label>Available Roles</Label>

        <RadioGroup
          value={formik.values.role}
          onValueChange={(value) =>
            formik.setFieldValue("role", value)
          }
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {roles.map((role) => {
            const selected = formik.values.role === role.value;

            return (
              <label
                key={role.value}
                className={`flex gap-3 rounded-lg border p-4 cursor-pointer transition items-center
                `}
              >
                <RadioGroupItem value={role.value} className="border-gray-400" />

                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {role.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {role.description}
                  </p>
                </div>
              </label>
            );
          })}
        </RadioGroup>
      </div>
    </div>
  );
}
