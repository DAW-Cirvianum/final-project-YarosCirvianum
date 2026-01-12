import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Menu</h2>
      <nav className="flex flex-col gap-3">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `px-3 py-2 rounded ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
          }
        >
          Dashboard
        </NavLink>
        {/* la resta d’enllaços CRUD */}
      </nav>
    </div>
  )
}
