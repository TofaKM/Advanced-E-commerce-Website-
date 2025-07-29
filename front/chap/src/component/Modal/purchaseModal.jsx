import { Modal, Button, Alert, Spinner } from 'react-bootstrap';
import { useCart } from '../../context/CartProvider';
import { useCheck } from '../../context/CheckProvider';
import { useState } from 'react';
import './style.css';

export default function PurchaseModal({ peg, closePeg }) {
  const { cart, totalCount, fetchCartData } = useCart(); // Use fetchCartData from CartContext
  const { checkout, placeOrder, confirmPurchase, loading, error } = useCheck();
  const [orderId, setOrderId] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handlePlaceOrder = async () => {
    try {
      await fetchCartData()
      const checkoutResult = await checkout()
      if (checkoutResult.success) {
        const result = await placeOrder({})
        if (result.success) {
          setOrderId(result.data.order_id);
          setOrderPlaced(true);
          await fetchCartData()
        }
      }
    } catch (err) {
      console.error('PurchaseModal: Error placing order:', err.message);
    }
  };

  const handleConfirm = async () => {
    try {
      const result = await confirmPurchase(orderId);
      if (result.success) {
        closePeg();
      }
    } catch (err) {
      console.error('PurchaseModal: Error confirming purchase:', err.message);
    }
  };

  return (
    <Modal show={peg} onHide={closePeg} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>PURCHASE ({totalCount} {totalCount === 1 ? 'item' : 'items'})</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        )}
        {error && <Alert variant="danger">{error}</Alert>}
        {cart.items.length === 0 && !loading && <p>Your cart is empty.</p>}
        {cart.items.length > 0 && !orderPlaced && (
          <>
            {cart.items.map((item) => (
              <div
                key={item.cart_id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '25px',
                  borderBottom: '1px solid #ddd',
                  paddingBottom: '20px',
                }}
              >
                <img
                  src={item.img_url || '/default.jpg'}
                  alt={item.product_name}
                  className="cart-item-image"
                  style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '30px' }}
                  onError={(e) => (e.target.src = '/default.jpg')}
                />
                <div style={{ flex: 1, padding: '15px' }}>
                  <h5 className="fw-bold">{item.product_name} ({item.color})</h5>
                  <p className="sm">Price: ${parseFloat(item.price).toFixed(2)}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Subtotal: ${(item.quantity * parseFloat(item.price)).toFixed(2)}</p>
                </div>
              </div>
            ))}
            <h4>Total: ${parseFloat(cart.total_price).toFixed(2)}</h4>
            <Button
              variant="primary"
              onClick={handlePlaceOrder}
              disabled={loading || cart.items.length === 0}
              style={{ width: '100%', marginTop: '20px' }}
            >
              Place Order
            </Button>
          </>
        )}
        {orderPlaced && (
          <>
            <p>Order placed successfully! Confirm your purchase below.</p>
            <Button
              variant="success"
              onClick={handleConfirm}
              disabled={loading || !orderId}
              style={{ width: '100%', marginTop: '20px' }}
            >
              Confirm Purchase
            </Button>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
}