import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Agents from "./pages/Agents";
import Rentals from "./pages/Rentals";
import Pending from "./pages/Pending";
import SidebarLink from "./components/layout/Sidebar";
import TopBar from "./components/layout/Topbar";

export default function App() {
  return (
    <BrowserRouter>
      {/* Container wraps the entire screen */}
      <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
        
        {/* 1. Sidebar - Fixed width, full height */}
        <aside className="w-64 bg-gray-900 text-white flex flex-col">
          <div className="p-6 text-xl font-bold border-b border-gray-800">
            RentalManager
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2">
            <SidebarLink to="/" label="Dashboard" />
            <SidebarLink to="/agents" label="Agents" />
            <SidebarLink to="/rentals" label="Rentals" />
            <SidebarLink to="/pending" label="Pending" />
          </nav>

          <div className="p-4 border-t border-gray-800">
             <Link to="/settings" className="text-sm text-gray-400 hover:text-white">Settings</Link>
          </div>
        </aside>

        {/* 2. Right Side Wrapper */}
        <div className="flex flex-col flex-1 min-w-0">
          
          {/* 3. Top Bar - Fixed height */}
          <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8">
            <TopBar />
          </header>

          {/* 4. Main Content Area - Scrollable Rectangle */}
          <main className="flex-1 overflow-y-auto p-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/rentals" element={<Rentals />} />
              <Route path="/pending" element={<Pending />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}