import { Col, Container, Row, Form, Button, Nav } from "react-bootstrap";
import { useAuth } from "../../context/AuthProvider";
import { Link } from "react-router-dom";
import { useCategory } from "../../context/CategoryProvider";
import { useState } from "react";

export default function Customer_l({ children }) {
  const { user } = useAuth();
  const { categories, loading: categoryLoading, error: categoryError } = useCategory();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const InitialsCircle = ({ size = 35 }) => (
    <div className="rounded-circle d-flex justify-content-center align-items-center bg-success text-white" style={{ width: size, height: size, fontSize: size === 35 ? "0.9rem" : "1.2rem" }} >
      <strong>
        {user ? `${user.firstname?.[0] ?? ""}${user.lastname?.[0] ?? ""}`.toUpperCase() : ""}
      </strong>
    </div>
  )
  
  return (
    <Container fluid className="py-4 px-4 min-vh-100 mt-4">
      {/* Header */}
      <Row className="mb-4 justify-content-center align-items-center">
        <Col xs="auto">
          <div className="d-flex align-items-center gap-3">
            <h4 className="fw-bold mb-0 ms-auto"> Welcome, {user?.firstname} {user?.lastname}</h4>
            <InitialsCircle />
          </div>
        </Col>
      </Row>
      {/* Sidebar and Main Content */}
      <Row>
        {/* Sidebar */}
        <Col lg={2} md={4} className="bg-white p-4 rounded shadow-sm">
          <h5 className="mb-3">Filter by Category</h5>
            {categoryLoading && <p>Loading categories...</p>}
            {categoryError && <p className="text-red-500">{categoryError}</p>}
          <div className="mt-auto vh-auto">
            <Row className="g-2 mb-3">
              <Col xs={12}>
                <Form>
                  <Form.Control type="text" placeholder="Search products..." className="shadow-sm" />
                </Form>
              </Col>
              <Col xs={12} className="d-flex flex-wrap gap-2">
                <Button variant={selectedCategory === null ? "dark" : "outline-dark"} size="sm" onClick={() => setSelectedCategory(null)}>
                  All
                </Button>
                {categories.map((cat) => (
                  <Button variant={selectedCategory === cat.category_id ? "dark" : "outline-dark"} size="sm" key={cat.category_id} onClick={() => setSelectedCategory(cat.category_id)}>
                    {cat.name}
                  </Button>
                ))}
              </Col>
            </Row>
            <Nav.Link as={Link} to="" className="text-dark small"> Click here for Advanced search</Nav.Link>
          </div>
        </Col>
        {/* Main content area */}
        <Col lg={10} md={8}>
          <Row className="g-4">{children(selectedCategory)}</Row>
        </Col>
      </Row>
    </Container>
  );
}