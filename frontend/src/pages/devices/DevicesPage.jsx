// src/pages/devices/DevicesPage.jsx
import { useState } from 'react';
import { useGet } from '../../hooks/useApi';
import Modal from '../../components/common/Modal';
import DeviceFormFields from './DeviceFormFields';
import DeviceViewFields from './DeviceViewFields';
import ActionsBar from './ActionsBar';

export default function DevicesPage() {
  const [filters, setFilters] = useState({ page: 1, per_page: 10 });
  const { data: devices, loading, refresh, meta } = useGet('/devices', filters);
  const [selected, setSelected] = useState(null); // Res seleccionat al principi
  const [editing, setEditing] = useState(null);

  const pag = meta?.pagination || { current_page: 1, last_page: 1 };

  return (
    <div className="max-w-7xl mx-auto text-gray-900">
      <ActionsBar filters={filters} setFilters={setFilters} onAdd={() => setEditing({})} />

      <div className="flex gap-10 items-start">
        {/* LLISTA */}
        <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
          <div className="divide-y divide-gray-100 min-h-[500px]">
            {loading ? <p className="p-10 text-center text-xs text-gray-300 uppercase">Loading...</p> : 
              devices.map(d => (
                <div key={d.id} onClick={() => setSelected(d)} 
                  className={`p-5 flex justify-between items-center cursor-pointer border-l-4 transition-all ${
                    selected && selected.id === d.id 
                      ? 'bg-gray-100 border-black' 
                      : 'bg-white border-transparent hover:bg-gray-50/50'
                  }`}>
                  <div>
                    <h4 className="text-sm font-bold">{d.brand} {d.model}</h4>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">{d.device_type} • {d.serial_number}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setEditing(d); }} className="text-[10px] font-bold text-gray-300 hover:text-black uppercase">Edit</button>
                </div>
              ))
            }
          </div>
          
          {/* PAGINACIÓ */}
          <div className="p-4 bg-gray-50 flex justify-between items-center border-t border-gray-100">
            <button disabled={pag.current_page <= 1} onClick={() => setFilters({...filters, page: pag.current_page - 1})} className="text-[10px] font-bold uppercase disabled:opacity-20 hover:text-black">← Previous</button>
            <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Page {pag.current_page} / {pag.last_page}</span>
            <button disabled={pag.current_page >= pag.last_page} onClick={() => setFilters({...filters, page: pag.current_page + 1})} className="text-[10px] font-bold uppercase disabled:opacity-20 hover:text-black">Next →</button>
          </div>
        </div>

        {/* DETALL DRETA (FIXAT) */}
        <div className="w-96 sticky top-4 bg-white border border-gray-200 rounded-lg p-8 shadow-sm h-fit">
          <h2 className="text-lg font-bold mb-8 border-b border-gray-100 pb-4 truncate">
            {selected ? `${selected.brand} ${selected.model}` : "Select Device"}
          </h2>
          {selected ? <DeviceViewFields device={selected} /> : <p className="text-center py-20 text-xs text-gray-300 italic uppercase">Click a device to see details</p>}
        </div>
      </div>

      <Modal title={editing?.id ? "Edit Device" : "Add Device"} isOpen={!!editing} onClose={() => setEditing(null)}>
        <DeviceFormFields initialData={editing?.id ? editing : null} onSuccess={() => { setEditing(null); refresh(); }} />
      </Modal>
    </div>
  );
}