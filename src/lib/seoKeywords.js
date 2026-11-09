/**
 * Velmoras Creation - SEO Keywords Repository (100 Core Keywords + Long-Tails)
 * Structured by topic clusters for Google White-Hat SEO & Rich Snippets indexing.
 */

export const STAR_WARS_KEYWORDS = [
  "Star Wars merchandise",
  "Star Wars accessories",
  "Star Wars gifts",
  "Star Wars collectibles",
  "Star Wars inspired clothing",
  "Star Wars leather jacket",
  "Star Wars costume accessories",
  "Star Wars fan gifts",
  "Darth Vader jacket",
  "Darth Vader costume",
  "Darth Vader accessories",
  "Jedi merchandise",
  "Jedi costume accessories",
  "Lightsaber collectibles",
  "Star Wars cosplay accessories",
  "Mandalorian costume",
  "Mandalorian helmet",
  "Boba Fett costume",
  "Star Wars themed gifts",
  "Star Wars fashion accessories",
  "Star Wars replica props",
  "Star Wars collector items",
  "Galactic themed accessories",
  "Sci fi collectibles",
  "Space fantasy merchandise",
  "Star Wars leather accessories",
  "Star Wars biker jacket",
  "Star Wars gift ideas",
  "Star Wars fan merchandise",
  "Star Wars collectible accessories"
];

export const STAR_WARS_LONG_TAILS = [
  "custom handmade Star Wars cosplay costumes worldwide shipping",
  "screen accurate Darth Vader leather jacket with cape attachments",
  "bespoke Mandalorian and Boba Fett costume accessories",
  "authentic Jedi robe and lightsaber collectible accessories",
  "custom fitted Star Wars biker leather jacket for sale",
  "handcrafted galactic sci fi replica props and fan gifts"
];

export const SUPERHERO_KEYWORDS = [
  "Superhero merchandise",
  "Superhero accessories",
  "Superhero gifts",
  "Superhero collectibles",
  "Marvel merchandise",
  "DC Comics merchandise",
  "Batman leather jacket",
  "Superman costume",
  "Spider Man accessories",
  "Iron Man collectibles",
  "Captain America merchandise",
  "Deadpool accessories",
  "Wolverine leather jacket",
  "Batman costume accessories",
  "Superhero cosplay accessories",
  "Marvel fan gifts",
  "DC superhero gifts",
  "Superhero leather jackets",
  "Comic book collectibles",
  "Superhero fashion accessories",
  "Superhero themed clothing",
  "Superhero replica costumes",
  "Comic book fan merchandise",
  "Superhero collector items",
  "Batman inspired jacket",
  "Spiderman themed gifts",
  "Marvel collectibles online",
  "Superhero biker jackets",
  "Movie character accessories",
  "Superhero gift ideas"
];

export const SUPERHERO_LONG_TAILS = [
  "custom fit Batman real leather motorcycle jacket with embossed logo",
  "screen accurate Wolverine X-Men leather jacket custom made",
  "Deadpool and Spider Man cosplay accessories tailored to fit",
  "premium Marvel and DC superhero leather jackets online",
  "comic book replica costumes and collector items store",
  "handcrafted superhero biker jackets for comic con"
];

export const LEATHER_PRODUCTS_KEYWORDS = [
  "Genuine leather jackets",
  "Men's leather jackets",
  "Women's leather jackets",
  "Handmade leather products",
  "Premium leather accessories",
  "Leather biker jackets",
  "Leather motorcycle jackets",
  "Black leather jackets",
  "Brown leather jackets",
  "Leather wallets",
  "Men's leather wallets",
  "Women's leather wallets",
  "Leather bags",
  "Leather messenger bags",
  "Leather travel bags",
  "Leather belts",
  "Leather gloves",
  "Custom leather jackets",
  "Vintage leather jackets",
  "Real leather fashion",
  "Leather gift ideas",
  "Handmade leather wallets",
  "Premium leather goods",
  "Leather fashion accessories",
  "Leather jackets online",
  "Leather products online",
  "Durable leather bags",
  "Classic leather jackets",
  "Custom made leather goods",
  "Luxury leather accessories"
];

export const LEATHER_PRODUCTS_LONG_TAILS = [
  "handmade genuine cowhide leather biker jackets for men and women",
  "custom tailored vintage brown leather jacket express delivery",
  "luxury handcrafted real leather messenger and travel bags online",
  "premium full grain leather wallets and fashion accessories gift ideas",
  "durable custom made classic leather motorcycle jackets shop",
  "bespoke handmade leather products and goods worldwide shipping"
];

export const BRAND_SHOPPING_KEYWORDS = [
  "Velmoras Creation",
  "Velmoras leather collection",
  "Velmoras superhero collection",
  "Velmoras exclusive merchandise",
  "Buy leather jackets online",
  "Shop superhero merchandise online",
  "Unique movie fan gifts",
  "Premium collectible gifts",
  "Exclusive fashion accessories",
  "Online store for collectibles and leather goods"
];

export const BRAND_SHOPPING_LONG_TAILS = [
  "Velmoras Creation official online store for custom leather and cosplay",
  "buy premium handcrafted movie fan collectible gifts online",
  "exclusive luxury leather jackets and superhero merchandise store",
  "best online store for custom made leather goods and cosplay replicas"
];

export const ALL_100_KEYWORDS = [
  ...STAR_WARS_KEYWORDS,
  ...SUPERHERO_KEYWORDS,
  ...LEATHER_PRODUCTS_KEYWORDS,
  ...BRAND_SHOPPING_KEYWORDS
];

export const ALL_LONG_TAIL_KEYWORDS = [
  ...STAR_WARS_LONG_TAILS,
  ...SUPERHERO_LONG_TAILS,
  ...LEATHER_PRODUCTS_LONG_TAILS,
  ...BRAND_SHOPPING_LONG_TAILS
];

/**
 * Returns contextual keywords for a given category/query to prevent keyword stuffing
 * while maximizing relevance score on Google algorithms.
 */
export const getContextualKeywords = (contextStr = '') => {
  const lower = contextStr.toLowerCase();
  
  if (lower.includes('star wars') || lower.includes('jedi') || lower.includes('vader') || lower.includes('mandalorian') || lower.includes('lightsaber')) {
    return [...STAR_WARS_KEYWORDS.slice(0, 15), ...STAR_WARS_LONG_TAILS.slice(0, 3), ...BRAND_SHOPPING_KEYWORDS.slice(0, 3)].join(', ');
  }
  
  if (lower.includes('superhero') || lower.includes('batman') || lower.includes('marvel') || lower.includes('dc') || lower.includes('spiderman') || lower.includes('wolverine') || lower.includes('iron man')) {
    return [...SUPERHERO_KEYWORDS.slice(0, 15), ...SUPERHERO_LONG_TAILS.slice(0, 3), ...BRAND_SHOPPING_KEYWORDS.slice(0, 3)].join(', ');
  }
  
  if (lower.includes('leather') || lower.includes('jacket') || lower.includes('wallet') || lower.includes('bag') || lower.includes('biker')) {
    return [...LEATHER_PRODUCTS_KEYWORDS.slice(0, 15), ...LEATHER_PRODUCTS_LONG_TAILS.slice(0, 3), ...BRAND_SHOPPING_KEYWORDS.slice(0, 3)].join(', ');
  }
  
  // Balanced default for homepage or generic store catalog
  return [
    ...BRAND_SHOPPING_KEYWORDS,
    ...LEATHER_PRODUCTS_KEYWORDS.slice(0, 6),
    ...STAR_WARS_KEYWORDS.slice(0, 6),
    ...SUPERHERO_KEYWORDS.slice(0, 6),
    ...BRAND_SHOPPING_LONG_TAILS.slice(0, 2)
  ].join(', ');
};

