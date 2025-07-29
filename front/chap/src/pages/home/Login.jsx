import { Link, useNavigate } from 'react-router-dom';
import { Button, Col, Container, Form, Row, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { useAuth } from '../../context/AuthProvider';

export default function Login(){
    const { login, loading, error } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleReset = () => {
        setFormData({
             email: '',
            password: ''
        });
    } 

  const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { user } = await login(formData);
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

        }catch (error) {
            console.error("Error Login...", error);
        }
    } 

    return(
        <>
        <Container>
             <Row>
                <Col md={12}>
                    <div className="d-flex justify-content-center align-items-center mt-3">
                          <Form className="shadow p-4 rounded" onSubmit={handleSubmit}>
                            <h4 className="fw-semibold mb-3">LOGIN</h4>
                            {error && <Alert variant="danger">{error.message || 'Login failed'}</Alert>}

                            <Form.Group className="mb-3">
                                <Form.Control placeholder="Email"type="email"name="email"required value={formData.email}onChange={handleChange}disabled={loading}/>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control placeholder="Password"type="password"name="password"required value={formData.password}onChange={handleChange}disabled={loading}/>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <Button variant="outline-dark" type="submit" disabled={loading}>Login</Button>
                                    <Button variant="outline-dark" type="reset" onClick={handleReset} disabled={loading}>Clear</Button>
                                </div>
                             </Form.Group>
                            <Form.Group className="mb-3">
                              <div>
                                <Link to="/register">
                                  <p className="text-decoration-none mb-0">Not Registered? <span>Register Now</span></p>
                                </Link>
                              </div>
                            </Form.Group>
                          </Form>
                      </div>
                    </Col>
                  </Row>
        </Container>
        </>
    )
}