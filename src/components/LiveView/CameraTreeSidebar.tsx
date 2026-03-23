import { useEffect, useState, ChangeEvent } from "react";
import { Search, ChevronDown, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SidebarCameraStore } from "@/Store/SidebarCameraStore";
import { CameraTreeItem } from "@/components/LiveView/CameraTreeItem";
import { Devices } from "@/components/Icons/Svg/liveViewIcons";

interface Props {
  isVisible?: boolean;
  onCameraClick?: (cameraId: string) => void;
}

export function CameraTreeSidebar({
  isVisible = true,
  onCameraClick = () => { },
}: Props) {
  const { groups, cameraMapByGroup, fetchCameras } = SidebarCameraStore();
  const [search, setSearch] = useState("");
  const [openMap, setOpenMap] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetchCameras();
  }, [fetchCameras]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const match = (name: string) =>
    name.toLowerCase().includes(search.toLowerCase());

  // Capitalize first letter helper
  const capitalizeFirstLetter = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  // Recursive render function for nested groups
  const renderGroup = (group: any) => {
    const isOpen = openMap[group.id] ?? true;

    const cameras = (cameraMapByGroup[group.id] || []).filter((c) =>
      match(c.name)
    );

    const childNodes = group.children?.map(renderGroup).filter(Boolean);

    const hasMatch =
      match(group.name) || cameras.length > 0 || (childNodes?.length ?? 0) > 0;

    if (!hasMatch) return null;

    return (
      <div key={group.id}>
        {/* Group header */}
        <div
          onClick={() => setOpenMap((p) => ({ ...p, [group.id]: !isOpen }))}
          className="flex justify-between items-center px-2 py-1 cursor-pointer hover:bg-muted rounded"
        >
          <div className="flex items-center gap-2">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            <span className="text-sm font-roboto font-semibold truncate max-w-[150px]">
              {capitalizeFirstLetter(group.name)}
            </span>
          </div>

          <span className="text-xs bg-blue-100 px-2 py-0.5 rounded">
            {cameras.length}
          </span>
        </div>

        {/* Cameras + Child groups */}
        {isOpen && (
          <div className="ml-4 border-l pl-3 space-y-1">
            {childNodes}
            {cameras.map((cam) => (
              <CameraTreeItem
                key={cam.cameraId}
                camera={cam}
                onCameraClick={onCameraClick}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={`w-72 h-full bg-white border rounded-xl p-3 flex flex-col ${!isVisible ? "hidden" : ""
        }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 font-semibold text-lg mb-3">
        <Devices size={18} />
        Cameras
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-8"
          placeholder="Search cameras..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      {/* Scrollable nested tree */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
        {groups.map(renderGroup)}
      </div>
    </aside>
  );
}