import { Modal, Button } from 'react-bootstrap';
import { useProduct } from '../../context/ProductProvider';

export default function DeleteModal({ show, onHide, product_id }) {
  const { remove, loading, error, success } = useProduct();

  const handleDelete = async () => {
    try {
      const res = await remove(product_id);
      if (res.success) {
        onHide();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <Modal centered size="lg" show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete this product?</p>
        {error && <p className="text-danger">{error}</p>}
        {success && <p className="text-success">Product deleted successfully!</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>Cancel</Button>
        <Button variant="danger" onClick={handleDelete} disabled={loading}>{loading ? 'Deleting...' : 'Delete'}</Button>
      </Modal.Footer>
    </Modal>
  );
}