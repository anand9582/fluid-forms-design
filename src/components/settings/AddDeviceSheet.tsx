import { useState, useMemo } from "react";
import { Camera, MonitorSpeaker, Router, Shield, Cpu, Plus, Network, Key, FolderTree, Settings } from "lucide-react";
import { toast } from "sonner";
import { StepWizardDrawer, WizardStep, StepValidation } from "@/components/ui/step-wizard-drawer";
import { StepFormSection, StepFormRow, StepFormField } from "@/components/ui/step-form-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddDeviceSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const deviceTypes = [
  { value: "camera", label: "Camera", icon: Camera },
  { value: "nvr", label: "NVR", icon: MonitorSpeaker },
  { value: "router", label: "Router", icon: Router },
  { value: "access_control", label: "Access Control", icon: Shield },
  { value: "iot", label: "IOT Center", icon: Cpu },
];

const steps: WizardStep[] = [
  { id: "device-info", label: "Device Information", icon: Camera },
  { id: "network", label: "Network Config", icon: Network },
  { id: "credentials", label: "Credentials", icon: Key },
  { id: "group", label: "Group Assignment", icon: FolderTree },
  { id: "settings", label: "Settings", icon: Settings },
];

const initialFormData = {
  name: "",
  ipAddress: "",
  port: "",
  make: "",
  model: "",
  type: "",
  username: "",
  password: "",
  group: "",
  rtspPort: "",
  httpPort: "",
  protocol: "",
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
        if (!formData.ipAddress.trim()) newErrors.ipAddress = "IP address is required";
        if (!formData.port.trim()) newErrors.port = "Port is required";
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
    1: { isValid: !!formData.ipAddress.trim() && !!formData.port.trim() },
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

            <StepFormSection title="Device Details" description="Specify the make and model of your device.">
              <StepFormRow>
                <StepFormField>
                  <Label htmlFor="make">Make / Manufacturer</Label>
                  <Input
                    id="make"
                    placeholder="e.g., Axis, Hikvision"
                    value={formData.make}
                    onChange={(e) => handleInputChange("make", e.target.value)}
                  />
                </StepFormField>
                <StepFormField>
                  <Label htmlFor="model">Model Number</Label>
                  <Input
                    id="model"
                    placeholder="e.g., Model-XO, DS-2CD2143"
                    value={formData.model}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                  />
                </StepFormField>
              </StepFormRow>
            </StepFormSection>
          </div>
        );

      case "network":
        return (
          <div className="space-y-6">
            <StepFormSection title="Network Configuration" description="Configure the network settings for your device.">
              <StepFormRow>
                <StepFormField>
                  <Label htmlFor="ipAddress">IP Address</Label>
                  <Input
                    id="ipAddress"
                    placeholder="e.g., 192.168.1.100"
                    value={formData.ipAddress}
                    onChange={(e) => handleInputChange("ipAddress", e.target.value)}
                  />
                </StepFormField>
                <StepFormField>
                  <Label htmlFor="port">Main Port</Label>
                  <Input
                    id="port"
                    placeholder="e.g., 8080"
                    value={formData.port}
                    onChange={(e) => handleInputChange("port", e.target.value)}
                  />
                </StepFormField>
              </StepFormRow>
              <StepFormRow>
                <StepFormField>
                  <Label htmlFor="rtspPort">RTSP Port</Label>
                  <Input
                    id="rtspPort"
                    placeholder="e.g., 554"
                    value={formData.rtspPort}
                    onChange={(e) => handleInputChange("rtspPort", e.target.value)}
                  />
                </StepFormField>
                <StepFormField>
                  <Label htmlFor="httpPort">HTTP Port</Label>
                  <Input
                    id="httpPort"
                    placeholder="e.g., 80"
                    value={formData.httpPort}
                    onChange={(e) => handleInputChange("httpPort", e.target.value)}
                  />
                </StepFormField>
              </StepFormRow>
              <StepFormRow columns={1}>
                <StepFormField>
                  <Label htmlFor="protocol">Protocol</Label>
                  <Select
                    value={formData.protocol}
                    onValueChange={(value) => handleInputChange("protocol", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select protocol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rtsp">RTSP</SelectItem>
                      <SelectItem value="onvif">ONVIF</SelectItem>
                      <SelectItem value="http">HTTP</SelectItem>
                      <SelectItem value="https">HTTPS</SelectItem>
                    </SelectContent>
                  </Select>
                </StepFormField>
              </StepFormRow>
            </StepFormSection>
          </div>
        );

      case "credentials":
        return (
          <div className="space-y-6">
            <StepFormSection title="Device Credentials" description="Enter the login credentials for your device.">
              <StepFormRow>
                <StepFormField>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                  />
                </StepFormField>
                <StepFormField>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                  />
                </StepFormField>
              </StepFormRow>
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

      case "settings":
        return (
          <div className="space-y-6">
            <StepFormSection title="Review & Confirm" description="Review your device configuration before adding.">
              <div className="rounded-lg border border-border p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Device Name</span>
                  <span className="font-medium">{formData.name || "—"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium">{formData.type || "—"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Make / Model</span>
                  <span className="font-medium">{formData.make && formData.model ? `${formData.make} ${formData.model}` : "—"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">IP Address</span>
                  <span className="font-medium">{formData.ipAddress || "—"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Port</span>
                  <span className="font-medium">{formData.port || "—"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Group</span>
                  <span className="font-medium">{formData.group || "—"}</span>
                </div>
              </div>
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
      titleIcon={
        <div className="p-2 rounded-lg bg-primary/10">
          <Plus className="h-5 w-5 text-primary" />
        </div>
      }
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
