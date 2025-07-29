import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Col, Container, Form, Row, Alert } from 'react-bootstrap';
import { format, isValid, parseISO } from 'date-fns';
import { useAuth } from '../../context/AuthProvider';
import { useLocation } from '../../context/LocProvider'

function Register() {
  const { locations, loading: locLoading, error: locError } = useLocation();
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    gender: '',
    date_of_birth: '',
    role: '',
    password: '',
    location_id: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'date_of_birth' && value) {
      try {
        const parsedDate = parseISO(value);
        if (isValid(parsedDate)) {
          setFormData({ ...formData, [name]: format(parsedDate, 'yyyy-MM-dd') });
        } else {
          setFormData({ ...formData, [name]: '' });
        }
      } catch {
        setFormData({ ...formData, [name]: '' });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleReset = () => {
    setFormData({
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      gender: '',
      date_of_birth: '',
      role: '',
      password: '',
      location_id: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { user } = await register(formData);
      switch (user?.role) {
        case 'customer':
          navigate('/customer');
          break;
        case 'vendor':
          navigate('/vendor');
          break;
        default:
          navigate('/login');
      }
    } catch (error) {
      console.error("Error Registering...", error);
    }
  };

  return (
    <Container>
      <Row>
        <Col md={12}>
          <div className="d-flex justify-content-center align-items-center mt-5">
            <Form className="shadow p-4 rounded" onSubmit={handleSubmit}>
              <h4 className="fw-semibold mb-3">REGISTER</h4>
              {(error || locError) && (
                <Alert variant="danger">{error?.message || locError || 'Registration failed'}</Alert>
              )}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      placeholder="Firstname"
                      type="text"
                      name="firstname"
                      required
                      value={formData.firstname}
                      onChange={handleChange}
                      disabled={loading || locLoading}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      placeholder="Lastname"
                      type="text"
                      name="lastname"
                      required
                      value={formData.lastname}
                      onChange={handleChange}
                      disabled={loading || locLoading}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Control
                  placeholder="Email"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading || locLoading}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  placeholder="Phone"
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading || locLoading}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Gender</Form.Label>
                <div style={{ display: 'flex', flexDirection: 'row' }} className='justify-content-between'>
                  <Form.Check
                    type="radio"
                    label="Male"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={handleChange}
                    required
                    disabled={loading || locLoading}
                  />
                  <Form.Check
                    type="radio"
                    label="Female"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={handleChange}
                    disabled={loading || locLoading}
                  />
                </div>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  required
                  disabled={loading || locLoading}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Select
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  disabled={loading || locLoading}
                >
                  <option value="">Select Role</option>
                  <option value="customer">Customer</option>
                  <option value="vendor">Vendor</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading || locLoading}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Select
                  name="location_id"
                  value={formData.location_id}
                  onChange={handleChange}
                  required
                  disabled={loading || locLoading || !locations}
                >
                  <option value="">Select Location</option>
                  {locations &&
                    locations.map((loc) => (
                      <option key={loc.location_id} value={loc.location_id}>
                        {loc.county}, {loc.town}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <Button variant="outline-dark" type="submit" disabled={loading || locLoading}>
                    Register
                  </Button>
                  <Button variant="outline-dark" type="reset" onClick={handleReset} disabled={loading || locLoading}>
                    Clear
                  </Button>
                </div>
              </Form.Group>
              <Form.Group className="mb-3">
                <div>
                  <Link to="/login">
                    <p className="text-decoration-none mb-0">
                      Already Registered? <span>Login Now</span>
                    </p>
                  </Link>
                </div>
              </Form.Group>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;
