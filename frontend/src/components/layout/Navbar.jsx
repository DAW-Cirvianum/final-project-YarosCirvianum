// src/components/layout/Navbar.jsx

// IMPORTACIONS
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

// ESTILS
const NAV_CONTAINER = "h-16 bg-gray-100 border-b border-gray-200 flex items-center justify-between px-10";
const USER_LABEL = "text-[12px] text-gray-400 uppercase tracking-widest";
const USER_NAME = "text-gray-900 font-bold ml-1";
const LOGOUT_BTN = "text-[12px] font-bold text-gray-400 hover:text-red-600 transition-colors uppercase tracking-[0.2em]";

export default function Navbar() {
  // CONTEXT
  const { logout, user } = useContext(AuthContext)

  // RENDERITZAT
  return (
    <header className={NAV_CONTAINER}>
      <div className={USER_LABEL}>
        Active User: <span className={USER_NAME}>{user?.name}</span>
      </div>
      <button onClick={logout} className={LOGOUT_BTN}>Sign Out</button>
    </header>
  )
}