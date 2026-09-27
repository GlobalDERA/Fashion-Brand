import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { Rating } from "@/components/ui/rating";
import { ProductCard } from "@/components/shop/ProductCard";
import { TrustBar } from "@/components/shop/TrustBar";
import { getProducts } from "@/lib/products";

export const metadata = { title: "Design system — Fashion Brand" };

export default function DesignPage() {
  const sample = getProducts()[0];
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-black">Design system (Phase 1)</h1>
        <p className="text-steel">Tokens: Forest #1B4332 / Charcoal #24272B / Steel #6E7B8B / Light #F4F5F3. Type: Sora display + Inter body. Radius 12, soft shadow.</p>
      </div>
      <section className="card space-y-3 p-6">
        <h2 className="font-bold">Buttons / Badges / Price / Rating</h2>
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Badge>Neutral</Badge>
          <Badge tone="sale">Sale</Badge>
          <Badge tone="low">Only 3 left</Badge>
          <Badge tone="out">Out of stock</Badge>
        </div>
        <Price amount={29} compareAt={39} />
        <Rating value={4.6} />
      </section>
      <TrustBar />
      <section>
        <h2 className="font-bold">ProductCard</h2>
        <div className="mt-3 max-w-xs"><ProductCard product={sample} /></div>
      </section>
    </div>
  );
}
