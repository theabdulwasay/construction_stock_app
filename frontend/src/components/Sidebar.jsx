import { NavLink } from "react-router-dom";
import { LayoutGrid, Boxes, TruckIcon, HandCoins, Users2 } from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/materials", label: "Materials & Rates", icon: Boxes },
  { to: "/purchases", label: "Stock In (Purchase)", icon: TruckIcon },
  { to: "/sales", label: "Stock Out (Sale)", icon: HandCoins },
  { to: "/parties", label: "Suppliers & Customers", icon: Users2 },
];

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 flex flex-col bg-[#24272B] text-[#EDEAE2]">
      <div className="px-6 py-6 border-b border-white/10">
        <div className="font-display font-extrabold text-xl tracking-tight leading-tight">
          STOCK<span className="text-[#C3922E]">YARD</span>
        </div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-white/50 mt-1">
          Ret · Bajri · Cement Ledger
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#4E6E7E] text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Icon size={17} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-white/10 text-[11px] text-white/40 font-mono-data">
        Depot ledger · SQLite backend
      </div>
    </aside>
  );
}
