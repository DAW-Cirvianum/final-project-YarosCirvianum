// src/pages/auth/Register.jsx

// IMPORTACIONS
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSubmit } from '../../hooks/useSubmit';
import { PWD_SIMPLE, PWD_COMPLEX, NAME_REGEX, USERNAME_REGEX } from '../../utils/regex';

// CONFIGURACIO
const ACTIVE_PWD_REGEX = PWD_SIMPLE; 
const PWD_MSG = "Min 4 chars"; 

// ESTILS
const PAGE_CONTAINER = "min-h-screen flex flex-col items-center justify-center bg-gray-100 font-sans antialiased px-4";
const LOGO_STYLE = "h-8 w-auto mb-8 object-contain";
const CARD_STYLE = "w-full max-w-md bg-white border border-gray-200 p-10 rounded-lg shadow-sm";
const HEADER_STYLE = "mb-10 text-center";
const TITLE_STYLE = "text-xl font-medium tracking-tight text-gray-900";
const LABEL_STYLE = "block text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] mb-2";
const BTN_STYLE = "w-full bg-gray-800 hover:bg-black text-white text-sm py-2.5 mt-2 rounded transition-all font-medium";
const ERROR_TEXT = "text-red-500 text-[9px] mt-1 font-bold uppercase tracking-wide";
const LINK_STYLE = "text-[11px] font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-[0.2em]";

// SUCCESS VIEW STYLES
const SUCCESS_MSG = "mt-4 text-sm text-gray-500 leading-relaxed italic";
const LOGIN_BTN = "block mt-8 text-[11px] font-bold text-gray-900 uppercase tracking-[0.2em] border border-gray-900 py-2.5 rounded hover:bg-gray-50 transition-colors";

/**
 * Genera les classes CSS per als camps d'entrada segons l'estat d'error.
 * @param {boolean} err - Indica si el camp té un error de validació.
 * @returns {string} String amb les classes de Tailwind.
 */
const inputClass = (err) => `w-full border ${err ? 'border-red-500 bg-red-50' : 'border-gray-300'} bg-white px-3 py-2.5 rounded text-sm focus:outline-none focus:border-gray-600 transition-colors placeholder:text-gray-400 text-gray-800`;

/**
 * Component de registre d'usuaris.
 * Gestiona la creació de comptes amb validació en client i servidor.
 */
export default function Register() {
  // ESTATS
  const [form, setForm] = useState({});
  const [localErrors, setLocalErrors] = useState({});
  const [isDone, setIsDone] = useState(false);

  const { submit, errors: serverErrors, sending } = useSubmit('/register', 'post', () => setIsDone(true));

  /**
   * Obté el missatge d'error per a un camp específic.
   * Prioritza errors de validació local sobre els del servidor.
   * @param {string} field - Nom del camp del formulari.
   * @returns {string|null} El missatge d'error o null.
   */
  const getError = (field) => localErrors[field] || serverErrors?.[field]?.[0];

  /**
   * Executa la validació del formulari i processa l'enviament de dades.
   * @param {Event} e - Esdeveniment de submit del formulari.
   */
  const validateAndSubmit = (e) => {
    e.preventDefault();
    const err = {};
    const f = form;

    if (!f.name) err.name = "Required";
    else if (!NAME_REGEX.test(f.name)) err.name = "Only letters allowed";

    if (!f.username) err.username = "Required";
    else if (!USERNAME_REGEX.test(f.username)) err.username = "Lowercase & numbers only";
    else if (f.username.length < 5) err.username = "Min 5 chars";
    else if (f.username.length > 15) err.username = "Max 15 chars";

    if (!f.email) err.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(f.email)) err.email = "Invalid email format";

    if (!f.password) err.password = "Required";
    else if (!ACTIVE_PWD_REGEX.test(f.password)) err.password = PWD_MSG;

    if (f.password !== f.password_confirmation) err.password_confirmation = "Passwords do not match";

    if (Object.keys(err).length > 0) { setLocalErrors(err); return; }
    
    setLocalErrors({});
    submit(form);
  };

  // VISTA SUCCESS
  if (isDone) return (
    <div className={PAGE_CONTAINER}>
      <img src="/logo-horiz-black.png" alt="Logo" className={LOGO_STYLE} />
      <div role="status" className="bg-white border border-gray-200 p-10 rounded-lg text-center max-w-sm w-full shadow-sm">
        <h2 className="text-lg font-medium text-gray-900 tracking-tight">Success</h2>
        <p className={SUCCESS_MSG}>Account created. Please verify your email.</p>
        <Link to="/login" className={LOGIN_BTN}>Log In</Link>
      </div>
    </div>
  );

  // VISTA FORMULARI
  return (
    <div className={PAGE_CONTAINER}>
      <img src="/logo-horiz-black.png" alt="Logo" className={LOGO_STYLE} />
      <div className={CARD_STYLE}>
        <header className={HEADER_STYLE}>
          <h1 className={TITLE_STYLE}>New Account</h1>
        </header>

        <form onSubmit={validateAndSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className={LABEL_STYLE}>Full Name</label>
              <input id="name" aria-required="true" className={inputClass(getError('name'))} placeholder="Josep Vila" onChange={e => setForm({...form, name: e.target.value})} />
              {getError('name') && <p role="alert" className={ERROR_TEXT}>{getError('name')}</p>}
            </div>
            <div>
              <label htmlFor="username" className={LABEL_STYLE}>Username</label>
              <input id="username" aria-required="true" className={inputClass(getError('username'))} placeholder="vilaj" maxLength={15} onChange={e => setForm({...form, username: e.target.value})} />
              {getError('username') && <p role="alert" className={ERROR_TEXT}>{getError('username')}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="email" className={LABEL_STYLE}>Email Address</label>
            <input id="email" type="email" aria-required="true" className={inputClass(getError('email'))} placeholder="josepvila@example.com" onChange={e => setForm({...form, email: e.target.value})} />
            {getError('email') && <p role="alert" className={ERROR_TEXT}>{getError('email')}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className={LABEL_STYLE}>Password</label>
              <input id="password" type="password" aria-required="true" className={inputClass(getError('password'))} placeholder="************" onChange={e => setForm({...form, password: e.target.value})} />
              {getError('password') && <p role="alert" className={ERROR_TEXT}>{getError('password')}</p>}
            </div>
            <div>
              <label htmlFor="password_confirmation" className={LABEL_STYLE}>Confirm</label>
              <input id="password_confirmation" type="password" aria-required="true" className={inputClass(getError('password_confirmation'))} placeholder="************" onChange={e => setForm({...form, password_confirmation: e.target.value})} />
               {getError('password_confirmation') && <p role="alert" className={ERROR_TEXT}>{getError('password_confirmation')}</p>}
            </div>
          </div>

          <button type="submit" className={BTN_STYLE} disabled={sending}>
            {sending ? 'Creating...' : 'Register'}
          </button>
        </form>

        <footer className="mt-8 pt-6 border-t border-gray-100 text-center">
          <Link to="/login" className={LINK_STYLE}>Log In</Link>
        </footer>
      </div>
    </div>
  );
}