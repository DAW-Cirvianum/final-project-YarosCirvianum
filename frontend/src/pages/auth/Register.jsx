// src/pages/auth/Register.jsx
import { useState } from 'react';
import { useSubmit } from '../../hooks/useSubmit';
import { Link } from 'react-router-dom';
// Importem les constants centralitzades
import { PWD_SIMPLE, PWD_COMPLEX, NAME_REGEX, USERNAME_REGEX } from '../../utils/regex';

export default function Register() {
  const [form, setForm] = useState({});
  const [localErrors, setLocalErrors] = useState({});
  const [isDone, setIsDone] = useState(false);

  const { submit, errors: serverErrors, sending } = useSubmit('/register', 'post', () => setIsDone(true));

  // SELECCIONA AQUI QUINA VOLS USAR
  const ACTIVE_PWD_REGEX = PWD_SIMPLE; 
  const PWD_MSG = "Min 4 chars"; 
  // const ACTIVE_PWD_REGEX = PWD_COMPLEX;
  // const PWD_MSG = "Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char";

  const getError = (field) => localErrors[field] || serverErrors?.[field]?.[0];
  
  const inputClass = (field) => `w-full border ${getError(field) ? 'border-red-500 bg-red-50' : 'border-gray-300'} bg-white px-3 py-2.5 rounded text-sm focus:outline-none focus:border-gray-600 transition-colors placeholder:text-gray-400 text-gray-800`;
  const labelClass = "block text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] mb-2";
  const errorClass = "text-red-500 text-[9px] mt-1 font-bold uppercase tracking-wide";

  const validateAndSubmit = (e) => {
    e.preventDefault();
    const err = {};
    const f = form;

    // 1. Validació Nom
    if (!f.name) err.name = "Required";
    else if (!NAME_REGEX.test(f.name)) err.name = "Only letters allowed";

    // 2. Validació Username (min 5, max 15)
    if (!f.username) err.username = "Required";
    else if (!USERNAME_REGEX.test(f.username)) err.username = "Lowercase & numbers only";
    else if (f.username.length < 5) err.username = "Min 5 chars"; // <--- VALIDACIÓ NOVA
    else if (f.username.length > 15) err.username = "Max 15 chars";

    // 3. Validació Email
    if (!f.email) err.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(f.email)) err.email = "Invalid email format";

    // 4. Validació Password
    if (!f.password) err.password = "Required";
    else if (!ACTIVE_PWD_REGEX.test(f.password)) err.password = PWD_MSG;

    // 5. Confirmació
    if (f.password !== f.password_confirmation) err.password_confirmation = "Passwords do not match";

    if (Object.keys(err).length > 0) {
        setLocalErrors(err);
        return;
    }
    
    setLocalErrors({});
    submit(form);
  };

  if (isDone) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 antialiased">
      <img src="/logo-horiz-black.png" alt="Logo" className="h-8 w-auto mb-8 object-contain" />
      <div className="bg-white border border-gray-200 p-10 rounded-lg text-center max-w-sm w-full shadow-sm">
        <h2 className="text-lg font-medium text-gray-900 tracking-tight">Success</h2>
        <p className="mt-4 text-sm text-gray-500 leading-relaxed italic">Account created. Please verify your email.</p>
        <Link to="/login" className="block mt-8 text-[11px] font-bold text-gray-900 uppercase tracking-[0.2em] border border-gray-900 py-2.5 rounded hover:bg-gray-50 transition-colors">
          Log In
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 font-sans antialiased">
      <img src="/logo-horiz-black.png" alt="Logo" className="h-8 w-auto mb-8 object-contain" />
      <div className="w-full max-w-md bg-white border border-gray-200 p-10 rounded-lg shadow-sm">
        <header className="mb-10 text-center">
          <h1 className="text-xl font-medium tracking-tight text-gray-900">New Account</h1>
        </header>

        <form onSubmit={validateAndSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Full Name</label>
              <input className={inputClass('name')} placeholder="Josep Vila" onChange={e => setForm({...form, name: e.target.value})} />
              {getError('name') && <p className={errorClass}>{getError('name')}</p>}
            </div>
            <div>
              <label className={labelClass}>Username</label>
              <input className={inputClass('username')} placeholder="vilaj" maxLength={15} onChange={e => setForm({...form, username: e.target.value})} />
              {getError('username') && <p className={errorClass}>{getError('username')}</p>}
            </div>
          </div>

          <div>
            <label className={labelClass}>Email Address</label>
            <input className={inputClass('email')} type="email" placeholder="josepvila@example.com" onChange={e => setForm({...form, email: e.target.value})} />
            {getError('email') && <p className={errorClass}>{getError('email')}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Password</label>
              <input className={inputClass('password')} type="password" placeholder="************" onChange={e => setForm({...form, password: e.target.value})} />
              {getError('password') && <p className={errorClass}>{getError('password')}</p>}
            </div>
            <div>
              <label className={labelClass}>Confirm</label>
              <input className={inputClass('password_confirmation')} type="password" placeholder="************" onChange={e => setForm({...form, password_confirmation: e.target.value})} />
               {getError('password_confirmation') && <p className={errorClass}>{getError('password_confirmation')}</p>}
            </div>
          </div>

          <button className="w-full bg-gray-800 hover:bg-black text-white text-sm py-2.5 mt-2 rounded transition-all font-medium" disabled={sending}>
            {sending ? 'Creating...' : 'Register'}
          </button>
        </form>

        <footer className="mt-8 pt-6 border-t border-gray-100 text-center">
          <Link to="/login" className="text-[11px] font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-[0.2em]">
            Log In
          </Link>
        </footer>
      </div>
    </div>
  );
}