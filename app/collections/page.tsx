import { ProductCard } from "@/components/shop/ProductCard";
import { getProducts } from "@/lib/products";

export const metadata = { title: "Shop all — Fashion Brand" };

export default function CollectionsPage() {
  const products = getProducts();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-black">Shop all</h1>
        <p className="text-steel">{products.length} styles — Phase 1 static list (filters land in Phase 2).</p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {products.map((p) => <ProductCard key={p.slug} product={p} />)}
      </div>
    </div>
  );
}
