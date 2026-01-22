"use client";

import { FormikProps } from "formik";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StepFormSection, StepFormRow, StepFormField } from "@/components/ui/step-form-section";
import { AddUserFormValues } from "../AddUserSheet";
import { Camera, MonitorSpeaker, Router, Shield, Cpu } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UserInfoStepProps {
  formik: FormikProps<AddUserFormValues>;
  currentStep: number;
  totalSteps: number;
}
const deviceTypes = [
    { value: "camera", label: "Camera", icon: Camera },
    { value: "nvr", label: "NVR", icon: MonitorSpeaker },
    { value: "router", label: "Router", icon: Router },
    { value: "access_control", label: "Access Control", icon: Shield },
    { value: "iot", label: "IOT Center", icon: Cpu },
];

export function UserInfoStep({ formik, currentStep, totalSteps }: UserInfoStepProps) {
  return (
    <div className="space-y-6">
      <StepFormSection description={`Step ${currentStep + 1} of ${totalSteps}`}>
        <StepFormRow>
          <StepFormField>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter Full Name"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
          </StepFormField>

          <StepFormField>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              placeholder="Enter Username"
              value={formik.values.username}
              onChange={formik.handleChange}
            />
          </StepFormField>

          <StepFormField>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="Enter Email"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
          </StepFormField>

          <StepFormField>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              placeholder="Enter Phone Number"
              value={formik.values.phone}
              onChange={formik.handleChange}
            />
          </StepFormField>
        </StepFormRow>

        {/* Address Info */}
        <div className="col-span-2">
          <h3 className="text-sm font-semibold text-foreground">Address Information</h3>
          <hr className="mt-2 border-border" />
        </div>

       
          <StepFormField>
            <Label htmlFor="address">Street Address</Label>
            <Input
              id="address"
              name="address"
              placeholder="123 Security Blvd, Monitoring Center A"
              value={formik.values.address}
              onChange={formik.handleChange}
            />
          </StepFormField>

      <StepFormRow columns={3}>
  <StepFormField>
    <Label htmlFor="city">City</Label>
    <Input
      id="city"
      name="city"
      placeholder="City"
      value={formik.values.city}
      onChange={formik.handleChange}
    />
  </StepFormField>

  <StepFormField>
    <Label htmlFor="state">State</Label>
    <Input
      id="state"
      name="state"
      placeholder="State"
      value={formik.values.state}
      onChange={formik.handleChange}
    />
  </StepFormField>

  <StepFormField>
    <Label htmlFor="pincode">Pincode</Label>
    <Input
      id="pincode"
      name="pincode"
      placeholder="Pincode"
      value={formik.values.pincode}
      onChange={formik.handleChange}
    />
  </StepFormField>
</StepFormRow>

      </StepFormSection>

      {/* Security */}
      <StepFormSection>
         <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-foreground">
                Security
              </h2>

              <Badge
                variant="secondary"
                className="rounded-full px-2 py-0.5 text-xs font-medium text-gray-500"
              >
                Admin only
              </Badge>
            </div>
        <StepFormRow>
          <StepFormField>
            <Label htmlFor="oldPassword">Password</Label>
            <Input
              id="oldPassword"
              name="oldPassword"
              type="password"
              placeholder="Old Password"
              value={formik.values.oldPassword}
              onChange={formik.handleChange}
            />
          </StepFormField>

          <StepFormField>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
            />
          </StepFormField>
        </StepFormRow>
      </StepFormSection>
    </div>
  );
}
