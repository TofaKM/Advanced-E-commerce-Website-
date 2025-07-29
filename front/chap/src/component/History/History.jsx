import { useEffect, useState } from 'react';
import { useCheck } from '../../context/CheckProvider';
import { Modal, Button, Table, Spinner, Alert, Collapse } from 'react-bootstrap';
import './style.css';

export default function CustomerHistory({ history, closeHistory }) {
  const { fetchPurchaseHistory, purchaseHistory, loading, error } = useCheck();
  const [expandedOrders, setExpandedOrders] = useState({});

  // Fetch purchase history when modal is shown
  useEffect(() => {
    if (history) {
      fetchPurchaseHistory();
    }
  }, [history, fetchPurchaseHistory]);

  // Toggle expansion of order items
  const toggleOrder = (order_id) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [order_id]: !prev[order_id],
    }));
  };

  // Group purchase history by order_id
  const groupedData = purchaseHistory.reduce((acc, item) => {
    const { order_id, created_at, status, total_price } = item;
    if (!acc[order_id]) {
      acc[order_id] = {
        order_id,
        created_at: new Date(created_at).toLocaleString(),
        status,
        total_price: parseFloat(total_price),
        items: [],
      };
    }
    acc[order_id].items.push({
      variant_id: item.variant_id,
      quantity: item.quantity,
      price_at_purchase: item.price_at_purchase,
      color: item.color,
      product_name: item.product_name,
    });
    return acc;
  }, {});

  const orders = Object.values(groupedData);

  return (
    <Modal show={history} onHide={closeHistory} size="xl" centered className="history-modal">
      <Modal.Header closeButton>
        <Modal.Title>Purchase History</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        )}
        {error && <Alert variant="danger">{error}</Alert>}
        {!loading && orders.length === 0 && <p>No purchase history found.</p>}
        {orders.length > 0 && (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <>
                  <tr key={order.order_id}>
                    <td>{order.order_id}</td>
                    <td>{order.created_at}</td>
                    <td>${parseFloat(order.total_price).toFixed(2)}</td>
                    <td>{order.status}</td>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => toggleOrder(order.order_id)}
                        disabled={loading}
                      >
                        {expandedOrders[order.order_id] ? 'Hide Items' : 'Show Items'}
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="5">
                      <Collapse in={expandedOrders[order.order_id]}>
                        <div>
                          <Table striped bordered hover size="sm" className="mt-2">
                            <thead>
                              <tr>
                                <th>Product</th>
                                <th>Color</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.items.map((item) => (
                                <tr key={item.variant_id}>
                                  <td>{item.product_name}</td>
                                  <td>{item.color}</td>
                                  <td>{item.quantity}</td>
                                  <td>${parseFloat(item.price_at_purchase).toFixed(2)}</td>
                                  <td>
                                    ${(item.quantity * parseFloat(item.price_at_purchase)).toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      </Collapse>
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeHistory}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}