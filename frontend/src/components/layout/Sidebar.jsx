// src/components/layout/Sidebar.jsx
import { NavLink } from "react-router-dom";

function Section({ title, children }) {
  return (
    <div className="mb-8 px-4">
      <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-3 px-2">
        {title}
      </h3>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

function Item({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded text-sm transition-all duration-200 ${
          isActive
            ? "bg-white text-black font-semibold shadow-sm"
            : "text-gray-600 hover:text-black hover:bg-gray-50"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-200 border-r border-gray-300 h-screen flex flex-col py-8">
      <div className="text-lg font-bold tracking-[0.1em] px-8 mb-12 text-gray-900">
        Inventory
      </div>

      <nav className="flex-1 overflow-y-auto">
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
