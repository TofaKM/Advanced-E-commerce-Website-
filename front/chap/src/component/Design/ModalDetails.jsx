import { useEffect, useState } from "react";
import { Modal, Button, Table, Badge, Form, Alert } from "react-bootstrap";
import { useProduct } from "../../context/ProductProvider";
import { useCart } from "../../context/CartProvider";
import "./style.css";

export function ModalDetails({ view, closeView, product_id }) {
  const { one, selectedProduct, loading, error: productError } = useProduct();
  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState({});
  const [cartError, setCartError] = useState(null);

  useEffect(() => {
    if (view && product_id) {
      one(product_id);
      setQuantities({});
      setCartError(null);
    }
  }, [view, product_id, one]);

  useEffect(() => {
    if (selectedProduct?.variants) {
      const initialQuantities = selectedProduct.variants.reduce((acc, variant) => ({
        ...acc,
        [variant.variant_id]: 1,
      }), {});
      setQuantities(initialQuantities);
    }
  }, [selectedProduct]);

  const handleQuantityChange = (variantId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [variantId]: Math.max(1, Math.min(value, selectedProduct.variants.find((v) => v.variant_id === variantId)?.quantity || 1)),
    }));
    setCartError(null);
  };

  const handleAddToCart = async (variant_id) => {
    const quantity = quantities[variant_id] || 1;
    console.log('ModalDetails: Adding to cart:', { variant_id, quantity, url: 'http://localhost:3000/cart/auth/add' });
    try {
      const response = await addToCart(variant_id, quantity);
      console.log('ModalDetails: addToCart response:', response);
      if (response.success) {
        setCartError(null);
        alert('Item added to cart successfully!');
      }
    } catch (error) {
      console.log('ModalDetails: addToCart error:', error);
      setCartError(error.response?.data?.error || error.message || 'Error adding item to cart');
    }
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (productError) return <div className="text-danger text-center py-5">Error: {productError}</div>;
  if (!selectedProduct || !selectedProduct.product) return <div className="text-muted text-center py-5">No product found.</div>;

  const { product, variants } = selectedProduct;

  const statusColor = {
    available: "success",
    "sold out": "danger",
  };

  const formatPrice = (amount) => {
    if (amount == null || isNaN(amount)) return "Ksh 0/day";
    const formatter = new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    });
    return `${formatter.format(amount)}`;
  };

  return (
    <Modal centered size="lg" show={view} onHide={closeView} className="modal-custom">
      <Modal.Header closeButton className="border-0 pb-2">
        <Modal.Title className="fw-bold">{product.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 py-3">
        {cartError && <Alert variant="danger">{cartError}</Alert>}
        <div className="d-flex flex-column flex-md-row gap-4">
          <img
            src={product.img_url}
            alt={product.name}
            className="product-image rounded shadow-sm"
            onError={(e) => (e.target.src = "/default.jpg")}
          />
          <div className="flex-grow-1">
            <h4 className="fw-semibold mb-3">{product.name}</h4>
            <div className="mb-3">
              <p className="mb-1"><strong>Vendor:</strong> {product.firstname} {product.lastname}</p>
              <p className="mb-1"><strong>Phone:</strong> {product.phone}</p>
              <p className="mb-1"><strong>Category:</strong> {product.category_name}</p>
              <p className="text-muted mb-2"><strong>Description:</strong> {product.description}</p>
              <Badge
                bg={statusColor[product.availability.toLowerCase()] || "secondary"}
                className="text-capitalize px-3 py-2"
              >
                {product.availability}
              </Badge>
            </div>
            <p className="fw-medium mb-2">Base Price: {formatPrice(product.base_price)}</p>
          </div>
        </div>
        {variants.length > 0 ? (
          <>
            <h5 className="mt-4 mb-3 fw-semibold">Variants</h5>
            <Table striped hover responsive className="table-custom">
              <thead>
                <tr>
                  <th>Color</th>
                  <th>Price</th>
                  <th>Available Quantity</th>
                  <th>Select Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {variants.map((variant) => (
                  <tr key={variant.variant_id}>
                    <td>{variant.color}</td>
                    <td>{formatPrice(variant.price)}</td>
                    <td>{variant.quantity}</td>
                    <td>
                      <Form.Control
                        type="number"
                        min="1"
                        max={variant.quantity || 1}
                        value={quantities[variant.variant_id] || 1}
                        onChange={(e) => handleQuantityChange(variant.variant_id, parseInt(e.target.value))}
                        className="quantity-input"
                        disabled={variant.quantity <= 0}
                      />
                    </td>
                    <td>
                      <Button
                        variant="primary"
                        size="sm"
                        className="btn-custom"
                        onClick={() => handleAddToCart(variant.variant_id)}
                        disabled={variant.quantity <= 0}
                      >
                        Add to Cart
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        ) : (
          <p className="mt-4 text-muted">No variants available for this product.</p>
        )}
      </Modal.Body>
      <Modal.Footer className="border-0 pt-2">
        <Button variant="outline-secondary" onClick={closeView} className="px-4">Close</Button>
      </Modal.Footer>
    </Modal>
  );
}