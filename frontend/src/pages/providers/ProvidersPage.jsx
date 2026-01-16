// src/pages/providers/ProvidersPage.jsx

// IMPORTACIONS
import { useState } from 'react';
import { useGet } from '../../hooks/useApi';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import ProviderFormFields from './ProviderFormFields';
import ProviderViewFields from './ProviderViewFields';
import ActionsBar from './ActionsBar';
import { formatText } from '../../utils/formatters';

// ESTILS DE PAGINA
const PAGE_CONTAINER = "max-w-8xl mx-auto text-gray-900";
const PAGE_TITLE = "text-2xl font-bold tracking-tight text-gray-900";

// Ajustat per posar-se en columnes en mobils i posar-se en fila en pantalles grans
const CONTENT_LAYOUT = "flex flex-col lg:flex-row gap-6 items-start";

// ESTILS DE LLISTA
const LIST_CONTAINER = "flex-1 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col w-full";
const LIST_ITEMS = "divide-y divide-gray-100 min-h-[500px]";
const LOADING_MSG = "p-10 text-center text-xs text-gray-300 uppercase";

// Flex-wrap per evitar encavalcaments en pantalles estretes
const ITEM_BASE = "p-5 flex flex-wrap sm:flex-nowrap justify-between items-center cursor-pointer transition-all gap-4";
const ITEM_SELECTED = "bg-gray-200";
const ITEM_HOVER = "hover:bg-gray-100";
const ITEM_TITLE = "text-sm font-bold flex items-center gap-2";
const ITEM_SUBTITLE = "text-[10px] text-gray-400 uppercase tracking-widest";
const BADGE_INACTIVE = "text-[8px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded uppercase tracking-wider";

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
 * Pagina de gestio de proveidors. Permet llistar, filtrar, editar i esborrar proveidors.
 */
export default function ProvidersPage() {
  // ESTATS I API
  const [filters, setFilters] = useState({ page: 1, per_page: 10 });
  const { data: providers, loading, refresh, meta, deleteItem } = useGet('/providers', filters);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);

  const pag = meta?.pagination || { current_page: 1, last_page: 1 };

  // ACCIONS
  /**
   * Gestiona l'eliminacio d'un proveidor i neteja la seleccio si cal.
   * @param {number} id - ID del proveidor.
   */
  const handleDelete = async (id) => {
    await deleteItem(id);
    if (selected?.id === id) setSelected(null);
  };

  // RENDERITZAT
  return (
    <div className={PAGE_CONTAINER}>
      <div className="mb-4">
        <h1 className={PAGE_TITLE}>Providers Management</h1>
      </div>
      
      <ActionsBar filters={filters} setFilters={setFilters} onAdd={() => setEditing({})} />

      <div className={CONTENT_LAYOUT}>
        {/* LLISTA */}
        <div className={LIST_CONTAINER} role="region" aria-label="Llistat de proveidors">
          <div className={LIST_ITEMS} role="list">
            {loading ? <p className={LOADING_MSG} role="status">Loading...</p> : providers.map(provider => (
              <div key={provider.id} 
                onClick={() => setSelected(provider)}
                onKeyDown={(e) => e.key === 'Enter' && setSelected(provider)}
                role="listitem"
                tabIndex="0"
                aria-selected={selected?.id === provider.id}
                className={`${ITEM_BASE} ${selected?.id === provider.id ? ITEM_SELECTED : ITEM_HOVER}`}
              >
                <div className="min-w-0">
                  <h4 className={ITEM_TITLE}>
                    {provider.name}
                    {!provider.is_active && <span className={BADGE_INACTIVE}>Inactive</span>}
                  </h4>
                  <p className={ITEM_SUBTITLE}>
                    {formatText(provider.provider_type)} • {formatText(provider.contact_email, 'No Email')}
                  </p>
                </div>
                
                <div className={BTN_GROUP}>
                  <button onClick={(e) => { e.stopPropagation(); setEditing(provider); }} className={BTN_EDIT} aria-label={`Editar ${provider.name}`}>Edit</button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(provider.id); }} className={BTN_DEL} aria-label={`Esborrar ${provider.name}`}>Delete</button>
                </div>
              </div>
            ))}
          </div>

          <nav className={PAGINATION_BAR} aria-label="Navegacio de pagines">
            <button disabled={pag.current_page <= 1} onClick={() => setFilters({...filters, page: pag.current_page - 1})} className={PAG_BTN} aria-label="Pagina anterior">← Previous</button>
            <span className={PAG_INFO} aria-current="page">Page {pag.current_page} / {pag.last_page}</span>
            <button disabled={pag.current_page >= pag.last_page} onClick={() => setFilters({...filters, page: pag.current_page + 1})} className={PAG_BTN} aria-label="Pagina següent">Next →</button>
          </nav>
        </div>

        {/* DETALL DRETA */}
        <aside className={SIDE_PANEL} aria-labelledby="detail-title">
          <h2 id="detail-title" className={PANEL_TITLE}>{selected ? selected.name : "Select Provider"}</h2>
          {selected ? <ProviderViewFields provider={selected} /> : <p className={EMPTY_MSG}>Click a provider to see details</p>}
        </aside>
      </div>

      <Modal title={editing?.id ? "Edit Provider" : "Add Provider"} isOpen={!!editing} onClose={() => setEditing(null)}>
        <ProviderFormFields 
            initialData={editing?.id ? editing : null} 
            onSuccess={() => { setEditing(null); refresh(); }} 
            onCancel={() => setEditing(null)} 
        />
      </Modal>
    </div>
  );
}