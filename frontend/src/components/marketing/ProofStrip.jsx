export default function ProofStrip({ items }) {
  return (
    <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/[0.06] p-4 shadow-[0_20px_60px_rgba(15,23,42,0.16)] backdrop-blur-xl sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-[1.5rem] border border-white/10 bg-slate-950/40 px-5 py-4 text-white"
        >
          <div className="text-2xl font-heading font-extrabold tracking-[-0.04em]">{item.value}</div>
          <div className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
            {item.label}
          </div>
          <p className="mt-2 text-sm leading-6 text-white/70">{item.detail}</p>
        </div>
      ))}
    </div>
  );
}
