export default function DevicesActionsBar({ filters, setFilters, onCreate }) {
  const fields = [
    { value: "device_name", label: "Name" },
    { value: "serial_number", label: "Serial number" },
    { value: "type", label: "Type" },
    { value: "status", label: "Status" },
  ];

  const currentField = fields.find(f => f.value === filters.field);

  return (
    <div className="bg-white p-4 rounded shadow mb-4 flex flex-wrap gap-3 items-center">
      <select
        value={filters.field}
        onChange={e => setFilters({ ...filters, field: e.target.value })}
        className="border rounded px-3 py-2"
      >
        {fields.map(f => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder={`Search by ${currentField.label.toLowerCase()}...`}
        value={filters.search}
        onChange={e => setFilters({ ...filters, search: e.target.value })}
        className="border rounded px-3 py-2 flex-1 min-w-[200px]"
      />

      <button
        onClick={() =>
          setFilters({
            ...filters,
            order: filters.order === "asc" ? "desc" : "asc",
          })
        }
        className="border rounded px-3 py-2"
      >
        Order {filters.order === "asc" ? "A–Z" : "Z–A"}
      </button>

      <button
        onClick={onCreate}
        className="ml-auto bg-blue-600 text-white px-4 py-2 rounded"
      >
        + Create new Device
      </button>
    </div>
  );
}
