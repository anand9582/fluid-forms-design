"use client";
import { Formik, FormikHelpers } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "sonner";
import { StepWizardDrawer, WizardStep } from "@/components/ui/step-wizard-drawer";
import { UserInfoStep } from "@/components/settings/AddUser/Steps/UserInfoStep";
import { RoleAssignmentStep } from "@/components/settings/AddUser/Steps/RoleAssignmentStep";
import { CameraAssignmentStep } from "@/components/settings/AddUser/Steps/CameraAssignmentStep";
import { ScheduleStep } from "@/components/settings/AddUser/Steps/ScheduleStep";
import { RestrictionsStep } from "@/components/settings/AddUser/Steps/RestrictionsStep";
import { APISERVERURL, API_URLS } from "@/components/Config/api";

import {
  Restrictions,
  Date,
  Devices,
  User,
  RoleAssignment,
} from "@/components/ui/icons";

export interface ScheduleEventPolicy {
  eventType: string;
  severity: string;
  enabled: boolean;
}

export interface DaySchedule {
  dayOfWeek: string;
  startTime?: string;
  endTime?: string;
  enabled: boolean;
  isClosed?: boolean;
}

export interface LoginTimeRestriction {
  enabled: boolean;
  schedules: DaySchedule[];
}

export interface AddUserFormValues {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  contactNo: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  password: "";
  confirmPassword: "";
  roleId: number | null;
  cameraIds: string[];
  accountExpiryDate: string | null;
  maxLoginLimit: number;
  inactivityTimeoutMinutes: number;
  allowedIpAddresses: string[];
  eventPolicies: ScheduleEventPolicy[];
  loginTimeRestriction: LoginTimeRestriction;
}

const initialValues: AddUserFormValues = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  contactNo: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  password: "",
  confirmPassword: "",
  roleId: null,
  cameraIds: [],
  accountExpiryDate: null,
  maxLoginLimit: 3,
  inactivityTimeoutMinutes: 30,
  allowedIpAddresses: [],
  eventPolicies: [
    { eventType: "MOTION", severity: "HIGH", enabled: true },
    { eventType: "LINE_CROSSING", severity: "MEDIUM", enabled: true }
  ],
  loginTimeRestriction: {
    enabled: true,
    schedules: [
      { dayOfWeek: "MONDAY", startTime: "09:00", endTime: "18:00", enabled: true },
      { dayOfWeek: "TUESDAY", startTime: "09:00", endTime: "18:00", enabled: true },
      { dayOfWeek: "WEDNESDAY", startTime: "09:00", endTime: "18:00", enabled: true },
      { dayOfWeek: "THURSDAY", startTime: "09:00", endTime: "18:00", enabled: true },
      { dayOfWeek: "FRIDAY", startTime: "09:00", endTime: "18:00", enabled: true },
      { dayOfWeek: "SATURDAY", startTime: "10:00", endTime: "16:00", enabled: true },
      { dayOfWeek: "SUNDAY", enabled: false, isClosed: true }
    ]
  }
};

const validationSchemas = [
  // Step 1: User Info
  Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    contactNo: Yup.string().required("Phone number is required"),
    password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), undefined], "Passwords must match")
      .required("Confirm password is required"),
  }),
  // Step 2: Role Assignment
  Yup.object().shape({
    roleId: Yup.number().typeError("Role is required").required("Role is required"),
  }),
  // Step 3: Camera Assignment
  Yup.object().shape({
    cameraIds: Yup.array().of(Yup.string()).min(1, "At least one camera must be selected"),
  }),
  // Step 4: Schedule
  Yup.object().shape({}),
  // Step 5: Restrictions
  Yup.object().shape({})
];

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

  const handleSubmit = async (values: AddUserFormValues, helpers: FormikHelpers<AddUserFormValues>) => {
    try {
      const payload = {
        ...values,
        maxLoginLimit: Number(values.maxLoginLimit) || 3,
        inactivityTimeoutMinutes: Number(values.inactivityTimeoutMinutes) || 30,
      };

      const response = await axios.post(
        `${APISERVERURL}${API_URLS.CREATE_USER}`,
        payload
      );

      toast.success("User created successfully!");
      helpers.setSubmitting(false);
      onOpenChange(false);
      setCurrentStep(0);
      helpers.resetForm();
    } catch (error: any) {
      console.error("Failed to create user", error);
      toast.error(error?.response?.data?.message || "Failed to create user.");
      helpers.setSubmitting(false);
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {(formik) => {
        const handleValidateStep = (stepIndex: number) => {
          const schema = validationSchemas[stepIndex];
          if (!schema) return true;

          try {
            schema.validateSync(formik.values, { abortEarly: false });
            return true;
          } catch (err) {
            if (err instanceof Yup.ValidationError) {
              const errors: Record<string, string> = {};
              err.inner.forEach((error) => {
                if (error.path) {
                  errors[error.path] = error.message;
                }
              });
              formik.setErrors(errors);
              // Explicitly touch all fields in the current step to show errors
              const touched: Record<string, boolean> = {};
              Object.keys(errors).forEach(key => touched[key] = true);
              formik.setTouched({ ...formik.touched, ...touched }, false);
            }
            return false;
          }
        };

        return (
          <StepWizardDrawer
            open={open}
            onOpenChange={(val) => {
              onOpenChange(val);
              if (!val) {
                setTimeout(() => {
                  setCurrentStep(0);
                  formik.resetForm();
                }, 300);
              }
            }}
            title="Add New User"
            description="Create a new User account and configure"
            steps={steps}
            currentStep={currentStep}
            onStepChange={(step) => setCurrentStep(step)}
            onValidateStep={handleValidateStep}
            onSubmit={formik.handleSubmit}
            submitLabel={formik.isSubmitting ? "Creating..." : "Create User"}
            nextLabel="Save and Next"
            cancelLabel="Cancel"
            showCloseIcon={true}
          >
            {currentStep === 0 && <UserInfoStep formik={formik} currentStep={currentStep} totalSteps={steps.length} />}
            {currentStep === 1 && <RoleAssignmentStep formik={formik} currentStep={currentStep} totalSteps={steps.length} />}
            {currentStep === 2 && <CameraAssignmentStep formik={formik} currentStep={currentStep} totalSteps={steps.length} />}
            {currentStep === 3 && <ScheduleStep formik={formik} currentStep={currentStep} totalSteps={steps.length} />}
            {currentStep === 4 && <RestrictionsStep formik={formik} currentStep={currentStep} totalSteps={steps.length} />}
          </StepWizardDrawer>
        );
      }}
    </Formik>
  );
}
