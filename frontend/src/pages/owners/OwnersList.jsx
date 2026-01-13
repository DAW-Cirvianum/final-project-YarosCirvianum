import { useEffect, useState } from "react";
import api from "../../services/api";
import OwnerModal from "./OwnerModal";

export default function OwnersList({ filters, createOpen, setCreateOpen }) {
  const [owners, setOwners] = useState([]);
  const [editing, setEditing] = useState(null);

  const loadOwners = async () => {
    const res = await api.get("/owners");
    let data = res.data.data;

    if (filters.search) {
      data = data.filter(o =>
        String(o[filters.field] || "")
          .toLowerCase()
          .includes(filters.search.toLowerCase())
      );
    }

    data.sort((a, b) => {
      const A = a[filters.field] || "";
      const B = b[filters.field] || "";
      return filters.order === "asc"
        ? A.localeCompare(B)
        : B.localeCompare(A);
    });

    setOwners(data);
  };

  useEffect(() => {
    loadOwners();
  }, [filters]);

  const remove = async id => {
    if (!confirm("Delete owner?")) return;
    await api.delete(`/owners/${id}`);
    loadOwners();
  };

  return (
    <>
      <table className="w-full bg-white rounded shadow border-2">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Name</th>
            <th>Email</th>
            <th>Department</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {owners.map(o => (
            <tr key={o.id} className="border-t">
              <td className="p-2">{o.owner_name}</td>
              <td>{o.email}</td>
              <td>{o.department}</td>
              <td className="text-right p-2 space-x-4">
                <button onClick={() => setEditing(o)}>Edit</button>
                <button onClick={() => remove(o.id)} className="text-red-500">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {(editing || createOpen) && (
        <OwnerModal
          owner={editing}
          onClose={() => {
            setEditing(null);
            setCreateOpen(false);
          }}
          onSaved={loadOwners}
        />
      )}
    </>
  );
}
