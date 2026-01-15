// src/pages/owners/OwnerViewFields.jsx
import { useState } from "react";

export default function OwnerViewFields({ owner }) {
  const [tab, setTab] = useState("General");

  const Row = ({ label, val }) => (
    <div className="flex justify-between border-b border-gray-50 py-2.5">
      <span className="text-[10px] font-bold text-gray-400 uppercase">
        {label}
      </span>
      <span className="text-sm text-gray-900 font-medium text-right truncate max-w-[180px]">
        {val || "—"}
      </span>
    </div>
  );

  return (
    <div>
      <div className="flex border-b border-gray-200 mb-6 gap-6">
        {["General", "Contact"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-2 text-[11px] font-bold uppercase tracking-widest transition-all ${
              tab === t
                ? "border-b-2 border-gray-900 text-gray-900"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-1">
        {tab === "General" && (
          <>
            <Row label="Name" val={owner.owner_name} />
            <Row label="Department" val={owner.department} />
            <Row label="Location" val={owner.location} />
            <Row label="Employee Code" val={owner.employee_code} />
            <Row label="Status" val={owner.is_active ? "Active" : "Inactive"} />

            <div className="mt-8 pt-4 border-t border-gray-100 text-[9px] text-gray-300 uppercase leading-loose">
              Created: {owner.created_at} <br /> Updated: {owner.updated_at}
            </div>
          </>
        )}

        {tab === "Contact" && (
          <>
            <Row label="Email" val={owner.email} />
            <Row label="Extension" val={owner.extension} />
            <Row label="Phone" val={owner.phone} />
          </>
        )}
      </div>
    </div>
  );
}
