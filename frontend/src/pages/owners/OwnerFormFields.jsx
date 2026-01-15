// src/pages/owners/OwnerFormFields.jsx
import { useState } from 'react';
import { useSubmit } from '../../hooks/useSubmit';

export default function OwnerFormFields({ initialData, onSuccess, onCancel }) {
  const [localErrors, setLocalErrors] = useState({});

  const getInitialState = () => (
    initialData ? { ...initialData, name: initialData.owner_name } : { is_active: true }
  );

  const [originalForm] = useState(getInitialState());
  const [form, setForm] = useState(getInitialState());

  const { submit, sending } = useSubmit(initialData?.id ? `/owners/${initialData.id}` : '/owners', initialData?.id ? 'put' : 'post', onSuccess);

  const hasChanges = JSON.stringify(form) !== JSON.stringify(originalForm);

  const inputClass = (err) => `w-full border ${err ? 'border-red-500 bg-red-50' : 'border-gray-300'} p-2 text-xs rounded focus:border-black outline-none transition-colors`;
  const labelClass = "text-[10px] font-bold text-gray-400 uppercase mt-2 block";
  const errorClass = "text-red-500 text-[9px] mt-1 font-bold uppercase tracking-wide";

  const isClean = (t) => /^[a-zA-Z0-9\s]*$/.test(t||'');
  const isCode = (t) => /^[a-zA-Z0-9\s-]*$/.test(t||'');
  const isNum = (t) => /^\d*$/.test(t);

  const isPhone = (t) => {
    if (!t) return true;
    const validChars = /^[0-9+\-() ]*$/.test(t);
    const noDoubleSpace = !t.includes("  ");
    return validChars && noDoubleSpace;
  };

  const validateAndSubmit = (e) => {
    e.preventDefault();
    if (!hasChanges) return;

    const newErrors = {};
    const f = form;

    if (!f.name) newErrors.name = "Name is required";
    if (f.name?.length > 40) newErrors.name = "Max 40 chars";

    if (f.email) {
      if (f.email.length > 150) newErrors.email = "Max 150 chars";
      if (!f.email.includes('@')) newErrors.email = "Invalid email format";
    }

    if (f.phone?.length > 20) newErrors.phone = "Max 20 chars";
    if (f.extension && f.extension.length !== 3) newErrors.extension = "Must be exactly 3 digits";

    if (f.department && (f.department.length > 30 || !isClean(f.department))) newErrors.department = f.department.length > 30 ? "Max 30 chars" : "No special chars allowed";
    if (f.location && (f.location.length > 30 || !isClean(f.location))) newErrors.location = f.location.length > 30 ? "Max 30 chars" : "No special chars allowed";
    if (f.employee_code && (f.employee_code.length > 30 || !isCode(f.employee_code))) newErrors.employee_code = f.employee_code.length > 30 ? "Max 30 chars" : "Special chars not allowed (except -)";

    if (f.notes?.length > 1000) newErrors.notes = "Max 1000 chars";

    if (Object.keys(newErrors).length > 0) { setLocalErrors(newErrors); return; }
    setLocalErrors({});
    submit(form);
  };

  return (
    <form onSubmit={validateAndSubmit} className="relative h-full flex flex-col">
      <div className="space-y-3 flex-1 overflow-y-auto px-1 pb-24">
        <div>
          <label className={labelClass}>Full Name *</label>
          <input className={inputClass(localErrors.name)} maxLength={40} value={form.name||''} onChange={e => setForm({...form, name: e.target.value})} placeholder="Max 40 chars" />
          {localErrors.name && <p className={errorClass}>{localErrors.name}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4 border-t pt-2">
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" className={inputClass(localErrors.email)} maxLength={150} value={form.email||''} onChange={e => setForm({...form, email: e.target.value})} />
            {localErrors.email && <p className={errorClass}>{localErrors.email}</p>}
          </div>
          <div className="grid grid-cols-2 gap-2">
             <div>
                <label className={labelClass}>Phone</label>
                <input
                    className={inputClass(localErrors.phone)}
                    maxLength={20}
                    placeholder="+34 600..."
                    value={form.phone||''}
                    onChange={e => isPhone(e.target.value) && setForm({...form, phone: e.target.value})}
                />
                {localErrors.phone && <p className={errorClass}>{localErrors.phone}</p>}
             </div>
             <div>
                <label className={labelClass}>Ext.</label>
                <input className={inputClass(localErrors.extension)} maxLength={3} placeholder="3 digits" value={form.extension||''} onChange={e => isNum(e.target.value) && setForm({...form, extension: e.target.value})} />
                {localErrors.extension && <p className={errorClass}>{localErrors.extension}</p>}
             </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t pt-2">
          <div>
            <label className={labelClass}>Department</label>
            <input className={inputClass(localErrors.department)} maxLength={30} value={form.department||''} onChange={e => setForm({...form, department: e.target.value})} />
            {localErrors.department && <p className={errorClass}>{localErrors.department}</p>}
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <input className={inputClass(localErrors.location)} maxLength={30} value={form.location||''} onChange={e => setForm({...form, location: e.target.value})} />
            {localErrors.location && <p className={errorClass}>{localErrors.location}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t pt-2">
           <div>
            <label className={labelClass}>Employee Code</label>
            <input className={inputClass(localErrors.employee_code)} maxLength={30} placeholder="Allows (-)" value={form.employee_code||''} onChange={e => setForm({...form, employee_code: e.target.value})} />
            {localErrors.employee_code && <p className={errorClass}>{localErrors.employee_code}</p>}
          </div>
          <div className="flex items-center pt-6">
            <label className="text-xs cursor-pointer flex items-center gap-2 select-none">
              <input type="checkbox" className="scale-110 accent-gray-900" checked={!!form.is_active} onChange={e => setForm({...form, is_active: e.target.checked ? 1 : 0})} />
              <span className="font-bold text-gray-700 uppercase tracking-wide">Active Account</span>
            </label>
          </div>
        </div>

        <div className="border-t pt-2">
           {/* AFEGIT SPAN MAX */}
           <label className={labelClass}>Notes <span className="text-[9px] text-gray-300">(Max 1000)</span></label>
           <textarea className={`${inputClass(localErrors.notes)} h-20 resize-none`} maxLength={1000} value={form.notes||''} onChange={e => setForm({...form, notes: e.target.value})} />
           {localErrors.notes && <p className={errorClass}>{localErrors.notes}</p>}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-end gap-3 rounded-b-lg z-20">
        <button type="button" onClick={onCancel} className="px-6 py-2 text-xs font-bold text-gray-400 uppercase hover:text-black">Discard</button>
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