import { useState, useMemo } from "react";
import { Camera, MonitorSpeaker, Router, Shield, Cpu, Plus, Network, Key, FolderTree, Settings } from "lucide-react";
import { toast } from "sonner";
import { StepWizardDrawer, WizardStep, StepValidation } from "@/components/ui/step-wizard-drawer";
import { StepFormSection, StepFormRow, StepFormField } from "@/components/ui/step-form-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DeviceTreeSelect, DeviceNode } from "@/components/ui/device-tree-select";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Restrictions,
  Date,
  Devices,
  User  
} from "@/components/ui/icons";

interface AddDeviceSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
// Mock data for tree view - this will come from API
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

const deviceTypes = [
    { value: "camera", label: "Camera", icon: Camera },
    { value: "nvr", label: "NVR", icon: MonitorSpeaker },
    { value: "router", label: "Router", icon: Router },
    { value: "access_control", label: "Access Control", icon: Shield },
    { value: "iot", label: "IOT Center", icon: Cpu },
];

const steps: WizardStep[] = [
  { id: "device-info", label: "User Information", icon: User },
  { id: "network", label: "Camera Assignment", icon: Devices },
  { id: "credentials", label: "Schedule & Events", icon: Date },
  { id: "group", label: "Restrictions", icon: Restrictions },
];

const initialFormData = {
  name: "",
  username: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  type: "",
  password: "",
  group: "",
  selectedCameras: [] as string[],
};


type FormErrors = Partial<Record<keyof typeof initialFormData, string>>;

export function AddDeviceSheet({ open, onOpenChange }: AddDeviceSheetProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (stepIndex: number): boolean => {
    const newErrors: FormErrors = {};
    
    switch (steps[stepIndex].id) {
      case "device-info":
        if (!formData.name.trim()) newErrors.name = "Device name is required";
        if (!formData.type) newErrors.type = "Device type is required";
        break;
      case "network":
        if (formData.selectedCameras.length === 0) {
          newErrors.selectedCameras = "Please select at least one camera";
        }
        break;
      case "credentials":
        if (!formData.username.trim()) newErrors.username = "Username is required";
        if (!formData.password.trim()) newErrors.password = "Password is required";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validation: StepValidation = useMemo(() => ({
    0: { isValid: !!formData.name.trim() && !!formData.type },
    1: { isValid: formData.selectedCameras.length > 0 },
    2: { isValid: !!formData.username.trim() && !!formData.password.trim() },
    3: { isValid: true }, // Group is optional
    4: { isValid: true }, // Review step
  }), [formData]);

  const handleSubmit = () => {
    console.log("Device data:", formData);
    toast.success("Device added successfully!");
    onOpenChange(false);
    setCurrentStep(0);
    setFormData(initialFormData);
    setErrors({});
    setTouched({});
  };

  const handleCancel = () => {
    setCurrentStep(0);
    setFormData(initialFormData);
    setErrors({});
    setTouched({});
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case "device-info":
        return (
          <div className="space-y-6">
           <StepFormSection
              description={`Step ${currentStep + 1} of ${steps.length}`}
            >
              <StepFormRow>
                <StepFormField>
                  <Label htmlFor="name">Full name</Label>
                    <Input
                      id="name"
                      placeholder="Enter Full Name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                </StepFormField>
                 <StepFormField>
                  <Label htmlFor="name">Username</Label>
                  <Input
                    id="name"
                    placeholder="Enter Full Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </StepFormField>

              <StepFormField>
                  <Label htmlFor="Email">Email</Label>
                  <Input
                    id="name"
                    placeholder="Enter Full Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </StepFormField>  
              <StepFormField>
                  <Label htmlFor="Phone">Phone</Label>
                  <Input
                    id="Phone"
                    placeholder="Enter Full Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </StepFormField>

                 <StepFormField>
                  <Label htmlFor="type">Role</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleInputChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {deviceTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </StepFormField>
                
              <div className="col-span-2">
                <h3 className="text-sm font-semibold text-foreground">
                      Address Information
                </h3>
                <hr className="mt-2 border-border" />
              </div>

              <StepFormField className="col-span-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  placeholder="123 Security Blvd, Monitoring Center A"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </StepFormField>
                
              </StepFormRow>
            </StepFormSection>

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
  <StepFormRow columns={3}>
    <StepFormField>
      <Label htmlFor="city">Old Password</Label>
      <Input
        id="city"
        placeholder="New Delhi"
        value={formData.city}
        onChange={(e) => handleInputChange("city", e.target.value)}
      />
    </StepFormField>

    <StepFormField>
      <Label htmlFor="state">State</Label>
      <Input
        id="state"
        placeholder="Delhi"
        value={formData.state}
        onChange={(e) => handleInputChange("state", e.target.value)}
      />
    </StepFormField>

    <StepFormField>
      <Label htmlFor="pincode">Pincode</Label>
      <Input
        id="pincode"
        placeholder="110001"
        value={formData.pincode}
        onChange={(e) => handleInputChange("pincode", e.target.value)}
      />
    </StepFormField>
  </StepFormRow>
</StepFormSection>


           <StepFormSection>
  <StepFormRow columns={3}>
    <StepFormField>
      <Label htmlFor="city">Old Password</Label>
      <Input
        id="city"
        placeholder="New Delhi"
        value={formData.city}
        onChange={(e) => handleInputChange("city", e.target.value)}
      />
    </StepFormField>

    <StepFormField>
      <Label htmlFor="state">New Password</Label>
      <Input
        id="state"
        placeholder="Delhi"
        value={formData.state}
        onChange={(e) => handleInputChange("state", e.target.value)}
      />
    </StepFormField>

    <StepFormField>
      <Label htmlFor="pincode">Confirm Password</Label>
      <Input
        id="pincode"
        placeholder="110001"
        value={formData.pincode}
        onChange={(e) => handleInputChange("pincode", e.target.value)}
      />
    </StepFormField>
  </StepFormRow>
</StepFormSection>  

          </div>
        );

      case "network":
        return (
          <DeviceTreeSelect
            data={mockDeviceData}
            selectedIds={formData.selectedCameras}
            onSelectionChange={(ids) => handleInputChange("selectedCameras", ids)}
            searchPlaceholder="Search cameras, buildings or areas..."
            selectionLabel="Cameras Assigned"
          />

          // <div className="space-y-6">
          //   <StepFormSection title="Network Configuration" description="Configure the network settings for your device.">
          //     <StepFormRow>
          //       <StepFormField>
          //         <Label htmlFor="ipAddress">IP Address</Label>
          //         <Input
          //           id="ipAddress"
          //           placeholder="e.g., 192.168.1.100"
          //           value={formData.ipAddress}
          //           onChange={(e) => handleInputChange("ipAddress", e.target.value)}
          //         />
          //       </StepFormField>
          //       <StepFormField>
          //         <Label htmlFor="port">Main Port</Label>
          //         <Input
          //           id="port"
          //           placeholder="e.g., 8080"
          //           value={formData.port}
          //           onChange={(e) => handleInputChange("port", e.target.value)}
          //         />
          //       </StepFormField>
          //     </StepFormRow>
          //     <StepFormRow>
          //       <StepFormField>
          //         <Label htmlFor="rtspPort">RTSP Port</Label>
          //         <Input
          //           id="rtspPort"
          //           placeholder="e.g., 554"
          //           value={formData.rtspPort}
          //           onChange={(e) => handleInputChange("rtspPort", e.target.value)}
          //         />
          //       </StepFormField>
          //       <StepFormField>
          //         <Label htmlFor="httpPort">HTTP Port</Label>
          //         <Input
          //           id="httpPort"
          //           placeholder="e.g., 80"
          //           value={formData.httpPort}
          //           onChange={(e) => handleInputChange("httpPort", e.target.value)}
          //         />
          //       </StepFormField>
          //     </StepFormRow>
          //     <StepFormRow columns={1}>
          //       <StepFormField>
          //         <Label htmlFor="protocol">Protocol</Label>
          //         <Select
          //           value={formData.protocol}
          //           onValueChange={(value) => handleInputChange("protocol", value)}
          //         >
          //           <SelectTrigger>
          //             <SelectValue placeholder="Select protocol" />
          //           </SelectTrigger>
          //           <SelectContent>
          //             <SelectItem value="rtsp">RTSP</SelectItem>
          //             <SelectItem value="onvif">ONVIF</SelectItem>
          //             <SelectItem value="http">HTTP</SelectItem>
          //             <SelectItem value="https">HTTPS</SelectItem>
          //           </SelectContent>
          //         </Select>
          //       </StepFormField>
          //     </StepFormRow>
          //   </StepFormSection>
          // </div>
        );

      case "credentials":
        return (
         <div className="space-y-6 px-6 py-4">
  <StepFormSection
    title="Device Credentials"
    description="Enter the login credentials for your device."
  >
    {/* ✅ Inputs */}
    <StepFormRow>
      <StepFormField>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          placeholder="Enter username"
          value={formData.username}
          onChange={(e) =>
            handleInputChange("username", e.target.value)
          }
        />
      </StepFormField>

      <StepFormField>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={(e) =>
            handleInputChange("password", e.target.value)
          }
        />
      </StepFormField>
    </StepFormRow>

    {/* 🔽 Divider */}
    <div className="border-t border-border pt-6 mt-6 space-y-4">
      <h3 className="text-sm font-semibold text-foreground">
        Allowed Login Times
      </h3>
      
    </div>
  </StepFormSection>
</div>

        );

      case "group":
        return (
          <div className="space-y-6">
            <StepFormSection title="Group Assignment" description="Assign your device to a group for easier management.">
              <StepFormRow columns={1}>
                <StepFormField>
                  <Label htmlFor="group">Device Group</Label>
                  <Select
                    value={formData.group}
                    onValueChange={(value) => handleInputChange("group", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main-entrance">Main Entrance</SelectItem>
                      <SelectItem value="parking">Parking Area</SelectItem>
                      <SelectItem value="warehouse">Warehouse</SelectItem>
                      <SelectItem value="office">Office Floor</SelectItem>
                      <SelectItem value="perimeter">Perimeter</SelectItem>
                    </SelectContent>
                  </Select>
                </StepFormField>
              </StepFormRow>
            </StepFormSection>
          </div>
        );

    
      default:
        return null;
    }
  };

  const getFieldError = (field: keyof FormErrors) => {
    return touched[field] ? errors[field] : undefined;
  };

  return (
    <StepWizardDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Edit User"
      description="Update configuration for kate.russell@campulse.com"
      steps={steps}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      submitLabel="Add Device"
      validation={validation}
      onValidateStep={validateStep}
    >
      {renderStepContent()}
    </StepWizardDrawer>
  );
}
