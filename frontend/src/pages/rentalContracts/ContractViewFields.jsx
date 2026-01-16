// src/pages/rentalContracts/ContractViewFields.jsx

// IMPORTACIONS
import { useState } from "react";
import { formatText } from "../../utils/formatters";

// ESTILS GENERALS
// Afegit overflow-x-auto per a millor responsive en pestanyes
const TAB_LAYOUT = "flex border-b border-gray-200 mb-6 gap-6 overflow-x-auto";
const TAB_BASE = "pb-2 text-[11px] font-bold uppercase tracking-widest transition-all whitespace-nowrap";
const TAB_ACTIVE = "border-b-2 border-gray-900 text-gray-900";
const TAB_INACTIVE = "text-gray-400 hover:text-gray-600";

// ESTILS DE FILA
const ROW_BOX = "flex justify-between border-b border-gray-50 py-2.5 gap-2";
const ROW_LABEL = "text-[10px] font-bold text-gray-400 uppercase flex-shrink-0";
const ROW_VAL = "text-sm text-gray-900 font-medium text-right truncate max-w-[200px] sm:max-w-none";

// ESTILS DE BLOC TEXT
const BLOCK_WRAPPER = "mt-4";
const TEXT_ITALIC = "text-sm text-gray-600 mt-1 italic";
const FOOTER_META = "mt-8 pt-4 border-t border-gray-100 text-[9px] text-gray-300 uppercase leading-loose";

// COLORS D'ESTAT
const STATUS_STYLES = {
  active: 'text-green-600 font-bold uppercase text-xs',
  expired: 'text-red-500 font-bold uppercase text-xs',
  terminated: 'text-gray-500 font-bold uppercase text-xs',
  pending: 'text-yellow-600 font-bold uppercase text-xs',
  default: 'text-gray-900'
};

/**
 * Component per veure els detalls d'un contracte organitzats en pestanyes.
 * @param {Object} props - Propietats del component.
 * @param {Object} props.contract - Objecte amb la informacio del contracte.
 */
export default function ContractViewFields({ contract }) {
  // ESTATS
  const [tab, setTab] = useState("General");

  /**
   * Component auxiliar per mostrar una fila de dades.
   */
  const Row = ({ label, val }) => (
    <div className={ROW_BOX} role="group" aria-label={label}>
      <span className={ROW_LABEL}>{label}</span>
      <span className={ROW_VAL}>{val || "—"}</span>
    </div>
  );

  const getStatusClass = (status) => STATUS_STYLES[status] || STATUS_STYLES.default;

  // RENDERITZAT
  return (
    <div>
      {/* NAVEGACIO TABS */}
      <div className={TAB_LAYOUT} role="tablist" aria-label="Seccions de dades del contracte">
        {["General", "Financial", "Details"].map((t) => (
          <button key={t} 
            id={`tab-${t}`}
            role="tab"
            aria-selected={tab === t}
            aria-controls={`panel-${t}`}
            onClick={() => setTab(t)} 
            className={`${TAB_BASE} ${tab === t ? TAB_ACTIVE : TAB_INACTIVE}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-1" id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`}>
        
        {/* PESTANYA GENERAL */}
        {tab === "General" && (
          <>
            <Row label="Contract Name" val={contract.name} />
            <Row label="Code" val={contract.contract_number} />
            <Row label="Provider" val={contract.provider?.name} />
            
            {/* Custom Row per Status amb color */}
            <div className={ROW_BOX} role="group" aria-label="Estat">
                <span className={ROW_LABEL}>Status</span>
                <span className={getStatusClass(contract.status)} role="status">{contract.status}</span>
            </div>
            
            <div className={FOOTER_META} role="note" aria-label="Metadades">
              Created: {contract.created_at} <br /> Updated: {contract.updated_at}
            </div>
          </>
        )}

        {/* PESTANYA FINANCERA */}
        {tab === "Financial" && (
          <>
            <Row label="Monthly Cost" val={contract.monthly_cost ? `${contract.monthly_cost} €` : null} />
            <Row label="Start Date" val={contract.start_date} />
            <Row label="End Date" val={contract.end_date} />
            <Row label="Cost To Date" val={contract.total_cost_to_date ? `${contract.total_cost_to_date} €` : null} />
            
            <div className={BLOCK_WRAPPER} role="group" aria-label="Estat de caducitat">
                <span className={ROW_LABEL}>Is Expired?</span>
                <p className={`text-sm mt-1 font-bold ${contract.is_expired ? 'text-red-500' : 'text-green-600'}`}>
                    {contract.is_expired ? 'YES' : 'NO'}
                </p>
            </div>
          </>
        )}

        {/* PESTANYA DETALLS */}
        {tab === "Details" && (
            <>
            <Row label="Assigned Devices" val={contract.devices_count} />
            <Row label="Active Devices" val={contract.active_devices_count} />
            <div className={BLOCK_WRAPPER} role="group" aria-label="Termes">
              <span className={ROW_LABEL}>Terms</span>
              <p className={TEXT_ITALIC}>{formatText(contract.terms)}</p>
            </div>
            
            <div className={BLOCK_WRAPPER} role="group" aria-label="Notes">
              <span className={ROW_LABEL}>Notes</span>
              <p className={TEXT_ITALIC}>{formatText(contract.notes)}</p>
            </div>
            </>
        )}
      </div>
    </div>
  );
}