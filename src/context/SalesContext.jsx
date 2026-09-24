import { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../api/client';

const SalesContext = createContext();

export const SalesProvider = ({ children }) => {
  const [activeSales, setActiveSales] = useState([]);

  useEffect(() => {
    // Fetch only active sales
    apiFetch('/promotions?active=true')
      .then(data => {
        // Filter out future sales or expired sales using YYYY-MM-DD to avoid timezone bugs
        const d = new Date();
        const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const validSales = (data || []).filter(sale => {
          if (sale.start_date) {
            const startStr = sale.start_date.split('T')[0];
            if (startStr > todayStr) return false;
          }
          if (sale.end_date) {
            const endStr = sale.end_date.split('T')[0];
            if (endStr < todayStr) return false;
          }
          return true;
        });
        setActiveSales(validSales);
      })
      .catch(() => {});
  }, []);

  const getProductSale = (product) => {
    if (!product || !activeSales.length) return null;
    
    // Find the best sale for this product
    let bestSale = null;
    let lowestPrice = parseFloat(product.price);

    activeSales.forEach(sale => {
      let applies = false;
      if (sale.applies_to === 'all') applies = true;
      if (sale.applies_to === 'products' && sale.target_ids.includes(product.id)) applies = true;
      if (sale.applies_to === 'categories' && sale.target_ids.includes(product.category_id)) applies = true;

      if (applies) {
        let salePrice = parseFloat(product.price);
        if (sale.discount_type === 'percentage') {
          salePrice = salePrice - (salePrice * (sale.discount_value / 100));
        } else if (sale.discount_type === 'flat') {
          salePrice = salePrice - sale.discount_value;
        }
        
        if (salePrice < 0) salePrice = 0;

        if (salePrice < lowestPrice) {
          lowestPrice = salePrice;
          bestSale = sale;
        }
      }
    });

    if (bestSale) {
      return {
        ...bestSale,
        salePrice: lowestPrice
      };
    }
    return null;
  };

  const getCategorySale = (categoryId) => {
    if (!categoryId || !activeSales.length) return null;
    
    // Find a sale that applies to this category or 'all'
    const sale = activeSales.find(s => 
      s.applies_to === 'all' || 
      (s.applies_to === 'categories' && s.target_ids.includes(categoryId))
    );
    
    return sale || null;
  };

  return (
    <SalesContext.Provider value={{ activeSales, getProductSale, getCategorySale }}>
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => useContext(SalesContext);
