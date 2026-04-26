import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Agents from "./pages/Agents";
import Rentals from "./pages/Rentals";
import Pending from "./pages/Pending";
import TopBar from "./components/layout/Topbar";
import Sidebar from "./components/layout/Sidebar";

export default function App() {
  return (
    <BrowserRouter>
      {/* Container wraps the entire screen */}
      <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
        
        {/* 1. Sidebar - Fixed width, full height */}
        <Sidebar />

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