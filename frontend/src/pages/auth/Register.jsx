// src/pages/auth/Register.jsx
import { useState } from 'react';
import { useSubmit } from '../../hooks/useSubmit';
import { Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({});
  const [isDone, setIsDone] = useState(false);

  const { submit, errors, sending } = useSubmit('/register', 'post', () => setIsDone(true));

  const inputClass = "w-full border border-gray-300 bg-white px-3 py-2.5 rounded text-sm focus:outline-none focus:border-gray-600 transition-colors placeholder:text-gray-400 text-gray-800";
  const labelClass = "block text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] mb-2";

  if (isDone) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 antialiased">
      <div className="bg-white border border-gray-200 p-10 rounded-lg text-center max-w-sm">
        <h2 className="text-lg font-medium text-gray-900 tracking-tight">Success</h2>
        <p className="mt-4 text-sm text-gray-500 leading-relaxed italic">Account created. Please verify your email.</p>
        <Link to="/login" className="block mt-8 text-[11px] font-bold text-gray-900 uppercase tracking-[0.2em] border border-gray-900 py-2.5 rounded hover:bg-gray-50 transition-colors">
          Log In
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans antialiased">
      <div className="w-full max-w-md bg-white border border-gray-200 p-10 rounded-lg shadow-sm">
        <header className="mb-10 text-center">
          <h1 className="text-xl font-medium tracking-tight text-gray-900">New Account</h1>
        </header>
        
        <form onSubmit={(e) => { e.preventDefault(); submit(form); }} className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Full Name</label>
              <input className={inputClass} placeholder="Full Name" onChange={e => setForm({...form, name: e.target.value})} />
              {errors?.name && <p className="text-red-600 text-[10px] mt-1">{errors.name[0]}</p>}
            </div>
            <div>
              <label className={labelClass}>Username</label>
              <input className={inputClass} placeholder="Username" onChange={e => setForm({...form, username: e.target.value})} />
              {errors?.username && <p className="text-red-600 text-[10px] mt-1">{errors.username[0]}</p>}
            </div>
          </div>

          <div>
            <label className={labelClass}>Email Address</label>
            <input className={inputClass} type="email" placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
            {errors?.email && <p className="text-red-600 text-[10px] mt-1">{errors.email[0]}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Password</label>
              <input className={inputClass} type="password" onChange={e => setForm({...form, password: e.target.value})} />
              {errors?.password && <p className="text-red-600 text-[10px] mt-1">{errors.password[0]}</p>}
            </div>
            <div>
              <label className={labelClass}>Confirm</label>
              <input className={inputClass} type="password" onChange={e => setForm({...form, password_confirmation: e.target.value})} />
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