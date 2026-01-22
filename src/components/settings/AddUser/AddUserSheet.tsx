"use client";

import { Formik, FormikHelpers } from "formik";
import { useState } from "react";
import { StepWizardDrawer, WizardStep } from "@/components/ui/step-wizard-drawer";
import { UserInfoStep } from "@/components/settings/AddUser/Steps/UserInfoStep";
import { RoleAssignmentStep } from "@/components/settings/AddUser/Steps/RoleAssignmentStep";
import { CameraAssignmentStep } from "@/components/settings/AddUser/Steps/CameraAssignmentStep";
import { ScheduleStep } from "@/components/settings/AddUser/Steps/ScheduleStep";
import { RestrictionsStep } from "@/components/settings/AddUser/Steps/RestrictionsStep";
import {
  Restrictions,
  Date,
  Devices,
  User,
  RoleAssignment,
} from "@/components/ui/icons";

export interface AddUserFormValues {
  name: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const initialValues: AddUserFormValues = {
  name: "",
  username: "",
  email: "",
  phone: "",
  role: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

interface AddUserSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const steps: WizardStep[] = [
    { id: "device-info", label: "User Information", icon: User },
     { id: "roleassignment", label: "Role Assignment", icon: RoleAssignment },
    { id: "network", label: "Camera Assignment", icon: Devices },
    { id: "credentials", label: "Schedule & Events", icon: Date },
    { id: "group", label: "Restrictions", icon: Restrictions }, 
];

export function AddUserSheet({ open, onOpenChange }: AddUserSheetProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const handleSubmit = (values: AddUserFormValues, helpers: FormikHelpers<AddUserFormValues>) => {
    console.log("Creating user:", values);  
    helpers.setSubmitting(false);
    onOpenChange(false);
    setCurrentStep(0);
    helpers.resetForm();
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {(formik) => (
        <StepWizardDrawer
          open={open}
          onOpenChange={onOpenChange}
          title="Add New User"
          description="Create a new User account and configure"
          steps={steps}
          currentStep={currentStep}
          onStepChange={(step) => setCurrentStep(step)}
          onSubmit={formik.handleSubmit}
          submitLabel="Create User"
          nextLabel="Save and Next"
          cancelLabel="Cancel"
        >
         {currentStep === 0 && <UserInfoStep formik={formik} currentStep={currentStep} totalSteps={steps.length} />}
         {currentStep === 1 && (
              <RoleAssignmentStep
                  formik={formik}
                  currentStep={currentStep}
                  totalSteps={steps.length}
              />
            )}
          {currentStep === 2 && <CameraAssignmentStep  currentStep={currentStep} totalSteps={steps.length} />}
          {currentStep === 3 && <ScheduleStep  />}
          {currentStep === 4 && <RestrictionsStep />}
        </StepWizardDrawer>
      )}
    </Formik>
  );
}
