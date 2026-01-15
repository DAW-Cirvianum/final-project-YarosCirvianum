// src/pages/rentalContracts/ContractsPage.jsx
import { useState } from 'react';
import { useGet } from '../../hooks/useApi';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import ContractFormFields from './ContractFormFields';
import ContractViewFields from './ContractViewFields';
import ActionsBar from './ActionsBar';
import { formatText } from '../../utils/formatters';

export default function ContractsPage() {
  const [filters, setFilters] = useState({ page: 1, per_page: 10 });
  const { data: contracts, loading, refresh, meta } = useGet('/rental-contracts', filters);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);

  const pag = meta?.pagination || { current_page: 1, last_page: 1 };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contract?")) return;
    try {
      await api.delete(`/rental-contracts/${id}`);
      if (selected?.id === id) setSelected(null);
      refresh();
    } catch (error) {
      alert("Error deleting contract. It might have linked devices.");
    }
  };

  const getStatusBadge = (status) => {
      const styles = {
          active: 'bg-green-100 text-green-700',
          expired: 'bg-red-100 text-red-700',
          terminated: 'bg-gray-100 text-gray-600',
          pending: 'bg-yellow-100 text-yellow-700'
      };
      const klass = styles[status] || 'bg-gray-100 text-gray-500';
      return <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-bold ml-2 ${klass}`}>{status}</span>;
  };

  return (
    <div className="max-w-8xl mx-auto text-gray-900">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Rental Contracts</h1>
      </div>
      
      <ActionsBar filters={filters} setFilters={setFilters} onAdd={() => setEditing({})} />

      <div className="flex gap-6 items-start">
        {/* LLISTA */}
        <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
          <div className="divide-y divide-gray-100 min-h-[500px]">
            {loading ? <p className="p-10 text-center text-xs text-gray-300 uppercase">Loading...</p> :
              contracts.map(c => (
                <div key={c.id} onClick={() => setSelected(c)}
                  className={`p-5 flex justify-between items-center cursor-pointer transition-all ${
                    selected && selected.id === c.id
                      ? 'bg-gray-200'
                      : 'hover:bg-gray-100'
                  }`}>
                  <div>
                    <h4 className="text-sm font-bold flex items-center">
                      {c.name}
                      {getStatusBadge(c.status)}
                    </h4>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                      {c.contract_number} • {formatText(c.provider?.name, 'No Provider')}
                    </p>
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                        onClick={(e) => { e.stopPropagation(); setEditing(c); }} 
                        className="text-[10px] font-bold text-gray-400 hover:text-black uppercase transition-colors"
                    >
                        Edit
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }} 
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

        {/* DETALL */}
        <div className="w-96 sticky top-4 bg-white border border-gray-200 rounded-lg p-4 shadow-sm h-fit">
          <h2 className="text-lg font-bold mb-8 border-b border-gray-100 pb-4 truncate">
            {selected ? selected.name : "Select Contract"}
          </h2>
          {selected ? <ContractViewFields contract={selected} /> : <p className="text-center py-20 text-xs text-gray-300 italic uppercase">Click a contract to see details</p>}
        </div>
      </div>

      <Modal
        title={editing?.id ? "Edit Contract" : "Add Contract"}
        isOpen={!!editing}
        onClose={() => setEditing(null)}
      >
        <ContractFormFields
          initialData={editing?.id ? editing : null}
          onSuccess={() => { setEditing(null); refresh(); }}
          onCancel={() => setEditing(null)}
        />
      </Modal>
    </div>
  );
}