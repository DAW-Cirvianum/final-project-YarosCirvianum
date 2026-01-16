// src/pages/devices/ActionsBar.jsx
import SelectSearch from "../../components/ui/SelectSearch";
import { formatType } from "../../utils/formatters";
// CONSTANTS
const DEVICE_TYPES = ['laptop', 'desktop', 'tablet', 'phone', 'mouse', 'keyboard', 'mouse_keyboard'];
// ESTILS
const BAR_CONTAINER = "bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm flex flex-col md:flex-row items-stretch md:items-end gap-4 text-gray-900";
const GRID_LAYOUT = "flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4";
const FIELD_WRAPPER = "flex flex-col";
const LABEL_STYLE = "text-[10px] font-bold text-gray-400 uppercase mb-1";
const SELECT_STYLE = "border border-gray-300 px-3 py-2 rounded text-xs outline-none focus:border-black bg-white";
const BTN_GROUP = "flex gap-2 justify-end";
const RESET_BTN = "text-[10px] font-bold text-gray-400 hover:text-black uppercase px-2";
const ADD_BTN = "bg-gray-900 text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-widest hover:bg-black transition-all whitespace-nowrap";

/**
 * Component que renderitza la barra d'accions amb filtres i cerca per a dispositius.
 * @param {Object} props Propietats del component.
 * @param {Object} props.filters Estats dels filtres actuals.
 * @param {Function} props.setFilters Funció per actualitzar els filtres.
 * @param {Function} props.onAdd Funció per activar la creació d'un nou element.
 */

export default function ActionsBar({ filters, setFilters, onAdd }) {
  /** Actualitza un criteri de filtre i reinicia la pàgina a 1. @param {string} key @param {any} val */
  const update = (key, val) => setFilters({ ...filters, [key]: val, page: 1 });
  return (
    <div className={BAR_CONTAINER} role="search" aria-label="Filtres de cerca de dispositius">
      <div className={GRID_LAYOUT}>
        <SelectSearch label="Owner" url="/owners" displayKey="owner_name" onSelect={(o) => update('owner_id', o?.id)} />
        <SelectSearch label="Provider" url="/providers" displayKey="name" onSelect={(p) => update('provider_id', p?.id)} />
        <SelectSearch label="Contract" url="/rental-contracts" displayKey="contract_number" onSelect={(c) => update('rental_contract_id', c?.id)} />
        <div className={FIELD_WRAPPER}>
          <label htmlFor="device-type-select" className={LABEL_STYLE}>Type</label>
          <select id="device-type-select" className={SELECT_STYLE} onChange={(e) => update('device_type', e.target.value)} value={filters.device_type || ""} aria-label="Filtrar per tipus de dispositiu">
            <option value="">All Types</option>
            {DEVICE_TYPES.map(t => <option key={t} value={t}>{formatType(t)}</option>)}
          </select>
        </div>
      </div>
      <div className={BTN_GROUP}>
        <button onClick={() => window.location.reload()} className={RESET_BTN} aria-label="Reiniciar tots els filtres">Reset</button>
        <button onClick={onAdd} className={ADD_BTN} aria-label="Crear nou dispositiu">Create New +</button>
      </div>
    </div>
  );
}