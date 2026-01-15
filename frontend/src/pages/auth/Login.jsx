// src/pages/auth/Login.jsx
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useSubmit } from "../../hooks/useSubmit";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({});
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const { submit, errors, sending } = useSubmit("/login", "post", (data) => {
    localStorage.setItem("token", data.token);
    setUser(data.user);
    setTimeout(() => navigate("/"), 20);
  });

  const inputClass = (isError) =>
    `w-full border ${
      isError ? "border-red-500 bg-red-50" : "border-gray-300"
    } bg-white px-3 py-2.5 rounded text-sm focus:outline-none focus:border-gray-600 transition-colors placeholder:text-gray-400 text-gray-800`;
  
  const labelClass = "block text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] mb-2";

  const generalError = errors?.credentials?.[0] || errors?.email?.[0];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 font-sans antialiased">
      
      {/* LOGO FORA DEL REQUADRE (TARGETA) */}
      <img 
        src="/logo-horiz-black.png" 
        alt="Logo" 
        className="h-8 w-auto mb-8 object-contain" 
      />

      <div className="w-full max-w-sm bg-white border border-gray-200 p-10 rounded-lg shadow-sm">
        <header className="mb-10 text-center">
          <h1 className="text-xl font-medium tracking-tight text-gray-900">
            Inventory Management
          </h1>
        </header>

        {generalError && (
          <div className="mb-6 bg-red-50 border border-red-100 text-red-600 p-3 rounded text-xs text-center font-medium">
            {generalError}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit({ login: form.login, password: form.password });
          }}
          className="flex flex-col gap-5"
        >
          <div>
            <label className={labelClass}>Identifier</label>
            <input
              className={inputClass(!!generalError)}
              placeholder="User or Email"
              onChange={(e) => setForm({ ...form, login: e.target.value })}
            />
          </div>

          <div>
            <label className={labelClass}>Password</label>
            <input
              className={inputClass(!!generalError)}
              type="password"
              placeholder="************"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            className="w-full bg-gray-800 hover:bg-black text-white py-2.5 rounded transition-colors text-sm font-medium mt-2"
            disabled={sending}
          >
            {sending ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <footer className="mt-8 pt-6 border-t border-gray-100 text-center">
          <Link
            to="/register"
            className="text-[11px] font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-[0.2em]"
          >
            Create Account
          </Link>
        </footer>
      </div>
    </div>
  );
}