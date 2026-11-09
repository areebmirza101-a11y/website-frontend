import { createContext, useContext, useState, useEffect, useMemo } from 'react';

export const SUPPORTED_CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', defaultRate: 1.0, decimals: 2 },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', defaultRate: 0.92, decimals: 2 },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', defaultRate: 0.79, decimals: 2 },
  { code: 'PKR', symbol: 'Rs ', name: 'Pakistani Rupee', flag: '🇵🇰', defaultRate: 278.50, decimals: 0 },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', flag: '🇨🇦', defaultRate: 1.38, decimals: 2 },
  { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar', flag: '🇦🇺', defaultRate: 1.54, decimals: 2 },
];

const CURRENCY_STORAGE_KEY = 'velmoras_selected_currency';
const RATES_STORAGE_KEY = 'velmoras_exchange_rates';

const detectInitialCurrency = () => {
  try {
    const saved = localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (saved && SUPPORTED_CURRENCIES.some((c) => c.code === saved)) {
      return saved;
    }

    // Timezone-based auto-detection
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('Karachi') || tz.includes('Pakistan')) return 'PKR';
    if (tz.includes('London')) return 'GBP';
    if (
      tz.includes('Berlin') ||
      tz.includes('Paris') ||
      tz.includes('Rome') ||
      tz.includes('Madrid') ||
      tz.includes('Amsterdam') ||
      tz.includes('Vienna') ||
      tz.includes('Brussels')
    ) {
      return 'EUR';
    }
    if (tz.includes('Toronto') || tz.includes('Vancouver') || tz.includes('Montreal')) return 'CAD';
    if (tz.includes('Sydney') || tz.includes('Melbourne') || tz.includes('Brisbane')) return 'AUD';
  } catch (e) {
    // Fallback
  }
  return 'USD';
};

const CurrencyContext = createContext({
  currency: 'USD',
  currencyInfo: SUPPORTED_CURRENCIES[0],
  setCurrency: () => {},
  formatPrice: () => '$0.00',
  convertPrice: () => 0,
  rates: {},
});

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrencyState] = useState(detectInitialCurrency);
  const [rates, setRates] = useState(() => {
    try {
      const cached = localStorage.getItem(RATES_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.timestamp && Date.now() - parsed.timestamp < 12 * 60 * 60 * 1000) {
          return parsed.rates;
        }
      }
    } catch (e) {}
    // Default fallback rates
    const fallback = {};
    SUPPORTED_CURRENCIES.forEach((c) => {
      fallback[c.code] = c.defaultRate;
    });
    return fallback;
  });

  const currencyInfo = useMemo(() => {
    return SUPPORTED_CURRENCIES.find((c) => c.code === currency) || SUPPORTED_CURRENCIES[0];
  }, [currency]);

  // Fetch fresh exchange rates in the background
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await res.json();
        if (data && data.rates) {
          const newRates = { USD: 1.0 };
          SUPPORTED_CURRENCIES.forEach((c) => {
            if (data.rates[c.code]) {
              newRates[c.code] = data.rates[c.code];
            } else {
              newRates[c.code] = c.defaultRate;
            }
          });
          setRates(newRates);
          try {
            localStorage.setItem(
              RATES_STORAGE_KEY,
              JSON.stringify({ rates: newRates, timestamp: Date.now() })
            );
          } catch (e) {}
        }
      } catch (e) {
        // Silently keep default rates
      }
    };
    fetchRates();
  }, []);

  // Secondary IP Geolocation lookup if user has never selected a currency
  useEffect(() => {
    if (localStorage.getItem(CURRENCY_STORAGE_KEY)) return;
    const detectCountry = async () => {
      try {
        const res = await fetch('https://api.country.is');
        const data = await res.json();
        if (data && data.country) {
          const cc = data.country.toUpperCase();
          if (cc === 'PK') setCurrencyState('PKR');
          else if (cc === 'GB') setCurrencyState('GBP');
          else if (['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'IE', 'PT', 'FI', 'GR'].includes(cc)) setCurrencyState('EUR');
          else if (cc === 'CA') setCurrencyState('CAD');
          else if (cc === 'AU') setCurrencyState('AUD');
        }
      } catch (e) {}
    };
    detectCountry();
  }, []);

  const setCurrency = (code) => {
    if (SUPPORTED_CURRENCIES.some((c) => c.code === code)) {
      setCurrencyState(code);
      try {
        localStorage.setItem(CURRENCY_STORAGE_KEY, code);
      } catch (e) {}
    }
  };

  const convertPrice = (usdAmount) => {
    const num = typeof usdAmount === 'string' ? parseFloat(usdAmount) : usdAmount;
    if (!Number.isFinite(num)) return 0;
    const rate = rates[currency] || currencyInfo.defaultRate || 1.0;
    return num * rate;
  };

  const formatPrice = (usdAmount) => {
    const converted = convertPrice(usdAmount);
    const decimals = currencyInfo.decimals;
    if (decimals === 0) {
      // Clean integer rounding for PKR
      const rounded = Math.round(converted);
      return `${currencyInfo.symbol}${rounded.toLocaleString()}`;
    }
    return `${currencyInfo.symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencyInfo,
        setCurrency,
        formatPrice,
        convertPrice,
        rates,
        supportedCurrencies: SUPPORTED_CURRENCIES,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);

