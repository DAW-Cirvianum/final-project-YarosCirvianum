import { useState } from "react";
import OwnersActionsBar from "./OwnersActionsBar";
import OwnersList from "./OwnersList";

export default function OwnersPage() {
  const [filters, setFilters] = useState({
    search: "",
    field: "owner_name",
    order: "asc",
  });

  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Owners</h1>

      <OwnersActionsBar
        filters={filters}
        setFilters={setFilters}
        onCreate={() => setCreateOpen(true)}
      />

      <OwnersList
        filters={filters}
        createOpen={createOpen}
        setCreateOpen={setCreateOpen}
      />
    </>
  );
}
