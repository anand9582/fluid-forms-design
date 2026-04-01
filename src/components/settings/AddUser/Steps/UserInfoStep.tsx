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
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="Enter First Name"
              value={formik.values.firstName}
              onChange={formik.handleChange}
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.firstName}</p>
            )}
          </StepFormField>

          <StepFormField>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Enter Last Name"
              value={formik.values.lastName}
              onChange={formik.handleChange}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.lastName}</p>
            )}
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
            {formik.touched.username && formik.errors.username && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.username}</p>
            )}
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
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
            )}
          </StepFormField>

          <StepFormField>
            <Label htmlFor="contactNo">Phone</Label>
            <Input
              id="contactNo"
              name="contactNo"
              placeholder="Enter Phone Number"
              value={formik.values.contactNo}
              onChange={formik.handleChange}
            />
            {formik.touched.contactNo && formik.errors.contactNo && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.contactNo}</p>
            )}
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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
            )}
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
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</p>
            )}
          </StepFormField>
        </StepFormRow>
      </StepFormSection>
    </div>
  );
}
