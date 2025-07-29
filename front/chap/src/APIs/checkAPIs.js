import axios from 'axios';

const API_URL = 'http://localhost:3000/check/auth';

const checkout = async () => {
  try {
    const response = await axios.post(`${API_URL}/checkout`, {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error during checkout');
  }
};

const placeOrder = async (shipping_details = {}) => {
  try {
    const response = await axios.post(
      `${API_URL}/place-order`,
      { shipping_details },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error placing order');
  }
};

const confirmPurchase = async (order_id) => {
  try {
    const response = await axios.post(
      `${API_URL}/confirm-purchase`,
      { order_id },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error confirming purchase');
  }
};

const viewPurchaseHistory = async () => {
  try {
    const response = await axios.get(`${API_URL}/history`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error fetching purchase history');
  }
};

const viewOrderItems = async (order_id) => {
  try {
    const response = await axios.get(`${API_URL}/order/${order_id}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error fetching order items');
  }
};

const viewVendorSales = async () => {
  try {
    const response = await axios.get(`${API_URL}/vendor/sales`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error fetching vendor sales');
  }
};

export {
  checkout,
  placeOrder,
  confirmPurchase,
  viewPurchaseHistory,
  viewOrderItems,
  viewVendorSales,
};