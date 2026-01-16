// src/pages/devices/DeviceViewFields.jsx

// IMPORTACIONS
import { useState } from 'react';
import { formatType } from '../../utils/formatters';
// ESTILS GENERALS
const TABS_LAYOUT = "flex border-b border-gray-200 mb-6 gap-6";
const TAB_BASE = "pb-2 text-[11px] font-bold uppercase tracking-widest transition-all";
const TAB_ACTIVE = "border-b-2 border-gray-900 text-gray-900";
const TAB_INACTIVE = "text-gray-400 hover:text-gray-600";
// ESTILS DE FILA
const ROW_WRAPPER = "flex justify-between border-b border-gray-50 py-2.5";
const ROW_LABEL = "text-[10px] font-bold text-gray-400 uppercase";
const ROW_VAL = "text-sm text-gray-900 font-medium";

// ESTILS DE BLOC
const BLOCK_WRAPPER = "mt-4";
const TEXT_ITALIC = "text-sm text-gray-600 mt-1 italic";
const TEXT_MONO = "text-sm bg-gray-50 p-3 rounded mt-2 font-mono leading-relaxed";
const FOOTER_META = "mt-8 pt-4 border-t border-gray-100 text-[9px] text-gray-300 uppercase leading-loose";

/**
 * Component per visualitzar els detalls d'un dispositiu.
 * Organitza la informacio en pestanyes: General, Docs i Specs.
 */
export default function DeviceViewFields({ device }) {
  // ESTATS
  const [tab, setTab] = useState('General');
  
  /**
   * Component de fila per mostrar una etiqueta i el seu valor.
   * @param {Object} props - Propietats: label i val.
   */
  const Row = ({ label, val }) => (
    <div className={ROW_WRAPPER} role="definition">
      <span className={ROW_LABEL}>{label}</span>
      <span className={ROW_VAL}>{val || '—'}</span>
    </div>
  );
// RENDERITZAT
  return (
    <div>
      {/* NAVEGACIO PESTANYES */}
      <div className={TABS_LAYOUT} role="tablist" aria-label="Detalls del dispositiu">
        {['General', 'Docs', 'Specs'].map(t => (
          <button key={t} role="tab" aria-selected={tab === t} aria-controls={`panel-${t}`} id={`tab-${t}`} onClick={() => setTab(t)} className={`${TAB_BASE} ${tab === t ? TAB_ACTIVE : TAB_INACTIVE}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-1" id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {/* PESTANYA GENERAL */}
        {tab === 'General' && (
          <>
            <Row label="Owner" val={device.owner?.owner_name} />
            <Row label="Provider" val={device.provider?.name} />
            <Row label="Type" val={formatType(device.device_type)} />
            <Row label="Status" val={device.status} />
            <Row label="Inv. Number" val={device.inventory_number} />
            <Row label="Location" val={device.physical_location} />
            <div className={BLOCK_WRAPPER}>
              <span className={ROW_LABEL}>Notes</span>
              <p className={TEXT_ITALIC}>{device.notes}</p>
            </div>
            <div className={FOOTER_META}>
               Created: {device.created_at} <br/> Updated: {device.updated_at}
            </div>
          </>
        )}

        {/* PESTANYA DOCUMENTACIO */}
        {tab === 'Docs' && (
          <>
            <Row label="Contract" val={device.rental_contract?.contract_number} />
            <Row label="Warranty End" val={device.warranty_end_date} />
            <Row label="Purchase Date" val={device.purchase_date} />
            <Row label="Insured" val={device.is_insured ?
            'Yes' : 'No'} />
            <Row label="Leased" val={device.is_leased ?
            'Yes' : 'No'} />
          </>
        )}

        {/* PESTANYA ESPECIFICACIONS */}
        {tab === 'Specs' && (
          <>
            <Row label="Serial No." val={device.serial_number} />
            <div className={BLOCK_WRAPPER}>
              <span className={ROW_LABEL}>Specifications</span>
              <p className={TEXT_MONO}>{device.specifications}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}