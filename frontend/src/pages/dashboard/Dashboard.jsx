// src/pages/dashboard/Dashboard.jsx

// IMPORTACIONS
import { Link } from "react-router-dom";
import { useGet } from "../../hooks/useApi";
import { useState, useEffect } from "react";
import api from "../../services/api";

// ESTILS DE PAGINA
const PAGE_CONTAINER = "max-w-7xl mx-auto text-gray-900 flex flex-col min-h-[85vh] px-4";
const HEADER_TITLE = "text-2xl font-bold tracking-tight text-gray-900";
const HEADER_SUBTITLE = "text-[10px] text-gray-400 uppercase tracking-widest mt-1";
const GRID_CONTAINER = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6";

// ESTILS DE CARD
const CARD_BASE = "group relative bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all";
const ICON_WRAPPER = "absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity";
const ICON_SHAPE = "w-16 h-16 rounded-full bg-current";
const CARD_TITLE = "text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1";
const COUNT_STYLE = "text-4xl font-bold text-gray-900";
const BADGE_STYLE = "text-xs font-medium text-green-600 mb-1 bg-green-50 px-2 py-0.5 rounded-full";
const LINK_TEXT = "mt-4 text-xs font-medium text-gray-400 group-hover:text-gray-900 flex items-center gap-1 transition-colors";

// ESTILS D'ACCIONS RAPIDES
const ACTIONS_TITLE = "text-sm font-bold text-gray-900 mb-4";
const ACTIONS_BTN = "px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold uppercase hover:bg-gray-50 hover:border-gray-300";

// ESTILS DE LA QUOTE (A BAIX I SUAU)
const QUOTE_WRAPPER = "mt-auto pt-12 min-h-[140px]"; 
const QUOTE_BOX = "bg-gray-50/50 border border-gray-100 rounded-xl p-6 text-center transition-opacity duration-1000";
const QUOTE_TEXT = "text-md italic text-gray-500 font-medium";
const QUOTE_AUTHOR = "text-[9px] uppercase tracking-[0.2em] text-gray-400 mt-2 block";

/**
 * Component principal del Dashboard.
 * Gestiona la visualització de mètriques i la càrrega de frases motivacionals.
 */
export default function Dashboard() {
  const { data: stats, loading } = useGet("/stats/dashboard");
  const [quote, setQuote] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const s = Array.isArray(stats) ? {} : stats;

  /**
   * Obté una nova frase de l'API externa.
   * Filtra la frase per defecte per mantenir la varietat.
   */
  const fetchNewQuote = async () => {
    try {
      const res = await api.get("/stats/dashboard");
      const newQuote = res.data.data.external_quote;
      
      if (newQuote.text !== "Everything you can imagine is real.") {
        setQuote(newQuote);
        setIsVisible(true);
      }
    } catch (err) {
      console.log("External API error or Rate Limit reached.");
    }
  };

  useEffect(() => {
    if (!loading && s.external_quote) {
      setQuote(s.external_quote);
      setIsVisible(true);
    }

    const interval = setInterval(() => {
      setIsVisible(false); 
      setTimeout(fetchNewQuote, 1000); 
    }, 15000);

    return () => clearInterval(interval);
  }, [loading, s.external_quote]);

  /**
   * Component intern per a les targetes d'estadístiques.
   */
  const StatCard = ({ title, count, activeCount, labelActive, to, color }) => (
    <Link to={to} className={CARD_BASE} aria-label={`${title}: ${count}`}>
      <div className={`${ICON_WRAPPER} ${color}`} aria-hidden="true"><div className={ICON_SHAPE}></div></div>
      <h3 className={CARD_TITLE}>{title}</h3>
      <div className="flex items-end gap-3">
        <span className={COUNT_STYLE}>{loading ? '-' : count || 0}</span>
        {activeCount !== undefined && (
          <span className={BADGE_STYLE}>
            {loading ? '-' : activeCount} {labelActive}
          </span>
        )}
      </div>
      <div className={LINK_TEXT} aria-hidden="true">View Details <span>→</span></div>
    </Link>
  );

  return (
    <div className={PAGE_CONTAINER}>
      <header className="mb-8">
        <h1 className={HEADER_TITLE}>Dashboard</h1>
        <p className={HEADER_SUBTITLE}>Overview & Key Metrics</p>
      </header>

      <section className={GRID_CONTAINER} aria-label="Mètriques principals">
        <StatCard title="Total Devices" count={s.devices} activeCount={s.active_devices} labelActive="Active" to="/devices" color="text-blue-500" />
        <StatCard title="Total Owners" count={s.owners} activeCount={s.active_owners} labelActive="Active" to="/owners" color="text-purple-500" />
        <StatCard title="Providers" count={s.providers} activeCount={s.active_providers} labelActive="Active" to="/providers" color="text-orange-500" />
        <StatCard title="Contracts" count={s.contracts} activeCount={s.active_contracts} labelActive="Active" to="/rental-contracts" color="text-pink-500" />
      </section>

      <nav className="mt-12" aria-label="Accions ràpides">
        <h3 className={ACTIONS_TITLE}>Quick Actions</h3>
        <div className="flex gap-4">
           <Link to="/devices" className={ACTIONS_BTN}>Add Device</Link>
           <Link to="/owners" className={ACTIONS_BTN}>Add Owner</Link>
           <Link to="/providers" className={ACTIONS_BTN}>Add Provider</Link>
           <Link to="/rental-contracts" className={ACTIONS_BTN}>Add Contract</Link>
        </div>
      </nav>

      {/* SECCIÓ FRASE amb accessibilitat per a contingut dinàmic */}
      <aside className={QUOTE_WRAPPER} aria-live="polite">
        {quote && (
          <div className={`${QUOTE_BOX} ${isVisible ? 'opacity-100' : 'opacity-0'}`} role="status">
            <p className={QUOTE_TEXT}>"{quote.text}"</p>
            <span className={QUOTE_AUTHOR}>— {quote.author}</span>
          </div>
        )}
      </aside>
    </div>
  );
}