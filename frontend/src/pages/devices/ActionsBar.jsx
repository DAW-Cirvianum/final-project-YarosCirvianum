// src/pages/devices/ActionsBar.jsx
import SelectSearch from "../../components/ui/SelectSearch";
import { formatType } from "../../utils/formatters";

export default function ActionsBar({ filters, setFilters, onAdd }) {
  const update = (key, val) => setFilters({ ...filters, [key]: val, page: 1 });
  // Llista estricta tal com has demanat
  const types = ['laptop', 'desktop', 'tablet', 'phone', 'mouse', 'keyboard', 'mouse_keyboard'];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm flex items-end gap-4 text-gray-900">
      <div className="flex-1 grid grid-cols-4 gap-4">
        <SelectSearch label="Owner" url="/owners" displayKey="owner_name" onSelect={(o) => update('owner_id', o.id)} />
        <SelectSearch label="Provider" url="/providers" displayKey="name" onSelect={(p) => update('provider_id', p.id)} />
        <SelectSearch label="Contract" url="/rental-contracts" displayKey="contract_number" onSelect={(c) => update('rental_contract_id', c.id)} />

        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-gray-400 uppercase mb-1">Type</label>
          <select 
            className="border border-gray-300 px-3 py-2 rounded text-xs outline-none focus:border-black bg-white"
            onChange={(e) => update('device_type', e.target.value)} 
            value={filters.device_type || ""}
          >
            <option value="">All Types</option>
            {types.map(t => <option key={t} value={t}>{formatType(t)}</option>)}
          </select>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => window.location.reload()} className="text-[10px] font-bold text-gray-400 hover:text-black uppercase px-2">Reset</button>
        <button onClick={onAdd} className="bg-gray-900 text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-widest hover:bg-black transition-all">
          Create New +
        </button>
      </div>
    </div>
  );
}