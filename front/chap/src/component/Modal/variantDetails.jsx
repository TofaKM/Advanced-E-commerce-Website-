import React, { useState } from 'react';
import { Form, Col, Row, Button, Table } from 'react-bootstrap';

const VariantsStep = ({ formData, setFormData, errors }) => {
  const [newVariant, setNewVariant] = useState({ color: '', quantity: '', price: '' });
  const [localErrors, setLocalErrors] = useState({});

  const validateNewVariant = () => {
  const errors = {};
  if (!newVariant.color.trim()) errors.color = 'Color is required';
  const quantity = parseInt(newVariant.quantity);
  const price = parseFloat(newVariant.price);
  if (isNaN(quantity) || quantity < 0) errors.quantity = 'Quantity must be non-negative';
  if (isNaN(price) || price < 0) errors.price = 'Price must be non-negative';
  if (formData.variants.some(v => v.color.toLowerCase() === newVariant.color.trim().toLowerCase())) {
    errors.color = 'Color already exists';
  }
  console.log('validateNewVariant:', { newVariant, errors });
  if (Object.keys(errors).length > 0) {
    alert(Object.values(errors).join('\n'));
  }
  setLocalErrors(errors);
  return Object.keys(errors).length === 0;
  };

  const addVariant = () => {
    if (validateNewVariant()) {
      const quantity = parseInt(newVariant.quantity);
      const price = parseFloat(newVariant.price);
      const newVariants = [...formData.variants, { color: newVariant.color.trim(), quantity, price }];
      setFormData({ ...formData, variants: newVariants });
      console.log('Added variant, new variants:', newVariants);
      setNewVariant({ color: '', quantity: '', price: '' });
      setLocalErrors({});
    } else {
      console.log('Failed to add variant due to validation errors:', localErrors);
    }
  };

  const removeVariant = (index) => {
    const newVariants = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: newVariants });
    console.log('Removed variant, new variants:', newVariants);
  };

  const handleNewVariantChange = (e) => {
    const { name, value } = e.target;
    setNewVariant({ ...newVariant, [name]: value });
    console.log('New variant change:', { name, value }); // Debug
  };

  console.log('VariantsStep variants:', formData.variants);

  return (
    <div>
      <h5>Add Variants</h5>
      <Form>
        <Row className="mb-3">
          <Col>
            <Form.Control
              type="text"
              name="color"
              placeholder="Color"
              value={newVariant.color}
              onChange={handleNewVariantChange}
              isInvalid={!!localErrors.color}
            />
            <Form.Control.Feedback type="invalid">
              {localErrors.color}
            </Form.Control.Feedback>
          </Col>
          <Col>
            <Form.Control
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={newVariant.quantity}
              onChange={handleNewVariantChange}
              min="0"
              isInvalid={!!localErrors.quantity}
            />
            <Form.Control.Feedback type="invalid">
              {localErrors.quantity}
            </Form.Control.Feedback>
          </Col>
          <Col>
            <Form.Control
              type="number"
              name="price"
              placeholder="Price ($)"
              value={newVariant.price}
              onChange={handleNewVariantChange}
              min="0"
              step="0.01"
              isInvalid={!!localErrors.price}
            />
            <Form.Control.Feedback type="invalid">
              {localErrors.price}
            </Form.Control.Feedback>
          </Col>
          <Col>
            <Button variant="primary" onClick={() => { console.log('Add Variant clicked', newVariant); addVariant(); }}>
              Add Variant
            </Button>
          </Col>
        </Row>
      </Form>
      {formData.variants.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Color</th>
              <th>Quantity</th>
              <th>Price ($)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {formData.variants.map((variant, index) => (
              <tr key={index}>
                <td>{variant.color}</td>
                <td>{variant.quantity}</td>
                <td>{variant.price}</td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => removeVariant(index)}>
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {errors.variants && <div className="alert alert-danger">{errors.variants}</div>}
    </div>
  );
};

export default VariantsStep;