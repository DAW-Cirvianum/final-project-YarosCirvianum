// src/pages/rentalContracts/ContractFormFields.jsx

// IMPORTACIONS
import { useState } from 'react';
import { useSubmit } from '../../hooks/useSubmit';
import SelectSearch from '../../components/ui/SelectSearch';

// ESTILS
const FORM_CONTAINER = "relative h-full flex flex-col";
const SCROLL_AREA = "space-y-3 flex-1 overflow-y-auto px-1 pb-24";
// Ajustat per ser responsive en mobils
const GRID_2_COL = "grid grid-cols-1 sm:grid-cols-2 gap-4";
const GRID_3_COL = "grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-2";
const BORDER_TOP = "border-t pt-2 mt-2";
const FOOTER_BAR = "absolute bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-end gap-3 rounded-b-lg z-20";
const BTN_CANCEL = "px-6 py-2 text-xs font-bold text-gray-400 uppercase hover:text-black";
const BTN_SAVE = "bg-gray-900 text-white px-8 py-2 rounded text-xs font-bold uppercase hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed";
const LABEL_STYLE = "text-[10px] font-bold text-gray-400 uppercase mt-2 block";
const ERROR_TEXT = "text-red-500 text-[9px] mt-1 font-bold uppercase tracking-wide";

// Helper styles
const inputClass = (err) => `w-full border ${err ? 'border-red-500 bg-red-50' : 'border-gray-300'} p-2 text-xs rounded focus:border-black outline-none transition-colors`;

/**
 * Component de formulari per a la creacio o edicio de contractes de lloguer.
 * @param {Object} props - Propietats: initialData, onSuccess i onCancel.
 */
export default function ContractFormFields({ initialData, onSuccess, onCancel }) {
  // ESTATS INICIALS
  const getInitialState = () => (initialData ? { ...initialData } : { status: 'active', monthly_cost: 0 });
  const [originalForm] = useState(getInitialState());
  const [form, setForm] = useState(getInitialState());
  const [inputs, setInputs] = useState({ provider: initialData?.provider?.name || "" });
  const [localErrors, setLocalErrors] = useState({});

  // SUBMIT HOOK
  const { submit, sending, errors: serverErrors } = useSubmit(
    initialData?.id ? `/rental-contracts/${initialData.id}` : '/rental-contracts', 
    initialData?.id ? 'put' : 'post', 
    onSuccess
  );

  const hasChanges = JSON.stringify(form) !== JSON.stringify(originalForm);
  const getError = (field) => localErrors[field] || serverErrors?.[field]?.[0];

  /**
   * Valida les dades i envia el formulari si no hi ha errors.
   */
  const validateAndSubmit = (e) => {
    e.preventDefault();
    if (!hasChanges) return;
    const newErrors = {};
    const f = form;

    if (!f.contract_number) newErrors.contract_number = "Number is required"; 
    else if (f.contract_number.length > 100) newErrors.contract_number = "Max 100 chars";
    if (!f.name) newErrors.name = "Name is required";
    else if (f.name.length > 200) newErrors.name = "Max 200 chars";
    if (inputs.provider.trim() && !f.provider_id) newErrors.provider_id = "Select a valid Provider";
    if (!f.provider_id) newErrors.provider_id = "Provider is required";
    if (!f.start_date) newErrors.start_date = "Required";
    if (!f.end_date) newErrors.end_date = "Required";
    if (f.start_date && f.end_date && new Date(f.start_date) > new Date(f.end_date)) {
        newErrors.end_date = "Must be after start date";
    }
    if (f.monthly_cost < 0) newErrors.monthly_cost = "Cannot be negative";
    if (!f.status) newErrors.status = "Required";
    if (f.terms?.length > 1000) newErrors.terms = "Max 1000 chars";
    if (f.notes?.length > 1000) newErrors.notes = "Max 1000 chars";

    if (Object.keys(newErrors).length > 0) { setLocalErrors(newErrors); return; }
    setLocalErrors({});
    const payload = { ...f };
    if (!payload.contract_code && payload.contract_number) {
        payload.contract_code = payload.contract_number;
    }
    submit(payload);
  };

  // RENDERITZAT
  return (
    <form onSubmit={validateAndSubmit} className={FORM_CONTAINER} aria-label="Formulari de contracte">
      <div className={SCROLL_AREA}>
        <div className={GRID_2_COL}>
            <div>
                <label htmlFor="contract-num" className={LABEL_STYLE}>Contract Number *</label>
                <input id="contract-num" className={inputClass(getError('contract_number'))} aria-invalid={!!getError('contract_number')} aria-required="true" maxLength={100} value={form.contract_number || ''} onChange={e => setForm({...form, contract_number: e.target.value})} />
                {getError('contract_number') && <p role="alert" className={ERROR_TEXT}>{getError('contract_number')}</p>}
            </div>
            <div>
                <label htmlFor="contract-name" className={LABEL_STYLE}>Contract Name *</label>
                <input id="contract-name" className={inputClass(getError('name'))} aria-invalid={!!getError('name')} aria-required="true" maxLength={200} value={form.name||''} onChange={e => setForm({...form, name: e.target.value})} />
                {getError('name') && <p role="alert" className={ERROR_TEXT}>{getError('name')}</p>}
            </div>
        </div>

        <div className={BORDER_TOP}>
             <SelectSearch
                label="Provider *" url="/providers" displayKey="name" maxLength={70}
                initialText={inputs.provider}
                onType={(txt) => setInputs(prev => ({ ...prev, provider: txt }))}
                onSelect={(p) => setForm({...form, provider_id: p?.id || null})}
                error={getError('provider_id')}
                aria-label="Cercar i seleccionar proveidor"
            />
        </div>

        <div className={GRID_3_COL}>
            <div>
                <label htmlFor="start-date" className={LABEL_STYLE}>Start Date *</label>
                <input id="start-date" type="date" className={inputClass(getError('start_date'))} aria-invalid={!!getError('start_date')} aria-required="true" value={form.start_date||''} onChange={e => setForm({...form, start_date: e.target.value})} />
                {getError('start_date') && <p role="alert" className={ERROR_TEXT}>{getError('start_date')}</p>}
            </div>
            <div>
                <label htmlFor="end-date" className={LABEL_STYLE}>End Date *</label>
                <input id="end-date" type="date" className={inputClass(getError('end_date'))} aria-invalid={!!getError('end_date')} aria-required="true" value={form.end_date||''} onChange={e => setForm({...form, end_date: e.target.value})} />
                {getError('end_date') && <p role="alert" className={ERROR_TEXT}>{getError('end_date')}</p>}
            </div>
            <div>
                <label htmlFor="status-select" className={LABEL_STYLE}>Status *</label>
                <select id="status-select" className={inputClass(getError('status'))} aria-invalid={!!getError('status')} value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="terminated">Terminated</option>
                    <option value="pending">Pending</option>
                </select>
                {getError('status') && <p role="alert" className={ERROR_TEXT}>{getError('status')}</p>}
            </div>
        </div>

        <div className={BORDER_TOP}>
            <label htmlFor="monthly-cost" className={LABEL_STYLE}>Monthly Cost (€)</label>
            <input id="monthly-cost" type="number" step="0.01" className={inputClass(getError('monthly_cost'))} aria-invalid={!!getError('monthly_cost')} value={form.monthly_cost||''} onChange={e => setForm({...form, monthly_cost: e.target.value})} />
            {getError('monthly_cost') && <p role="alert" className={ERROR_TEXT}>{getError('monthly_cost')}</p>}
        </div>

        <div className={BORDER_TOP}>
            <label htmlFor="contract-terms" className={LABEL_STYLE}>Terms & Conditions <span className="text-[9px] text-gray-300">(Max 1000)</span></label>
            <textarea id="contract-terms" className={`${inputClass(getError('terms'))} h-20 resize-none`} aria-invalid={!!getError('terms')} maxLength={1000} value={form.terms||''} onChange={e => setForm({...form, terms: e.target.value})} />
            {getError('terms') && <p role="alert" className={ERROR_TEXT}>{getError('terms')}</p>}
        </div>

        <div className={BORDER_TOP}>
            <label htmlFor="contract-notes" className={LABEL_STYLE}>Notes <span className="text-[9px] text-gray-300">(Max 1000)</span></label>
            <textarea id="contract-notes" className={`${inputClass(getError('notes'))} h-16 resize-none`} aria-invalid={!!getError('notes')} maxLength={1000} value={form.notes||''} onChange={e => setForm({...form, notes: e.target.value})} />
            {getError('notes') && <p role="alert" className={ERROR_TEXT}>{getError('notes')}</p>}
        </div>
      </div>

      <div className={FOOTER_BAR}>
        <button type="button" onClick={onCancel} className={BTN_CANCEL} aria-label="Descartar canvis">Discard</button>
        <button type="submit" disabled={sending || !hasChanges} className={BTN_SAVE} aria-label="Guardar contracte">
            {sending ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}