const {fetchAllProducts,fetchOneProduct,} = require('./customerQueries');
// Fetch All Products (from all vendors)
const fetchAllProductsHandler = async (req, res) => {
  try {
    // Optional: Require customer authentication
    if (!req.session.user || req.session.user.role !== 'customer') {
      return res.status(403).json({ success: false, error: 'Unauthorized: Customer access required' });
    }

    console.log('Fetching all products for customer:', req.session.user.user_id); // Debugging
    const { products, variants } = await fetchAllProducts();

    // Group variants by product_id
    const productsWithVariants = products.map(product => ({
      ...product,
      variants: variants.filter(v => v.product_id === product.product_id),
    }));

    res.status(200).json({ success: true, data: productsWithVariants });
  } catch (error) {
    console.error('Error fetching all products:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
}
// Fetch One Product
const fetchOneProductHandler = async (req, res) => {
  try {
    console.log('fetchOneProductHandler - Session:', req.session.user)
    if (!req.session.user || req.session.user.role !== 'customer') {
      console.log('Unauthorized access attempt:', req.session.user);
      return res.status(403).json({ success: false, error: 'Unauthorized: Customer access required' });
    }

    const product_id = parseInt(req.params.product_id);
    console.log('fetchOneProductHandler - product_id:', product_id);
    if (isNaN(product_id)) {
      console.log('Invalid product ID:', req.params.product_id);
      return res.status(400).json({ success: false, error: 'Invalid product ID' });
    }

    console.log('Fetching product for customer:', product_id);
    const result = await fetchOneProduct(product_id);
    console.log('fetchOneProduct result:', result);
    if (!result) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch product' });
  }
};

module.exports = {
  fetchAllProducts: fetchAllProductsHandler,
  fetchOneProduct: fetchOneProductHandler,
};