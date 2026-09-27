import { formatPrice } from "@/lib/money";

export function Price({ amount, compareAt }: { amount: number; compareAt?: number }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-lg font-bold">{formatPrice(amount)}</span>
      {compareAt && compareAt > amount && (
        <span className="text-sm text-steel line-through">{formatPrice(compareAt)}</span>
      )}
    </div>
  );
}
