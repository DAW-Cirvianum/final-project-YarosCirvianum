import { useState, useEffect } from "react";
import { useFetch } from "./useFetch";

export default function Device({ id, onClose }) {
  const token = localStorage.getItem("token");
  const { data, loading, error } = useFetch(
    `http://final-project.local/api/devices/${id}`,
    token
  );

  const [formData, setFormData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    if (data && data.data) {
      // Excloem els camps que no vols mostrar
      const { id, created_at, updated_at, deleted_at, ...rest } = data.data;
      setFormData(rest);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);

    try {
      const res = await fetch(`http://final-project.local/api/devices/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Save failed");

      onClose(); // Tanquem modal després de salvar
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !formData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
        <p className="bg-white p-4 rounded shadow">Loading device...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
        <p className="bg-white p-4 rounded shadow text-red-500">
          Error loading device: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4">
          Device Details - {formData.brand} {formData.model}
        </h2>

        {saveError && (
          <p className="text-red-500 mb-2">Error saving: {saveError}</p>
        )}

        <div className="grid grid-cols-2 gap-4">
          {Object.entries(formData).map(([key, value]) => {
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
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
