// src/components/ui/SelectSearch.jsx

// IMPORTACIONS
import { useState, useEffect } from 'react';
import api from '../../services/api';

// ESTILS
const WRAPPER_STYLE = "relative w-full text-left";
const LABEL_STYLE = "block text-[10px] font-bold text-gray-400 uppercase mb-1";
const INPUT_BASE = "w-full border px-3 py-2 rounded text-xs focus:border-black outline-none transition-colors";
const INPUT_ERR = "border-red-500 bg-red-50";
const INPUT_OK = "border-gray-300 bg-white";
const LIST_STYLE = "absolute z-[100] w-full bg-white border border-gray-200 shadow-xl rounded mt-1 max-h-48 overflow-auto";
const ITEM_STYLE = "p-2 hover:bg-gray-100 cursor-pointer text-xs border-b border-gray-50 text-gray-900 truncate";
const ERROR_MSG = "text-red-500 text-[9px] mt-1 font-bold uppercase tracking-wide";

export default function SelectSearch({ 
  label, url, onSelect, onType, displayKey = "name", 
  placeholder = "Search...", initialText = "", maxLength, error 
}) {
  // ESTATS
  const [query, setQuery] = useState(initialText);
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);

  // EFECTES
  useEffect(() => { setQuery(initialText); }, [initialText]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (open) {
        const endpoint = query ? `${url}?name=${query}&per_page=10` : `${url}?per_page=10&sort_by=name`;
        api.get(endpoint).then(res => setResults(res.data.data)).catch(() => setResults([]));
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [query, url, open]);

  // HANDLERS
  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setOpen(true);
    if (onType) onType(val);
    onSelect(null);
  };

  const handlePick = (item) => {
    const txt = item[displayKey] || item.name;
    setQuery(txt);
    setOpen(false);
    if (onType) onType(txt);
    onSelect(item);
  };

  // RENDERITZAT
  return (
    <div className={WRAPPER_STYLE} onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}>
      <label className={LABEL_STYLE}>{label}</label>
      <input 
        className={`${INPUT_BASE} ${error ? INPUT_ERR : INPUT_OK}`}
        value={query} 
        onChange={handleChange}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        maxLength={maxLength}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
      />
      
      {open && results.length > 0 && (
        <ul className={LIST_STYLE}>
          {results.map(item => (
            <li key={item.id} onMouseDown={() => handlePick(item)} className={ITEM_STYLE}>
              {item[displayKey] || item.name}
            </li>
          ))}
        </ul>
      )}

      {error && <p className={ERROR_MSG}>{error}</p>}
    </div>
  );
}