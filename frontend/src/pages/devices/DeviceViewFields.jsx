// src/pages/devices/DeviceViewFields.jsx
import { useState } from 'react';

export default function DeviceViewFields({ device }) {
  const [tab, setTab] = useState('General');
  const Row = ({ label, val }) => (
    <div className="flex justify-between border-b border-gray-50 py-2.5">
      <span className="text-[10px] font-bold text-gray-400 uppercase">{label}</span>
      <span className="text-sm text-gray-900 font-medium">{val || '—'}</span>
    </div>
  );

  return (
    <div>
      <div className="flex border-b border-gray-200 mb-6 gap-6">
        {['General', 'Docs', 'Specs'].map(t => (
          <button key={t} onClick={() => setTab(t)} 
            className={`pb-2 text-[11px] font-bold uppercase tracking-widest transition-all ${tab === t ? 'border-b-2 border-gray-900 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-1">
        {tab === 'General' && (
          <>
            <Row label="Owner" val={device.owner?.owner_name} />
            <Row label="Provider" val={device.provider?.name} />
            <Row label="Type" val={device.device_type} />
            <Row label="Status" val={device.status} />
            <Row label="Inv. Number" val={device.inventory_number} />
            <Row label="Location" val={device.physical_location} />
            <div className="mt-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Notes</span>
              <p className="text-sm text-gray-600 mt-1 italic">{device.notes}</p>
            </div>
            <div className="mt-8 pt-4 border-t border-gray-100 text-[9px] text-gray-300 uppercase leading-loose">
              Created: {device.created_at} <br/> Updated: {device.updated_at}
            </div>
          </>
        )}
        {tab === 'Docs' && (
          <>
            <Row label="Contract" val={device.rental_contract?.contract_number} />
            <Row label="Warranty End" val={device.warranty_end_date} />
            <Row label="Purchase Date" val={device.purchase_date} />
            <Row label="Insured" val={device.is_insured ? 'Yes' : 'No'} />
            <Row label="Leased" val={device.is_leased ? 'Yes' : 'No'} />
          </>
        )}
        {tab === 'Specs' && (
          <>
            <Row label="Serial No." val={device.serial_number} />
            <div className="mt-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Specifications</span>
              <p className="text-sm bg-gray-50 p-3 rounded mt-2 font-mono leading-relaxed">{device.specifications}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}