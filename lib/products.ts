import products from "@/data/products.json";

export type Variant = { size: string; color: string; sku: string; stock: number };
export type Product = {
  slug: string;
  title: string;
  collection: string;
  price: number;
  compareAt?: number;
  rating: number;
  colors: string[];
  sizes: string[];
  description: string;
  fabric: string;
  care: string;
  image: string;
  variants: Variant[];
};

export function getProducts(): Product[] {
  return products as Product[];
}

export function getProduct(slug: string): Product | undefined {
  return getProducts().find((p) => p.slug === slug);
}

export function getCollections() {
  const map = new Map<string, { slug: string; title: string; count: number; image: string }>();
  for (const p of getProducts()) {
    const slug = p.collection.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (!map.has(slug)) map.set(slug, { slug, title: p.collection, count: 0, image: p.image });
    map.get(slug)!.count += 1;
  }
  return [...map.values()];
}
