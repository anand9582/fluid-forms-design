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
    value: 1,
    title: "Super Admin",
    description: "Full access to all system settings, users, and devices.",
  },
  {
    value: 2,
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
    <Select defaultValue="administrator">
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
          value={formik.values.roleId ? String(formik.values.roleId) : undefined}
          onValueChange={(value) =>
            formik.setFieldValue("roleId", Number(value))
          }
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {roles.map((role) => {
            const selected = formik.values.roleId === role.value;

            return (
              <label
                key={role.value}
                className={`flex gap-3 rounded-lg border p-4 cursor-pointer transition items-center pt-[1.125rem]`}
              >
                <RadioGroupItem value={String(role.value)} className="border-gray-400" />

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
        {formik.touched.roleId && formik.errors.roleId && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.roleId}</p>
        )}
      </div>
    </div>
  );
}
