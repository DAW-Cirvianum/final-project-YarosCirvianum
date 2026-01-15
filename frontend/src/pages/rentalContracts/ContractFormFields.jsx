// src/pages/rentalContracts/ContractFormFields.jsx
import { useState } from 'react';
import { useSubmit } from '../../hooks/useSubmit';
import SelectSearch from '../../components/ui/SelectSearch';

export default function ContractFormFields({ initialData, onSuccess, onCancel }) {
  const [localErrors, setLocalErrors] = useState({});

  const getInitialState = () => (
    initialData 
    ? { ...initialData } 
    : { status: 'active', monthly_cost: 0 }
  );

  const [originalForm] = useState(getInitialState());
  const [form, setForm] = useState(getInitialState());
  
  const [inputs, setInputs] = useState({
      provider: initialData?.provider?.name || ""
  });

  const { submit, sending, errors: serverErrors } = useSubmit(
    initialData?.id ? `/rental-contracts/${initialData.id}` : '/rental-contracts', 
    initialData?.id ? 'put' : 'post', 
    onSuccess
  );

  const hasChanges = JSON.stringify(form) !== JSON.stringify(originalForm);
  const getError = (field) => localErrors[field] || serverErrors?.[field]?.[0];

  const inputClass = (field) => `w-full border ${getError(field) ? 'border-red-500 bg-red-50' : 'border-gray-300'} p-2 text-xs rounded focus:border-black outline-none transition-colors`;
  const labelClass = "text-[10px] font-bold text-gray-400 uppercase mt-2 block";
  const errorClass = "text-red-500 text-[9px] mt-1 font-bold uppercase tracking-wide";

  const validateAndSubmit = (e) => {
    e.preventDefault();
    if (!hasChanges) return;

    const newErrors = {};
    const f = form;

    // VALIDACIONS
    
    // 1. Required & Lengths
    if (!f.contract_number) newErrors.contract_number = "Number is required"; 
    if (f.contract_number?.length > 100) newErrors.contract_number = "Max 100 chars";

    if (!f.name) newErrors.name = "Name is required";
    if (f.name?.length > 200) newErrors.name = "Max 200 chars";

    // 2. Provider Logic
    if (inputs.provider.trim() && !f.provider_id) newErrors.provider_id = "Select a valid Provider";
    if (!f.provider_id) newErrors.provider_id = "Provider is required";

    // 3. Dates
    if (!f.start_date) newErrors.start_date = "Required";
    if (!f.end_date) newErrors.end_date = "Required";
    if (f.start_date && f.end_date && new Date(f.start_date) > new Date(f.end_date)) {
        newErrors.end_date = "Must be after start date";
    }

    // 4. Money
    if (f.monthly_cost < 0) newErrors.monthly_cost = "Cannot be negative";

    // 5. Status
    if (!f.status) newErrors.status = "Required";

    // 6. Text Areas (NOU)
    if (f.terms?.length > 1000) newErrors.terms = "Max 1000 chars";
    if (f.notes?.length > 1000) newErrors.notes = "Max 1000 chars";

    if (Object.keys(newErrors).length > 0) { setLocalErrors(newErrors); return; }
    setLocalErrors({});
    
    const payload = { ...f };
    // Fix per si venim d'editar i el camp es diu diferent al JSON de resposta
    if (!payload.contract_code && payload.contract_number) {
        payload.contract_code = payload.contract_number;
    }

    submit(payload);
  };

  return (
    <form onSubmit={validateAndSubmit} className="relative h-full flex flex-col">
      <div className="space-y-3 flex-1 overflow-y-auto px-1 pb-24">
        
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className={labelClass}>Contract Number *</label>
                <input 
                    className={inputClass('contract_number')} 
                    maxLength={100} 
                    value={form.contract_number || ''} 
                    onChange={e => setForm({...form, contract_number: e.target.value})} 
                />
                {getError('contract_number') && <p className={errorClass}>{getError('contract_number')}</p>}
            </div>
            <div>
                <label className={labelClass}>Contract Name *</label>
                <input className={inputClass('name')} maxLength={200} value={form.name||''} onChange={e => setForm({...form, name: e.target.value})} />
                {getError('name') && <p className={errorClass}>{getError('name')}</p>}
            </div>
        </div>

        <div className="border-t pt-2 mt-2">
             <SelectSearch
                label="Provider *" 
                url="/providers" 
                displayKey="name" 
                maxLength={70}
                initialText={inputs.provider}
                onType={(txt) => setInputs(prev => ({ ...prev, provider: txt }))}
                onSelect={(p) => setForm({...form, provider_id: p?.id || null})}
                error={getError('provider_id')}
            />
        </div>

        <div className="grid grid-cols-3 gap-4 border-t pt-2">
            <div>
                <label className={labelClass}>Start Date *</label>
                <input type="date" className={inputClass('start_date')} value={form.start_date||''} onChange={e => setForm({...form, start_date: e.target.value})} />
                {getError('start_date') && <p className={errorClass}>{getError('start_date')}</p>}
            </div>
            <div>
                <label className={labelClass}>End Date *</label>
                <input type="date" className={inputClass('end_date')} value={form.end_date||''} onChange={e => setForm({...form, end_date: e.target.value})} />
                {getError('end_date') && <p className={errorClass}>{getError('end_date')}</p>}
            </div>
            <div>
                <label className={labelClass}>Status *</label>
                <select className={inputClass('status')} value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="terminated">Terminated</option>
                    <option value="pending">Pending</option>
                </select>
                {getError('status') && <p className={errorClass}>{getError('status')}</p>}
            </div>
        </div>

        <div className="border-t pt-2">
            <label className={labelClass}>Monthly Cost (€)</label>
            <input type="number" step="0.01" className={inputClass('monthly_cost')} value={form.monthly_cost||''} onChange={e => setForm({...form, monthly_cost: e.target.value})} />
            {getError('monthly_cost') && <p className={errorClass}>{getError('monthly_cost')}</p>}
        </div>

        {/* TERMS & CONDITIONS (Updated) */}
        <div className="border-t pt-2 mt-2">
            <label className={labelClass}>Terms & Conditions</label>
            <textarea 
                className={`${inputClass('terms')} h-20 resize-none`} 
                maxLength={1000} 
                value={form.terms||''} 
                onChange={e => setForm({...form, terms: e.target.value})} 
            />
            {getError('terms') && <p className={errorClass}>{getError('terms')}</p>}
        </div>

        {/* NOTES (Updated) */}
        <div className="border-t pt-2">
            <label className={labelClass}>Notes</label>
            <textarea 
                className={`${inputClass('notes')} h-16 resize-none`} 
                maxLength={1000} 
                value={form.notes||''} 
                onChange={e => setForm({...form, notes: e.target.value})} 
            />
            {getError('notes') && <p className={errorClass}>{getError('notes')}</p>}
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