const db = require('../../../database/mysql');

const fetchAllProducts = async () => {
  const [products] = await db.query(
    `SELECT p.product_id, p.name, p.img_url, p.description, p.availability, p.base_price, 
            p.created_at, p.updated_at, c.name AS category_name, 
            u.firstname, u.lastname, u.phone
     FROM PRODUCTS p
     JOIN CATEGORIES c ON p.category_id = c.category_id
     JOIN USERS u ON p.vendor_id = u.user_id`
  );

  const [variants] = await db.query(
    `SELECT v.variant_id, v.product_id, v.color, v.quantity, v.price, v.created_at, v.updated_at
     FROM PRODUCT_VARIANTS v
     WHERE v.product_id IN (SELECT product_id FROM PRODUCTS)`
  );

  return { products, variants };
};

const fetchOneProduct = async (product_id) => {
  const [products] = await db.query(
    `SELECT p.product_id, p.name, p.img_url, p.description, p.availability, p.base_price, 
            p.created_at, p.updated_at, c.name AS category_name, 
            u.firstname, u.lastname, u.phone
     FROM PRODUCTS p
     LEFT JOIN CATEGORIES c ON p.category_id = c.category_id
     LEFT JOIN USERS u ON p.vendor_id = u.user_id
     WHERE p.product_id = ?`,
    [product_id]
  );

  console.log('fetchOneProduct - products:', products)
  if (products.length === 0) {
    console.log(`No product found for product_id: ${product_id}`);
    return null;
  }

  const [variants] = await db.query(
    `SELECT variant_id, product_id, color, quantity, price, created_at, updated_at
     FROM PRODUCT_VARIANTS
     WHERE product_id = ?`,
    [product_id]
  );

  console.log('fetchOneProduct - product:', products[0], 'variants:', variants); // Debug
  return { product: products[0], variants };
};

module.exports = {
  fetchAllProducts,
  fetchOneProduct,
};