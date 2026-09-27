import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { Rating } from "@/components/ui/rating";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);
  const low = totalStock > 0 && totalStock <= 5;
  return (
    <Link href={`/product/${product.slug}`} className="card group overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={product.image} alt={product.title} className="aspect-[4/5] w-full object-cover" loading="lazy" />
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-steel">{product.collection}</span>
          <Rating value={product.rating} />
        </div>
        <h3 className="font-display text-base font-bold group-hover:text-forest">{product.title}</h3>
        <Price amount={product.price} compareAt={product.compareAt} />
        <div className="flex gap-2">
          {product.compareAt && <Badge tone="sale">Sale</Badge>}
          {totalStock === 0 && <Badge tone="out">Out of stock</Badge>}
          {low && <Badge tone="low">Only {totalStock} left</Badge>}
        </div>
      </div>
    </Link>
  );
}
