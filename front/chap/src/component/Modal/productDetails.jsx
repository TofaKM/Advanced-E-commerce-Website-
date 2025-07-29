import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const ProductDetailsStep = ({ formData, setFormData, errors, categories }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('ProductDetailsStep change:', { name, value }); // Debug
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    console.log('ProductDetailsStep image change:', e.target.files[0]); // Debug
    setFormData({ ...formData, image: e.target.files[0] });
  };

  return (
    <Form>
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Base Price</Form.Label>
            <Form.Control
              type="number"
              name="base_price"
              value={formData.base_price}
              onChange={handleChange}
              min="0"
              step="0.01"
              isInvalid={!!errors.base_price}
            />
            <Form.Control.Feedback type="invalid">{errors.base_price}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          value={formData.description}
          onChange={handleChange}
          isInvalid={!!errors.description}
        />
        <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Category</Form.Label>
        <Form.Select
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          isInvalid={!!errors.category_id}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.category_id} value={category.category_id}>
              {category.name}
            </option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">{errors.category_id}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Image</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </Form.Group>
    </Form>
  );
};

export default ProductDetailsStep;