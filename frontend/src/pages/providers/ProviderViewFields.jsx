import { useState } from "react";
import { formatText } from "../../utils/formatters";

export default function ProviderViewFields({ provider }) {
  const [tab, setTab] = useState("General");

  const Row = ({ label, val, isLink }) => (
    <div className="flex justify-between border-b border-gray-50 py-2.5">
      <span className="text-[10px] font-bold text-gray-400 uppercase">
        {label}
      </span>
      <span className="text-sm text-gray-900 font-medium text-right truncate max-w-[200px]">
        {isLink && val ? (
            <a href={val.startsWith('http') ? val : `https://${val}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {val}
            </a>
        ) : (
            val || "—"
        )}
      </span>
    </div>
  );

  return (
    <div>
      <div className="flex border-b border-gray-200 mb-6 gap-6">
        {["General", "Contact", "Details"].map((t) => (
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
            <Row label="Company Name" val={provider.name} />
            <Row label="Tax ID" val={provider.tax_id} />
            <Row label="Type" val={provider.provider_type} />
            <Row label="Website" val={provider.website} isLink />
            <Row label="Status" val={provider.is_active ? "Active" : "Inactive"} />

            <div className="mt-8 pt-4 border-t border-gray-100 text-[9px] text-gray-300 uppercase leading-loose">
              Created: {provider.created_at} <br /> Updated: {provider.updated_at}
            </div>
          </>
        )}

        {tab === "Contact" && (
          <>
            <Row label="Contact Person" val={provider.contact_person} />
            <Row label="Email" val={provider.contact_email} />
            <Row label="Phone" val={provider.contact_phone} />
            <div className="mt-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Address</span>
                <p className="text-sm text-gray-600 mt-1">{formatText(provider.address)}</p>
            </div>
          </>
        )}

        {tab === "Details" && (
            <>
             <Row label="Active Contracts" val={provider.active_contracts_count} />
             <Row label="Total Devices" val={provider.devices_count} />
             <div className="mt-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Notes</span>
              <p className="text-sm text-gray-600 mt-1 italic">{formatText(provider.notes)}</p>
            </div>
            </>
        )}
      </div>
    </div>
  );
}