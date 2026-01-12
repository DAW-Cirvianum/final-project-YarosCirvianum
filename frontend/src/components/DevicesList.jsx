import { useState } from "react";
import { useFetch } from "./useFetch";
import Device from "./Device";

export default function DevicesList() {
  const token = localStorage.getItem("token");
  const { data, loading, error } = useFetch(
    "http://final-project.local/api/devices",
    token
  );

  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

  if (loading) {
    return <p className="text-gray-500">Loading devices...</p>;
  }

  if (error) {
    return (
      <p className="text-red-500">Error loading devices: {error.message}</p>
    );
  }

  if (!data || !data.data || data.data.length === 0) {
    return <p className="text-gray-400">No devices found</p>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Devices</h2>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.data.map((device) => (
          <li
            key={device.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
          >
            <h3 className="font-semibold text-gray-800">
              {device.brand} {device.model}
            </h3>
            <p className="text-sm text-gray-500">{device.device_type}</p>
            <p className="text-xs text-gray-400">Status: {device.status}</p>
            <button
              onClick={() => setSelectedDeviceId(device.id)}
              className="mt-2 px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              View Detail
            </button>
          </li>
        ))}
      </ul>

      {selectedDeviceId && (
        <Device
          id={selectedDeviceId}
          onClose={() => setSelectedDeviceId(null)}
        />
      )}
    </div>
  );
}
