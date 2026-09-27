import { cn } from "@/lib/cn";

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "sale" | "low" | "out" }) {
  const tones: Record<string, string> = {
    neutral: "bg-charcoal/5 text-charcoal",
    sale: "bg-forest-light text-forest-dark",
    low: "bg-yellow-100 text-yellow-900",
    out: "bg-charcoal/10 text-steel"
  };
  return <span className={cn("badge", tones[tone])}>{children}</span>;
}
