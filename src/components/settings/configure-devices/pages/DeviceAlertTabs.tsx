import { useState } from "react";
import { Monitor, Mail, Smartphone, Webhook } from "lucide-react";
import { ConfigSection } from "@/components/Common/ConfigSection";
import { AlertsTable } from "@/components/Common/AlertsTable";
import { AlertIcons } from "@/components/Icons/Svg/RecordingIcons";
import { DeviceAlertData } from "@/components/settings/configure-devices/pages/DeviceAlertData";


/* ---------------- CHANNEL CONFIG ---------------- */
const CHANNELS = [
    { key: "mail", icon: Mail },
    { key: "sms", icon: Smartphone },
    { key: "desktop", icon: Monitor },
    { key: "webhook", icon: Webhook },
] as const;



export default function DeviceAlertsPage() {
  const [sections, setSections] = useState(DeviceAlertData);

  const updateAlerts = (sectionId: string, alerts: any[]) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, alerts } : s
      )
    );
  };

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <ConfigSection
          key={section.id}
          icon={<AlertIcons className="h-4 w-4" />}
          title={section.title}
          defaultOpen={section.defaultOpen}
        >
          <AlertsTable
            alerts={section.alerts}
            setAlerts={(alerts) =>
              updateAlerts(section.id, alerts)
            }
            channels={CHANNELS}
          />
        </ConfigSection>
      ))}
    </div>
  );
}
