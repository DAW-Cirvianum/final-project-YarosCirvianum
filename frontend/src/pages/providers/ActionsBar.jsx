// src/pages/providers/ActionsBar.jsx

// IMPORTACIONS
import { useState } from "react";

// ESTILS
const BAR_CONTAINER = "bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm flex flex-col md:flex-row items-stretch md:items-end gap-4 text-gray-900";
const GRID_LAYOUT = "flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4";
const FIELD_COL = "flex flex-col";
const LABEL_STYLE = "text-[10px] font-bold text-gray-400 uppercase mb-1";
const INPUT_STYLE = "border border-gray-300 px-3 py-2 rounded text-xs outline-none focus:border-black bg-white";
const BTN_GROUP = "flex gap-2 justify-end";
const BTN_RESET = "text-[10px] font-bold text-gray-400 hover:text-black uppercase px-2";
const BTN_ADD = "bg-gray-900 text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-widest hover:bg-black transition-all";

/**
 * Component de barra d'accions per gestionar filtres de proveidors.
 */

export default function ActionsBar({ filters, setFilters, onAdd }) {
  // LOGICA
  const update = (key, val) => setFilters({ ...filters, [key]: val, page: 1 });
  // RENDERITZAT
  return (
    <div className={BAR_CONTAINER} role="search" aria-label="Filtres de cerca de proveidors">
      <div className={GRID_LAYOUT}>
        {/* FILTRE NOM */}
        <div className={FIELD_COL}>
          <label htmlFor="filter-prov-name" className={LABEL_STYLE}>Search Name</label>
          <input id="filter-prov-name" className={INPUT_STYLE} placeholder="Company name..." value={filters.name || ""} onChange={(e) => update('name', e.target.value)} aria-label="Filtrar per nom d'empresa" />
        </div>

        {/* FILTRE ESTAT */}
        <div className={FIELD_COL}>
   
        <label htmlFor="filter-prov-status" className={LABEL_STYLE}>Status</label>
          <select id="filter-prov-status" className={INPUT_STYLE} onChange={(e) => update('is_active', e.target.value)} value={filters.is_active !== undefined ? filters.is_active : ""} aria-label="Filtrar per estat actiu o inactiu">
            <option value="">All Status</option>
            <option value="1">Active Only</option>
            <option value="0">Inactive Only</option>
          </select>
        </div>
      </div>
      
      <div className={BTN_GROUP}>
        <button onClick={() => window.location.reload()} className={BTN_RESET} aria-label="Reiniciar filtres">Reset</button>
        <button onClick={onAdd} className={BTN_ADD} aria-label="Crear nou proveidor">Create New +</button>
      </div>
    </div>
  );
}