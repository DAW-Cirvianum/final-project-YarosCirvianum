import { useGet } from "../../hooks/useApi";
import { Link } from "react-router-dom";

export default function Dashboard() {
  // Carreguem les dades de l'endpoint nou
  const { data: stats, loading } = useGet("/stats/dashboard");

  // Si l'API retorna un objecte directe (no array), useGet sol posar-ho a 'data'.
  // Com que el teu useGet està pensat per llistes (res.data.data), potser caldrà ajustar.
  // PERÒ: Si l'ApiResponse retorna { data: { ...stats } }, el useGet posarà aquest objecte a 'data'.
  // Si useGet inicialitza amb [], hem de vigilar.
  
  // Ajust ràpid per si useGet torna array buit al principi
  const s = Array.isArray(stats) ? {} : stats; 

  const StatCard = ({ title, count, activeCount, labelActive, to, color }) => (
    <Link to={to} className="group relative bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
        {/* Icona decorativa simple (cercle) */}
        <div className="w-16 h-16 rounded-full bg-current"></div>
      </div>
      
      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</h3>
      <div className="flex items-end gap-3">
        <span className="text-4xl font-bold text-gray-900">{loading ? '-' : count || 0}</span>
        {activeCount !== undefined && (
             <span className="text-xs font-medium text-green-600 mb-1 bg-green-50 px-2 py-0.5 rounded-full">
                {loading ? '-' : activeCount} {labelActive}
             </span>
        )}
      </div>
      <div className="mt-4 text-xs font-medium text-gray-400 group-hover:text-gray-900 flex items-center gap-1 transition-colors">
        View Details <span>→</span>
      </div>
    </Link>
  );

  return (
    <div className="max-w-7xl mx-auto text-gray-900">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Overview & Key Metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            title="Total Devices" 
            count={s.devices} 
            activeCount={s.active_devices} 
            labelActive="Active" 
            to="/devices" 
            color="text-blue-500"
        />
        <StatCard 
            title="Total Owners" 
            count={s.owners} 
            activeCount={s.active_owners} 
            labelActive="Active" 
            to="/owners" 
            color="text-purple-500"
        />
        <StatCard 
            title="Providers" 
            count={s.providers} 
            activeCount={s.active_providers} 
            labelActive="Active" 
            to="/providers" 
            color="text-orange-500"
        />
        <StatCard 
            title="Contracts" 
            count={s.contracts} 
            activeCount={s.active_contracts} 
            labelActive="Active" 
            to="/rental-contracts" 
            color="text-pink-500"
        />
      </div>

      {/* Secció Extra (opcional) */}
      <div className="mt-12">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex gap-4">
             <Link to="/devices" className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold uppercase hover:bg-gray-50 hover:border-gray-300">
                Add Device
             </Link>
             <Link to="/owners" className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold uppercase hover:bg-gray-50 hover:border-gray-300">
                Add Owner
             </Link>
             <Link to="/providers" className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold uppercase hover:bg-gray-50 hover:border-gray-300">
                Add Provider
             </Link>
             <Link to="/rental-contracts" className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold uppercase hover:bg-gray-50 hover:border-gray-300">
                Add Contract
             </Link>
        </div>
      </div>
    </div>
  );
}