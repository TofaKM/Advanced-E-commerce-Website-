
const validateCategory = async (connection, category_id) => {
  const [dbName] = await connection.query('SELECT DATABASE()');
  console.log('validateCategory database:', dbName[0]['DATABASE()']);
  const [rows] = await connection.query('SELECT category_id, name FROM categories WHERE category_id = ?', [category_id]);
  console.log('validateCategory query result:', { category_id, rows });
  return rows.length > 0 ? rows[0] : null;
};

async function insertProduct(connection, productData) {
  const { name, description, base_price, category_id, availability, img_url, vendor_id } = productData;
  const [result] = await connection.query(
    `INSERT INTO products (name, description, base_price, category_id, availability, img_url, vendor_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, description, base_price, category_id, availability, img_url, vendor_id]
  );
  return result.insertId;
}

const insertVariant = async (connection, variantData) => {
  const { product_id, color, quantity, price } = variantData;
  await connection.query(
    'INSERT INTO PRODUCT_VARIANTS (product_id, color, quantity, price, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
    [product_id, color, quantity, price]
  );
};

const fetchVendorProducts = async (connection, vendor_id) => {
  const [products] = await connection.query(
    `SELECT p.product_id, p.name, p.img_url, p.description, p.availability, p.base_price, 
            p.created_at, p.updated_at, c.name AS category_name, 
            u.firstname, u.lastname, u.phone
     FROM PRODUCTS p
     JOIN CATEGORIES c ON p.category_id = c.category_id
     JOIN USERS u ON p.vendor_id = u.user_id
     WHERE p.vendor_id = ?`,
    [vendor_id]
  );

  const [variants] = await connection.query(
    `SELECT v.variant_id, v.product_id, v.color, v.quantity, v.price, v.created_at, v.updated_at
     FROM PRODUCT_VARIANTS v
     WHERE v.product_id IN (SELECT product_id FROM PRODUCTS WHERE vendor_id = ?)`,
    [vendor_id]
  );

  return { products, variants };
};

const fetchOneProduct = async (connection, product_id, vendor_id) => {
  const [products] = await connection.query(
    `SELECT p.product_id, p.name, p.img_url, p.description, p.availability, p.base_price, 
            p.created_at, p.updated_at, c.name AS category_name, 
            u.firstname, u.lastname, u.phone
     FROM PRODUCTS p
     JOIN CATEGORIES c ON p.category_id = c.category_id
     JOIN USERS u ON p.vendor_id = u.user_id
     WHERE p.product_id = ? AND p.vendor_id = ?`,
    [product_id, vendor_id]
  );

  if (products.length === 0) return null;

  const [variants] = await connection.query(
    `SELECT variant_id, product_id, color, quantity, price, created_at, updated_at
     FROM PRODUCT_VARIANTS
     WHERE product_id = ?`,
    [product_id]
  );

  return { product: products[0], variants };
};

const validateProductOwnership = async (connection, product_id, vendor_id) => {
  const [rows] = await connection.query(
    'SELECT product_id FROM PRODUCTS WHERE product_id = ? AND vendor_id = ?',
    [product_id, vendor_id]
  );
  return rows.length > 0;
};

const updateProduct = async (connection, product_id, vendor_id, productData) => {
  const { name, img_url, description, category_id, availability, base_price } = productData;
  await connection.query(
    'UPDATE PRODUCTS SET name = ?, img_url = ?, description = ?, category_id = ?, availability = ?, base_price = ?, updated_at = NOW() WHERE product_id = ? AND vendor_id = ?',
    [name, img_url, description, category_id, availability, base_price, product_id, vendor_id]
  );
};

const updateVariant = async (connection, variant_id, product_id, variantData) => {
  const { color, quantity, price } = variantData;
  await connection.query(
    'UPDATE PRODUCT_VARIANTS SET color = ?, quantity = ?, price = ?, updated_at = NOW() WHERE variant_id = ? AND product_id = ?',
    [color, quantity, price, variant_id, product_id]
  );
};

const insertNewVariant = async (connection, product_id, variantData) => {
  const { color, quantity, price } = variantData;
  await connection.query(
    'INSERT INTO PRODUCT_VARIANTS (product_id, color, quantity, price, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
    [product_id, color, quantity, price]
  );
};

const deleteVariant = async (connection, variant_id, product_id) => {
  await connection.query(
    'DELETE FROM PRODUCT_VARIANTS WHERE variant_id = ? AND product_id = ?',
    [variant_id, product_id]
  );
};

const checkProductDependencies = async (connection, product_id) => {
  const [orderItems] = await connection.query(
    'SELECT COUNT(*) AS count FROM ORDER_ITEMS WHERE variant_id IN (SELECT variant_id FROM PRODUCT_VARIANTS WHERE product_id = ?)',
    [product_id]
  );
  const [cartItems] = await connection.query(
    'SELECT COUNT(*) AS count FROM CART WHERE variant_id IN (SELECT variant_id FROM PRODUCT_VARIANTS WHERE product_id = ?)',
    [product_id]
  );
  return { orderItems: orderItems[0].count, cartItems: cartItems[0].count };
};

const deleteProduct = async (connection, product_id, vendor_id) => {
  await connection.query(
    'DELETE FROM PRODUCTS WHERE product_id = ? AND vendor_id = ?',
    [product_id, vendor_id]
  );
};

const fetchCategories = async (connection) => {
  const [categories] = await connection.query('SELECT category_id, name FROM CATEGORIES ORDER BY name');
  return categories;
}

module.exports = {
  validateCategory,
  insertProduct,
  insertVariant,
  fetchVendorProducts,
  fetchOneProduct,
  validateProductOwnership,
  updateProduct,
  updateVariant,
  insertNewVariant,
  deleteVariant,
  checkProductDependencies,
  deleteProduct,
  fetchCategories,
};