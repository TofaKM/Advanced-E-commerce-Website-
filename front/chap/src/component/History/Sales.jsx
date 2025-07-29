import { useEffect, useState } from 'react';
import { useCheck } from '../../context/CheckProvider';
import { Modal, Button, Table, Spinner, Alert, Collapse } from 'react-bootstrap';
import './style.css';

export default function VendorSales({ sales, closeSales }) {
  const { fetchVendorSales, vendorSales, loading, error } = useCheck();
  const [expandedOrders, setExpandedOrders] = useState({});

  // Fetch sales history when modal is shown
  useEffect(() => {
    if (sales) {
      fetchVendorSales();
    }
  }, [sales, fetchVendorSales]);

  // Toggle expansion of order items
  const toggleOrder = (order_id) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [order_id]: !prev[order_id],
    }));
  };

  // Group sales history by order_id and calculate totals
  const groupedData = vendorSales.reduce((acc, item) => {
    const { order_id, created_at, status } = item;
    if (!acc[order_id]) {
      acc[order_id] = {
        order_id,
        created_at: new Date(created_at).toLocaleString(),
        status,
        total_price: 0,
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
    acc[order_id].total_price += item.quantity * item.price_at_purchase;
    return acc;
  }, {});

  const orders = Object.values(groupedData);

  // Calculate grand total of all sales
  const grandTotal = orders.reduce((sum, order) => sum + order.total_price, 0);

  // Format price in KES
  const formatPrice = (amount) => {
    if (amount == null || isNaN(amount)) return "Ksh 0.00";
    const formatter = new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    });
    return `${formatter.format(amount)}.00`;
  };

  return (
    <Modal show={sales} onHide={closeSales} size="xl" centered className="history-modal">
      <Modal.Header closeButton>
        <Modal.Title>Sales History</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        )}
        {error && <Alert variant="danger">{error}</Alert>}
        {!loading && orders.length === 0 && <p>No sales history found.</p>}
        {orders.length > 0 && (
          <>
            <div className="mb-3">
              <h5>Total Sales: {formatPrice(grandTotal)}</h5>
            </div>
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
                      <td>{formatPrice(order.total_price)}</td>
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
                                    <td>{formatPrice(item.price_at_purchase)}</td>
                                    <td>{formatPrice(item.quantity * item.price_at_purchase)}</td>
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
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeSales}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}