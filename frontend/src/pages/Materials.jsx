import { useEffect, useState } from "react";
import api, { CATEGORY_COLORS } from "../api";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const CATEGORIES = ["CEMENT", "RET", "BAJRI", "BRICK", "STEEL", "OTHER"];
const UNITS = ["BAG", "TON", "CFT", "TROLLEY", "KG", "PCS"];

const emptyForm = { name: "", category: "CEMENT", unit: "BAG", current_rate: "", stock_quantity: "", reorder_level: "" };

export default function Materials() {
  const [materials, setMaterials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("materials/").then((res) => setMaterials(res.data.results || res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(emptyForm); setEditingId(null); setShowForm(true); };
  const openEdit = (m) => {
    setForm({
      name: m.name, category: m.category, unit: m.unit,
      current_rate: m.current_rate, stock_quantity: m.stock_quantity, reorder_level: m.reorder_level,
    });
    setEditingId(m.id);
    setShowForm(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await api.patch(`materials/${editingId}/`, form);
    } else {
      await api.post("materials/", form);
    }
    setShowForm(false);
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this material? This cannot be undone.")) return;
    await api.delete(`materials/${id}/`);
    load();
  };

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[#24272B]">Materials & Rates</h1>
          <p className="text-sm text-[#71767a] mt-1">Manage cement, ret, bajri and other material rates & reorder levels.</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-[#4E6E7E] text-white text-sm font-semibold px-4 py-2.5 rounded-md hover:bg-[#37515E] transition-colors"
        >
          <Plus size={16} /> Add Material
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="bg-[#F7F5F0] border border-[#DAD5C9] rounded-lg p-5 mb-6 animate-ticket-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-sm">{editingId ? "Edit Material" : "New Material"}</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={18} /></button>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Name">
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input" placeholder="e.g. OPC Cement (Bag)" />
            </Field>
            <Field label="Category">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input">
                {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_COLORS[c].label}</option>)}
              </select>
            </Field>
            <Field label="Unit">
              <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="input">
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </Field>
            <Field label="Rate per unit (Rs)">
              <input required type="number" step="0.01" value={form.current_rate}
                onChange={(e) => setForm({ ...form, current_rate: e.target.value })} className="input" />
            </Field>
            <Field label="Opening Stock">
              <input required type="number" step="0.01" value={form.stock_quantity}
                onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} className="input" />
            </Field>
            <Field label="Reorder Level">
              <input required type="number" step="0.01" value={form.reorder_level}
                onChange={(e) => setForm({ ...form, reorder_level: e.target.value })} className="input" />
            </Field>
          </div>
          <button className="mt-4 bg-[#24272B] text-white text-sm font-semibold px-5 py-2.5 rounded-md hover:bg-black transition-colors">
            {editingId ? "Save Changes" : "Add Material"}
          </button>
        </form>
      )}

      <div className="bg-[#F7F5F0] border border-[#DAD5C9] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#EDEAE2] text-left text-[11px] uppercase tracking-wider text-[#71767a]">
              <th className="px-4 py-3">Material</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-right">Rate</th>
              <th className="px-4 py-3 text-right">Stock</th>
              <th className="px-4 py-3 text-right">Reorder At</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && materials.map((m) => {
              const c = CATEGORY_COLORS[m.category] || CATEGORY_COLORS.OTHER;
              return (
                <tr key={m.id} className="border-t border-[#DAD5C9]">
                  <td className="px-4 py-3 font-medium">{m.name}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: c.bg, color: c.text }}>
                      {c.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono-data">Rs {Number(m.current_rate).toLocaleString()}</td>
                  <td className={`px-4 py-3 text-right font-mono-data ${m.is_low_stock ? "text-[#B9502F] font-bold" : ""}`}>
                    {Number(m.stock_quantity).toFixed(1)} {m.unit}
                  </td>
                  <td className="px-4 py-3 text-right font-mono-data text-[#8a8f93]">{Number(m.reorder_level).toFixed(1)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(m)} className="p-1.5 rounded hover:bg-[#DAD5C9]"><Pencil size={15} /></button>
                      <button onClick={() => remove(m.id)} className="p-1.5 rounded hover:bg-[#F0E1D6] text-[#B9502F]"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <style>{`.input { width: 100%; border: 1px solid #DAD5C9; border-radius: 6px; padding: 8px 10px; font-size: 14px; background: white; } .input:focus { outline: 2px solid #4E6E7E; outline-offset: 1px; }`}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-[#71767a] mb-1">{label}</span>
      {children}
    </label>
  );
}
