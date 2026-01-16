// src/pages/providers/ProviderViewFields.jsx

// IMPORTACIONS
import { useState } from "react";
import { formatText } from "../../utils/formatters";

// ESTILS GENERALS
// Permetem scroll horitzontal en pestanyes si no caben en pantalla
const TAB_LAYOUT = "flex border-b border-gray-200 mb-6 gap-6 overflow-x-auto";
const TAB_BASE = "pb-2 text-[11px] font-bold uppercase tracking-widest transition-all whitespace-nowrap";
const TAB_ACTIVE = "border-b-2 border-gray-900 text-gray-900";
const TAB_INACTIVE = "text-gray-400 hover:text-gray-600";

// ESTILS DE FILA
const ROW_BOX = "flex justify-between border-b border-gray-50 py-2.5 gap-4";
const ROW_LABEL = "text-[10px] font-bold text-gray-400 uppercase flex-shrink-0";
const ROW_VAL = "text-sm text-gray-900 font-medium text-right truncate max-w-[200px] sm:max-w-none";
const LINK_STYLE = "text-blue-600 hover:underline";

// ESTILS DE BLOC DE TEXT
const BLOCK_WRAPPER = "mt-4";
const TEXT_NORMAL = "text-sm text-gray-600 mt-1";
const TEXT_ITALIC = "text-sm text-gray-600 mt-1 italic";
const FOOTER_META = "mt-8 pt-4 border-t border-gray-100 text-[9px] text-gray-300 uppercase leading-loose";

/**
 * Component per mostrar els detalls d'un proveidor organitzats per pestanyes.
 * @param {Object} props - Propietats del component.
 * @param {Object} props.provider - Objecte amb les dades del proveidor.
 */
export default function ProviderViewFields({ provider }) {
  // ESTATS
  const [tab, setTab] = useState("General");

  /**
   * Helper intern per renderitzar una fila de dades amb etiqueta i valor.
   */
  const Row = ({ label, val, isLink }) => (
    <div className={ROW_BOX} role="group" aria-label={label}>
      <span className={ROW_LABEL}>{label}</span>
      <span className={ROW_VAL}>
        {isLink && val ? (<a href={val.startsWith('http') ? val : `https://${val}`} target="_blank" rel="noopener noreferrer" className={LINK_STYLE} aria-label={`Visitar lloc web de ${label}`}> {val} </a>) : (val || "—" )}
      </span>
    </div>
  );

  // RENDERITZAT
  return (
    <div>
      {/* NAVEGACIO TABS */}
      <div className={TAB_LAYOUT} role="tablist" aria-label="Seccions de detalls del proveidor">
        {["General", "Contact", "Details"].map((t) => (
          <button 
            key={t} 
            id={`tab-${t}`}
            role="tab"
            aria-selected={tab === t}
            aria-controls={`panel-${t}`}
            onClick={() => setTab(t)} 
            className={`${TAB_BASE} ${tab === t ? TAB_ACTIVE : TAB_INACTIVE}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-1" 
           id={`panel-${tab}`} 
           role="tabpanel" 
           aria-labelledby={`tab-${tab}`}>
        
        {/* PESTANYA GENERAL */}
        {tab === "General" && (
          <>
            <Row label="Company Name" val={provider.name} />
            <Row label="Tax ID" val={provider.tax_id} />
            <Row label="Type" val={provider.provider_type} />
            <Row label="Website" val={provider.website} isLink />
            <Row label="Status" val={provider.is_active ? "Active" : "Inactive"} />

            <div className={FOOTER_META} role="note" aria-label="Dates del registre">
              Created: {provider.created_at} <br /> Updated: {provider.updated_at}
            </div>
          </>
        )}

        {/* PESTANYA CONTACTE */}
        {tab === "Contact" && (
          <>
            <Row label="Contact Person" val={provider.contact_person} />
            <Row label="Email" val={provider.contact_email} />
            <Row label="Phone" val={provider.contact_phone} />
            <div className={BLOCK_WRAPPER} role="group" aria-label="Adreça">
                <span className={ROW_LABEL}>Address</span>
                <p className={TEXT_NORMAL}>{formatText(provider.address)}</p>
            </div>
          </>
        )}

        {/* PESTANYA DETALLS */}
        {tab === "Details" && (
            <>
             <Row label="Active Contracts" val={provider.active_contracts_count} />
             <Row label="Total Devices" val={provider.devices_count} />
             <div className={BLOCK_WRAPPER} role="group" aria-label="Notes">
              <span className={ROW_LABEL}>Notes</span>
              <p className={TEXT_ITALIC}>{formatText(provider.notes)}</p>
            </div>
            </>
        )}
      </div>
    </div>
  );
}