import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

export default function Dashboard() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6 bg-gray-100 flex-1">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="mt-4">Aquí aniran els continguts de l’inventari...</p>
        </div>
      </div>
    </div>
  )
}
