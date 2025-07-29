import axios from 'axios';
const API_URL = 'http://localhost:3000/product/auth';

// (user side)
const productAll = async () => {
  try {
    const response = await axios.get(`${API_URL}`, { withCredentials: true }); // Add withCredentials
    console.log('productAll full response:', response); // Log entire response
    console.log('productAll data:', response.data);
    return response.data;
  } catch (error) {
    console.error('productAll error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
};
// One product (user side)
const productOne = async (product_id) => {
  try {
    if (!product_id || isNaN(product_id)) {
      throw new Error('Invalid product ID');
    }
    const response = await axios.get(`${API_URL}/${product_id}`, { withCredentials: true });
    console.log('productOne - full response:', response); // Debug
    console.log('productOne - data:', response.data); // Debug
    return response.data; // { success: true, data: { product, variants } }
  } catch (error) {
    console.error('productOne - error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(error.response?.data?.message || 'Failed to fetch product');
  }
};
// VENDOR: All vendor products
const fetchAll = async () => {
  try {
    const response = await axios.get(`${API_URL}/vendor`, { withCredentials: true });
    console.log('fetchAll response:', response.data); // Debug
    return response.data;
  } catch (error) {
    console.error('Error fetching vendor products:', error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch vendor products');
  }
};
// VENDOR: One vendor product
const fetchOne = async (product_id) => {
  try {
    if (!product_id || isNaN(product_id)) {
      throw new Error('Invalid product ID');
    }
    const response = await axios.get(`${API_URL}/vendor/${product_id}`, { withCredentials: true });
    console.log('fetchOne response:', response.data); // Debug
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch vendor product');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching vendor product:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(error.response?.data?.message || 'Failed to fetch vendor product');
  }
};
// VENDOR: Add product
const addProduct = async (formData) => {
  try {
    console.log('addProduct received formData:', Object.fromEntries(formData)); // Debug
    const response = await axios.post(`${API_URL}/vendor`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    });
    console.log('addProduct response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding product:', error.message, error.response?.data);
    return { success: false, error: error.response?.data?.error || error.message || 'Failed to add product' };
  }
};
// VENDOR: Update product
const updateProduct = async (product_id, productData) => {
  try {
    if (!product_id || isNaN(product_id)) {
      throw new Error('Invalid product ID');
    }

    // Validate required fields
    if (!productData.name || typeof productData.name !== 'string' || productData.name.trim() === '') {
      throw new Error('Product name is required');
    }
    if (!productData.description || typeof productData.description !== 'string') {
      throw new Error('Description is required');
    }
    if (productData.base_price == null || isNaN(productData.base_price) || productData.base_price < 0) {
      throw new Error('Valid base price is required');
    }
    if (!productData.category_id || isNaN(productData.category_id)) {
      throw new Error('Valid category ID is required');
    }
    if (!Array.isArray(productData.variants) || productData.variants.length === 0) {
      throw new Error('At least one variant is required');
    }

    const formData = new FormData();
    formData.append('product_id', product_id);
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('base_price', productData.base_price);
    formData.append('category_id', productData.category_id);
    formData.append('availability', productData.availability);
    formData.append('variants', JSON.stringify(productData.variants));
    if (productData.delete_variants?.length > 0) {
      formData.append('delete_variants', JSON.stringify(productData.delete_variants));
    }
    if (productData.image instanceof File) {
      formData.append('image', productData.image);
    }

    console.log('updateProduct sending:', Object.fromEntries(formData));
    const response = await axios.put(`${API_URL}/vendor/${product_id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    });
    console.log('updateProduct response:', response.data);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to update product');
    }
    return response.data;
  } catch (error) {
    console.error('Error updating product:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      fullResponse: error.response, // Log full response for debugging
    });
    throw new Error(error.response?.data?.error || error.message || 'Failed to update product');
  }
};
// VENDOR: Delete product
const deleteProduct = async (product_id) => {
  try {
    if (!product_id || isNaN(product_id)) {
      throw new Error('Invalid product ID');
    }
    const response = await axios.delete(`${API_URL}/vendor/${product_id}`, { withCredentials: true });
    console.log('deleteProduct response:', response.data);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to delete product');
    }
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(error.response?.data?.message || 'Failed to delete product');
  }
};

export { productAll, productOne, fetchAll, fetchOne, addProduct, updateProduct, deleteProduct };