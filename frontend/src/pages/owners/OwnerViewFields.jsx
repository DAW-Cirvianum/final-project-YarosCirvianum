// src/pages/owners/OwnerViewFields.jsx

// IMPORTACIONS
import { useState } from "react";

// ESTILS GENERALS
const TAB_LAYOUT = "flex border-b border-gray-200 mb-6 gap-6 overflow-x-auto";
const TAB_BASE = "pb-2 text-[11px] font-bold uppercase tracking-widest transition-all whitespace-nowrap";
const TAB_ACTIVE = "border-b-2 border-gray-900 text-gray-900";
const TAB_INACTIVE = "text-gray-400 hover:text-gray-600";

// ESTILS DE FILA
const ROW_BOX = "flex justify-between border-b border-gray-50 py-2.5 gap-2";
const ROW_LABEL = "text-[10px] font-bold text-gray-400 uppercase flex-shrink-0";
const ROW_VAL = "text-sm text-gray-900 font-medium text-right truncate max-w-[180px] sm:max-w-none";
const FOOTER_META = "mt-8 pt-4 border-t border-gray-100 text-[9px] text-gray-300 uppercase leading-loose";

/**
 * Component per mostrar els detalls d'un propietari organitzats per pestanyes.
 * @param {Object} props - Propietats del component.
 * @param {Object} props.owner - Objecte amb les dades del propietari.
 */
export default function OwnerViewFields({ owner }) {
  // ESTATS
  const [tab, setTab] = useState("General");

  /**
   * Helper per renderitzar una fila de dades.
   */
  const Row = ({ label, val }) => (
    <div className={ROW_BOX} role="group" aria-label={label}>
      <span className={ROW_LABEL}>{label}</span>
      <span className={ROW_VAL} title={val}>{val || "—"}</span>
    </div>
  );

  // RENDERITZAT
  return (
    <div className="w-full">
      {/* TABS */}
      <div className={TAB_LAYOUT} role="tablist" aria-label="Seccions d'informacio">
        {["General", "Contact"].map((t) => (
          <button 
            key={t} 
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

      {/* CONTINGUT */}
      <div 
        className="space-y-1" 
        id={`panel-${tab}`}
        role="tabpanel" 
        aria-labelledby={`tab-${tab}`}
      >
        {tab === "General" && (
          <>
            <Row label="Name" val={owner.owner_name} />
            <Row label="Department" val={owner.department} />
            <Row label="Location" val={owner.location} />
            <Row label="Employee Code" val={owner.employee_code} />
            <Row label="Status" val={owner.is_active ? "Active" : "Inactive"} />
            <div className={FOOTER_META} role="note" aria-label="Metadades del registre">
              Created: {owner.created_at} <br /> Updated: {owner.updated_at}
            </div>
          </>
        )}

        {tab === "Contact" && (
          <>
            <Row label="Email" val={owner.email} />
            <Row label="Extension" val={owner.extension} />
            <Row label="Phone" val={owner.phone} />
          </>
        )}
      </div>
    </div>
  );
}