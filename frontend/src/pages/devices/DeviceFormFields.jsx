// src/pages/devices/DeviceFormFields.jsx

// IMPORTACIONS
import { useState } from 'react';
import { useSubmit } from '../../hooks/useSubmit';
import SelectSearch from '../../components/ui/SelectSearch';
import { formatType } from '../../utils/formatters';

// CONSTANTS
const DEVICE_TYPES = ['laptop', 'desktop', 'tablet', 'phone', 'mouse', 'keyboard', 'mouse_keyboard'];

// ESTILS
const FORM_CONTAINER = "relative h-full flex flex-col";
const SCROLL_AREA = "space-y-4 flex-1 overflow-y-auto px-1 pb-24";
const GRID_2_COL = "grid grid-cols-1 sm:grid-cols-2 gap-4";
const GRID_3_COL = "grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-2";
const FOOTER_BAR = "absolute bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-end gap-3 rounded-b-lg z-20";
const BTN_CANCEL = "px-6 py-2 text-xs font-bold text-gray-400 uppercase hover:text-black";
const BTN_SAVE = "bg-gray-900 text-white px-8 py-2 rounded text-xs font-bold uppercase hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed";
const LABEL_STYLE = "text-[10px] font-bold text-gray-400 uppercase mt-2 block";
const ERROR_TEXT = "text-red-500 text-[9px] mt-1 font-bold uppercase tracking-wide";
const CHECKBOX_LABEL = "text-xs cursor-pointer flex items-center gap-1";
const inputClass = (err) => `w-full border ${err ? 'border-red-500 bg-red-50' : 'border-gray-300'} p-2 text-xs rounded focus:border-black outline-none transition-colors`;

/**
 * Component de formulari per crear o editar un dispositiu.
 * @param {Object} props - initialData per editar, onSuccess i onCancel per control de flux.
 */

export default function DeviceFormFields({ initialData, onSuccess, onCancel }) {
  const initialValues = initialData || { status: 'in_stock', device_type: 'laptop' };
  const [originalForm] = useState(initialValues);
  const [form, setForm] = useState(initialValues);
  const [inputs, setInputs] = useState({ owner: initialData?.owner?.owner_name || "", provider: initialData?.provider?.name || "", contract: initialData?.rental_contract?.contract_number || "" });
  const [localErrors, setLocalErrors] = useState({});
  const { submit, sending } = useSubmit(initialData?.id ? `/devices/${initialData.id}` : '/devices', initialData?.id ? 'put' : 'post', onSuccess);
  const hasChanges = JSON.stringify(form) !== JSON.stringify(originalForm);

  /** Valida les dades i executa l'enviament a l'API. @param {Event} e */

  const validateAndSubmit = (e) => {
    e.preventDefault();
    if (!hasChanges) return;
    const newErrors = {};
    if (inputs.owner.trim() && !form.owner_id) newErrors.owner = "Select a valid Owner";
    if (inputs.provider.trim() && !form.provider_id) newErrors.provider = "Select a valid Provider";
    if (inputs.contract.trim() && !form.rental_contract_id) newErrors.contract = "Select a valid Contract";
    if (!form.brand) newErrors.brand = "Required";
    if (!form.model) newErrors.model = "Required";
    if (!form.serial_number) newErrors.serial_number = "Required";
    if (Object.keys(newErrors).length > 0) { setLocalErrors(newErrors); return; }
    setLocalErrors({});
    submit(form);
  };

  return (
    <form onSubmit={validateAndSubmit} className={FORM_CONTAINER} aria-label="Formulari de dispositiu">
      <div className={SCROLL_AREA}>
        <div className={GRID_2_COL}>
          <div>
            <label htmlFor="brand" className={LABEL_STYLE}>Brand</label>
            <input id="brand" className={inputClass(localErrors.brand)} aria-invalid={!!localErrors.brand} aria-required="true" maxLength={30} value={form.brand || ''} onChange={e => setForm({...form, brand: e.target.value})} />
            {localErrors.brand && <p role="alert" className={ERROR_TEXT}>{localErrors.brand}</p>}
          </div>
          <div>
            <label htmlFor="model" className={LABEL_STYLE}>Model</label>
            <input id="model" className={inputClass(localErrors.model)} aria-invalid={!!localErrors.model} aria-required="true" maxLength={30} value={form.model || ''} onChange={e => setForm({...form, model: e.target.value})} />
            {localErrors.model && <p role="alert" className={ERROR_TEXT}>{localErrors.model}</p>}
          </div>
        </div>
        <div className={GRID_3_COL}>
          <SelectSearch label="Owner" url="/owners" displayKey="owner_name" initialText={inputs.owner} onType={(txt) => setInputs(p => ({ ...p, owner: txt }))} onSelect={(o) => setForm({...form, owner_id: o?.id || null})} error={localErrors.owner} />
          <SelectSearch label="Provider" url="/providers" displayKey="name" initialText={inputs.provider} onType={(txt) => setInputs(p => ({ ...p, provider: txt }))} onSelect={(p) => setForm({...form, provider_id: p?.id || null})} error={localErrors.provider} />
          <SelectSearch label="Contract" url="/rental-contracts" displayKey="contract_number" initialText={inputs.contract} onType={(txt) => setInputs(p => ({ ...p, contract: txt }))} onSelect={(c) => setForm({...form, rental_contract_id: c?.id || null})} error={localErrors.contract} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t pt-2">
          <div>
            <label htmlFor="device_type" className={LABEL_STYLE}>Type</label>
            <select id="device_type" className={inputClass(false)} value={form.device_type} onChange={e => setForm({...form, device_type: e.target.value})}>
              {DEVICE_TYPES.map(t => <option key={t} value={t}>{formatType(t)}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="status" className={LABEL_STYLE}>Status</label>
            <select id="status" className={inputClass(false)} value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
              <option value="in_use">In Use</option><option value="in_stock">In Stock</option><option value="under_repair">Repair</option><option value="retired">Retired</option>
            </select>
          </div>
          <div>
            <label htmlFor="sn" className={LABEL_STYLE}>Serial No.</label>
            <input id="sn" className={inputClass(localErrors.serial_number)} aria-invalid={!!localErrors.serial_number} aria-required="true" maxLength={30} value={form.serial_number || ''} onChange={e => setForm({...form, serial_number: e.target.value})} />
            {localErrors.serial_number && <p role="alert" className={ERROR_TEXT}>{localErrors.serial_number}</p>}
          </div>
        </div>
        <div className={GRID_3_COL}>
          <div><label htmlFor="inv" className={LABEL_STYLE}>Inventory No.</label><input id="inv" className={inputClass(false)} maxLength={30} value={form.inventory_number || ''} onChange={e => setForm({...form, inventory_number: e.target.value})} /></div>
          <div><label htmlFor="loc" className={LABEL_STYLE}>Location</label><input id="loc" className={inputClass(false)} maxLength={30} value={form.physical_location || ''} onChange={e => setForm({...form, physical_location: e.target.value})} /></div>
          <div><label htmlFor="pdate" className={LABEL_STYLE}>Purchase Date</label><input id="pdate" type="date" className={inputClass(false)} value={form.purchase_date || ''} onChange={e => setForm({...form, purchase_date: e.target.value})} /></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-2">
          <div><label htmlFor="wend" className={LABEL_STYLE}>Warranty End</label><input id="wend" type="date" className={inputClass(false)} value={form.warranty_end_date || ''} onChange={e => setForm({...form, warranty_end_date: e.target.value})} /></div>
          <div className="flex flex-wrap gap-4 pt-6">
            <label className={CHECKBOX_LABEL}><input type="checkbox" checked={!!form.has_warranty} onChange={e => setForm({...form, has_warranty: e.target.checked})} /> Warranty</label>
            <label className={CHECKBOX_LABEL}><input type="checkbox" checked={!!form.is_insured} onChange={e => setForm({...form, is_insured: e.target.checked})} /> Insured</label>
            <label className={CHECKBOX_LABEL}><input type="checkbox" checked={!!form.is_leased} onChange={e => setForm({...form, is_leased: e.target.checked})} /> Leased</label>
          </div>
        </div>
        <div className="border-t pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label htmlFor="specs" className={LABEL_STYLE}>Specs</label><textarea id="specs" className={`${inputClass(false)} h-20`} maxLength={1000} value={form.specifications || ''} onChange={e => setForm({...form, specifications: e.target.value})} /></div>
          <div><label htmlFor="notes" className={LABEL_STYLE}>Notes</label><textarea id="notes" className={`${inputClass(false)} h-20`} maxLength={1000} value={form.notes || ''} onChange={e => setForm({...form, notes: e.target.value})} /></div>
        </div>
      </div>
      <div className={FOOTER_BAR}>
        <button type="button" onClick={onCancel} className={BTN_CANCEL}>Discard</button>
        <button type="submit" disabled={sending || !hasChanges} className={BTN_SAVE}>{sending ? 'Saving...' : 'Save'}</button>
      </div>
    </form>
  );
}