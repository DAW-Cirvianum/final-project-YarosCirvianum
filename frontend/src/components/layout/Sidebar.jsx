import { NavLink } from "react-router-dom";

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h3 className="text-xs uppercase tracking-wide text-gray-400 mb-2">
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
        `px-3 py-2 rounded text-sm ${
          isActive ? "bg-gray-700" : "hover:bg-gray-700"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-4">
      <div className="text-xl font-bold mb-8">Inventory Panel</div>

      <Section title="General">
        <Item to="/">Dashboard</Item>
        <Item to="/devices">Devices</Item>
      </Section>

      <Section title="Management">
        <Item to="/owners">Owners</Item>
        <Item to="/providers">Providers</Item>
        <Item to="/rental-contracts">Rental Contracts</Item>
      </Section>

      <Section title="Legacy / History">
        <Item to="/legacy-devices">Legacy Devices</Item>
        <Item to="/owner-history">Owner History</Item>
        <Item to="/device-incidents">Device Incidents</Item>
        <Item to="/invoices">Invoices</Item>
      </Section>
    </aside>
  );
}
