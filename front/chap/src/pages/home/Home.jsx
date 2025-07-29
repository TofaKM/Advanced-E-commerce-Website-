import { Link } from 'react-router-dom';
import { Button, Card, Col, Container, Row, Nav } from 'react-bootstrap';
import { useLocation } from '../../context/LocProvider';
import './Home.css'; 

function Home() {
  const { locations, loading: locLoading, error: locError } = useLocation();
  
  const products = [
    { id: 1, name: 'Phone', price: 12000.99 },
    { id: 2, name: 'Laptop', price: 49000.99 },
    { id: 3, name: 'Fashion', price: 1900.99 },
  ];

  return (
    <Container fluid className="p-0 mt-5">
      {/* Hero Section */}
      <section className="hero bg-info text-white text-center py-5">
        <Container>
          <h1 className="fw-semibold mb-3">Welcome to Chap Mall</h1>
          <p className="lead mb-4">CHAP connects buyers and sellers for quality products, tailored to your location. Shop or sell with ease!</p>
          <div className="d-flex justify-content-center gap-3">
            <Button variant="outline-light" size="lg" as={Link} to="/register" className="fw-semibold">
              Get Started
            </Button>
            <Button variant="light" size="lg" as={Link} to="/login" className="fw-semibold">
              Login
            </Button>
          </div>
        </Container>
      </section>

      {/* About Section */}
      <section className="py-5">
        <Container>
          <h2 className="fw-semibold mb-4 text-center">What is CHAP?</h2>
          <p className="lead text-center">
            CHAP is your go-to e-commerce platform for buying and selling products. Whether you're looking for unique
            items in your local area or want to reach users across regions, CHAP makes it simple and secure.
          </p>
          <p className="text-center">
            Buyers can explore a wide range of products, from everyday essentials to specialty items, while sellers
            can showcase their offerings to a growing community. Join today to start shopping or selling!
          </p>
        </Container>
      </section>

      {/* Featured Products Section */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="fw-semibold mb-4 text-center">Explore Our Products</h2>
          {locLoading ? (
            <p className="text-center">Loading products...</p>
          ) : locError ? (
            <p className="text-center text-danger">{locError}</p>
          ) : (
            <Row>
              {products.map((product) => (
                <Col md={4} key={product.id} className="mb-4">
                  <Card className="shadow p-3 rounded text-center">
                    <Card.Body>
                      <Card.Title>{product.name}</Card.Title>
                      <Card.Text>KES {product.price.toFixed(2)}</Card.Text>
                      <Button variant="outline-dark" as={Link} to="/login">
                        Login to Shop
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <Container>
          <h2 className="fw-semibold mb-4 text-center">Why Choose CHAP?</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="shadow p-3 rounded text-center">
                <Card.Body>
                  <i className="bi bi-geo-alt-fill display-4 mb-3 text-success"></i>
                  <Card.Title>Location-Based Shopping</Card.Title>
                  <Card.Text>Find products available in your area or sell to local users with ease.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="shadow p-3 rounded text-center">
                <Card.Body>
                  <i className="bi bi-shop display-4 mb-3 text-success"></i>
                  <Card.Title>Easy Selling</Card.Title>
                  <Card.Text>List your products quickly and reach a wide audience of buyers.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="shadow p-3 rounded text-center">
                <Card.Body>
                  <i className="bi bi-shield-lock-fill display-4 mb-3 text-success"></i>
                  <Card.Title>Secure Transactions</Card.Title>
                  <Card.Text>Shop and sell with confidence using our secure platform.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Shop by Location Section */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="fw-semibold mb-4 text-center">Shop by Location</h2>
          <Row>
            {locLoading ? (
              <Col><p className="text-center">Loading locations...</p></Col>
            ) : locError ? (
              <Col><p className="text-center text-danger">{locError}</p></Col>
            ) : locations && locations.length > 0 ? (
              locations.slice(0, 3).map((loc) => (
                <Col md={4} key={loc.location_id} className="mb-4">
                  <Card className="shadow p-3 rounded text-center">
                    <Card.Body>
                      <Card.Title>{loc.county}</Card.Title>
                      <Card.Text>{loc.town}</Card.Text>
                      <Button variant="outline-dark" as={Link} to="/login">
                        Shop in {loc.town}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col><p className="text-center">No locations available.</p></Col>
            )}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5 text-center">
        <Container>
          <h2 className="fw-semibold mb-3">Join CHAP Today</h2>
          <p className="mb-4">Sign up to start shopping or selling quality products in your area.</p>
          <Button variant="success" size="lg" as={Link} to="/register" className="fw-semibold">
            Get Started
          </Button>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <Container>
          <Row>
            <Col md={4}>
              <h5 className="fw-semibold">CHAP</h5>
              <p>Your trusted e-commerce platform for buying and selling quality products.</p>
            </Col>
            <Col md={4}>
              <h5 className="fw-semibold">Quick Links</h5>
              <Nav className="flex-column">
                <Nav.Link as={Link} to="/" className="text-white">
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/about" className="text-white">
                  About
                </Nav.Link>
                <Nav.Link as={Link} to="/contact" className="text-white">
                  Contact
                </Nav.Link>
              </Nav>
            </Col>
            <Col md={4}>
              <h5 className="fw-semibold">Get Started</h5>
              <Nav className="flex-column">
                <Nav.Link as={Link} to="/login" className="text-white">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="text-white">
                  Register
                </Nav.Link>
              </Nav>
            </Col>
          </Row>
          <hr className="bg-white" />
          <p className="text-center mb-0">© {new Date().getFullYear()} CHAP. All rights reserved.</p>
        </Container>
      </footer>
    </Container>
  );
}

export default Home;