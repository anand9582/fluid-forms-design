import { Radar, PlusCircle, Upload } from "lucide-react";

export const StorageTabs = [
  {
    id: "Storagevloume",
    label: "Storage Volumes",
    icon: <Radar size={16} />,
  },
  {
    id: "RetentionPolicies",
    label: "Retention Policies",
    icon: <PlusCircle size={16} />,
  },
  // {
  //   id: "FailoverRedundancy",
  //   label: "Failover and Redundancy",
  //   icon: <Upload size={16} />,
  // },
];
