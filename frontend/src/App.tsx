import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import Agents from "./pages/Agents";
import Rentals from "./pages/Rentals";
import Pending from "./pages/Pending";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        
        {/* Navbar */}
        <nav className="bg-white shadow-md px-6 py-4">
          <div className="flex gap-6 font-medium">
            <Link to="/">Dashboard</Link>
            <Link to="/agents">Agents</Link>
            <Link to="/rentals">Rentals</Link>
            <Link to="/pending">Pending</Link>
          </div>
        </nav>

        {/* Pages */}
        <main className="p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/rentals" element={<Rentals />} />
            <Route path="/pending" element={<Pending />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}