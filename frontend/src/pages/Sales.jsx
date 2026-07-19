import { useEffect, useState } from "react";
import api from "../api";
import { Plus, Trash2, X, HandCoins } from "lucide-react";

const today = () => new Date().toISOString().slice(0, 10);
const emptyForm = { material: "", customer: "", quantity: "", rate: "", date: today(), notes: "" };

export default function Sales() {
  const [rows, setRows] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([
      api.get("sales/"),
      api.get("materials/"),
      api.get("customers/"),
    ]).then(([p, m, s]) => {
      setRows(p.data.results || p.data);
      setMaterials(m.data.results || m.data);
      setCustomers(s.data.results || s.data);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setForm({ ...emptyForm, material: materials[0]?.id || "", customer: customers[0]?.id || "" });
    setShowForm(true);
  };

  const onMaterialChange = (id) => {
    const mat = materials.find((m) => m.id === Number(id));
    setForm({ ...form, material: id, rate: mat ? mat.current_rate : form.rate });
  };

  const submit = async (e) => {
    e.preventDefault();
    await api.post("sales/", { ...form, customer: form.customer || null });
    setShowForm(false);
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this sale entry? Stock will be added back.")) return;
    await api.delete(`sales/${id}/`);
    load();
  };

  const total = form.quantity && form.rate ? (Number(form.quantity) * Number(form.rate)).toLocaleString() : "0";

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[#24272B] flex items-center gap-2">
            <HandCoins size={22} className="text-[#C3922E]" /> Stock Out — Sales
          </h1>
          <p className="text-sm text-[#71767a] mt-1">Record material sold to customers. Stock quantity decreases automatically.</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-[#C3922E] text-white text-sm font-semibold px-4 py-2.5 rounded-md hover:bg-[#24272B] transition-colors">
          <Plus size={16} /> New Sale
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="bg-[#F7F5F0] border border-[#DAD5C9] rounded-lg p-5 mb-6 animate-ticket-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-sm">New Sale Entry</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={18} /></button>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Material">
              <select required value={form.material} onChange={(e) => onMaterialChange(e.target.value)} className="input">
                {materials.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </Field>
            <Field label="Customer">
              <select value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} className="input">
                <option value="">— none —</option>
                {customers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </Field>
            <Field label="Date">
              <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input" />
            </Field>
            <Field label="Quantity">
              <input type="number" step="0.01" required value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="input" />
            </Field>
            <Field label="Rate per unit (Rs)">
              <input type="number" step="0.01" required value={form.rate} onChange={(e) => setForm({ ...form, rate: e.target.value })} className="input" />
            </Field>
            <Field label="Notes">
              <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input" placeholder="Optional" />
            </Field>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="font-mono-data text-sm text-[#71767a]">Total: <span className="font-bold text-[#24272B]">Rs {total}</span></div>
            <button className="bg-[#24272B] text-white text-sm font-semibold px-5 py-2.5 rounded-md hover:bg-black transition-colors">
              Save Sale
            </button>
          </div>
        </form>
      )}

      <div className="bg-[#F7F5F0] border border-[#DAD5C9] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#EDEAE2] text-left text-[11px] uppercase tracking-wider text-[#71767a]">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Material</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3 text-right">Qty</th>
              <th className="px-4 py-3 text-right">Rate</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && rows.map((r) => (
              <tr key={r.id} className="border-t border-[#DAD5C9]">
                <td className="px-4 py-3 font-mono-data text-[#71767a]">{r.date}</td>
                <td className="px-4 py-3 font-medium">{r.material_name}</td>
                <td className="px-4 py-3">{r.customer_name || "—"}</td>
                <td className="px-4 py-3 text-right font-mono-data">{Number(r.quantity).toFixed(1)} {r.material_unit}</td>
                <td className="px-4 py-3 text-right font-mono-data">Rs {Number(r.rate).toLocaleString()}</td>
                <td className="px-4 py-3 text-right font-mono-data font-semibold text-[#C3922E]">Rs {Number(r.total_amount).toLocaleString()}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => remove(r.id)} className="p-1.5 rounded hover:bg-[#F0E1D6] text-[#B9502F]"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
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
