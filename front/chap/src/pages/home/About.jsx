import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'

function About() {
  return (
    <Container fluid className="min-vh-100 bg-light py-5">
      <Container>
        <h3 className="text-center mb-4">Chap Marketplace</h3>
        <Row className="mb-5">
          <Col md={12}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <Card.Title className="text-center mb-4">Welcome to Chap Mall</Card.Title>
                <Card.Text className="text-muted">
                  This is a peer-to-peer e-commerce platform that connects customers with vendors to create a seamless and trusted shopping experience. Our mission is to empower individuals and small businesses by providing a marketplace where buyers find unique products and vendors grow their businesses with ease.
                </Card.Text>
                <Card.Text className="text-muted">
                  Whether you're a customer looking for one-of-a-kind items or a vendor wanting to reach a wider audience, our platform offers secure transactions, user-friendly tools, and a vibrant community to support your needs.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="text-center">
          <Col md={6} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                <Card.Title>For Customers</Card.Title>
                <Card.Text>
                  Discover a wide range of products directly from trusted vendors. Enjoy secure payments, verified sellers, and a personalized shopping experience tailored to your needs.
                </Card.Text>
                <Button as={Link} to='/register' variant="outline-primary">Join as a Customer</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                <Card.Title>For Vendors</Card.Title>
                <Card.Text>
                  Grow your business by reaching thousands of customers. Set up your store, manage listings, and leverage our tools to scale your operations with ease.
                </Card.Text>
                <Button as={Link} to='/register' variant="outline-primary">Join as a Vendor</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="mt-5 text-center">
          <Col>
            <img
              src="https://via.placeholder.com/600x400?text=Marketplace+Image"
              alt="Marketplace"
              className="img-fluid rounded shadow-sm mb-3"
              style={{ maxWidth: '600px' }}
            />
            <p className="text-muted">Connecting buyers and sellers in a vibrant marketplace.</p>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default About;