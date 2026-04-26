import { NavLink } from "react-router-dom";

// 1. The Helper Component
function SidebarLink({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-4 py-2.5 rounded-md transition-all duration-200 text-sm font-medium ${
          isActive
            ? "bg-blue-600 text-white shadow-sm" 
            : "text-gray-400 hover:text-white hover:bg-gray-800"
        }`
      }
    >
      {label}
    </NavLink>
  );
}

// 2. The Main Sidebar Component
export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col shrink-0">
      <div className="p-6 text-xl font-bold border-b border-gray-800 tracking-tight">
        RentalManager
      </div>
      
      <nav className="flex-1 px-3 py-6 space-y-1">
        <SidebarLink to="/" label="Dashboard" />
        <SidebarLink to="/agents" label="Agents" />
        <SidebarLink to="/rentals" label="Rentals" />
        <SidebarLink to="/pending" label="Pending" />
      </nav>

      <div className="p-4 border-t border-gray-800">
        <SidebarLink to="/settings" label="Settings" />
      </div>
    </aside>
  );
}