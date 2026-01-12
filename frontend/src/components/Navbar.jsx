import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function Navbar() {
  const { logout, user } = useContext(AuthContext)

  return (
    <div className="flex justify-between items-center bg-blue-600 text-white p-4">
      <div className="font-bold text-xl">Inventory Panel</div>
      {user && (
        <div className="flex items-center gap-4">
          <span>{user.name}</span>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
