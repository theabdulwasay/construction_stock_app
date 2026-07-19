export default function StatCard({ eyebrow, value, sub, accent = "#4E6E7E", icon: Icon }) {
  return (
    <div className="relative bg-[#F7F5F0] rounded-lg border border-[#DAD5C9] p-5 overflow-hidden animate-ticket-in">
      <div
        className="absolute top-0 left-0 h-full w-1"
        style={{ backgroundColor: accent }}
      />
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.14em] text-[#71767a] font-semibold">
            {eyebrow}
          </div>
          <div className="font-mono-data text-2xl font-bold mt-1.5 text-[#24272B]">
            {value}
          </div>
          {sub && <div className="text-xs text-[#8a8f93] mt-1">{sub}</div>}
        </div>
        {Icon && (
          <div
            className="rounded-md p-2"
            style={{ backgroundColor: `${accent}1A`, color: accent }}
          >
            <Icon size={18} />
          </div>
        )}
      </div>
    </div>
  );
}
