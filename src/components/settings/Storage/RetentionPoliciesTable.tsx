import { useMemo,useState } from "react";
import { Clock, Pencil, AlertTriangle,Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { DynamicTable } from "@/components/ui/dynamic-table";
import { NewRetentionPolicyPanel } from "@/components/settings/Storage/DialogStorage/NewRetentionPolicyPanel";
import { DynamicFilterDrawer } from "@/components/ui/dynamic-filter-drawer"; 
import { cn } from "@/lib/utils";

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

interface RetentionPoliciesTableProps {
  data?: RetentionPolicy[];
  onDataChange?: (data: RetentionPolicy[]) => void;
}

export function RetentionPoliciesTable({ data: externalData }: RetentionPoliciesTableProps) {
  const tableData = externalData ?? defaultData;
   const [newStorageOpen, setNewStorageOpen] = useState(false);

  const columns = useMemo<ColumnDef<RetentionPolicy, any>[]>(
    () => [
      {
        accessorKey: "policyName",
        header: "Policy Name",
        cell: ({ row }) => (
          <span className="text-sm font-roboto font-medium text-foreground">{row.original.policyName}</span>
        ),
      },
      {
        accessorKey: "durationDays",
        header: "Duration",
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-sm font-roboto font-medium text-foreground">
            <Clock className="h-3.5 w-3.5" />
            {row.original.durationDays} Days
          </div>
        ),
      },
      {
        accessorKey: "retentionAction",
        header: "Retention Action",
       cell: ({ row }) => {
    const action = row.original.retentionAction;

    const isArchive = action === "Archive";

    return (
      <Badge
        variant="outline"
        className={cn(
          "px-4 py-1.5 rounded-full text-sm font-roboto font-medium border-0",
          isArchive
            ? "bg-purple-50 text-purple-600 "
            : "bg-slate-50 text-slate-700 "
        )}
      >
        {action}
      </Badge>
    );
  },
      },
      {
        accessorKey: "minFreeSpace",
        header: "Min. Free Space",
        cell: ({ row }) => (
          <span className="text-sm font-roboto font-medium text-slate-500">{row.original.minFreeSpace}</span>
        ),
      },
      {
        id: "locations",
        header: "Locations / Groups",
        cell: ({ row }) => (
          <div className="flex gap-3 flex-wrap">
            {row.original.locations.map((loc) => (
              <Badge key={loc} variant="outline" className="text-sm font-roboto font-medium rounded-sm bg-blue-50 text-blue-700 border-blue-100 py-2 px-3">
                  {loc}
              </Badge>
            ))}
          </div>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: () => (
          <Button variant="ghost" size="icon" className="h-7 w-7">
             <Pencil className="h-4 w-4 font-roboto font-medium text-slate-500" />
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
                <h2 className="text-base sm:text-lg font-semibold text-foreground">Data Retention Policies</h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Configure how long video data is stored before deletion or archiving.</p>
            </div>
            <Button size="sm" className="gap-2 self-start sm:self-auto" onClick={() => setNewStorageOpen(true)}>
                <Plus className="h-4 w-4" />
                New Retention Policy
            </Button>
        </div>

          <DynamicTable
            data={tableData}
            columns={columns}
            showSearch={false}
            showPagination={false}
            emptyMessage="No retention policies configured."
            headerBgClass="bg-slate-100 dark:bg-slate-900"
             disableColumnWidths={true}
          />

      <div className="flex items-start gap-3 rounded-sm border  border-yellow-500/30 bg-amber-50 p-3.5">
        <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-sm">
            <span className="font-roboto font-medium text-amber-700 dark:text-yellow-400">Retention Policy Conflicts Detected</span>
             <br />
            <span className="font-roboto font-regular text-amber-600 dark:text-yellow-400/80">3 cameras in the 'Lobby' group are assigned to multiple retention policies. The policy with the shortest duration ('Standard Retention') will take precedence.</span>
        </div>
      </div>
        <DynamicFilterDrawer
          open={newStorageOpen}
          onOpenChange={setNewStorageOpen}
          title="New Retention Policy"
          description="Define storage duration and lifecycle rules."
          applyLabel="Save Policy"
          width="xl"
          onApply={() => {
            setNewStorageOpen(false);
          }}
        >
          <NewRetentionPolicyPanel />
        </DynamicFilterDrawer>
  </div>
  );
}
