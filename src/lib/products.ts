export type ProductId = "original" | "dark" | "caramel" | "crunch";

export interface Product {
  id: ProductId
  name: string
  shortName: string
  tagline: string
  description: string
  price: number
  cocoa: string
  image: string
  accent: "caramel" | "cream" | "blush" | "aqua"
}

export const PRODUCTS: Product[] = [
  {
    id: "original",
    name: "MEOW Original",
    shortName: "ORIGINAL",
    tagline: "Classic milk chocolate",
    description:
      "The one that started the craving. Smooth milk chocolate with a slow melt and a little extra cocoa in the finish.",
    price: 149,
    cocoa: "38%",
    image: "/images/original.jpg",
    accent: "caramel",
  },
  {
    id: "dark",
    name: "MEOW Dark",
    shortName: "DARK",
    tagline: "Deep cocoa",
    description:
      "For the ones who take their pleasure seriously. Dense, bitter-sweet, almost black. No apology.",
    price: 169,
    cocoa: "72%",
    image: "/images/dark.jpg",
    accent: "cream",
  },
  {
    id: "caramel",
    name: "MEOW Caramel",
    shortName: "CARAMEL",
    tagline: "Salted caramel",
    description:
      "A golden ribbon of salted caramel, trapped in milk chocolate. Sweet, then salt, then trouble.",
    price: 179,
    cocoa: "42%",
    image: "/images/caramel.jpg",
    accent: "blush",
  },
  {
    id: "crunch",
    name: "MEOW Crunch",
    shortName: "CRUNCH",
    tagline: "Roasted crunch",
    description:
      "Roasted cocoa nibs folded through milk chocolate. Texture for people who get bored easily.",
    price: 169,
    cocoa: "45%",
    image: "/images/crunch.jpg",
    accent: "aqua",
  },
];

export function getProduct(id: ProductId) {
  const product = PRODUCTS.find((item) => item.id === id);
  if (!product) throw new Error(`Unknown product: ${id}`);
  return product;
}
