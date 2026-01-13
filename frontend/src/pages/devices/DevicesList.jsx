import { useState, useEffect } from "react";
import { useFetch } from "../../components/useFetch";
import DeviceModal from "./DeviceModal";

export default function DevicesList({ filters, createOpen, setCreateOpen }) {
  const token = localStorage.getItem("token");

  const { data, loading, error } = useFetch(
    "http://final-project.local/api/devices",
    token
  );

  const [devices, setDevices] = useState([]);
  const [editingDevice, setEditingDevice] = useState(null);

  useEffect(() => {
    if (!data?.data) return;

    let filtered = [...data.data];

    // Search
    if (filters.search) {
      filtered = filtered.filter(device =>
        String(device[filters.field] || "")
          .toLowerCase()
          .includes(filters.search.toLowerCase())
      );
    }

    // Order
    filtered.sort((a, b) => {
      const A = a[filters.field] || "";
      const B = b[filters.field] || "";

      return filters.order === "asc"
        ? A.localeCompare(B)
        : B.localeCompare(A);
    });

    setDevices(filtered);
  }, [data, filters]);

  if (loading) {
    return <p className="text-gray-500">Loading devices...</p>;
  }

  if (error) {
    return (
      <p className="text-red-500">
        Error loading devices: {error.message}
      </p>
    );
  }

  if (!devices.length) {
    return <p className="text-gray-400">No devices found</p>;
  }

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 mt-6">
        {devices.map(device => (
          <li
            key={device.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
          >
            <h3 className="font-semibold text-gray-800">
              {device.brand} {device.model}
            </h3>

            <p className="text-sm text-gray-500">
              {device.device_type}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Status: {device.status}
            </p>

            <div className="mt-3 flex justify-end">
              <button
                onClick={() => setEditingDevice(device)}
                className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>

      {(editingDevice || createOpen) && (
        <DeviceModal
          device={editingDevice}
          onClose={() => {
            setEditingDevice(null);
            setCreateOpen(false);
          }}
          onSaved={() => window.location.reload()}
        />
      )}
    </>
  );
}
