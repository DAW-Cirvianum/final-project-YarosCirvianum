// src/pages/rentalContracts/ContractsPage.jsx

// IMPORTACIONS
import { useState } from 'react';
import { useGet } from '../../hooks/useApi';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import ContractFormFields from './ContractFormFields';
import ContractViewFields from './ContractViewFields';
import ActionsBar from './ActionsBar';
import { formatText } from '../../utils/formatters';

// ESTILS DE PAGINA
const PAGE_CONTAINER = "max-w-8xl mx-auto text-gray-900";
const PAGE_TITLE = "text-2xl font-bold tracking-tight text-gray-900";
// Ajustat per apilar-se en vertical en mobils
const CONTENT_LAYOUT = "flex flex-col lg:flex-row gap-6 items-start";

// ESTILS DE LLISTA
const LIST_CONTAINER = "flex-1 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col w-full";
const LIST_ITEMS = "divide-y divide-gray-100 min-h-[500px]";
const LOADING_MSG = "p-10 text-center text-xs text-gray-300 uppercase";
// Flex-wrap per evitar que els botons es trepitgin amb el text en pantalles estretes
const ITEM_BASE = "p-5 flex flex-wrap sm:flex-nowrap justify-between items-center cursor-pointer transition-all gap-4";
const ITEM_SELECTED = "bg-gray-200";
const ITEM_HOVER = "hover:bg-gray-100";
const ITEM_TITLE = "text-sm font-bold flex items-center";
const ITEM_SUBTITLE = "text-[10px] text-gray-400 uppercase tracking-widest";

// ESTILS DE BADGE (STATUS)
const BADGE_BASE = "text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-bold ml-2";
const STATUS_COLORS = {
  active: 'bg-green-100 text-green-700',
  expired: 'bg-red-100 text-red-700',
  terminated: 'bg-gray-100 text-gray-600',
  pending: 'bg-yellow-100 text-yellow-700',
  default: 'bg-gray-100 text-gray-500'
};

// ESTILS BOTONS
const BTN_GROUP = "flex gap-4 ml-auto";
const BTN_EDIT = "text-[10px] font-bold text-gray-400 hover:text-black uppercase transition-colors";
const BTN_DEL = "text-[10px] font-bold text-red-300 hover:text-red-600 uppercase transition-colors";

// ESTILS DETALL LATERAL
// Ample complet en mobil i fix a partir de lg
const SIDE_PANEL = "w-full lg:w-96 sticky top-4 bg-white border border-gray-200 rounded-lg p-4 shadow-sm h-fit";
const PANEL_TITLE = "text-lg font-bold mb-8 border-b border-gray-100 pb-4 truncate";
const EMPTY_MSG = "text-center py-20 text-xs text-gray-300 italic uppercase";

// ESTILS PAGINACIO
const PAGINATION_BAR = "p-4 bg-gray-50 flex justify-between items-center border-t border-gray-100";
const PAG_BTN = "text-[10px] font-bold uppercase disabled:opacity-20 hover:text-black";
const PAG_INFO = "text-[10px] font-bold text-gray-400 tracking-widest uppercase";

/**
 * Pagina principal per a la gestio de contractes de lloguer.
 * Permet visualitzar el llistat paginat i els detalls de cada contracte.
 */
export default function ContractsPage() {
  // ESTATS I API
  const [filters, setFilters] = useState({ page: 1, per_page: 10 });
  const { data: contracts, loading, refresh, meta, deleteItem } = useGet('/rental-contracts', filters);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);

  const pag = meta?.pagination || { current_page: 1, last_page: 1 };

  // ACCIONS
  /**
   * Gestiona l'eliminacio d'un contracte.
   * @param {number} id - Identificador del contracte a esborrar.
   */
  const handleDelete = async (id) => {
    await deleteItem(id);
    if (selected?.id === id) setSelected(null);
  };

  /**
   * Genera l'etiqueta d'estat amb els colors corresponents.
   * @param {string} status - L'estat del contracte.
   */
  const getStatusBadge = (status) => {
    const colorClass = STATUS_COLORS[status] || STATUS_COLORS.default;
    return <span className={`${BADGE_BASE} ${colorClass}`}>{status}</span>;
  };

  // RENDERITZAT
  return (
    <div className={PAGE_CONTAINER}>
      <div className="mb-4">
        <h1 className={PAGE_TITLE}>Rental Contracts</h1>
      </div>
      
      <ActionsBar filters={filters} setFilters={setFilters} onAdd={() => setEditing({})} />

      <div className={CONTENT_LAYOUT}>
        {/* LLISTA */}
        <div className={LIST_CONTAINER} role="region" aria-label="Llistat de contractes">
          <div className={LIST_ITEMS} role="list">
            {loading ? <p className={LOADING_MSG} role="status">Loading...</p> : contracts.map(c => (
              <div key={c.id} 
                onClick={() => setSelected(c)}
                onKeyDown={(e) => e.key === 'Enter' && setSelected(c)}
                role="listitem"
                tabIndex="0"
                aria-selected={selected?.id === c.id}
                className={`${ITEM_BASE} ${selected?.id === c.id ? ITEM_SELECTED : ITEM_HOVER}`}
              >
                <div className="min-w-0">
                  <h4 className={ITEM_TITLE}>
                    {c.name}
                    {getStatusBadge(c.status)}
                  </h4>
                  <p className={ITEM_SUBTITLE}>
                    {c.contract_number} • {formatText(c.provider?.name, 'No Provider')}
                  </p>
                </div>
                
                <div className={BTN_GROUP}>
                  <button onClick={(e) => { e.stopPropagation(); setEditing(c); }} className={BTN_EDIT} aria-label={`Editar contracte ${c.name}`}>Edit</button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }} className={BTN_DEL} aria-label={`Esborrar contracte ${c.name}`}>Delete</button>
                </div>
              </div>
            ))}
          </div>

          <nav className={PAGINATION_BAR} aria-label="Paginacio de contractes">
            <button disabled={pag.current_page <= 1} onClick={() => setFilters({...filters, page: pag.current_page - 1})} className={PAG_BTN} aria-label="Pagina anterior">← Previous</button>
            <span className={PAG_INFO} aria-current="page">Page {pag.current_page} / {pag.last_page}</span>
            <button disabled={pag.current_page >= pag.last_page} onClick={() => setFilters({...filters, page: pag.current_page + 1})} className={PAG_BTN} aria-label="Pagina següent">Next →</button>
          </nav>
        </div>

        {/* DETALL DRETA */}
        <aside className={SIDE_PANEL} aria-labelledby="detail-title">
          <h2 id="detail-title" className={PANEL_TITLE}>{selected ? selected.name : "Select Contract"}</h2>
          {selected ? <ContractViewFields contract={selected} /> : <p className={EMPTY_MSG}>Click a contract to see details</p>}
        </aside>
      </div>

      <Modal title={editing?.id ? "Edit Contract" : "Add Contract"} isOpen={!!editing} onClose={() => setEditing(null)}>
        <ContractFormFields 
            initialData={editing?.id ? editing : null} 
            onSuccess={() => { setEditing(null); refresh(); }} 
            onCancel={() => setEditing(null)} 
        />
      </Modal>
    </div>
  );
}