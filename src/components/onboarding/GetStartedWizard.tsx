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
      "Connect a camera or device so Omni View can start streaming.You can use vendor devices or use quick add.",
    hint: "Pro Tip: Auto-discover cameras from your server to speed things up.",
    primaryAction: "Add device",
    secondaryAction: "Skip for now",
  },
  {
    id: 2,
    title: "Add Storage",
    description:
      "Set up storage to begin recording.",
    hint: "Pro Tip: Auto-discover cameras from your server to speed things up.",
    primaryAction: "Add storage",
    secondaryAction: "Skip for now",
  },
  {
    id: 3,
    title: "Open live view",
    description:
      "You can monitor multiple cameras, verify device setup, and ensure everything is streaming correctly.",
    hint: "Pro Tip : You can adjust layouts and save views later.",
    primaryAction: "Open Live View",
    secondaryAction: "Skip for now",
  },
  {
    id: 4,
    title: "Open playback",
    description:
      "Check recordings for events, timeline playback, and export clips if needed.",
    hint: "Pro Tip : You can switch between synced playback and individual camera playback modes.",
    primaryAction: "Open playback",
    secondaryAction: "Skip for now",
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
