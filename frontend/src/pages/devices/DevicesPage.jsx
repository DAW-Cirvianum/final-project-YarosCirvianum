// src/pages/devices/DevicesPage.jsx
import { useState } from 'react';
import { useGet } from '../../hooks/useApi';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import DeviceFormFields from './DeviceFormFields';
import DeviceViewFields from './DeviceViewFields';
import ActionsBar from './ActionsBar';
// 1. IMPORTAR EL FORMATTER
import { formatType } from '../../utils/formatters';

export default function DevicesPage() {
  const [filters, setFilters] = useState({ page: 1, per_page: 10 });
  const { data: devices, loading, refresh, meta } = useGet('/devices', filters);
  const [selected, setSelected] = useState(null); 
  const [editing, setEditing] = useState(null);

  const pag = meta?.pagination || { current_page: 1, last_page: 1 };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this device?")) return;
    try {
      await api.delete(`/devices/${id}`);
      if (selected?.id === id) setSelected(null);
      refresh();
    } catch (error) {
      alert("Error deleting device.");
    }
  };

  return (
    <div className="max-w-8xl mx-auto text-gray-900">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Devices Management</h1>
      </div>
      <ActionsBar filters={filters} setFilters={setFilters} onAdd={() => setEditing({})} />

      <div className="flex gap-6 items-start">
        {/* LLISTA */}
        <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
          <div className="divide-y divide-gray-100 min-h-[500px]">
            {loading ? <p className="p-10 text-center text-xs text-gray-300 uppercase">Loading...</p> :
              devices.map(d => (
                <div key={d.id} onClick={() => setSelected(d)}
                  className={`p-5 flex justify-between items-center cursor-pointer transition-all ${
                    selected && selected.id === d.id
                      ? 'bg-gray-200'
                      : 'hover:bg-gray-100/100 active: ???'
                  }`}>
                  <div>
                    <h4 className="text-sm font-bold">{d.brand} {d.model}</h4>
                    
                    {/* 2. APLICAR EL FORMATTER AQUÍ */}
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                      {formatType(d.device_type)} • {d.serial_number}
                    </p>
                  </div>
                  
                  {/* BOTONS D'ACCIÓ */}
                  <div className="flex gap-4">
                    <button 
                        onClick={(e) => { e.stopPropagation(); setEditing(d); }} 
                        className="text-[10px] font-bold text-gray-400 hover:text-black uppercase transition-colors"
                    >
                        Edit
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(d.id); }} 
                        className="text-[10px] font-bold text-red-300 hover:text-red-600 uppercase transition-colors"
                    >
                        Delete
                    </button>
                  </div>

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
        <div className="w-96 sticky top-4 bg-white border border-gray-200 rounded-lg p-4 shadow-sm h-fit">
          <h2 className="text-lg font-bold mb-8 border-b border-gray-100 pb-4 truncate">
            {selected ? `${selected.brand} ${selected.model}` : "Select Device"}
          </h2>
          {selected ? <DeviceViewFields device={selected} /> : <p className="text-center py-20 text-xs text-gray-300 italic uppercase">Click a device to see details</p>}
        </div>
      </div>

        <Modal
        title={editing?.id ? "Edit Device" : "Add Device"}
        isOpen={!!editing}
        onClose={() => setEditing(null)}
        >
        <DeviceFormFields
            initialData={editing?.id ? editing : null}
            onSuccess={() => { setEditing(null); refresh(); }}
            onCancel={() => setEditing(null)} />
        </Modal>
    </div>
  );
}