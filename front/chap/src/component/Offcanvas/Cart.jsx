import { Offcanvas, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { useState } from 'react';
import { useCart } from '../../context/CartProvider';
import PurchaseModal from '../Modal/purchaseModal';
import './style.css';

export default function Bag({ bag, closeBag }) {
    const { cart, totalCount, loading, error, incrementCartItem, decrementCartItem, removeCartItem, fetchCartData } = useCart();
    const [peg, setPeg] = useState(false);

    const openPeg = () => setPeg(true);
    const closePeg = () => setPeg(false);

    const handleCheckout = async () => {
      try {
        await fetchCartData()
        
        openPeg();
      }catch(err){
        console.error('Bag: Error fetching cart:', err.message);
      }
    }

    return (
      <Offcanvas placement="end" show={bag} onHide={closeBag}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className='align-item-center d-flex fw-bold'>CART <Badge variant='success'>({totalCount} {totalCount === 1 ? 'item' : 'items'})</Badge></Offcanvas.Title>
        </Offcanvas.Header>
        <hr />
        <Offcanvas.Body>
          {loading && (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          )}
          {error && <Alert variant="danger">{error}</Alert>}
          {cart.items.length === 0 && !loading && <p>Your cart is empty.</p>}
          {cart.items.length > 0 && (
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
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => incrementCartItem(item.variant_id)}
                    disabled={loading}
                  >
                    +
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => decrementCartItem(item.variant_id)}
                    disabled={loading}
                  >
                    -
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeCartItem(item.variant_id)}
                    disabled={loading}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            <h4>Total: ${parseFloat(cart.total_price).toFixed(2)}</h4>
            <Button
              variant="primary"
              onClick={handleCheckout}
              disabled={loading || cart.items.length === 0}
              style={{ width: '100%', marginTop: '20px' }}
            >
              Proceed to Checkout
            </Button>
          </>
        )}
      </Offcanvas.Body>
      <PurchaseModal peg={peg} closePeg={closePeg} />
    </Offcanvas>
  );
}