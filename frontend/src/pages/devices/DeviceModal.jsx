import { useEffect, useState } from "react";

export default function DeviceModal({ device, onClose, onSaved }) {
  const token = localStorage.getItem("token");
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Quan carreguem device, omplim el form amb tots els camps menys id i deleted_at
  useEffect(() => {
    if (device) {
      const { id, deleted_at, ...rest } = device;
      setForm(rest);
    } else {
      setForm({}); // modal de crear device
    }
  }, [device]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const save = async () => {
    setSaving(true);
    setError(null);

    const url = device
      ? `http://final-project.local/api/devices/${device.id}`
      : `http://final-project.local/api/devices`;
    const method = device ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Save failed");

      onSaved();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!form || Object.keys(form).length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4">
          {device ? "Edit Device" : "Create Device"}
        </h2>

        {error && <p className="text-red-500 mb-2">Error: {error}</p>}

        <div className="grid grid-cols-2 gap-4">
          {Object.entries(form).map(([key, value]) => {
            if (typeof value === "boolean") {
              return (
                <div key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    name={key}
                    checked={value}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label className="capitalize">{key.replace(/_/g, " ")}</label>
                </div>
              );
            }

            return (
              <div key={key} className="flex flex-col">
                <label className="text-sm text-gray-500 capitalize mb-1">
                  {key.replace(/_/g, " ")}
                </label>
                <input
                  type="text"
                  name={key}
                  value={value || ""}
                  onChange={handleChange}
                  className="border rounded px-2 py-1"
                />
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Discard
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
