const db = require('../../database/mysql');

const checkout = async (req, res) => {
  if (!req.session?.user || req.session.user.role !== 'customer') {
    return res.status(401).json({ success: false, error: 'Unauthorized: Customer access required' });
  }

  const user_id = req.session.user.user_id;

  try {
    // Fetch cart items with stock and product details
    const [cartItems] = await db.query(
      `SELECT c.cart_id, c.variant_id, c.quantity, pv.price, pv.quantity AS stock, pv.color, p.name AS product_name
       FROM cart c
       JOIN product_variants pv ON c.variant_id = pv.variant_id
       JOIN products p ON pv.product_id = p.product_id
       WHERE c.user_id = ?`,
      [user_id]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ success: false, error: 'Cart is empty' });
    }

    // Validate stock availability
    for (const item of cartItems) {
      if (item.quantity > item.stock) {
        return res.status(400).json({ success: false, error: `Insufficient stock for ${item.color} ${item.product_name}` });
      }
    }

    // Calculate total price
    const total_price = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2);

    // Return cart details for modal display (no database changes yet)
    return res.status(200).json({
      success: true,
      data: {
        cartItems,
        total_price,
      },
      message: 'Cart details retrieved for checkout modal',
    });
  } catch (error) {
    console.error('Error fetching cart for checkout:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

const placeOrder = async (req, res) => {
  if (!req.session?.user || req.session.user.role !== 'customer') {
    return res.status(401).json({ success: false, error: 'Unauthorized: Customer access required' });
  }

  const user_id = req.session.user.user_id;
  // Optionally, accept shipping/payment details from the modal
  const { shipping_details } = req.body; // Example: could be validated if needed

  try {
    // Fetch cart items again to ensure consistency
    const [cartItems] = await db.query(
      `SELECT c.cart_id, c.variant_id, c.quantity, pv.price, pv.quantity AS stock, pv.color, p.name AS product_name
       FROM cart c
       JOIN product_variants pv ON c.variant_id = pv.variant_id
       JOIN products p ON pv.product_id = p.product_id
       WHERE c.user_id = ?`,
      [user_id]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ success: false, error: 'Cart is empty' });
    }

    // Validate stock
    for (const item of cartItems) {
      if (item.quantity > item.stock) {
        return res.status(400).json({ success: false, error: `Insufficient stock for ${item.color} ${item.product_name}` });
      }
    }

    const total_price = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2);

    await db.query('START TRANSACTION');

    try {
      // Insert into ORDERS
      const [orderResult] = await db.query(
        'INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)',
        [user_id, total_price, 'pending']
      );
      const order_id = orderResult.insertId;

      // Insert into ORDER_ITEMS
      for (const item of cartItems) {
        await db.query(
          'INSERT INTO order_items (order_id, variant_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)',
          [order_id, item.variant_id, item.quantity, item.price]
        );
      }

      // Clear CART
      await db.query('DELETE FROM cart WHERE user_id = ?', [user_id]);

      await db.query('COMMIT');

      return res.status(200).json({
        success: true,
        data: { order_id, total_price },
        message: 'Order placed successfully, awaiting payment confirmation',
      });
    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error placing order:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

const confirmPurchase = async (req, res) => {
  if (!req.session?.user || req.session.user.role !== 'customer') {
    return res.status(401).json({ success: false, error: 'Unauthorized: Customer access required' });
  }

  const { order_id } = req.body;
  const user_id = req.session.user.user_id;

  try {
    // Verify order exists and is pending
    const [order] = await db.query(
      'SELECT order_id, status FROM orders WHERE order_id = ? AND user_id = ?',
      [order_id, user_id]
    );

    if (order.length === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    if (order[0].status !== 'pending') {
      return res.status(400).json({ success: false, error: 'Order cannot be confirmed' });
    }

    await db.query('START TRANSACTION');

    try {
      // Update ORDERS status
      await db.query('UPDATE orders SET status = ? WHERE order_id = ?', ['confirmed', order_id]);

      // Fetch ORDER_ITEMS for PURCHASES (optional) and stock update
      const [orderItems] = await db.query(
        'SELECT variant_id, quantity, price_at_purchase FROM order_items WHERE order_id = ?',
        [order_id]
      );

      // Insert into PURCHASES (optional: remove if PURCHASES table is redundant)
      for (const item of orderItems) {
        await db.query(
          'INSERT INTO purchases (user_id, variant_id, quantity, total_price) VALUES (?, ?, ?, ?)',
          [user_id, item.variant_id, item.quantity, (item.quantity * item.price_at_purchase).toFixed(2)]
        );
      }

      // Update PRODUCT_VARIANTS quantity
      for (const item of orderItems) {
        await db.query(
          'UPDATE product_variants SET quantity = quantity - ? WHERE variant_id = ?',
          [item.quantity, item.variant_id]
        );
      }

      await db.query('COMMIT');

      return res.status(200).json({
        success: true,
        message: 'Purchase confirmed successfully',
      });
    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error confirming purchase:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

const viewPurchaseHistory = async (req, res) => {
  if (!req.session?.user || req.session.user.role !== 'customer') {
    return res.status(401).json({ success: false, error: 'Unauthorized: Customer access required' });
  }

  const user_id = req.session.user.user_id;

  try {
    // Use ORDERS and ORDER_ITEMS instead of PURCHASES for consistency (optional: keep PURCHASES if needed)
    const [purchases] = await db.query(
      `SELECT o.order_id, o.total_price, o.status, o.created_at, oi.variant_id, oi.quantity, oi.price_at_purchase, pv.color, p.name AS product_name
       FROM orders o
       JOIN order_items oi ON o.order_id = oi.order_id
       JOIN product_variants pv ON oi.variant_id = pv.variant_id
       JOIN products p ON pv.product_id = p.product_id
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [user_id]
    );

    return res.status(200).json({
      success: true,
      data: { purchases },
      message: purchases.length ? 'Purchase history retrieved successfully' : 'No purchase history',
    });
  } catch (error) {
    console.error('Error viewing purchase history:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

const viewOrderItems = async (req, res) => {
  if (!req.session?.user || req.session.user.role !== 'customer') {
    return res.status(401).json({ success: false, error: 'Unauthorized: Customer access required' });
  }

  const { order_id } = req.params;
  const user_id = req.session.user.user_id;

  try {
    const [order] = await db.query(
      'SELECT order_id, total_price, status FROM orders WHERE order_id = ? AND user_id = ?',
      [order_id, user_id]
    );

    if (order.length === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const [orderItems] = await db.query(
      `SELECT oi.order_id, oi.variant_id, oi.quantity, oi.price_at_purchase, pv.color, p.name AS product_name
       FROM order_items oi
       JOIN product_variants pv ON oi.variant_id = pv.variant_id
       JOIN products p ON pv.product_id = p.product_id
       WHERE oi.order_id = ?`,
      [order_id]
    );

    return res.status(200).json({
      success: true,
      data: {
        order: {
          order_id: order[0].order_id,
          total_price: order[0].total_price,
          status: order[0].status,
          items: orderItems,
        },
      },
      message: orderItems.length ? 'Order items retrieved successfully' : 'No items in order',
    });
  } catch (error) {
    console.error('Error viewing order items:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

const viewVendorSales = async (req, res) => {
  if (!req.session?.user || req.session.user.role !== 'vendor') {
    return res.status(401).json({ success: false, error: 'Unauthorized: Vendor access required' });
  }

  const vendor_id = req.session.user.user_id;

  try {
    const [sales] = await db.query(
      `SELECT oi.order_id, oi.variant_id, oi.quantity, oi.price_at_purchase, pv.color, p.name AS product_name, o.created_at, o.status
       FROM order_items oi
       JOIN product_variants pv ON oi.variant_id = pv.variant_id
       JOIN products p ON pv.product_id = p.product_id
       JOIN orders o ON oi.order_id = o.order_id
       WHERE p.vendor_id = ?
       ORDER BY o.created_at DESC`,
      [vendor_id]
    );

    return res.status(200).json({
      success: true,
      data: { sales },
      message: sales.length ? 'Vendor sales retrieved successfully' : 'No sales found',
    });
  } catch (error) {
    console.error('Error viewing vendor sales:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

module.exports = {
  checkout,
  placeOrder,
  confirmPurchase,
  viewPurchaseHistory,
  viewOrderItems,
  viewVendorSales,
};