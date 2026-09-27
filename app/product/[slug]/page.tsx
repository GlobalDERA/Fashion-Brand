import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { Rating } from "@/components/ui/rating";
import { SizeGuide } from "@/components/shop/SizeGuide";
import { ProductCard } from "@/components/shop/ProductCard";
import { getProduct, getProducts } from "@/lib/products";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();
  const related = getProducts().filter((p) => p.slug !== product.slug && p.collection === product.collection).slice(0, 3);

  return (
    <div className="space-y-8">
      <Link href="/collections" className="text-sm font-semibold text-forest">← Back to shop</Link>
      <div className="grid gap-6 md:grid-cols-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={product.title} className="card aspect-[4/5] w-full object-cover" />
        <div className="space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-steel">{product.collection}</span>
          <h1 className="font-display text-3xl font-black">{product.title}</h1>
          <Rating value={product.rating} />
          <Price amount={product.price} compareAt={product.compareAt} />
          <p className="text-steel">{product.description}</p>
          <div>
            <div className="mb-2 text-sm font-bold">Sizes</div>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <span key={v.sku} className={`badge ${v.stock === 0 ? "bg-charcoal/10 text-steel" : "bg-charcoal/5 text-charcoal"}`}>
                  {v.size}{v.stock === 0 ? " — out" : v.stock <= 3 ? ` — ${v.stock} left` : ""}
                </span>
              ))}
            </div>
          </div>
          <SizeGuide />
          <div className="flex gap-3">
            <Button>Add to cart (Phase 2)</Button>
            <Button variant="secondary">WhatsApp us</Button>
          </div>
          <div className="card space-y-1 p-4 text-sm">
            <div><strong>Fabric:</strong> {product.fabric}</div>
            <div><strong>Care:</strong> {product.care}</div>
            <div><strong>Delivery:</strong> 2–5 days (Phase 3 live rates)</div>
          </div>
          {product.compareAt && <Badge tone="sale">Save {product.compareAt - product.price} on launch price</Badge>}
        </div>
      </div>
      {related.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-bold">You may also like</h2>
          <div className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-3">
            {related.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
