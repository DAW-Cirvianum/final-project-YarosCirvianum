// src/pages/devices/DeviceFormFields.jsx
import { useState } from 'react';
import { useSubmit } from '../../hooks/useSubmit';
import SelectSearch from '../../components/ui/SelectSearch';

export default function DeviceFormFields({ initialData, onSuccess }) {
  const [form, setForm] = useState(initialData || { status: 'in_stock' });
  
  const { submit, errors, sending } = useSubmit(
    initialData?.id ? `/devices/${initialData.id}` : '/devices',
    initialData?.id ? 'put' : 'post',
    onSuccess
  );

  const inputClass = "w-full border border-gray-300 p-2 text-sm rounded focus:border-gray-900 outline-none";

  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(form); }} className="space-y-4 text-gray-900">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase">Brand</label>
          <input className={inputClass} value={form.brand || ''} onChange={e => setForm({...form, brand: e.target.value})} />
          {errors?.brand && <p className="text-red-600 text-[10px]">{errors.brand[0]}</p>}
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase">Model</label>
          <input className={inputClass} value={form.model || ''} onChange={e => setForm({...form, model: e.target.value})} />
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase">Serial Number</label>
        <input className={inputClass} value={form.serial_number || ''} onChange={e => setForm({...form, serial_number: e.target.value})} />
        {errors?.serial_number && <p className="text-red-600 text-[10px]">{errors.serial_number[0]}</p>}
      </div>

      <SelectSearch 
        label="Assigned Owner" 
        url="/owners" 
        onSelect={(o) => setForm({...form, owner_id: o.id})} 
        error={errors?.owner_id}
      />

      <button className="w-full bg-gray-900 text-white py-2 rounded text-sm font-medium hover:bg-black transition-colors" disabled={sending}>
        {sending ? 'Saving...' : 'Save Device'}
      </button>
    </form>
  );
}