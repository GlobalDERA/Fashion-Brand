import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shop/ProductCard";
import { TrustBar } from "@/components/shop/TrustBar";
import { getProducts, getCollections } from "@/lib/products";

export default function Home() {
  const products = getProducts().slice(0, 4);
  const collections = getCollections();
  return (
    <div className="space-y-10">
      <section className="card overflow-hidden p-8 md:p-12">
        <p className="badge bg-forest-light text-forest-dark">New drop — Essentials</p>
        <h1 className="mt-3 max-w-xl font-display text-4xl font-black md:text-5xl">
          Look stylish. Spend smart.
        </h1>
        <p className="mt-3 max-w-lg text-steel">
          Affordable, fashionable, good-quality clothing for students and young professionals.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/collections"><Button>Shop collections</Button></Link>
          <Link href="/design"><Button variant="secondary">View design system</Button></Link>
        </div>
      </section>

      <TrustBar />

      <section>
        <h2 className="font-display text-2xl font-bold">Featured collections</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {collections.map((c) => (
            <Link key={c.slug} href="/collections" className="card p-4">
              <div className="font-bold">{c.title}</div>
              <div className="text-sm text-steel">{c.count} items</div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">Popular now</h2>
          <Link href="/collections" className="text-sm font-semibold text-forest">View all →</Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          {products.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      </section>
    </div>
  );
}
