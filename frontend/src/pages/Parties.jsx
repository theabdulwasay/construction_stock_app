import { useEffect, useState } from "react";
import api from "../api";
import { Plus, Trash2, Users2 } from "lucide-react";

function PartyPanel({ title, endpoint, accent }) {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [showForm, setShowForm] = useState(false);

  const load = () => api.get(`${endpoint}/`).then((res) => setRows(res.data.results || res.data));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post(`${endpoint}/`, form);
    setForm({ name: "", phone: "", address: "" });
    setShowForm(false);
    load();
  };

  const remove = async (id) => {
    if (!confirm("Remove this entry?")) return;
    await api.delete(`${endpoint}/${id}/`);
    load();
  };

  return (
    <div className="bg-[#F7F5F0] border border-[#DAD5C9] rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-sm" style={{ color: accent }}>{title}</h3>
        <button onClick={() => setShowForm(!showForm)} className="p-1.5 rounded hover:bg-[#DAD5C9]">
          <Plus size={16} />
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="mb-4 space-y-2 animate-ticket-in">
          <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
          <input placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" />
          <input placeholder="Address (optional)" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input" />
          <button className="text-white text-xs font-semibold px-4 py-2 rounded-md" style={{ backgroundColor: accent }}>
            Add
          </button>
        </form>
      )}

      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.id} className="flex items-center justify-between bg-white rounded-md border border-[#DAD5C9] px-3 py-2.5 text-sm">
            <div>
              <div className="font-medium text-[#24272B]">{r.name}</div>
              {(r.phone || r.address) && (
                <div className="text-xs text-[#8a8f93]">{[r.phone, r.address].filter(Boolean).join(" · ")}</div>
              )}
            </div>
            <button onClick={() => remove(r.id)} className="p-1 rounded hover:bg-[#F0E1D6] text-[#B9502F]"><Trash2 size={14} /></button>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-[#8a8f93]">None added yet.</p>}
      </div>
    </div>
  );
}

export default function Parties() {
  return (
    <div className="p-8 max-w-5xl">
      <h1 className="font-display text-2xl font-extrabold text-[#24272B] flex items-center gap-2 mb-1">
        <Users2 size={22} className="text-[#4E6E7E]" /> Suppliers & Customers
      </h1>
      <p className="text-sm text-[#71767a] mb-6">Manage the parties you buy from and sell to.</p>

      <div className="grid md:grid-cols-2 gap-6">
        <PartyPanel title="Suppliers" endpoint="suppliers" accent="#37515E" />
        <PartyPanel title="Customers" endpoint="customers" accent="#C3922E" />
      </div>

      <style>{`.input { width: 100%; border: 1px solid #DAD5C9; border-radius: 6px; padding: 8px 10px; font-size: 14px; background: white; } .input:focus { outline: 2px solid #4E6E7E; outline-offset: 1px; }`}</style>
    </div>
  );
}
