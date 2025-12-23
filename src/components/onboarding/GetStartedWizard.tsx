import { Wizard } from "@/components/Wizard/Wizard";
import { Scan,Video, Play, Info } from "lucide-react";

import {
  Database,
  Camera,
  LiveFeed,
  OpenPlayback,
} from "@/components/ui/icons";

const steps = [
  {
    id: 1,
    title: "Add your first device",
    description:
      "Connect a camera or device so OmniView can start streaming.\nYou can add vendor devices or use quick-add.",
    hint: "Need help? Try the device setup wizard.",
    primaryAction: "Add device",
    secondaryAction: "Quick add",
  },
  {
    id: 2,
    title: "Configure your storage",
    description:
      "Set up storage locations for your recordings.\nChoose between local storage or cloud options.",
    hint: "Need help? Try the storage setup wizard.",
    primaryAction: "Add storage",
    secondaryAction: "Configure later",
  },
  {
    id: 3,
    title: "Open live feed",
    description:
      "View real-time streams from your connected devices.\nMonitor multiple cameras simultaneously.",
    hint: "Need help? Try the live view tutorial.",
    primaryAction: "Open feed",
    secondaryAction: "Skip",
  },
  {
    id: 4,
    title: "Access playback",
    description:
      "Review recorded footage and search through events.\nExport clips and create bookmarks.",
    hint: "Need help? Try the playback guide.",
    primaryAction: "Open playback",
    secondaryAction: "Finish",
  },
];

const navButtons = [
  { icon: Camera, label: "Scan Device" },
  { icon: OpenPlayback, label: "Add Storage" },
  { icon: LiveFeed, label: "Open Live feed" },
  { icon: OpenPlayback, label: "Open Playback" },
];

export function GetStartedWizard() {
  return (
    <Wizard
      title="Get Started"
      position="right-top"
      steps={steps}
      navButtons={navButtons}
      size="medium"
      onFinish={() => console.log("Wizard finished!")}
    />
  );
}
