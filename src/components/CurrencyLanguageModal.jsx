import { useState, useRef, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { Globe, Check, ChevronDown, X } from 'lucide-react';

const CurrencyLanguageModal = ({ isMobile = false }) => {
  const { currency, currencyInfo, setCurrency, supportedCurrencies } = useCurrency();
  const { language, setLanguage, languages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (isMobile) {
    return (
      <div className="pt-4 border-t border-gray-100 space-y-3">
        <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">
          {t('common.currency')} & {t('common.language')}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {/* Currency Mobile Selector */}
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-xs font-bold py-2.5 px-3 rounded-xl appearance-none outline-none focus:ring-1 focus:ring-accent cursor-pointer"
            >
              {supportedCurrencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code} ({c.symbol.trim()})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Language Mobile Selector */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-xs font-bold py-2.5 px-3 rounded-xl appearance-none outline-none focus:ring-1 focus:ring-accent cursor-pointer"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Navbar Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50/80 transition-all text-xs font-bold text-gray-700 shadow-2xs"
        title="Change currency and language"
      >
        <span className="text-sm leading-none">{currencyInfo.flag}</span>
        <span className="tracking-wider">{currencyInfo.code}</span>
        <span className="text-gray-300">|</span>
        <span className="uppercase text-[11px] text-gray-500 font-semibold">{language}</span>
        <ChevronDown className="w-3 h-3 text-gray-400 ml-0.5" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
            <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-accent" /> Preferences
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Currency Selection */}
          <div className="mb-4">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-2">
              Select Currency
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {supportedCurrencies.map((c) => {
                const isSelected = c.code === currency;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setCurrency(c.code);
                    }}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-gray-900 text-white shadow-xs'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span>{c.flag}</span>
                      <span>{c.code}</span>
                    </span>
                    <span className={`text-[10px] ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>
                      {c.symbol.trim()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language Selection */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-2">
              Select Language
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {languages.map((l) => {
                const isSelected = l.code === language;
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      setLanguage(l.code);
                    }}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-gray-900 text-white shadow-xs'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span>{l.flag}</span>
                      <span>{l.name}</span>
                    </span>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencyLanguageModal;

