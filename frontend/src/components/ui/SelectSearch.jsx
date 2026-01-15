// src/components/ui/SelectSearch.jsx
import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function SelectSearch({ 
  label, url, onSelect, onType, displayKey = "name", 
  placeholder = "Search...", initialText = "", maxLength, error 
}) {
  const [query, setQuery] = useState(initialText);
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => { setQuery(initialText); }, [initialText]);

  const fetchResults = (val) => {
    const endpoint = val ? `${url}?name=${val}&per_page=10` : `${url}?per_page=10&sort_by=name`;
    api.get(endpoint).then(res => setResults(res.data.data)).catch(() => setResults([]));
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      if (open) fetchResults(query === initialText ? '' : query);
    }, 300);
    return () => clearTimeout(delay);
  }, [query, url, open]);

  // Gestió del canvi de text
  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setOpen(true);
    
    // IMPORTANT: Si escriu, "des-seleccionem" l'objecte anterior fins que en triï un de nou
    if (onType) onType(val); // Avisem al pare que hi ha text
    onSelect(null);          // Posem l'ID a null
  };

  const handlePick = (item) => {
    const txt = item[displayKey] || item.name;
    setQuery(txt);
    setOpen(false);
    
    if (onType) onType(txt); // El text és vàlid
    onSelect(item);          // Seleccionem l'ID vàlid
  };

  return (
    <div className="relative w-full text-left" onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}>
      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">{label}</label>
      <input 
        className={`w-full border px-3 py-2 rounded text-xs focus:border-black outline-none transition-colors ${
          error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
        }`}
        value={query} 
        onChange={handleChange}
        onFocus={() => { setOpen(true); fetchResults(''); }}
        placeholder={placeholder}
        maxLength={maxLength}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
      />
      
      {/* LLISTA DESPLEGABLE */}
      {open && results.length > 0 && (
        <ul className="absolute z-[100] w-full bg-white border border-gray-200 shadow-xl rounded mt-1 max-h-48 overflow-auto">
          {results.map(item => (
            <li key={item.id} onMouseDown={() => handlePick(item)}
                className="p-2 hover:bg-gray-100 cursor-pointer text-xs border-b border-gray-50 text-gray-900 truncate">
              {item[displayKey] || item.name}
            </li>
          ))}
        </ul>
      )}

      {/* MISSATGE D'ERROR VERMELL */}
      {error && <p className="text-red-500 text-[9px] mt-1 font-bold uppercase tracking-wide">{error}</p>}
    </div>
  );
}