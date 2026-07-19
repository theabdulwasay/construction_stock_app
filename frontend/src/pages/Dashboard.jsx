import { useEffect, useState } from "react";
import api, { CATEGORY_COLORS } from "../api";
import StatCard from "../components/StatCard";
import { Wallet, PackageSearch, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

const fmt = (n) => `Rs ${Number(n).toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("dashboard/").then((res) => setData(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (loading || !data) {
    return <div className="p-8 text-[#71767a] font-mono-data text-sm">Loading ledger…</div>;
  }

  return (
    <div className="p-8 space-y-8 max-w-6xl">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-[#24272B]">Yard Overview</h1>
        <p className="text-sm text-[#71767a] mt-1">
          Live stock value, today's activity, and reorder alerts across the depot.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          eyebrow="Total Stock Value"
          value={fmt(data.total_stock_value)}
          sub={`${data.total_materials} materials tracked`}
          accent="#4E6E7E"
          icon={Wallet}
        />
        <StatCard
          eyebrow="Today's Purchases"
          value={fmt(data.today_purchase_total)}
          sub={`${data.today_purchase_count} stock-in entries`}
          accent="#37515E"
          icon={TrendingDown}
        />
        <StatCard
          eyebrow="Today's Sales"
          value={fmt(data.today_sale_total)}
          sub={`${data.today_sale_count} stock-out entries`}
          accent="#C3922E"
          icon={TrendingUp}
        />
        <StatCard
          eyebrow="Low Stock Alerts"
          value={data.low_stock_count}
          sub="At or below reorder level"
          accent="#B9502F"
          icon={AlertTriangle}
        />
      </div>

      {data.low_stock_items.length > 0 && (
        <div className="bg-[#F7F5F0] border border-[#E6C7B8] rounded-lg p-5">
          <div className="flex items-center gap-2 text-[#B9502F] font-semibold text-sm mb-3">
            <AlertTriangle size={16} /> Reorder Needed
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.low_stock_items.map((m) => (
              <div key={m.id} className="flex items-center justify-between bg-white rounded-md border border-[#DAD5C9] px-4 py-3">
                <div>
                  <div className="text-sm font-semibold text-[#24272B]">{m.name}</div>
                  <div className="text-xs text-[#8a8f93]">Reorder at {m.reorder_level} {m.unit_display}</div>
                </div>
                <div className="font-mono-data text-sm font-bold text-[#B9502F]">
                  {Number(m.stock_quantity).toFixed(1)} {m.unit}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <ActivityPanel title="Recent Stock-In (Purchases)" rows={data.recent_purchases} party="supplier_name" accent="#37515E" />
        <ActivityPanel title="Recent Stock-Out (Sales)" rows={data.recent_sales} party="customer_name" accent="#C3922E" />
      </div>

      <div>
        <h2 className="font-display font-bold text-lg text-[#24272B] mb-3">Current Stock, by Material</h2>
        <div className="bg-[#F7F5F0] border border-[#DAD5C9] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#EDEAE2] text-left text-[11px] uppercase tracking-wider text-[#71767a]">
                <th className="px-4 py-3">Material</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-right">Rate</th>
                <th className="px-4 py-3 text-right">Stock</th>
                <th className="px-4 py-3 text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              {data.materials_by_category.map((m) => {
                const c = CATEGORY_COLORS[m.category] || CATEGORY_COLORS.OTHER;
                return (
                  <tr key={m.id} className="border-t border-[#DAD5C9]">
                    <td className="px-4 py-3 font-medium text-[#24272B]">{m.name}</td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-0.5 rounded text-xs font-semibold"
                        style={{ backgroundColor: c.bg, color: c.text }}
                      >
                        {c.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono-data">{fmt(m.current_rate)}</td>
                    <td className={`px-4 py-3 text-right font-mono-data ${m.is_low_stock ? "text-[#B9502F] font-bold" : ""}`}>
                      {Number(m.stock_quantity).toFixed(1)} {m.unit}
                    </td>
                    <td className="px-4 py-3 text-right font-mono-data">{fmt(m.stock_value)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ActivityPanel({ title, rows, party, accent }) {
  return (
    <div className="bg-[#F7F5F0] border border-[#DAD5C9] rounded-lg p-5">
      <h3 className="font-display font-bold text-sm text-[#24272B] mb-3">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-[#8a8f93]">No entries yet.</p>
      ) : (
        <div className="space-y-2">
          {rows.map((r) => (
            <div key={r.id} className="flex items-center justify-between text-sm border-b border-[#DAD5C9] last:border-0 pb-2 last:pb-0">
              <div>
                <div className="font-medium text-[#24272B]">{r.material_name}</div>
                <div className="text-xs text-[#8a8f93]">{r[party] || "—"} · {r.date}</div>
              </div>
              <div className="font-mono-data font-semibold" style={{ color: accent }}>
                {fmt(r.total_amount)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
