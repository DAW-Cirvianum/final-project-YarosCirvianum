// src/pages/auth/Login.jsx
import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useSubmit } from '../../hooks/useSubmit';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({});
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const { submit, errors, sending } = useSubmit('/login', 'post', (data) => {
    localStorage.setItem('token', data.token);
    setUser(data.user);
    setTimeout(() => navigate('/'), 20);
  });

  const inputClass = "w-full border border-gray-300 bg-white px-3 py-2.5 rounded text-sm focus:outline-none focus:border-gray-600 transition-colors placeholder:text-gray-400 text-gray-800";
  const labelClass = "block text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] mb-2";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans antialiased">
      <div className="w-full max-w-sm bg-white border border-gray-200 p-10 rounded-lg shadow-sm">
        <header className="mb-10 text-center">
          <h1 className="text-xl font-medium tracking-tight text-gray-900">Asset Management</h1>
        </header>

        <form onSubmit={(e) => { e.preventDefault(); submit({ login: form.login, password: form.password }); }} className="flex flex-col gap-5">
          <div>
            <label className={labelClass}>Identifier</label>
            <input className={inputClass} placeholder="User or Email" onChange={e => setForm({...form, login: e.target.value})} />
            {errors?.credentials && <p className="text-red-600 text-[10px] mt-1 ml-1">Invalid credentials</p>}
          </div>

          <div>
            <label className={labelClass}>Password</label>
            <input className={inputClass} type="password" onChange={e => setForm({...form, password: e.target.value})} />
          </div>
          
          <button className="w-full bg-gray-800 hover:bg-black text-white py-2.5 rounded transition-colors text-sm font-medium mt-2" disabled={sending}>
            {sending ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <footer className="mt-8 pt-6 border-t border-gray-100 text-center">
          <Link to="/register" className="text-[11px] font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-[0.2em]">
            Create Account
          </Link>
        </footer>
      </div>
    </div>
  );
}