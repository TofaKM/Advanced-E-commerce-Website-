import { Navbar, Offcanvas, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import ProfileModal from '../others/profile';
import CustomerHistory from '../History/History';
import VendorSales from '../History/Sales';
import { useState } from 'react';

export default function Side({ side, closeSide }) {
  const { user, logout, role } = useAuth()
  const [profile,setProfile] = useState(false)
  const [sales,setSales] = useState(false)
  const [history,setHistory] = useState(false)

  const openSales = () => setSales(true)
  const closeSales = () => setSales(false)

  const openHistory = () => setHistory(true)
  const closeHistory = () => setHistory(false)

  const openProfile = () => setProfile(true)
  const closeProfile = () =>setProfile(false)

  const handleHistory = () =>{
    openHistory()
  }

  const handleSales = () =>{
    openSales()
  }

  const handleProfile = () =>{
    openProfile()
  }

  const renderMenu = () => {
    switch (role) {
      case 'customer':
        return (
          <>
            <Navbar.Brand className="mb-2 fw-bold">
              {user?.firstname || 'User'} {user?.lastname || ''}
            </Navbar.Brand>
            <Nav className="d-block">
              <Nav.Link as={Link} to="/customer" className="mb-2">
                <i className="bi bi-house-door me-2"></i>Home
              </Nav.Link>
              <Nav.Link onClick={handleProfile} className="mb-2">
                <i className="bi bi-person me-2"></i>Profile
              </Nav.Link>
              <Nav.Link onClick={handleHistory} className="mb-2">
                <i className="bi bi-clock-history me-2"></i>History
              </Nav.Link>
              <Button variant="outline-dark" onClick={logout} className="mt-3 w-100">
                <i className="bi bi-box-arrow-right me-2"></i>Logout
              </Button>
            </Nav>
          </>
        );

      case 'vendor':
        return (
          <>
            <Navbar.Brand className="mb-3 fw-bold">
              {user?.firstname || 'Vendor'} {user?.lastname || ''}
            </Navbar.Brand>
            <Nav className="d-block">
              <Nav.Link as={Link} to="/vendor" className="mb-2">
                <i className="bi bi-house-door me-2"></i>Home
              </Nav.Link>
              <Nav.Link onClick={handleProfile} className="mb-2">
                <i className="bi bi-person me-2"></i>Profile
              </Nav.Link>
              
              <Nav.Link onClick={handleSales} className="mb-2">
                <i className="bi bi-credit-card-2-back me-2"></i>Sales
              </Nav.Link>
              
              <Button variant="outline-dark" onClick={logout} className="mt-3 w-100">
                <i className="bi bi-box-arrow-right me-2"></i>Logout
              </Button>
            </Nav>
          </>
        );

      default:
        return (
          <>
            <Navbar.Brand className="mb-3 fw-bold">Welcome</Navbar.Brand>
            <Nav className="d-block">
              <Nav.Link as={Link} to="/" className="mb-2">
                <i className="bi bi-house-door me-2"></i>Home
              </Nav.Link>
              <Nav.Link as={Link} to="/about" className="mb-2">
                <i className="bi bi-file-person me-2"></i>About
              </Nav.Link>
              <Nav.Link as={Link} to="/contact" className="mb-2">
                <i className="bi bi-person-lines-fill me-2"></i>Contact
              </Nav.Link>
              <Nav.Link as={Link} to="/login" className="mb-2">
                <i className="bi bi-box-arrow-in-right me-2"></i>Login
              </Nav.Link>
              <Nav.Link as={Link} to="/register" className="mb-2">
                <i className="bi bi-person-plus me-2"></i>Register
              </Nav.Link>
            </Nav>
          </>
        );
    }
  };

  return (
    <Offcanvas show={side} onHide={closeSide} placement="start" style={{ width: '250px' }}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Menu</Offcanvas.Title>
      </Offcanvas.Header>
      <hr />
      <Offcanvas.Body>
        <Navbar className="d-block py-1 me-auto">
          {renderMenu()}
        </Navbar>
      </Offcanvas.Body>
      <ProfileModal profile={profile} closeProfile={closeProfile} />
      <CustomerHistory history={history} closeHistory={closeHistory} />
      <VendorSales sales={sales} closeSales={closeSales} />
    </Offcanvas>
  );
}
