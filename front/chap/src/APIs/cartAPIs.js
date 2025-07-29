import axios from 'axios';

const API_URL = 'http://localhost:3000/cart/auth'; // Adjusted to match cartRoutes

// Fetch cart
const fetchCart = async () => {
  try {
    const response = await axios.get(`${API_URL}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Error fetching cart";
  }
};

// Add item to cart
const addToCart = async (variant_id, quantity = 1) => {
  console.log('cartAPIs: Sending POST request:', { url: `${API_URL}/add`, variant_id, quantity });
  try {
    const response = await axios.post(
      `${API_URL}/add`,
      { variant_id, quantity },
      { withCredentials: true }
    );
    console.log('cartAPIs: POST response:', response.data);
    return response.data;
  } catch (error) {
    console.log('cartAPIs: POST error:', error.response || error);
    throw error.response?.data?.error || error.message || 'Error adding item to cart';
  }
};

// Remove item from cart
const removeCartItem = async (variant_id) => {
  try {
    const response = await axios.post(
      `${API_URL}/remove`,
      { variant_id },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Error removing item from cart";
  }
};

// Increment cart item quantity
const incrementCartItem = async (variant_id) => {
  try {
    const response = await axios.post(
      `${API_URL}/increment`,
      { variant_id },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Error incrementing cart item";
  }
};

// Decrement cart item quantity
const decrementCartItem = async (variant_id) => {
  try {
    const response = await axios.post(
      `${API_URL}/decrement`,
      { variant_id },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Error decrementing cart item";
  }
};

// Clear the cart
const clearCart = async () => {
  try {
    const response = await axios.post(`${API_URL}/clear`, {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Error clearing cart";
  }
};

export {
  fetchCart,
  addToCart,
  removeCartItem,
  incrementCartItem,
  decrementCartItem,
  clearCart,
};