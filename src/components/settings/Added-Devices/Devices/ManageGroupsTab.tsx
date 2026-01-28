import { useState } from "react";
import { Plus, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card,CardHeader,CardTitle,CardContent } from "@/components/ui/card";

const mockGroups = [
  { id: "1", name: "Lobby", deviceCount: 2 },
  { id: "2", name: "External", deviceCount: 2 },
  { id: "3", name: "Server Room", deviceCount: 1 },
];

export function ManageGroupsTab() {
  const [groups] = useState(mockGroups);
  const [newGroupName, setNewGroupName] = useState("");

  return (
          <Card className="rounded-md bg-card text-card-foreground border border-border/80 max-w-lg  mx-auto mt-5 max-auto shadow-none overflow-hidden">
                <CardHeader className="flex flex-row  justify-between py-3 bg-bgprimary rounded-t px-4">
                  <CardTitle className="font-roboto font-bold text-lg leading-[120%] tracking-[-0.02em] text-primarydarkblack mb-5">
                      Device Groups
                  </CardTitle>
                    <div className="flex items-center">
                            <span className="text-xs sm:text-sm text-muted-foreground">{groups.length} Groups Total</span>
                    </div>
                </CardHeader>
       <CardContent className="p-4 px-6">
          {/* Create Group Input */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Input 
              placeholder="Enter new group name..." 
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="flex-1"
            />
            <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto" disabled>
              <Plus className="h-4 w-4" />
              Create group
            </Button>
          </div>

          {/* Groups List */}
          <div className="space-y-4">
            {groups.map((group) => (
              <div 
                key={group.id} 
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border border-border"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                  <Folder className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-md font-roboto font-medium text-foreground">{group.name}</span>
                  <span className="text-sm font-roboto font-normal text-muted-foreground">{group.deviceCount} devices associated</span>
                </div>
              </div>
            ))}
          </div>      
      </CardContent>
          </Card>

  );
}
