// src/components/layout/Navbar.jsx
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

export default function Navbar() {
  const { logout, user } = useContext(AuthContext)
  return (
    <header className="h-16 bg-gray-100 border-b border-gray-200 flex items-center justify-between px-10">
      <div className="text-[12px] text-gray-400 uppercase tracking-widest">
        Active User: <span className="text-gray-900 font-bold ml-1">{user?.name}</span>
      </div>
      <button 
        onClick={logout} 
        className="text-[12px] font-bold text-gray-400 hover:text-red-600 transition-colors uppercase tracking-[0.2em]"
      >
        Sign Out
      </button>
    </header>
  )
}