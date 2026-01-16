// src/pages/rentalContracts/ActionsBar.jsx

// IMPORTACIONS
import SelectSearch from "../../components/ui/SelectSearch";

// ESTILS
// Ajustat per apilar-se en vertical en mobils i en horitzontal a partir de md
const BAR_CONTAINER = "bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm flex flex-col md:flex-row items-stretch md:items-end gap-4 text-gray-900";
// Graella adaptativa: 1 columna en mobil, 2 en tablets i 4 en escriptori
const GRID_LAYOUT = "flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4";
const FIELD_COL = "flex flex-col";
const LABEL_STYLE = "text-[10px] font-bold text-gray-400 uppercase mb-1";
const INPUT_STYLE = "border border-gray-300 px-3 py-2 rounded text-xs outline-none focus:border-black bg-white";
const BTN_GROUP = "flex gap-2 justify-end";
const BTN_RESET = "text-[10px] font-bold text-gray-400 hover:text-black uppercase px-2";
const BTN_ADD = "bg-gray-900 text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-widest hover:bg-black transition-all";

/**
 * Component de barra d'accions per cercar i filtrar contractes de lloguer.
 * @param {Object} props - Propietats: filters, setFilters i la funcio onAdd.
 */
export default function ActionsBar({ filters, setFilters, onAdd }) {
  // LOGICA
  const update = (key, val) => setFilters({ ...filters, [key]: val, page: 1 });

  // RENDERITZAT
  return (
    <div className={BAR_CONTAINER} role="search" aria-label="Filtres de cerca de contractes">
      <div className={GRID_LAYOUT}>
        
        {/* FILTRE PROVIDER */}
        <SelectSearch 
            label="Provider" 
            url="/providers" 
            displayKey="name" 
            onSelect={(p) => update('provider_id', p.id)} 
            aria-label="Seleccionar proveidor"
        />

        {/* FILTRE STATUS */}
        <div className={FIELD_COL}>
          <label htmlFor="status-filter" className={LABEL_STYLE}>Status</label>
          <select 
            id="status-filter"
            className={INPUT_STYLE} 
            onChange={(e) => update('status', e.target.value)} 
            value={filters.status || ""}
            aria-label="Filtrar per estat del contracte"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="terminated">Terminated</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* DATA INICI */}
        <div className={FIELD_COL}>
            <label htmlFor="start-filter" className={LABEL_STYLE}>Start From</label>
            <input 
                id="start-filter"
                type="date"
                className={INPUT_STYLE}
                onChange={(e) => update('start_from', e.target.value)}
                value={filters.start_from || ""}
                aria-label="Filtrar per data d'inici"
            />
        </div>

         {/* DATA FI */}
         <div className={FIELD_COL}>
            <label htmlFor="end-filter" className={LABEL_STYLE}>End To</label>
            <input 
                id="end-filter"
                type="date"
                className={INPUT_STYLE}
                onChange={(e) => update('end_to', e.target.value)}
                value={filters.end_to || ""}
                aria-label="Filtrar per data de finalitzacio"
            />
        </div>
      </div>

      <div className={BTN_GROUP}>
        <button onClick={() => window.location.reload()} className={BTN_RESET} aria-label="Netejar tots els filtres">Reset</button>
        <button onClick={onAdd} className={BTN_ADD} aria-label="Afegir nou contracte">Create New +</button>
      </div>
    </div>
  );
}