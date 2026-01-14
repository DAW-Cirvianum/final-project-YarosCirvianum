// src/pages/devices/ActionsBar.jsx
import SelectSearch from "../../components/ui/SelectSearch";

export default function ActionsBar({ filters, setFilters, onAdd }) {
  const update = (key, val) => setFilters({ ...filters, [key]: val, page: 1 });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm flex items-end gap-4">
      <div className="flex-1 grid grid-cols-3 gap-4">
        {/* Cerquem Owners i Providers. Laravel rebrà owner_id i provider_id */}
        <SelectSearch label="Owner" url="/owners" onSelect={(o) => update('owner_id', o.id)} />
        <SelectSearch label="Provider" url="/providers" onSelect={(p) => update('provider_id', p.id)} />
        
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-gray-400 uppercase mb-1">Device Type</label>
          <input 
            className="w-full border border-gray-300 px-3 py-2 rounded text-xs outline-none focus:border-black"
            placeholder="e.g. Laptop"
            onChange={(e) => update('device_type', e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => window.location.reload()} className="text-[10px] font-bold text-gray-400 hover:text-black uppercase px-2">Reset</button>
        <button onClick={onAdd} className="bg-gray-900 text-white px-5 py-2 rounded text-xs font-bold uppercase hover:bg-black transition-all">
          + Add Device
        </button>
      </div>
    </div>
  );
}