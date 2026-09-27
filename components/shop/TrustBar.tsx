const items = [
  { title: "Affordable", sub: "Style under budget" },
  { title: "Quality", sub: "Consistent fabrics" },
  { title: "Easy returns", sub: "Size help included" }
];

export function TrustBar() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map((i) => (
        <div key={i.title} className="card p-4 text-center">
          <div className="font-display text-sm font-bold">{i.title}</div>
          <div className="text-xs text-steel">{i.sub}</div>
        </div>
      ))}
    </div>
  );
}
