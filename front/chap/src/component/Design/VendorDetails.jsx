import { Modal, Button, Table, Badge } from 'react-bootstrap';
import { useProduct } from '../../context/ProductProvider';
import { useEffect, useState } from 'react';
import EditModal from '../others/Edit';
import DeleteModal from '../others/Delete';

export function VendorModalDetails({ showView, closeView, product_id, openEdit, openDelete }) {
  const { vendor, selectedVProduct, loading, error } = useProduct();
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleOpenEdit = () => {
    setShowEdit(true);
    openEdit(); // Trigger parent EditModal if needed
  };
  const handleCloseEdit = () => setShowEdit(false);
  const handleOpenDelete = () => {
    setShowDelete(true);
    openDelete(); // Trigger parent DeleteModal if needed
  };
  const handleCloseDelete = () => setShowDelete(false);

  useEffect(() => {
    if (showView && product_id) {
      vendor(product_id);
    }
  }, [showView, product_id, vendor]);

  const statusColor = {
    available: 'success',
    'sold out': 'danger',
  };

  const formatPrice = (amount) => {
    if (amount == null || isNaN(amount)) return 'Ksh 0/day';
    const formatter = new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    });
    return `${formatter.format(amount)}`;
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="text-danger text-center py-5">Error: {error}</div>;
  if (!selectedVProduct || !selectedVProduct.product)
    return <div className="text-muted text-center py-5">No product found.</div>;

  const { product, variants } = selectedVProduct;

  return (
    <>
      <Modal centered size="lg" show={showView} onHide={closeView} className="modal-custom">
        <Modal.Header closeButton className="border-0 pb-2">
          <Modal.Title className="fw-bold">{product.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 py-3">
          <div className="d-flex flex-column flex-md-row gap-4">
            <img
              src={product.img_url}
              alt={product.name}
              className="rounded shadow-sm"
              style={{ maxWidth: '300px', objectFit: 'cover' }}
              onError={(e) => (e.target.src = '/default.jpg')}
            />
            <div className="flex-grow-1">
              <h4 className="fw-semibold mb-3">{product.name}</h4>
              <div className="mb-3">
                <p className="mb-1"><strong>Vendor:</strong> {product.firstname} {product.lastname}</p>
                <p className="mb-1"><strong>Phone:</strong> {product.phone}</p>
                <p className="mb-1"><strong>Category:</strong> {product.category_name}</p>
                <p className="text-muted mb-2"><strong>Description:</strong> {product.description}</p>
                <Badge
                  bg={statusColor[product.availability.toLowerCase()] || 'secondary'}
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
                  </tr>
                </thead>
                <tbody>
                  {variants.map((variant) => (
                    <tr key={variant.variant_id}>
                      <td>{variant.color}</td>
                      <td>{formatPrice(variant.price)}</td>
                      <td>{variant.quantity}</td>
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
          <Button variant="primary" onClick={handleOpenEdit} className="px-4">
            Edit
          </Button>
          <Button variant="danger" onClick={handleOpenDelete} className="px-4">
            Delete
          </Button>
          <Button variant="outline-secondary" onClick={closeView} className="px-4">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <EditModal show={showEdit} onHide={handleCloseEdit} product_id={product_id} />
      <DeleteModal show={showDelete} onHide={handleCloseDelete} product_id={product_id} />
    </>
  );
}

export default VendorModalDetails;