import React from 'react';
import { Table, Image } from 'react-bootstrap';

const ReviewStep = ({ formData, categories }) => {
  const category = categories.find(c => c.category_id === parseInt(formData.category_id));
  const availability = formData.variants.some(v => v.quantity > 0) ? 'available' : 'sold out';

  return (
    <div>
      <h5>Review Product Details</h5>
      <Table bordered>
        <tbody>
          <tr>
            <td><strong>Name</strong></td>
            <td>{formData.name}</td>
          </tr>
          <tr>
            <td><strong>Description</strong></td>
            <td>{formData.description}</td>
          </tr>
          <tr>
            <td><strong>Base Price</strong></td>
            <td>${formData.base_price}</td>
          </tr>
          <tr>
            <td><strong>Category</strong></td>
            <td>{category ? category.name : 'Unknown'}</td>
          </tr>
          <tr>
            <td><strong>Availability</strong></td>
            <td>{availability}</td>
          </tr>
          <tr>
            <td><strong>Image</strong></td>
            <td>
              {formData.image ? (
                <Image
                  src={URL.createObjectURL(formData.image)}
                  alt="Product"
                  thumbnail
                  style={{ maxWidth: '200px' }}
                />
              ) : (
                'default.jpg'
              )}
            </td>
          </tr>
        </tbody>
      </Table>
      <h5>Variants</h5>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Color</th>
            <th>Quantity</th>
            <th>Price ($)</th>
          </tr>
        </thead>
        <tbody>
          {formData.variants.map((variant, index) => (
            <tr key={index}>
              <td>{variant.color}</td>
              <td>{variant.quantity}</td>
              <td>{variant.price}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ReviewStep;