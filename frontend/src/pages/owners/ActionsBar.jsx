// src/pages/owners/ActionsBar.jsx
import { useState } from "react";

export default function ActionsBar({ filters, setFilters, onAdd }) {
  // Estat local per als inputs de text (per evitar recàrregues a cada lletra, fem servir onBlur o Enter si cal, o directe)
  // En aquest cas, per mantenir l'estil reactiu, ho connectarem directe però amb cura.
  
  const update = (key, val) => setFilters({ ...filters, [key]: val, page: 1 });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm flex items-end gap-4 text-gray-900">
      <div className="flex-1 grid grid-cols-4 gap-4">
        {/* Filtre per Nom */}
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-gray-400 uppercase mb-1">Search Name</label>
          <input
            className="border border-gray-300 px-3 py-2 rounded text-xs outline-none focus:border-black bg-white"
            placeholder="Filter by name..."
            value={filters.name || ""}
            onChange={(e) => update('name', e.target.value)}
          />
        </div>

        {/* Filtre per Email */}
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-gray-400 uppercase mb-1">Search Email</label>
          <input
            className="border border-gray-300 px-3 py-2 rounded text-xs outline-none focus:border-black bg-white"
            placeholder="Filter by email..."
            value={filters.email || ""}
            onChange={(e) => update('email', e.target.value)}
          />
        </div>

        {/* Filtre per Status */}
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-gray-400 uppercase mb-1">Status</label>
          <select
            className="border border-gray-300 px-3 py-2 rounded text-xs outline-none focus:border-black bg-white"
            onChange={(e) => update('is_active', e.target.value)}
            value={filters.is_active !== undefined ? filters.is_active : ""}
          >
            <option value="">All Status</option>
            <option value="1">Active Only</option>
            <option value="0">Inactive Only</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => window.location.reload()} className="text-[10px] font-bold text-gray-400 hover:text-black uppercase px-2">Reset</button>
        <button onClick={onAdd} className="bg-gray-900 text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-widest hover:bg-black transition-all">
          Create New +
        </button>
      </div>
    </div>
  );
}