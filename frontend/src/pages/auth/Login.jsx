// src/pages/auth/Login.jsx

// IMPORTACIONS
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useSubmit } from "../../hooks/useSubmit";

// ESTILS
const PAGE_CONTAINER = "min-h-screen flex flex-col items-center justify-center bg-gray-100 font-sans antialiased px-4";
const LOGO_STYLE = "h-8 w-auto mb-8 object-contain";
const CARD_STYLE = "w-full max-w-sm bg-white border border-gray-200 p-10 rounded-lg shadow-sm";
const HEADER_STYLE = "mb-10 text-center";
const TITLE_STYLE = "text-xl font-medium tracking-tight text-gray-900";
const ERROR_BOX = "mb-6 bg-red-50 border border-red-100 text-red-600 p-3 rounded text-xs text-center font-medium";
const LABEL_STYLE = "block text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] mb-2";
const BTN_STYLE = "w-full bg-gray-800 hover:bg-black text-white py-2.5 rounded transition-colors text-sm font-medium mt-2";
const FOOTER_STYLE = "mt-6 pt-6 border-t border-gray-300 text-center space-y-2";
const LINK_STYLE = "text-[11px] font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-[0.2em]";
const ADMIN_LINK = "text-[11px] text-gray-400 font-bold hover:text-red-700 uppercase tracking-widest transition-colors";

/**
 * Genera les classes CSS per als camps d'entrada segons l'estat d'error.
 * @param {boolean} err - Indica si hi ha un error de validació o credencials.
 * @returns {string} String amb les classes de Tailwind.
 */
const inputClass = (err) => `w-full border ${err ? "border-red-500 bg-red-50" : "border-gray-300"} bg-white px-3 py-2.5 rounded text-sm focus:outline-none focus:border-gray-600 transition-colors placeholder:text-gray-400 text-gray-800`;

/**
 * Component de la pàgina d'inici de sessió.
 * Gestiona l'autenticació d'usuaris i la redirecció a l'aplicació.
 */
export default function Login() {
  // ESTATS I HOOKS
  const [form, setForm] = useState({});
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const { submit, errors, sending } = useSubmit("/login", "post", (data) => {
    localStorage.setItem("token", data.token);
    setUser(data.user);
    setTimeout(() => navigate("/"), 20);
  });

  // LOGICA
  const generalError = errors?.credentials?.[0] || errors?.email?.[0];

  /**
   * Gestiona l'enviament del formulari d'inici de sessió.
   * @param {Event} e - Esdeveniment de submit del formulari.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    submit({ login: form.login, password: form.password });
  };

  // RENDERITZAT
  return (
    <div className={PAGE_CONTAINER}>
      <img src="/logo-horiz-black.png" alt="Logo" className={LOGO_STYLE} />
      
      <div className={CARD_STYLE}>
        <header className={HEADER_STYLE}>
          <h1 className={TITLE_STYLE}>Inventory Management</h1>
        </header>

        {generalError && <div role="alert" className={ERROR_BOX}>{generalError}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="login" className={LABEL_STYLE}>Login</label>
            <input id="login" aria-required="true" className={inputClass(!!generalError)} placeholder="User or Email" onChange={(e) => setForm({ ...form, login: e.target.value })} />
          </div>
          <div>
            <label htmlFor="password" className={LABEL_STYLE}>Password</label>
            <input id="password" type="password" aria-required="true" className={inputClass(!!generalError)} placeholder="************" onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button type="submit" className={BTN_STYLE} disabled={sending}>
            {sending ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <footer className={FOOTER_STYLE}>
          <div>
            <Link to="/register" className={LINK_STYLE}>Create Account</Link>
          </div>
          <div>
            <a href="http://localhost:8000/admin/login" className={ADMIN_LINK}>Admin Portal</a>
          </div>
        </footer>
      </div>
    </div>
  );
}