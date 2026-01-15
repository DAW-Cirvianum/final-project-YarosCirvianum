// src/pages/devices/DeviceFormFields.jsx
import { useState } from 'react';
import { useSubmit } from '../../hooks/useSubmit';
import SelectSearch from '../../components/ui/SelectSearch';
import { formatType } from '../../utils/formatters';

export default function DeviceFormFields({ initialData, onSuccess, onCancel }) {
  // 1. Definim els valors inicials fixes
  const initialValues = initialData || { status: 'in_stock', device_type: 'laptop' };

  // 2. Guardem la còpia original per comparar
  const [originalForm] = useState(initialValues);

  // 3. L'estat mutable
  const [form, setForm] = useState(initialValues);

  // Estat per controlar què ha escrit l'usuari als cercadors (per validar)
  const [inputs, setInputs] = useState({
    owner: initialData?.owner?.owner_name || "",
    provider: initialData?.provider?.name || "",
    contract: initialData?.rental_contract?.contract_number || ""
  });

  const [localErrors, setLocalErrors] = useState({});

  const { submit, sending } = useSubmit(
    initialData?.id ? `/devices/${initialData.id}` : '/devices',
    initialData?.id ? 'put' : 'post',
    onSuccess
  );

  // 4. Check de canvis
  const hasChanges = JSON.stringify(form) !== JSON.stringify(originalForm);

  const types = ['laptop', 'desktop', 'tablet', 'phone', 'mouse', 'keyboard', 'mouse_keyboard'];
  const inputClass = (err) => `w-full border ${err ? 'border-red-500 bg-red-50' : 'border-gray-300'} p-2 text-xs rounded focus:border-black outline-none transition-colors`;
  const labelClass = "text-[10px] font-bold text-gray-400 uppercase mt-2 block";
  const errorClass = "text-red-500 text-[9px] mt-1 font-bold uppercase tracking-wide";

  const validateAndSubmit = (e) => {
    e.preventDefault();
    if (!hasChanges) return; // Bloqueig de seguretat extra

    const newErrors = {};

    if (inputs.owner.trim() && !form.owner_id) newErrors.owner = "Select a valid Owner from the list";
    if (inputs.provider.trim() && !form.provider_id) newErrors.provider = "Select a valid Provider";
    if (inputs.contract.trim() && !form.rental_contract_id) newErrors.contract = "Select a valid Contract";

    if (form.brand?.length > 30) newErrors.brand = "Max 30 chars";
    if (form.model?.length > 30) newErrors.model = "Max 30 chars";
    if (form.serial_number?.length > 30) newErrors.serial_number = "Max 30 chars";
    if (form.inventory_number?.length > 30) newErrors.inventory_number = "Max 30 chars";
    if (form.physical_location?.length > 30) newErrors.physical_location = "Max 30 chars";

    if (!form.brand) newErrors.brand = "Brand is required";
    if (!form.model) newErrors.model = "Model is required";
    if (!form.serial_number) newErrors.serial_number = "Serial No. is required";

    if (Object.keys(newErrors).length > 0) {
      setLocalErrors(newErrors);
      return; 
    }

    setLocalErrors({});
    submit(form);
  };

  return (
    <form onSubmit={validateAndSubmit} className="relative h-full flex flex-col">
      <div className="space-y-4 flex-1 overflow-y-auto px-1 pb-24">

        {/* ... (Camps del formulari iguals que abans) ... */}
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Brand</label>
            <input className={inputClass(localErrors.brand)} maxLength={30} value={form.brand || ''} onChange={e => setForm({...form, brand: e.target.value})} />
            {localErrors.brand && <p className={errorClass}>{localErrors.brand}</p>}
          </div>
          <div>
            <label className={labelClass}>Model</label>
            <input className={inputClass(localErrors.model)} maxLength={30} value={form.model || ''} onChange={e => setForm({...form, model: e.target.value})} />
            {localErrors.model && <p className={errorClass}>{localErrors.model}</p>}
          </div>
        </div>

        {/* Relations */}
        <div className="grid grid-cols-3 gap-4 border-t pt-2">
          <SelectSearch
            label="Owner" url="/owners" displayKey="owner_name" maxLength={70}
            initialText={inputs.owner}
            onType={(txt) => setInputs(prev => ({ ...prev, owner: txt }))}
            onSelect={(o) => setForm({...form, owner_id: o?.id || null})}
            error={localErrors.owner}
          />
          <SelectSearch
            label="Provider" url="/providers" displayKey="name" maxLength={70}
            initialText={inputs.provider}
            onType={(txt) => setInputs(prev => ({ ...prev, provider: txt }))}
            onSelect={(p) => setForm({...form, provider_id: p?.id || null})}
            error={localErrors.provider}
          />
          <SelectSearch
            label="Contract" url="/rental-contracts" displayKey="contract_number" maxLength={70}
            initialText={inputs.contract}
            onType={(txt) => setInputs(prev => ({ ...prev, contract: txt }))}
            onSelect={(c) => setForm({...form, rental_contract_id: c?.id || null})}
            error={localErrors.contract}
          />
        </div>

        {/* Status & Type */}
        <div className="grid grid-cols-3 gap-3 border-t pt-2">
          <div>
            <label className={labelClass}>Type</label>
            <select className={inputClass(false)} value={form.device_type} onChange={e => setForm({...form, device_type: e.target.value})}>
              {types.map(t => <option key={t} value={t}>{formatType(t)}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select className={inputClass(false)} value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
              <option value="in_use">In Use</option><option value="in_stock">In Stock</option><option value="under_repair">Repair</option><option value="retired">Retired</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Serial No.</label>
            <input className={inputClass(localErrors.serial_number)} maxLength={30} value={form.serial_number || ''} onChange={e => setForm({...form, serial_number: e.target.value})} />
            {localErrors.serial_number && <p className={errorClass}>{localErrors.serial_number}</p>}
          </div>
        </div>

        {/* Location & Dates */}
        <div className="grid grid-cols-3 gap-4 border-t pt-2">
          <div><label className={labelClass}>Inventory No.</label><input className={inputClass(localErrors.inventory_number)} maxLength={30} value={form.inventory_number || ''} onChange={e => setForm({...form, inventory_number: e.target.value})} /></div>
          <div><label className={labelClass}>Location</label><input className={inputClass(localErrors.physical_location)} maxLength={30} value={form.physical_location || ''} onChange={e => setForm({...form, physical_location: e.target.value})} /></div>
          <div><label className={labelClass}>Purchase Date</label><input type="date" className={inputClass(false)} value={form.purchase_date || ''} onChange={e => setForm({...form, purchase_date: e.target.value})} /></div>
        </div>

        {/* Warranty & Bools */}
        <div className="grid grid-cols-2 gap-4 border-t pt-2">
          <div><label className={labelClass}>Warranty End</label><input type="date" className={inputClass(false)} value={form.warranty_end_date || ''} onChange={e => setForm({...form, warranty_end_date: e.target.value})} /></div>
          <div className="flex gap-4 pt-6">
            <label className="text-xs cursor-pointer flex items-center gap-1"><input type="checkbox" checked={!!form.has_warranty} onChange={e => setForm({...form, has_warranty: e.target.checked})} /> Warranty</label>
            <label className="text-xs cursor-pointer flex items-center gap-1"><input type="checkbox" checked={!!form.is_insured} onChange={e => setForm({...form, is_insured: e.target.checked})} /> Insured</label>
            <label className="text-xs cursor-pointer flex items-center gap-1"><input type="checkbox" checked={!!form.is_leased} onChange={e => setForm({...form, is_leased: e.target.checked})} /> Leased</label>
          </div>
        </div>

        {/* Notes & Specs */}
        <div className="border-t pt-2 grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Specifications <span className="text-[9px] text-gray-300">(Max 1000)</span></label>
            <textarea className={`${inputClass(false)} h-24`} maxLength={1000} value={form.specifications || ''} onChange={e => setForm({...form, specifications: e.target.value})} />
          </div>
          <div>
            <label className={labelClass}>Notes <span className="text-[9px] text-gray-300">(Max 1000)</span></label>
            <textarea className={`${inputClass(false)} h-24`} maxLength={1000} value={form.notes || ''} onChange={e => setForm({...form, notes: e.target.value})} />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-end gap-3 rounded-b-lg z-20">
        <button type="button" onClick={onCancel} className="px-6 py-2 text-xs font-bold text-gray-400 uppercase hover:text-black">Discard</button>
        
        {/* 5. APLICAR LA DESHABILITACIÓ */}
        <button 
            type="submit" 
            disabled={sending || !hasChanges} 
            className="bg-gray-900 text-white px-8 py-2 rounded text-xs font-bold uppercase hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}