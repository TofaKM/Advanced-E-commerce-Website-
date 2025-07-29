import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup } from 'react-bootstrap';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: 'customer', // Default to customer inquiry
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to handle form submission (e.g., send to API or email service)
    console.log('Form submitted:', formData);
    alert('Thank you for your message! Our team will respond soon.');
    setFormData({ name: '', email: '', inquiryType: 'customer', message: '' });
  };

  return (
    <Container fluid className="min-vh-100 bg-light py-5">
      <Container>
        <h3 className="text-center mb-4">Contact Us</h3>
        <Row>
          {/* Contact Form */}
          <Col md={6} className="mb-4">
            <Card className="shadow-sm border-0">
              <Card.Body>
                <Card.Title>Send Us a Message</Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      required/>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your Email"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formInquiryType">
                    <Form.Label>Inquiry Type</Form.Label>
                    <Form.Select
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                    >
                      <option value="customer">Customer Support</option>
                      <option value="vendor">Vendor Support</option>
                      <option value="general">General Inquiry</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formMessage">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your Message"
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100">
                    Send Message
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          {/* Contact Info */}
          <Col md={6} className="mb-4">
            <Card className="shadow-sm border-0">
              <Card.Body>
                <Card.Title>Get in Touch</Card.Title>
                <Card.Text className="text-muted">
                  Have questions about your shopping experience or vendor account? We're here to help! Reach out via the form or contact us directly.
                </Card.Text>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Email:</strong> mwangitofa@gmail.com
                  </ListGroup.Item>
                  <ListGroup.Item className='d-flex justify-content-between'>
                    <strong>Phone:</strong>+254 759 799 624
                    <strong>Phone:</strong>+254 774 872 585
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Location:</strong> Juja, Nairobi, Kenya
                  </ListGroup.Item>
                </ListGroup>
                <div className="mt-4">
                  <h5>Follow Us</h5>
                  <div className="d-flex gap-3 justify-content-center mt-3">
                    <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-dark">
                      <i class="bi bi-twitter-x"></i>  
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-primary" style={{textDecoration:"none"}}>
                      <i class="bi bi-linkedin"></i> LinkedIn
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-danger" style={{textDecoration:"none"}}>
                      <i class="bi bi-instagram"></i> Instagram
                    </a>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Contact;