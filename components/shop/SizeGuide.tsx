"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const rows = [
  { size: "XS", chest: "82–86", waist: "62–66" },
  { size: "S", chest: "86–90", waist: "66–70" },
  { size: "M", chest: "90–96", waist: "70–76" },
  { size: "L", chest: "96–102", waist: "76–82" },
  { size: "XL", chest: "102–108", waist: "82–88" }
];

export function SizeGuide() {
  const [open, setOpen] = useState(false);
  if (!open) return <Button variant="secondary" onClick={() => setOpen(true)}>Size guide</Button>;
  return (
    <div className="card p-4">
      <div className="mb-2 flex items-center justify-between">
        <strong>Size guide (cm)</strong>
        <button className="text-sm underline" onClick={() => setOpen(false)}>Close</button>
      </div>
      <table className="w-full text-sm">
        <thead><tr className="text-left text-steel"><th>Size</th><th>Chest</th><th>Waist</th></tr></thead>
        <tbody>
          {rows.map((r) => <tr key={r.size} className="border-t border-charcoal/10"><td className="py-1 font-semibold">{r.size}</td><td>{r.chest}</td><td>{r.waist}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}
