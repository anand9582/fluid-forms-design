import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Formik, Form, Field, FieldProps } from "formik";
import { FormLabel } from "@/components/ui/FormLabel";
import { FileText  } from "lucide-react";

interface AddDeviceFormValues {
  deviceName: string;
  ipAddress: string;
  port: string;
  make: string;
  model: string;
  deviceType: string;
  assignmentGroup: string;
}

const initialValues: AddDeviceFormValues = {
  deviceName: "",
  ipAddress: "",
  port: "",
  make: "",
  model: "",
  deviceType: "",
  assignmentGroup: "",
};

export function AddSingleTab() {
  const handleSubmit = (values: AddDeviceFormValues) => {
    console.log("Form values:", values);
    // API integration goes here
  };

  return (
    <div className="flex justify-center py-6">
      <div className="bg-white border border-border rounded-lg p-6 sm:p-8  w-full max-w-3xl">
       <h3 className="font-roboto font-bold text-fontSize20px leading-[120%] tracking-[-0.02em] text-primarydarkblack mb-5">
          Device Configuration
        </h3>

        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ values, setFieldValue }) => (
            <Form className="space-y-6">
              {/* Device Name */}
              <div className="space-y-2">
                <FormLabel htmlFor="deviceName" text="Device Name" className="text-sm" />
                <Field name="deviceName">
                  {({ field }: FieldProps) => (
                    <Input
                      {...field}
                      id="deviceName"
                      placeholder="e.g. Lobby Camera 01"
                    />
                  )}
                </Field>
              </div>

              {/* IP Address + Port */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                   <FormLabel htmlFor="IPAddress" text="IP Address" className="text-sm" />
                  <Field name="ipAddress">
                    {({ field }: FieldProps) => (
                      <Input {...field} id="ipAddress" placeholder="192.168.1.1" />
                    )}
                  </Field>
                </div>
                <div className="space-y-2">
                 <FormLabel htmlFor="port" text="Port" className="text-sm" />
                  <Field name="port">
                    {({ field }: FieldProps) => (
                      <Input {...field} id="port" placeholder="80" />
                    )}
                  </Field>
                </div>
              </div>

              {/* Make + Model */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                   <FormLabel htmlFor="Make" text="Make" className="text-sm" />
                  <Select
                    value={values.make}
                    onValueChange={(value) => setFieldValue("make", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select manufacturer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hikvision">Hikvision</SelectItem>
                      <SelectItem value="dahua">Dahua</SelectItem>
                      <SelectItem value="axis">Axis</SelectItem>
                      <SelectItem value="hanwha">Hanwha</SelectItem>
                      <SelectItem value="bosch">Bosch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <FormLabel htmlFor="model" text="model" className="text-sm" />
                  <Field name="model">
                    {({ field }: FieldProps) => (
                      <Input {...field} id="model" placeholder="Model Number" />
                    )}
                  </Field>
                </div>
              </div>

              {/* Device Type + Assignment Group */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                   <FormLabel htmlFor="deviceType" text="Device Type" className="text-sm" />
                  <Select
                    value={values.deviceType}
                    onValueChange={(value) => setFieldValue("deviceType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="camera">Camera</SelectItem>
                      <SelectItem value="nvr">NVR</SelectItem>
                      <SelectItem value="router">Router</SelectItem>
                      <SelectItem value="access-control">Access Control</SelectItem>
                      <SelectItem value="iot-center">IOT Center</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                   <FormLabel htmlFor="assignmentGroup" text="Assignment Group" className="text-sm" />
                  <Select
                    value={values.assignmentGroup}
                    onValueChange={(value) => setFieldValue("assignmentGroup", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lobby">Lobby</SelectItem>
                      <SelectItem value="main-hall">Main Hall</SelectItem>
                      <SelectItem value="server-room">Server Room</SelectItem>
                      <SelectItem value="front-roof">Front Roof</SelectItem>
                      <SelectItem value="first-floor">First Floor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Button */}
              <div className="flex justify-end">
                <Button type="submit" className="bg-primary hover:bg-primary/90 font-roboto font-medium text-sm" disabled>
                    <FileText  className="w-4 h-4" /> Add device to Inventory
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
