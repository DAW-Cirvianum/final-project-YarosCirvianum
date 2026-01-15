// src/pages/rentalContracts/ContractViewFields.jsx
import { useState } from "react";
import { formatText } from "../../utils/formatters";

export default function ContractViewFields({ contract }) {
  const [tab, setTab] = useState("General");

  const Row = ({ label, val }) => (
    <div className="flex justify-between border-b border-gray-50 py-2.5">
      <span className="text-[10px] font-bold text-gray-400 uppercase">
        {label}
      </span>
      <span className="text-sm text-gray-900 font-medium text-right truncate max-w-[200px]">
        {val || "—"}
      </span>
    </div>
  );

  const getStatusColor = (status) => {
      switch(status) {
          case 'active': return 'text-green-600 font-bold uppercase text-xs';
          case 'expired': return 'text-red-500 font-bold uppercase text-xs';
          case 'terminated': return 'text-gray-500 font-bold uppercase text-xs';
          default: return 'text-gray-900';
      }
  };

  return (
    <div>
      <div className="flex border-b border-gray-200 mb-6 gap-6">
        {["General", "Financial", "Details"].map((t) => (
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
            <Row label="Contract Name" val={contract.name} />
            <Row label="Code" val={contract.contract_number} />
            <Row label="Provider" val={contract.provider?.name} />
            <div className="flex justify-between border-b border-gray-50 py-2.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Status</span>
                <span className={getStatusColor(contract.status)}>{contract.status}</span>
            </div>
            
            <div className="mt-8 pt-4 border-t border-gray-100 text-[9px] text-gray-300 uppercase leading-loose">
              Created: {contract.created_at} <br /> Updated: {contract.updated_at}
            </div>
          </>
        )}

        {tab === "Financial" && (
          <>
            <Row label="Monthly Cost" val={contract.monthly_cost ? `${contract.monthly_cost} €` : null} />
            <Row label="Start Date" val={contract.start_date} />
            <Row label="End Date" val={contract.end_date} />
            <Row label="Cost To Date" val={contract.total_cost_to_date ? `${contract.total_cost_to_date} €` : null} />
            
            <div className="mt-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Is Expired?</span>
                <p className={`text-sm mt-1 font-bold ${contract.is_expired ? 'text-red-500' : 'text-green-600'}`}>
                    {contract.is_expired ? 'YES' : 'NO'}
                </p>
            </div>
          </>
        )}

        {tab === "Details" && (
            <>
             <Row label="Assigned Devices" val={contract.devices_count} />
             <Row label="Active Devices" val={contract.active_devices_count} />
             
             <div className="mt-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Terms</span>
              <p className="text-sm text-gray-600 mt-1 italic">{formatText(contract.terms)}</p>
            </div>

             <div className="mt-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Notes</span>
              <p className="text-sm text-gray-600 mt-1 italic">{formatText(contract.notes)}</p>
            </div>
            </>
        )}
      </div>
    </div>
  );
}