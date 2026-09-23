import { assetUrl } from '../api/client';

// Format a number/string as USD currency
export const money = (value) => {
  const n = typeof value === 'string' ? parseFloat(value) : value;
  return `$${(Number.isFinite(n) ? n : 0).toFixed(2)}`;
};

// Get the primary image URL for an API product (falls back to first image / placeholder)
export const productImage = (product) => {
  if (!product) return '';
  const images = product.images || [];
  const main = images.find((i) => i.is_main);
  if (main) return assetUrl(main.url);
  const primary = images.find((i) => i.is_primary) || images[0];
  if (primary) return assetUrl(primary.url);
  if (product.image) return assetUrl(product.image); // legacy shape
  return 'https://placehold.co/800x1000?text=No+Image';
};

// Category name whether it's an object {name} or a plain string
export const categoryName = (product) => {
  if (!product?.category) return '';
  return typeof product.category === 'string' ? product.category : product.category.name;
};
