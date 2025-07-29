const db = require('../../database/mysql');

const addToCart = async (req, res) => {
  if (!req.session?.user || req.session.user.role !== 'customer') {
    return res.status(401).json({ success: false, error: 'Unauthorized: Customer access required' });
  }

  const { variant_id, quantity } = req.body;
  const user_id = req.session.user.user_id;

  try {
    // Validate inputs
    if (!variant_id || !quantity || quantity < 1) {
      return res.status(400).json({ success: false, error: 'Variant ID and quantity (greater than 0) are required' });
    }

    // Check if variant exists and has enough stock
    const [variant] = await db.query(
      'SELECT pv.quantity, pv.color, p.name AS product_name FROM product_variants pv JOIN products p ON pv.product_id = p.product_id WHERE pv.variant_id = ?',
      [variant_id]
    );
    console.log('cartController: Variant query result:', variant)
    if (variant.length === 0) {
      return res.status(404).json({ success: false, error: 'Product variant not found' });
    }
    if (variant[0].quantity < quantity) {
      return res.status(400).json({ success: false, error: `Only ${variant[0].quantity} ${variant[0].color} ${variant[0].product_name} available` });
    }

    // Check if item is already in cart
    const [existingItem] = await db.query('SELECT cart_id, quantity FROM cart WHERE user_id = ? AND variant_id = ?', [user_id, variant_id]);
    let cart_id;
    if (existingItem.length > 0) {
      const newQuantity = existingItem[0].quantity + quantity;
      if (newQuantity > variant[0].quantity) {
        return res.status(400).json({ success: false, error: `Total quantity exceeds stock; only ${variant[0].quantity} ${variant[0].color} ${variant[0].product_name} available` });
      }
      await db.query('UPDATE cart SET quantity = ?, updated_at = NOW() WHERE cart_id = ?', [newQuantity, existingItem[0].cart_id]);
      cart_id = existingItem[0].cart_id;
    } else {
      const [result] = await db.query('INSERT INTO cart (user_id, variant_id, quantity) VALUES (?, ?, ?)', [user_id, variant_id, quantity]);
      cart_id = result.insertId;
    }

    return res.status(200).json({ success: true, data: { cart_id }, message: 'Item added to cart' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

const viewCart = async (req, res) => {
  if (!req.session?.user || req.session.user.role !== 'customer') {
    return res.status(401).json({ success: false, error: 'Unauthorized: Customer access required' });
  }

  const user_id = req.session.user.user_id;

  try {
    const [cartItems] = await db.query(
      `SELECT c.cart_id, c.variant_id, c.quantity, pv.price, pv.color, p.name AS product_name ,p.img_url
       FROM cart c
       JOIN product_variants pv ON c.variant_id = pv.variant_id
       JOIN products p ON pv.product_id = p.product_id
       WHERE c.user_id = ?`,
      [user_id]
    );

    

    const total = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

    return res.status(200).json({
      success: true,
      data: { cart: cartItems, total_price: total.toFixed(2) },
      message: cartItems.length ? 'Cart retrieved successfully' : 'Cart is empty'
    });
  } catch (error) {
    console.error('Error viewing cart:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

const removeCartItem = async (req, res) => {
  if (!req.session?.user || req.session.user.role !== 'customer') {
    return res.status(401).json({ success: false, error: 'Unauthorized: Customer access required' });
  }

  const { variant_id } = req.body;
  const user_id = req.session.user.user_id;

  try {
    if (!variant_id) {
      return res.status(400).json({ success: false, error: 'Variant ID is required' });
    }

    const [result] = await db.query('DELETE FROM cart WHERE user_id = ? AND variant_id = ?', [user_id, variant_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Item not found in cart' });
    }

    return res.status(200).json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing cart item:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

const incrementCartItem = async (req, res) => {
  if (!req.session?.user || req.session.user.role !== 'customer') {
    return res.status(401).json({ success: false, error: 'Unauthorized: Customer access required' });
  }

  const { variant_id } = req.body;
  const user_id = req.session.user.user_id;

  try {
    if (!variant_id) {
      return res.status(400).json({ success: false, error: 'Variant ID is required' });
    }

    const [cartItem] = await db.query('SELECT cart_id, quantity FROM cart WHERE user_id = ? AND variant_id = ?', [user_id, variant_id]);
    if (cartItem.length === 0) {
      return res.status(404).json({ success: false, error: 'Item not found in cart' });
    }

    const [variant] = await db.query(
      'SELECT pv.quantity, pv.color, p.name AS product_name FROM product_variants pv JOIN products p ON pv.product_id = p.product_id WHERE pv.variant_id = ?',
      [variant_id]
    );
    if (variant.length === 0) {
      return res.status(404).json({ success: false, error: 'Product variant not found' });
    }

    const newQuantity = cartItem[0].quantity + 1;
    if (newQuantity > variant[0].quantity) {
      return res.status(400).json({ success: false, error: `Cannot add more; only ${variant[0].quantity} ${variant[0].color} ${variant[0].product_name} available` });
    }

    await db.query('UPDATE cart SET quantity = ?, updated_at = NOW() WHERE cart_id = ?', [newQuantity, cartItem[0].cart_id]);
    return res.status(200).json({ success: true, message: 'Cart item quantity increased' });
  } catch (error) {
    console.error('Error incrementing cart item:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

const decrementCartItem = async (req, res) => {
  if (!req.session?.user || req.session.user.role !== 'customer') {
    return res.status(401).json({ success: false, error: 'Unauthorized: Customer access required' });
  }

  const { variant_id } = req.body;
  const user_id = req.session.user.user_id;

  try {
    if (!variant_id) {
      return res.status(400).json({ success: false, error: 'Variant ID is required' });
    }

    const [cartItem] = await db.query('SELECT cart_id, quantity FROM cart WHERE user_id = ? AND variant_id = ?', [user_id, variant_id]);
    if (cartItem.length === 0) {
      return res.status(404).json({ success: false, error: 'Item not found in cart' });
    }

    const currentQuantity = cartItem[0].quantity;
    if (currentQuantity === 1) {
      const [result] = await db.query('DELETE FROM cart WHERE cart_id = ?', [cartItem[0].cart_id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, error: 'Item not found in cart' });
      }
      return res.status(200).json({ success: true, message: 'Item removed from cart' });
    }

    const newQuantity = currentQuantity - 1;
    await db.query('UPDATE cart SET quantity = ?, updated_at = NOW() WHERE cart_id = ?', [newQuantity, cartItem[0].cart_id]);
    return res.status(200).json({ success: true, message: 'Cart item quantity decreased' });
  } catch (error) {
    console.error('Error decrementing cart item:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

const clearCart = async (req, res) => {
  if (!req.session?.user || req.session.user.role !== 'customer') {
    return res.status(401).json({ success: false, error: 'Unauthorized: Customer access required' });
  }

  const user_id = req.session.user.user_id;

  try {
    const [cartItems] = await db.query('SELECT 1 FROM cart WHERE user_id = ?', [user_id]);
    if (cartItems.length === 0) {
      return res.status(400).json({ success: false, error: 'Cart is already empty' });
    }

    await db.query('DELETE FROM cart WHERE user_id = ?', [user_id]);
    return res.status(200).json({ success: true, message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

module.exports = {
  addToCart,
  viewCart,
  removeCartItem,
  incrementCartItem,
  decrementCartItem,
  clearCart,
};