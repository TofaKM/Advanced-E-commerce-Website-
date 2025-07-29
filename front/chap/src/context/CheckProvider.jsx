import { checkout, placeOrder, confirmPurchase, viewPurchaseHistory, viewOrderItems, viewVendorSales } from '../APIs/checkAPIs';
import { createContext, useContext, useState,useCallback } from 'react';

export const CheckContext = createContext();
export const useCheck = () => useContext(CheckContext);

export function CheckProvider({ children }) {
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [vendorSales, setVendorSales] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await checkout();
      return result; // Contains cartItems, total_price for modal
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (shipping_details = {}) => {
    try {
      setLoading(true);
      setError(null);
      const result = await placeOrder(shipping_details);
      return result; // Contains order_id, total_price
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPurchase = async (order_id) => {
    try {
      setLoading(true);
      setError(null);
      const result = await confirmPurchase(order_id);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

 const fetchPurchaseHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await viewPurchaseHistory();
      setPurchaseHistory(result.data.purchases || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrderItems = useCallback(async (order_id) => {
    try {
      setLoading(true);
      setError(null);
      const result = await viewOrderItems(order_id);
      setOrderItems(result.data.order?.items || []);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

    const fetchVendorSales = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await viewVendorSales();
      setVendorSales(result.data.sales || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [])

  return (
    <CheckContext.Provider
      value={{
        checkout: handleCheckout,
        placeOrder: handlePlaceOrder,
        confirmPurchase: handleConfirmPurchase,
        fetchPurchaseHistory,
        fetchOrderItems,
        fetchVendorSales,
        purchaseHistory,
        vendorSales,
        orderItems,
        loading,
        error,
      }}
    >
      {children}
    </CheckContext.Provider>
  );
}