import { createContext, useContext, useState, useEffect } from 'react';
import { fetchCart, addToCart, incrementCartItem, decrementCartItem, removeCartItem, clearCart } from '../APIs/cartAPIs';

export const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], total_price: "0.00" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  const calculateTotal = () => {
    const totalQ = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    setTotalCount(totalQ);
  };

  useEffect(() => {
    fetchCartData()
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [cart.items]);

  const fetchCartData = async () => {
    setLoading(true);
    try {
      const response = await fetchCart();
      console.log('CartProvider: fetchCart response:', response);
      if (response.success) {
        setCart({
          items: response.data.cart || [],
          total_price: response.data.total_price || "0.00",
        });
        setError(null);
      } else {
        setError(response.error || 'Failed to fetch cart');
      }
    } catch (err) {
      console.log('CartProvider: fetchCart error:', err);
      setError(err.response?.data?.error || err.message || 'Error fetching cart');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (variant_id, quantity = 1) => {
    setLoading(true);
    console.log('CartProvider: Sending addToCart request:', { variant_id, quantity });
    try {
      const response = await addToCart(variant_id, quantity);
      console.log('CartProvider: addToCart response:', response);
      if (response.success) {
        await fetchCartData();
        setError(null);
        return response;
      } else {
        console.log('CartProvider: addToCart failed:', response.error);
        setError(response.error || 'Failed to add item to cart');
      }
    } catch (err) {
      console.log('CartProvider: addToCart error:', err);
      setError(err.response?.data?.error || err.message || 'Error adding item to cart');
    } finally {
      setLoading(false);
    }
  };

  const handleIncrementCartItem = async (variant_id) => {
    setLoading(true);
    try {
      const response = await incrementCartItem(variant_id);
      if (response.success) {
        await fetchCartData();
        setError(null);
      } else {
        setError(response.error || 'Failed to increment item');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error incrementing item');
    } finally {
      setLoading(false);
    }
  };

  const handleDecrementCartItem = async (variant_id) => {
    setLoading(true);
    try {
      const response = await decrementCartItem(variant_id);
      if (response.success) {
        await fetchCartData();
        setError(null);
      } else {
        setError(response.error || 'Failed to decrement item');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error decrementing item');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCartItem = async (variant_id) => {
    setLoading(true);
    try {
      const response = await removeCartItem(variant_id);
      if (response.success) {
        await fetchCartData();
        setError(null);
      } else {
        setError(response.error || 'Failed to remove item');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error removing item');
    } finally {
      setLoading(false);
    }
  };

  const handleClearCart = async () => {
    setLoading(true);
    try {
      const response = await clearCart();
      if (response.success) {
        await fetchCartData();
        setError(null);
      } else {
        setError(response.error || 'Failed to clear cart');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error clearing cart');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cart,
    totalCount,
    loading,
    error,
    addToCart: handleAddToCart,
    incrementCartItem: handleIncrementCartItem,
    decrementCartItem: handleDecrementCartItem,
    removeCartItem: handleRemoveCartItem,
    clearCart: handleClearCart,
    fetchCartData, // Ensure fetchCartData is exported
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}