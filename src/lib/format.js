import { assetUrl } from '../api/client';

const DEFAULT_RATES = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  PKR: 278.50,
  CAD: 1.38,
  AUD: 1.54,
};

// Format a number/string as dynamic user currency (defaulting to USD)
export const money = (value, forceCurrency = null) => {
  const n = typeof value === 'string' ? parseFloat(value) : value;
  const num = Number.isFinite(n) ? n : 0;

  try {
    const selectedCurrency = forceCurrency || (typeof window !== 'undefined' ? localStorage.getItem('velmoras_selected_currency') : null) || 'USD';
    
    let rate = DEFAULT_RATES[selectedCurrency] || 1.0;
    if (typeof window !== 'undefined') {
      const cachedRatesStr = localStorage.getItem('velmoras_exchange_rates');
      if (cachedRatesStr) {
        const parsed = JSON.parse(cachedRatesStr);
        if (parsed?.rates?.[selectedCurrency]) {
          rate = parsed.rates[selectedCurrency];
        }
      }
    }

    const converted = num * rate;

    if (selectedCurrency === 'PKR') {
      return `Rs ${Math.round(converted).toLocaleString()}`;
    }
    if (selectedCurrency === 'EUR') {
      return `€${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (selectedCurrency === 'GBP') {
      return `£${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (selectedCurrency === 'CAD') {
      return `CA$${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (selectedCurrency === 'AUD') {
      return `AU$${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  } catch (e) {
    // Fallback to USD
  }

  return `$${num.toFixed(2)}`;
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
