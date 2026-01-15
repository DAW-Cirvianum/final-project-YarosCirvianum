// src/pages/providers/ProviderFormFields.jsx
import { useState } from 'react';
import { useSubmit } from '../../hooks/useSubmit';

export default function ProviderFormFields({ initialData, onSuccess, onCancel }) {
  const [localErrors, setLocalErrors] = useState({});

  const getInitialState = () => (
    initialData ? { ...initialData } : { is_active: true }
  );

  const [originalForm] = useState(getInitialState());
  const [form, setForm] = useState(getInitialState());

  const { submit, sending, errors: serverErrors } = useSubmit(
    initialData?.id ? `/providers/${initialData.id}` : '/providers',
    initialData?.id ? 'put' : 'post',
    onSuccess
  );

  const hasChanges = JSON.stringify(form) !== JSON.stringify(originalForm);
  const getError = (field) => localErrors[field] || serverErrors?.[field]?.[0];

  const inputClass = (field) => `w-full border ${getError(field) ? 'border-red-500 bg-red-50' : 'border-gray-300'} p-2 text-xs rounded focus:border-black outline-none transition-colors`;
  const labelClass = "text-[10px] font-bold text-gray-400 uppercase mt-2 block";
  const errorClass = "text-red-500 text-[9px] mt-1 font-bold uppercase tracking-wide";

  const isCode = (t) => /^[a-zA-Z0-9\s-]*$/.test(t||'');

  // FUNCIO isPhone IGUAL QUE A OWNERS
  const isPhone = (t) => {
    if (!t) return true;
    // Permet numeros, +, -, (), i espai
    const validChars = /^[0-9+\-() ]*$/.test(t);
    // No permet doble espai
    const noDoubleSpace = !t.includes("  ");
    return validChars && noDoubleSpace;
  };

  const isDomain = (t) => {
    if (!t) return true;
    return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(t);
  };

  const validateAndSubmit = (e) => {
    e.preventDefault();
    if (!hasChanges) return;

    const newErrors = {};
    const payload = { ...form };

    if (!payload.name) newErrors.name = "Name is required";
    if (payload.name?.length > 100) newErrors.name = "Max 100 chars";

    if (payload.contact_person?.length > 100) newErrors.contact_person = "Max 100 chars";

    if (payload.contact_email) {
      if (payload.contact_email.length > 150) newErrors.contact_email = "Max 150 chars";
      if (!payload.contact_email.includes('@')) newErrors.contact_email = "Invalid email";
    }

    if (payload.contact_phone?.length > 20) newErrors.contact_phone = "Max 20 digits";

    if (payload.tax_id && (payload.tax_id.length > 50 || !isCode(payload.tax_id))) {
        newErrors.tax_id = payload.tax_id.length > 50 ? "Max 50 chars" : "Invalid chars";
    }

    if (payload.website) {
        if (payload.website.length > 200) {
            newErrors.website = "Max 200 chars";
        } else if (!isDomain(payload.website)) {
            newErrors.website = "Invalid domain format";
        } else {
            if (!/^https?:\/\//i.test(payload.website)) {
                payload.website = `https://${payload.website}`;
            }
        }
    }

    if (payload.notes?.length > 1000) newErrors.notes = "Max 1000 chars";

    if (Object.keys(newErrors).length > 0) { setLocalErrors(newErrors); return; }
    setLocalErrors({});
    submit(payload);
  };

  return (
    <form onSubmit={validateAndSubmit} className="relative h-full flex flex-col">
      <div className="space-y-3 flex-1 overflow-y-auto px-1 pb-24">
        
        <div>
          <label className={labelClass}>Company Name *</label>
          <input className={inputClass('name')} maxLength={100} value={form.name||''} onChange={e => setForm({...form, name: e.target.value})} />
          {getError('name') && <p className={errorClass}>{getError('name')}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4 border-t pt-2">
            <div>
                <label className={labelClass}>Tax ID</label>
                <input className={inputClass('tax_id')} maxLength={50} value={form.tax_id||''} onChange={e => isCode(e.target.value) && setForm({...form, tax_id: e.target.value})} />
                {getError('tax_id') && <p className={errorClass}>{getError('tax_id')}</p>}
            </div>
            <div>
                <label className={labelClass}>Provider Type</label>
                <select className={inputClass('provider_type')} value={form.provider_type||'rental'} onChange={e => setForm({...form, provider_type: e.target.value})}>
                    <option value="rental">Rental</option>
                    <option value="lifetime">Lifetime</option>
                    <option value="service">Service</option>
                    <option value="leasing">Leasing</option>
                </select>
                {getError('provider_type') && <p className={errorClass}>{getError('provider_type')}</p>}
            </div>
        </div>

        <div className="border-t pt-2">
            <label className={labelClass}>Website</label>
            <input className={inputClass('website')} maxLength={200} placeholder="apple.com" value={form.website||''} onChange={e => setForm({...form, website: e.target.value})} />
            {getError('website') && <p className={errorClass}>{getError('website')}</p>}
        </div>

        <div className="border-t pt-2 mt-2">
            <h4 className="text-[9px] font-bold text-gray-900 uppercase tracking-widest mb-2">Contact Details</h4>
            
            <div className="mb-2">
                <label className={labelClass}>Contact Person</label>
                <input className={inputClass('contact_person')} maxLength={100} value={form.contact_person||''} onChange={e => setForm({...form, contact_person: e.target.value})} />
                {getError('contact_person') && <p className={errorClass}>{getError('contact_person')}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Email</label>
                    <input type="email" className={inputClass('contact_email')} maxLength={150} value={form.contact_email||''} onChange={e => setForm({...form, contact_email: e.target.value})} />
                    {getError('contact_email') && <p className={errorClass}>{getError('contact_email')}</p>}
                </div>
                <div>
                    <label className={labelClass}>Phone</label>
                    <input 
                        className={inputClass('contact_phone')} 
                        maxLength={20} 
                        placeholder="+34 600..." 
                        value={form.contact_phone||''} 
                        onChange={e => isPhone(e.target.value) && setForm({...form, contact_phone: e.target.value})} 
                    />
                    {getError('contact_phone') && <p className={errorClass}>{getError('contact_phone')}</p>}
                </div>
            </div>
            
            <div className="mt-2">
                {/* AFEGIT SPAN MAX */}
                <label className={labelClass}>Address <span className="text-[9px] text-gray-300">(Max 500)</span></label>
                <textarea className={`${inputClass('address')} h-16 resize-none`} maxLength={500} value={form.address||''} onChange={e => setForm({...form, address: e.target.value})} />
                {getError('address') && <p className={errorClass}>{getError('address')}</p>}
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t pt-4 mt-2">
           <div className="col-span-2">
            {/* AFEGIT SPAN MAX */}
            <label className={labelClass}>Notes <span className="text-[9px] text-gray-300">(Max 1000)</span></label>
            <textarea className={`${inputClass('notes')} h-16 resize-none`} maxLength={1000} value={form.notes||''} onChange={e => setForm({...form, notes: e.target.value})} />
            {getError('notes') && <p className={errorClass}>{getError('notes')}</p>}
          </div>
          <div className="flex items-center">
            <label className="text-xs cursor-pointer flex items-center gap-2 select-none">
              <input type="checkbox" className="scale-110 accent-gray-900" checked={!!form.is_active} onChange={e => setForm({...form, is_active: e.target.checked ? 1 : 0})} />
              <span className="font-bold text-gray-700 uppercase tracking-wide">Active Provider</span>
            </label>
          </div>
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