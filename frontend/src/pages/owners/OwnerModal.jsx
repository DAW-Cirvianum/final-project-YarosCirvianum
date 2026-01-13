import { useEffect, useState } from "react";
import api from "../../services/api";

export default function OwnerModal({ owner, onClose, onSaved }) {
  const [form, setForm] = useState({
    owner_name: "",
    email: "",
    department: "",
    location: "",
  });

  useEffect(() => {
    if (owner) setForm(owner);
  }, [owner]);

  const save = async () => {
    if (owner) {
      await api.put(`/owners/${owner.id}`, form);
    } else {
      await api.post("/owners", form);
    }
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          {owner ? "Edit Owner" : "Create Owner"}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {Object.keys(form).map(k => (
            <div key={k}>
              <label className="text-sm text-gray-500 capitalize">
                {k.replace("_", " ")}
              </label>
              <input
                className="border p-2 rounded w-full"
                value={form[k]}
                onChange={e => setForm({ ...form, [k]: e.target.value })}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
            Discard
          </button>
          <button onClick={save} className="px-4 py-2 bg-blue-600 text-white rounded">
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
