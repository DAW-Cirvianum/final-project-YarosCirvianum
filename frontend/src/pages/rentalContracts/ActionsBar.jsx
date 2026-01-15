// src/pages/rentalContracts/ActionsBar.jsx
import SelectSearch from "../../components/ui/SelectSearch";

export default function ActionsBar({ filters, setFilters, onAdd }) {
  const update = (key, val) => setFilters({ ...filters, [key]: val, page: 1 });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm flex items-end gap-4 text-gray-900">
      <div className="flex-1 grid grid-cols-4 gap-4">
        
        {/* Filter by Provider */}
        <SelectSearch 
            label="Provider" 
            url="/providers" 
            displayKey="name" 
            onSelect={(p) => update('provider_id', p.id)} 
        />

        {/* Filter by Status */}
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-gray-400 uppercase mb-1">Status</label>
          <select
            className="border border-gray-300 px-3 py-2 rounded text-xs outline-none focus:border-black bg-white"
            onChange={(e) => update('status', e.target.value)}
            value={filters.status || ""}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="terminated">Terminated</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Start Date Filter */}
        <div className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1">Start From</label>
            <input 
                type="date"
                className="border border-gray-300 px-3 py-2 rounded text-xs outline-none focus:border-black bg-white"
                onChange={(e) => update('start_from', e.target.value)}
                value={filters.start_from || ""}
            />
        </div>

         {/* End Date Filter */}
         <div className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1">End To</label>
            <input 
                type="date"
                className="border border-gray-300 px-3 py-2 rounded text-xs outline-none focus:border-black bg-white"
                onChange={(e) => update('end_to', e.target.value)}
                value={filters.end_to || ""}
            />
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