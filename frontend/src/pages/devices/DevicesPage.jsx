// src/pages/devices/DevicesPage.jsx

// IMPORTACIONS
import { useState } from 'react';
import { useGet } from '../../hooks/useApi';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import DeviceFormFields from './DeviceFormFields';
import DeviceViewFields from './DeviceViewFields';
import ActionsBar from './ActionsBar';
import { formatType } from '../../utils/formatters';

// ESTILS DE PAGINA
const PAGE_CONTAINER = "max-w-8xl mx-auto text-gray-900";
const PAGE_TITLE = "text-2xl font-bold tracking-tight text-gray-900";
const CONTENT_LAYOUT = "flex flex-col lg:flex-row gap-6 items-start";

// ESTILS DE LLISTA
const LIST_CONTAINER = "flex-1 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col";
const LIST_ITEMS = "divide-y divide-gray-100 min-h-[500px]";
const LOADING_MSG = "p-10 text-center text-xs text-gray-300 uppercase";
const ITEM_BASE = "p-5 flex justify-between items-center cursor-pointer transition-all";
const ITEM_SELECTED = "bg-gray-200";
const ITEM_HOVER = "hover:bg-gray-100";
const ITEM_TITLE = "text-sm font-bold";
const ITEM_SUBTITLE = "text-[10px] text-gray-400 uppercase tracking-widest";

// ESTILS BOTONS
const BTN_GROUP = "flex gap-4";
const BTN_EDIT = "text-[10px] font-bold text-gray-400 hover:text-black uppercase transition-colors";
const BTN_DEL = "text-[10px] font-bold text-red-300 hover:text-red-600 uppercase transition-colors";

// ESTILS DETALL LATERAL
const SIDE_PANEL = "w-full lg:w-96 sticky top-4 bg-white border border-gray-200 rounded-lg p-4 shadow-sm h-fit";
const PANEL_TITLE = "text-lg font-bold mb-8 border-b border-gray-100 pb-4 truncate";
const EMPTY_MSG = "text-center py-20 text-xs text-gray-300 italic uppercase";

// ESTILS PAGINACIO
const PAGINATION_BAR = "p-4 bg-gray-50 flex justify-between items-center border-t border-gray-100";
const PAG_BTN = "text-[10px] font-bold uppercase disabled:opacity-20 hover:text-black";
const PAG_INFO = "text-[10px] font-bold text-gray-400 tracking-widest uppercase";

/**
 * Component principal de la pagina de gestio de dispositius.
 * Gestiona el llistat, la paginacio i la seleccio d'elements.
 */
export default function DevicesPage() {
  // ESTATS I API
  const [filters, setFilters] = useState({ page: 1, per_page: 10 });
  const { data: devices, loading, refresh, meta, deleteItem } = useGet('/devices', filters);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);

  const pag = meta?.pagination || { current_page: 1, last_page: 1 };
  
  /**
   * Executa l'esborrat d'un dispositiu i actualitza l'estat local.
   * @param {number} id - Identificador unic del dispositiu.
   */
  const handleDelete = (id) => {
    // Fem servir la funció que ja porta la notificació i el refresh incorporats
    deleteItem(id, "Are you sure you want to delete this device?");
    // Mantenim la teva lògica de netejar la selecció
    if (selected?.id === id) setSelected(null);
  };
  // RENDERITZAT
  return (
    <div className={PAGE_CONTAINER}>
      <div className="mb-4">
        <h1 className={PAGE_TITLE}>Devices Management</h1>
      </div>

      <ActionsBar filters={filters} setFilters={setFilters} onAdd={() => setEditing({})} />

      <div className={CONTENT_LAYOUT}>
        {/* LLISTA */}
        <div className={LIST_CONTAINER} role="region" aria-label="Llistat de dispositius">
          <div className={LIST_ITEMS} role="list">
            {loading ? <p className={LOADING_MSG} role="status">Loading...</p> : devices.map(d => (
              <div key={d.id} onClick={() => setSelected(d)} role="listitem" tabIndex="0" aria-selected={selected?.id === d.id} onKeyDown={(e) => e.key === 'Enter' && setSelected(d)}
                className={`${ITEM_BASE} ${selected?.id === d.id ? ITEM_SELECTED : ITEM_HOVER}`}>
                <div>
                  <h4 className={ITEM_TITLE}>{d.brand} {d.model}</h4>
                  <p className={ITEM_SUBTITLE}>{formatType(d.device_type)} • {d.serial_number}</p>
                </div>

                <div className={BTN_GROUP}>
                  <button onClick={(e) => { e.stopPropagation();
                  setEditing(d); }} className={BTN_EDIT} aria-label={`Editar ${d.brand}`}>Edit</button>
                  <button onClick={(e) => { e.stopPropagation();
                  handleDelete(d.id); }} className={BTN_DEL} aria-label={`Eliminar ${d.brand}`}>Delete</button>
                </div>
              </div>
            ))}
          </div>

          <div className={PAGINATION_BAR} role="navigation" aria-label="Paginació">
            <button disabled={pag.current_page <= 1} onClick={() => setFilters({...filters, page: pag.current_page - 1})} className={PAG_BTN} aria-label="Pàgina anterior">← Previous</button>
            <span className={PAG_INFO} aria-current="page">Page {pag.current_page} / {pag.last_page}</span>
            <button disabled={pag.current_page >= pag.last_page} onClick={() => setFilters({...filters, page: pag.current_page + 1})} className={PAG_BTN} aria-label="Pàgina següent">Next →</button>
          </div>
        </div>

        {/* DETALL DRETA */}
        <div className={SIDE_PANEL} role="complementary" aria-labelledby="detail-title">
          <h2 id="detail-title" className={PANEL_TITLE}>{selected ?
          `${selected.brand} ${selected.model}` : "Select Device"}</h2>
          {selected ?
          <DeviceViewFields device={selected} /> : <p className={EMPTY_MSG}>Click a device to see details</p>}
        </div>
      </div>

      <Modal title={editing?.id ? "Edit Device" : "Add Device"} isOpen={!!editing} onClose={() => setEditing(null)}>
        <DeviceFormFields
            initialData={editing?.id ?
            editing : null}
            onSuccess={() => { setEditing(null); refresh();
            }}
            onCancel={() => setEditing(null)}
        />
      </Modal>
    </div>
  );
}