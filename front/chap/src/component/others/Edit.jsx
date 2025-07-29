import { Modal, Button, Form, Row, Col, Table } from 'react-bootstrap';
import { useProduct } from '../../context/ProductProvider';
import { useCategory } from '../../context/CategoryProvider';
import { useState, useEffect } from 'react';

export default function EditModal({ show, onHide, product_id }) {
  const { categories } = useCategory();
  const { update, selectedVProduct, loading, error: contextError, success, vendor } = useProduct();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    base_price: '',
    category_id: '',
    availability: 'available',
    variants: [],
    delete_variants: [],
    error: null, // Local error state
  });
  const [newVariant, setNewVariant] = useState({ color: '', quantity: '', price: '' });

  // Fetch product data when modal opens
  useEffect(() => {
    if (show && product_id) {
      console.log('Fetching product with ID:', product_id);
      if (!product_id || isNaN(product_id)) {
        setFormData((prev) => ({ ...prev, error: 'Invalid product ID' }));
        return;
      }
      vendor(product_id);
    }
  }, [show, product_id, vendor]);

  // Populate form with selectedVProduct data
  useEffect(() => {
    if (selectedVProduct) {
      console.log('Populating form with selectedVProduct:', selectedVProduct);
      setFormData({
        name: selectedVProduct.product?.name || '',
        description: selectedVProduct.product?.description || '',
        base_price: selectedVProduct.product?.base_price?.toString() || '',
        category_id: selectedVProduct.product?.category_id?.toString() || '',
        availability: selectedVProduct.product?.availability || 'available',
        variants: selectedVProduct.variants?.map((v) => ({
          variant_id: v.variant_id,
          color: v.color,
          quantity: v.quantity.toString(),
          price: v.price.toString(),
        })) || [],
        delete_variants: [],
        error: null,
      });
    }
  }, [selectedVProduct]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
      error: null,
    }));
  };

  // Handle changes to existing variants
  const handleVariantChange = (index, field, value) => {
    setFormData((prev) => {
      const variants = [...prev.variants];
      variants[index] = { ...variants[index], [field]: value };
      return { ...prev, variants, error: null };
    });
  };

  // Handle changes to new variant inputs
  const handleNewVariantChange = (e) => {
    const { name, value } = e.target;
    setNewVariant((prev) => ({ ...prev, [name]: value }));
  };

  // Add new variant to formData
  const addNewVariant = () => {
    if (!newVariant.color || !newVariant.quantity || !newVariant.price) {
      setFormData((prev) => ({ ...prev, error: 'All variant fields are required' }));
      return;
    }
    const parsedQuantity = parseInt(newVariant.quantity);
    const parsedPrice = parseFloat(newVariant.price);
    if (isNaN(parsedQuantity) || parsedQuantity < 0) {
      setFormData((prev) => ({ ...prev, error: 'Variant quantity must be non-negative' }));
      return;
    }
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setFormData((prev) => ({ ...prev, error: 'Variant price must be non-negative' }));
      return;
    }
    const colorExists = formData.variants.some(
      (v) => v.color.toLowerCase() === newVariant.color.toLowerCase()
    );
    if (colorExists) {
      setFormData((prev) => ({ ...prev, error: 'Duplicate color in variants' }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { ...newVariant }],
      error: null,
    }));
    setNewVariant({ color: '', quantity: '', price: '' });
  };

  // Remove variant and add to delete_variants
  const removeVariant = (variant_id) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((v) => v.variant_id !== variant_id),
      delete_variants: variant_id ? [...prev.delete_variants, variant_id] : prev.delete_variants,
      error: null,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!product_id || isNaN(product_id)) {
        throw new Error('Invalid product ID');
      }
      const data = {
        product_id,
        name: formData.name.trim(),
        description: formData.description.trim(),
        base_price: parseFloat(formData.base_price),
        category_id: parseInt(formData.category_id),
        availability: formData.availability,
        variants: formData.variants.map((v) => ({
          variant_id: v.variant_id || undefined,
          color: v.color.trim(),
          quantity: parseInt(v.quantity) || 0,
          price: parseFloat(v.price) || 0,
        })),
        delete_variants: formData.delete_variants.filter((id) => !isNaN(id) && id > 0),
        image: formData.image instanceof File ? formData.image : undefined,
      };

      // Validate data
      if (!data.name) throw new Error('Product name is required');
      if (!data.description) throw new Error('Description is required');
      if (isNaN(data.base_price) || data.base_price < 0) throw new Error('Valid base price is required');
      if (isNaN(data.category_id) || data.category_id <= 0) throw new Error('Valid category ID is required');
      if (data.variants.length === 0 && data.delete_variants.length > 0) {
        throw new Error('At least one variant is required after deletions');
      }
      const colors = new Set(data.variants.map((v) => v.color.toLowerCase()));
      if (colors.size !== data.variants.length) throw new Error('Duplicate colors are not allowed');
      data.variants.forEach((v, i) => {
        if (!v.color) throw new Error(`Variant ${i + 1}: Color is required`);
        if (isNaN(v.quantity) || v.quantity < 0) throw new Error(`Variant ${i + 1}: Valid quantity is required`);
        if (isNaN(v.price) || v.price < 0) throw new Error(`Variant ${i + 1}: Valid price is required`);
      });

      console.log('Submitting data:', { product_id, ...data });
      const res = await update(product_id, data);
      if (res.success) {
        console.log('Update successful, closing modal');
        onHide();
      }
    } catch (err) {
      console.error('Update error:', err.message);
      setFormData((prev) => ({ ...prev, error: err.message }));
    }
  };

  return (
    <Modal centered size="lg" show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Update Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="modal-form" onSubmit={handleSubmit}>
          {formData.error && <p className="text-danger mt-3">{formData.error}</p>}
          {contextError && <p className="text-danger mt-3">{contextError}</p>}
          {success && <p className="text-success mt-3">Product updated successfully!</p>}

          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              maxLength={255}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Base Price</Form.Label>
            <Form.Control
              type="number"
              name="base_price"
              value={formData.base_price}
              onChange={handleChange}
              required
              min={0}
              step="0.01"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Availability</Form.Label>
            <Form.Select
              name="availability"
              value={formData.availability}
              onChange={handleChange}
            >
              <option value="available">Available</option>
              <option value="sold out">Sold Out</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/*"
            />
          </Form.Group>

          <h5>Variants</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Color</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {formData.variants.map((variant, index) => (
                <tr key={variant.variant_id || `new-${index}`}>
                  <td>
                    <Form.Control
                      type="text"
                      value={variant.color}
                      onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                      maxLength={50}
                      required
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      value={variant.quantity}
                      onChange={(e) => handleVariantChange(index, 'quantity', e.target.value)}
                      min={0}
                      required
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      value={variant.price}
                      onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                      min={0}
                      step="0.01"
                      required
                    />
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeVariant(variant.variant_id)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <h6>Add New Variant</h6>
          <Row>
            <Col>
              <Form.Control
                type="text"
                name="color"
                placeholder="Color"
                value={newVariant.color}
                onChange={handleNewVariantChange}
                maxLength={50}
              />
            </Col>
            <Col>
              <Form.Control
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={newVariant.quantity}
                onChange={handleNewVariantChange}
                min={0}
              />
            </Col>
            <Col>
              <Form.Control
                type="number"
                name="price"
                placeholder="Price"
                value={newVariant.price}
                onChange={handleNewVariantChange}
                min={0}
                step="0.01"
              />
            </Col>
            <Col>
              <Button
                onClick={addNewVariant}
                disabled={!newVariant.color || !newVariant.quantity || !newVariant.price}
              >
                Add Variant
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          form="modal-form"
          disabled={loading || formData.variants.length === 0}
        >
          {loading ? 'Updating...' : 'Update'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}