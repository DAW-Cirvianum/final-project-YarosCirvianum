import { useState } from "react";
import DevicesActionsBar from "./DevicesActionsBar";
import DevicesList from "./DevicesList";

export default function DevicesPage() {
  const [filters, setFilters] = useState({
    search: "",
    field: "device_name",
    order: "asc",
  });

  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Devices</h1>

      <DevicesActionsBar
        filters={filters}
        setFilters={setFilters}
        onCreate={() => setCreateOpen(true)}
      />

      <DevicesList
        filters={filters}
        createOpen={createOpen}
        setCreateOpen={setCreateOpen}
      />
    </>
  );
}
