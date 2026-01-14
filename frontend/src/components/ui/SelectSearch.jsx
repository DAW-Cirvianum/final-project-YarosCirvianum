// src/components/ui/SelectSearch.jsx
import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function SelectSearch({ label, url, onSelect, placeholder = "Search..." }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.length > 0) {
        api.get(`${url}?name=${query}&per_page=10`).then(res => setResults(res.data.data));
      } else { setResults([]); }
    }, 300);
    return () => clearTimeout(delay);
  }, [query, url]);

  const handlePick = (item) => {
    const name = item.owner_name || item.name || item.device_type;
    setQuery(name);
    setOpen(false);
    onSelect(item);
  };

  return (
    <div className="relative w-full text-left">
      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">{label}</label>
      <input 
        className="w-full border border-gray-300 bg-white px-3 py-2 rounded text-xs focus:border-black outline-none"
        value={query} onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        placeholder={placeholder} onFocus={() => setOpen(true)}
      />
      {open && results.length > 0 && (
        <ul className="absolute z-[100] w-full bg-white border border-gray-200 shadow-xl rounded mt-1 max-h-48 overflow-auto">
          {results.map(item => (
            <li key={item.id} onMouseDown={() => handlePick(item)}
                className="p-2 hover:bg-gray-100 cursor-pointer text-xs border-b border-gray-50 last:border-0 text-gray-900">
              {item.owner_name || item.name || item.device_type}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}