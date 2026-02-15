import { useState, useMemo, useCallback } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Clock } from "lucide-react";
import {
  EditableDataTable,
  EditableTextCell,
  EditableNumberCell,
  EditableSelectCell,
  TagBadges,
  EditActionButton,
} from "@/components/ui/editable-data-table";

export interface RetentionPolicy {
  id: string;
  policyName: string;
  durationDays: number;
  retentionAction: "Remove" | "Archive";
  minFreeSpace: string;
  locations: string[];
}

const defaultData: RetentionPolicy[] = [
  {
    id: "1",
    policyName: "Jerome Bell",
    durationDays: 30,
    retentionAction: "Remove",
    minFreeSpace: "10%",
    locations: ["General", "Lobby"],
  },
  {
    id: "2",
    policyName: "Jerome Bell",
    durationDays: 30,
    retentionAction: "Archive",
    minFreeSpace: "20%",
    locations: ["Financial", "Perimeter"],
  },
  {
    id: "3",
    policyName: "Jerome Bell",
    durationDays: 30,
    retentionAction: "Archive",
    minFreeSpace: "50%",
    locations: ["Vault", "Server room"],
  },
];

const columnHelper = createColumnHelper<RetentionPolicy>();

interface RetentionPoliciesTableProps {
  data?: RetentionPolicy[];
  onDataChange?: (data: RetentionPolicy[]) => void;
}

export function RetentionPoliciesTable({ data: externalData, onDataChange }: RetentionPoliciesTableProps) {
  const [tableData, setTableData] = useState<RetentionPolicy[]>(externalData ?? defaultData);

  const updateRow = useCallback((rowIndex: number, field: keyof RetentionPolicy, value: unknown) => {
    setTableData((prev) => {
      const next = prev.map((row, i) =>
        i === rowIndex ? { ...row, [field]: value } : row
      );
      onDataChange?.(next);
      return next;
    });
  }, [onDataChange]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("policyName", {
        header: "Policy Name",
        cell: (info) => (
          <EditableTextCell
            value={info.getValue()}
            onSave={(v) => updateRow(info.row.index, "policyName", v)}
          />
        ),
      }),
      columnHelper.accessor("durationDays", {
        header: "Duration",
        cell: (info) => (
          <EditableNumberCell
            value={info.getValue()}
            suffix="Days"
            icon={<Clock className="h-3.5 w-3.5" />}
            onSave={(v) => updateRow(info.row.index, "durationDays", v)}
          />
        ),
      }),
      columnHelper.accessor("retentionAction", {
        header: "Retention Action",
        cell: (info) => (
          <EditableSelectCell
            value={info.getValue()}
            options={[
              { label: "Remove", value: "Remove" },
              { label: "Archive", value: "Archive" },
            ]}
            highlightValue="Archive"
            onSave={(v) => updateRow(info.row.index, "retentionAction", v as "Remove" | "Archive")}
          />
        ),
      }),
      columnHelper.accessor("minFreeSpace", {
        header: "Min. Free Space",
        cell: (info) => (
          <EditableTextCell
            value={info.getValue()}
            onSave={(v) => updateRow(info.row.index, "minFreeSpace", v)}
            className="text-muted-foreground"
          />
        ),
      }),
      columnHelper.accessor("locations", {
        header: "Locations / Groups",
        cell: (info) => <TagBadges tags={info.getValue()} />,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: () => <EditActionButton />,
      }),
    ],
    [updateRow]
  );

  return (
    <EditableDataTable
      data={tableData}
      columns={columns}
      warningAlert={{
        title: "Retention Policy Conflicts Detected",
        description:
          "3 cameras in the 'Lobby' group are assigned to multiple retention policies. The policy with the shortest duration ('Standard Retention') will take precedence.",
      }}
    />
  );
}
