import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Materials from "./pages/Materials";
import Purchases from "./pages/Purchases";
import Sales from "./pages/Sales";
import Parties from "./pages/Parties";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/parties" element={<Parties />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
