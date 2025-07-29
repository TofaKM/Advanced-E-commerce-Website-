const { upload, handleUploadErrors } = require('../../../image/multer');
const {validateCategory,insertProduct,insertVariant,fetchVendorProducts,fetchOneProduct,validateProductOwnership,updateProduct,updateVariant,insertNewVariant,deleteVariant,checkProductDependencies,deleteProduct,fetchCategories,} = require('./vendorQueries');

const validateProductInput = (data) => {
  console.log('validateProductInput received:', data); // Debug
  const { name, description, base_price, category_id, availability, variants } = data;

  if (!name || typeof name !== 'string' || name.trim() === '' || name.length > 255) {
    throw new Error('Product name is required, must be a non-empty string, and max 255 characters');
  }
  if (!description || typeof description !== 'string' || description.trim() === '') {
    throw new Error('Description is required and must be a non-empty string');
  }
  if (!category_id || isNaN(category_id) || parseInt(category_id) <= 0) {
    throw new Error('Valid category ID is required');
  }
  if (base_price == null || isNaN(base_price) || parseFloat(base_price) < 0) {
    throw new Error('Base price is required and must be non-negative');
  }
  if (availability && !['available', 'sold out'].includes(availability)) {
    throw new Error('Availability must be "available" or "sold out"');
  }
  if (!variants || !Array.isArray(variants) || variants.length === 0) {
    throw new Error('At least one variant is required');
  }
  const colors = new Set();
  variants.forEach((v, index) => {
    if (!v.color || typeof v.color !== 'string' || v.color.trim() === '' || v.color.length > 50) {
      throw new Error(`Variant ${index + 1}: Color is required, must be a non-empty string, and max 50 characters`);
    }
    if (colors.has(v.color.toLowerCase())) {
      throw new Error(`Variant ${index + 1}: Duplicate color "${v.color}"`);
    }
    colors.add(v.color.toLowerCase());
    if (v.quantity == null || isNaN(v.quantity) || parseInt(v.quantity) < 0) {
      throw new Error(`Variant ${index + 1}: Quantity is required and must be non-negative`);
    }
    if (v.price == null || isNaN(v.price) || parseFloat(v.price) < 0) {
      throw new Error(`Variant ${index + 1}: Price is required and must be non-negative`);
    }
  });

  // Return validated data
  return {
    name: name.trim(),
    description: description.trim(),
    base_price: parseFloat(base_price),
    category_id: parseInt(category_id),
    availability: availability || 'available',
    variants: variants.map((v) => ({
      variant_id: v.variant_id ? parseInt(v.variant_id) : undefined,
      color: v.color.trim(),
      quantity: parseInt(v.quantity),
      price: parseFloat(v.price),
    })),
  };
};
// Add Product
const addProduct = async (req, res) => {
  let connection;
  try {
    const pool = req.app.get('dbConnection');
    connection = await pool.getConnection();

    const [dbName] = await connection.query('SELECT DATABASE()');
    console.log('addProduct database:', dbName[0]['DATABASE()']);

    if (!req.session.user || req.session.user.role !== 'vendor') {
      return res.status(403).json({ success: false, error: 'Unauthorized: Vendor access required' });
    }

    const { name, description, base_price, category_id, availability, variants } = req.body;
    const vendor_id = req.session.user.user_id;
    const img_url = req.file ? req.file.path : 'default.jpg';
    const parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;

    // Now it's safe to log:
    console.log('addProduct received:', { name, description, base_price, category_id, availability, variants: parsedVariants, vendor_id, img_url });

    // Validate input
    validateProductInput({ name, description, base_price, category_id, availability, variants: parsedVariants });

    // Validate category
    const category = await validateCategory(connection, category_id);
    if (!category) {
      console.log('Invalid category_id:', category_id); // Debug
      return res.status(400).json({ success: false, error: 'Invalid category ID' });
    }

    // Start transaction
    await connection.beginTransaction();

    // Insert product
    const productData = {
      category_id: parseInt(category_id),
      name,
      img_url,
      description,
      vendor_id,
      availability: availability || 'available',
      base_price: parseFloat(base_price),
    };
    const product_id = await insertProduct(connection, productData);

    // Insert variants
    for (const variant of parsedVariants) {
      await insertVariant(connection, {
        product_id,
        color: variant.color,
        quantity: parseInt(variant.quantity),
        price: parseFloat(variant.price),
      });
    }

    // Commit transaction
    await connection.commit();

    // Fetch created product
    const result = await fetchOneProduct(connection, product_id, vendor_id);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error('Add product error:', error.message, error.stack); // Detailed error logging
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error('Rollback error:', rollbackError);
      }
    }
    res.status(400).json({ success: false, error: error.message });
  } finally {
    if (connection) connection.release();
  }
};
// Update Product
const updateProductHandler = async (req, res) => {
  let connection;
  try {
    const pool = req.app.get('dbConnection');
    connection = await pool.getConnection();

    if (!req.session.user || req.session.user.role !== 'vendor') {
      return res.status(403).json({ success: false, error: 'Unauthorized: Vendor access required' });
    }

    const product_id = parseInt(req.params.product_id);
    const { name, description, base_price, category_id, availability, variants, delete_variants } = req.body;
    const vendor_id = req.session.user.user_id;
    const img_url = req.file ? req.file.path : undefined;

    const parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants || [];
    const parsedDeleteVariants = typeof delete_variants === 'string' ? JSON.parse(delete_variants) : delete_variants || [];

    console.log('Updating product:', {
      product_id,
      name,
      description,
      base_price,
      category_id,
      availability,
      variants: parsedVariants,
      delete_variants: parsedDeleteVariants,
      img_url,
    });

    // Validate input and get validated data
    const validatedData = validateProductInput({
      name,
      description,
      base_price,
      category_id: parseInt(category_id), // Ensure category_id is parsed
      availability,
      variants: parsedVariants,
    });

    const isOwner = await validateProductOwnership(connection, product_id, vendor_id);
    if (!isOwner) {
      return res.status(404).json({ success: false, error: 'Product not found or unauthorized' });
    }

    const category = await validateCategory(connection, validatedData.category_id);
    if (!category) {
      return res.status(400).json({ success: false, error: 'The selected category does not exist' });
    }

    const currentProduct = await fetchOneProduct(connection, product_id, vendor_id);
    if (!currentProduct) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const currentVariants = currentProduct.variants || [];
    const remainingVariants = currentVariants
      .filter((v) => !parsedDeleteVariants.includes(v.variant_id))
      .concat(parsedVariants.filter((v) => !v.variant_id));
    if (remainingVariants.length === 0) {
      return res.status(400).json({ success: false, error: 'At least one variant is required after update' });
    }

    await connection.beginTransaction();

    const productData = {
      name: validatedData.name,
      img_url: img_url || currentProduct.product.img_url,
      description: validatedData.description,
      category_id: validatedData.category_id,
      availability: validatedData.availability,
      base_price: validatedData.base_price,
    };
    await updateProduct(connection, product_id, vendor_id, productData);

    for (const variant of validatedData.variants) {
      if (variant.variant_id) {
        await updateVariant(connection, variant.variant_id, product_id, {
          color: variant.color,
          quantity: variant.quantity,
          price: variant.price,
        });
      } else {
        await insertNewVariant(connection, product_id, {
          color: variant.color,
          quantity: variant.quantity,
          price: variant.price,
        });
      }
    }

    if (parsedDeleteVariants.length > 0) {
      for (const variant_id of parsedDeleteVariants) {
        if (!isNaN(variant_id) && variant_id > 0) {
          await deleteVariant(connection, variant_id, product_id);
        }
      }
    }

    await connection.commit();
    const result = await fetchOneProduct(connection, product_id, vendor_id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Update product error:', error.message, error.stack);
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error('Rollback error:', rollbackError);
      }
    }
    res.status(400).json({ success: false, error: error.message });
  } finally {
    if (connection) connection.release();
  }
};
// Fetch All Vendor Products (no transaction needed)
const getVendorProducts = async (req, res) => {
  try {
    const pool = req.app.get('dbConnection');
    const connection = await pool.getConnection();
    try {
      if (!req.session.user || req.session.user.role !== 'vendor') {
        return res.status(403).json({ success: false, error: 'Unauthorized: Vendor access required' });
      }

      console.log('Fetching products for vendor:', req.session.user.user_id); // Debugging
      const { products, variants } = await fetchVendorProducts(connection, req.session.user.user_id);

      // Group variants by product_id
      const productsWithVariants = products.map(product => ({
        ...product,
        variants: variants.filter(v => v.product_id === product.product_id),
      }));

      res.status(200).json({ success: true, data: productsWithVariants });
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
};
// Fetch One Product (no transaction needed)
const getOneProduct = async (req, res) => {
  try {
    const pool = req.app.get('dbConnection');
    const connection = await pool.getConnection();
    try {
      if (!req.session.user || req.session.user.role !== 'vendor') {
        return res.status(403).json({ success: false, error: 'Unauthorized: Vendor access required' });
      }

      const product_id = parseInt(req.params.product_id);
      if (isNaN(product_id)) {
        return res.status(400).json({ success: false, error: 'Invalid product ID' });
      }

      console.log('Fetching product:', product_id); // Debugging
      const result = await fetchOneProduct(connection, product_id, req.session.user.user_id);
      if (!result) {
        return res.status(404).json({ success: false, error: 'Product not found or unauthorized' });
      }
      res.status(200).json({ success: true, data: result });
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch product' });
  }
};
// Delete Product (no transaction needed, unless you want to wrap in transaction)
const deleteProductHandler = async (req, res) => {
  try {
    const pool = req.app.get('dbConnection');
    const connection = await pool.getConnection();
    try {
      if (!req.session.user || req.session.user.role !== 'vendor') {
        return res.status(403).json({ success: false, error: 'Unauthorized: Vendor access required' });
      }

      const product_id = parseInt(req.params.product_id);
      if (isNaN(product_id)) {
        return res.status(400).json({ success: false, error: 'Invalid product ID' });
      }

      console.log('Deleting product:', product_id); // Debugging
      const isOwner = await validateProductOwnership(connection, product_id, req.session.user.user_id);
      if (!isOwner) {
        return res.status(404).json({ success: false, error: 'Product not found or unauthorized' });
      }

      const { orderItems, cartItems } = await checkProductDependencies(connection, product_id);
      if (orderItems > 0 || cartItems > 0) {
        return res.status(400).json({ success: false, error: 'Cannot delete product with active orders or cart items' });
      }

      await deleteProduct(connection, product_id, req.session.user.user_id);
      res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete product' });
  }
};
// Fetch Categories for Form Select (no transaction needed)
const getCategories = async (req, res) => {
  try {
    const pool = req.app.get('dbConnection');
    const connection = await pool.getConnection();
    try {
      if (!req.session.user || req.session.user.role !== 'vendor') {
        return res.status(403).json({ success: false, error: 'Unauthorized: Vendor access required' });
      }

      console.log('Fetching categories'); // Debugging
      const categories = await fetchCategories(connection);
      res.status(200).json({ success: true, data: categories });
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
};

module.exports = {
  addProduct: [upload.single('image'), handleUploadErrors, addProduct],
  getVendorProducts,
  getOneProduct,
  updateProduct: [upload.single('image'), handleUploadErrors, updateProductHandler],
  deleteProduct: deleteProductHandler,
  getCategories,
};