// src/components/layout/Sidebar.jsx

// IMPORTACIONS
import { NavLink } from "react-router-dom";

// ESTILS
const ASIDE_CONTAINER = "w-64 bg-gray-200 border-r border-gray-300 h-screen flex flex-col py-8";
const LOGO_TEXT = "text-lg font-bold tracking-[0.1em] px-8 mb-12 text-gray-900";
const NAV_CONTAINER = "flex-1 overflow-y-auto";

const SECTION_BOX = "mb-8 px-4";
const SECTION_TITLE = "text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-3 px-2";
const SECTION_CONTENT = "flex flex-col gap-1";

const ITEM_BASE = "px-3 py-2 rounded text-sm transition-all duration-200";
const ITEM_ACTIVE = "bg-white text-black font-semibold shadow-sm";
const ITEM_INACTIVE = "text-gray-600 hover:text-black hover:bg-gray-50";

// COMPONENTS AUXILIARS
function Section({ title, children }) {
  return (
    <div className={SECTION_BOX}>
      <h3 className={SECTION_TITLE}>{title}</h3>
      <div className={SECTION_CONTENT}>{children}</div>
    </div>
  );
}

function Item({ to, children }) {
  return (
    <NavLink to={to} className={({ isActive }) => `${ITEM_BASE} ${isActive ? ITEM_ACTIVE : ITEM_INACTIVE}`}>
      {children}
    </NavLink>
  );
}

// COMPONENT PRINCIPAL
export default function Sidebar() {
  return (
    <aside className={ASIDE_CONTAINER}>
      <div className={LOGO_TEXT}>Inventory</div>
      <nav className={NAV_CONTAINER}>
        <Section title="General">
          <Item to="/">Dashboard</Item>
        </Section>
        <Section title="Management">
          <Item to="/devices">Devices</Item>
          <Item to="/owners">Owners</Item>
          <Item to="/providers">Providers</Item>
          <Item to="/rental-contracts">Contracts</Item>
        </Section>
        <Section title="Legacy / History">
          <Item to="/legacy-devices">Legacy Devices</Item>
          <Item to="/owner-history">History</Item>
          <Item to="/device-incidents">Incidents</Item>
          <Item to="/invoices">Invoices</Item>
        </Section>
      </nav>
    </aside>
  );
}