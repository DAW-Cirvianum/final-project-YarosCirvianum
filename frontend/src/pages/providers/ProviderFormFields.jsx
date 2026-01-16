// src/pages/providers/ProviderFormFields.jsx

// IMPORTACIONS
import { useState } from 'react';
import { useSubmit } from '../../hooks/useSubmit';

// ESTILS
const FORM_CONTAINER = "relative h-full flex flex-col";
const SCROLL_AREA = "space-y-3 flex-1 overflow-y-auto px-1 pb-24";

/** 
 * Ajustat per posar les columnes en vertical en pantalles petites 
 */

const GRID_2_COL = "grid grid-cols-1 sm:grid-cols-2 gap-4";
const GRID_BORDER_TOP = "border-t pt-2";
const FOOTER_BAR = "absolute bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-end gap-3 rounded-b-lg z-20";
const BTN_CANCEL = "px-6 py-2 text-xs font-bold text-gray-400 uppercase hover:text-black";
const BTN_SAVE = "bg-gray-900 text-white px-8 py-2 rounded text-xs font-bold uppercase hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed";
const LABEL_STYLE = "text-[10px] font-bold text-gray-400 uppercase mt-2 block";
const ERROR_TEXT = "text-red-500 text-[9px] mt-1 font-bold uppercase tracking-wide";
const CHECKBOX_LABEL = "text-xs cursor-pointer flex items-center gap-2 select-none";
const ACTIVE_TEXT = "font-bold text-gray-700 uppercase tracking-wide";
const SUB_HEADER = "text-[9px] font-bold text-gray-900 uppercase tracking-widest mb-2";

// Helper styles
const inputClass = (err) => `w-full border ${err ? 'border-red-500 bg-red-50' : 'border-gray-300'} p-2 text-xs rounded focus:border-black outline-none transition-colors`;

/**
 * Component de formulari per a la creacio o edicio de dades de proveidors.
 */
export default function ProviderFormFields({ initialData, onSuccess, onCancel }) {
  // ESTATS INICIALS
  const getInitialState = () => (initialData ? { ...initialData } : { is_active: true });
  const [originalForm] = useState(getInitialState());
  const [form, setForm] = useState(getInitialState());
  const [localErrors, setLocalErrors] = useState({});

  // SUBMIT HOOK
  const { submit, sending, errors: serverErrors } = useSubmit(
    initialData?.id ? `/providers/${initialData.id}` : '/providers',
    initialData?.id ? 'put' : 'post',
    onSuccess
  );

  const hasChanges = JSON.stringify(form) !== JSON.stringify(originalForm);
  const getError = (field) => localErrors[field] || serverErrors?.[field]?.[0];

  // VALIDADORS
  const isCode = (t) => /^[a-zA-Z0-9\s-]*$/.test(t||'');
  const isPhone = (t) => {
    if (!t) return true;
    const validChars = /^[0-9+\-() ]*$/.test(t);
    const noDoubleSpace = !t.includes("  ");
    return validChars && noDoubleSpace;
  };
  const isDomain = (t) => {
    if (!t) return true;
    return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(t);
  };

  // VALIDACIO FORMULARI
  const validateAndSubmit = (e) => {
    e.preventDefault();
    if (!hasChanges) return;

    const newErrors = {};
    const payload = { ...form };

    if (!payload.name) newErrors.name = "Name is required";
    else if (payload.name.length > 100) newErrors.name = "Max 100 chars";

    if (payload.contact_person?.length > 100) newErrors.contact_person = "Max 100 chars";

    if (payload.contact_email) {
      if (payload.contact_email.length > 150) newErrors.contact_email = "Max 150 chars";
      else if (!payload.contact_email.includes('@')) newErrors.contact_email = "Invalid email";
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
        } else if (!/^https?:\/\//i.test(payload.website)) {
            payload.website = `https://${payload.website}`;
        }
    }

    if (payload.notes?.length > 1000) newErrors.notes = "Max 1000 chars";

    if (Object.keys(newErrors).length > 0) { setLocalErrors(newErrors); return; }
    
    setLocalErrors({});
    submit(payload);
  };

  // RENDERITZAT
  return (
    <form onSubmit={validateAndSubmit} className={FORM_CONTAINER} aria-label="Formulari de proveidor">
      <div className={SCROLL_AREA}>
        
        {/* NOM */}
        <div>
          <label htmlFor="prov-name" className={LABEL_STYLE}>Company Name *</label>
          <input id="prov-name" className={inputClass(getError('name'))} aria-invalid={!!getError('name')} aria-describedby={getError('name') ? "err-name" : undefined} aria-required="true" maxLength={100} value={form.name||''} onChange={e => setForm({...form, name: e.target.value})} />
          {getError('name') && <p id="err-name" role="alert" className={ERROR_TEXT}>{getError('name')}</p>}
        </div>

        {/* INFO FISCAL */}
        <div className={`${GRID_2_COL} ${GRID_BORDER_TOP}`}>
            <div>
                <label htmlFor="prov-tax" className={LABEL_STYLE}>Tax ID</label>
                <input id="prov-tax" className={inputClass(getError('tax_id'))} aria-invalid={!!getError('tax_id')} aria-describedby={getError('tax_id') ? "err-tax" : undefined} maxLength={50} value={form.tax_id||''} onChange={e => isCode(e.target.value) && setForm({...form, tax_id: e.target.value})} />
                {getError('tax_id') && <p id="err-tax" role="alert" className={ERROR_TEXT}>{getError('tax_id')}</p>}
            </div>
            <div>
                <label htmlFor="prov-type" className={LABEL_STYLE}>Provider Type</label>
                <select id="prov-type" className={inputClass(getError('provider_type'))} aria-invalid={!!getError('provider_type')} value={form.provider_type||'rental'} onChange={e => setForm({...form, provider_type: e.target.value})}>
                    <option value="rental">Rental</option>
                    <option value="lifetime">Lifetime</option>
                    <option value="service">Service</option>
                    <option value="leasing">Leasing</option>
                </select>
                {getError('provider_type') && <p role="alert" className={ERROR_TEXT}>{getError('provider_type')}</p>}
            </div>
        </div>

        {/* WEB */}
        <div className={GRID_BORDER_TOP}>
            <label htmlFor="prov-web" className={LABEL_STYLE}>Website</label>
            <input id="prov-web" className={inputClass(getError('website'))} aria-invalid={!!getError('website')} aria-describedby={getError('website') ? "err-web" : undefined} maxLength={200} placeholder="apple.com" value={form.website||''} onChange={e => setForm({...form, website: e.target.value})} />
            {getError('website') && <p id="err-web" role="alert" className={ERROR_TEXT}>{getError('website')}</p>}
        </div>

        {/* CONTACTE */}
        <div className={`${GRID_BORDER_TOP} mt-2`}>
            <h4 className={SUB_HEADER}>Contact Details</h4>
            
            <div className="mb-2">
                <label htmlFor="prov-contact" className={LABEL_STYLE}>Contact Person</label>
                <input id="prov-contact" className={inputClass(getError('contact_person'))} aria-invalid={!!getError('contact_person')} aria-describedby={getError('contact_person') ? "err-contact" : undefined} maxLength={100} value={form.contact_person||''} onChange={e => setForm({...form, contact_person: e.target.value})} />
                {getError('contact_person') && <p id="err-contact" role="alert" className={ERROR_TEXT}>{getError('contact_person')}</p>}
            </div>

            <div className={GRID_2_COL}>
                <div>
                    <label htmlFor="prov-email" className={LABEL_STYLE}>Email</label>
                    <input id="prov-email" type="email" className={inputClass(getError('contact_email'))} aria-invalid={!!getError('contact_email')} aria-describedby={getError('contact_email') ? "err-email" : undefined} maxLength={150} value={form.contact_email||''} onChange={e => setForm({...form, contact_email: e.target.value})} />
                    {getError('contact_email') && <p id="err-email" role="alert" className={ERROR_TEXT}>{getError('contact_email')}</p>}
                </div>
                <div>
                    <label htmlFor="prov-phone" className={LABEL_STYLE}>Phone</label>
                    <input id="prov-phone" className={inputClass(getError('contact_phone'))} aria-invalid={!!getError('contact_phone')} aria-describedby={getError('contact_phone') ? "err-phone" : undefined} maxLength={20} placeholder="+34 600..." value={form.contact_phone||''} onChange={e => isPhone(e.target.value) && setForm({...form, contact_phone: e.target.value})} />
                    {getError('contact_phone') && <p id="err-phone" role="alert" className={ERROR_TEXT}>{getError('contact_phone')}</p>}
                </div>
            </div>

            <div className="mt-2">
                <label htmlFor="prov-addr" className={LABEL_STYLE}>Address <span className="text-[9px] text-gray-300">(Max 500)</span></label>
                <textarea id="prov-addr" className={`${inputClass(getError('address'))} h-16 resize-none`} aria-invalid={!!getError('address')} aria-describedby={getError('address') ? "err-addr" : undefined} maxLength={500} value={form.address||''} onChange={e => setForm({...form, address: e.target.value})} />
                {getError('address') && <p id="err-addr" role="alert" className={ERROR_TEXT}>{getError('address')}</p>}
            </div>
        </div>

        {/* NOTES & ESTAT */}
        <div className={`${GRID_2_COL} border-t pt-4 mt-2`}>
           <div className="col-span-1 sm:col-span-2">
            <label htmlFor="prov-notes" className={LABEL_STYLE}>Notes <span className="text-[9px] text-gray-300">(Max 1000)</span></label>
            <textarea id="prov-notes" className={`${inputClass(getError('notes'))} h-16 resize-none`} aria-invalid={!!getError('notes')} aria-describedby={getError('notes') ? "err-notes" : undefined} maxLength={1000} value={form.notes||''} onChange={e => setForm({...form, notes: e.target.value})} />
            {getError('notes') && <p id="err-notes" role="alert" className={ERROR_TEXT}>{getError('notes')}</p>}
          </div>
          <div className="flex items-center">
            <label className={CHECKBOX_LABEL}>
              <input type="checkbox" className="scale-110 accent-gray-900" checked={!!form.is_active} onChange={e => setForm({...form, is_active: e.target.checked ? 1 : 0})} aria-label="Proveidor actiu" />
              <span className={ACTIVE_TEXT}>Active Provider</span>
            </label>
          </div>
        </div>

      </div>

      <div className={FOOTER_BAR}>
        <button type="button" onClick={onCancel} className={BTN_CANCEL} aria-label="Descartar canvis">Discard</button>
        <button type="submit" disabled={sending || !hasChanges} className={BTN_SAVE} aria-label="Guardar proveidor">
            {sending ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}