import { useAuth } from '../../context/AuthProvider';
import { useCart } from '../../context/CartProvider';
import { Navbar, Nav, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Bag from '../Offcanvas/Cart';
import Side from '../Offcanvas/Menu';
import AddModal from '../Modal/addModal';
import ProfileModal from '../others/profile';
import { useState } from 'react';

export default function Navigation() {
  const { role, logout } = useAuth();
  const { totalCount } = useCart()
  const [bag,setBag] = useState(false)
  const [side,setSide] =useState(false)
  const [modal,setModal] = useState(false)
  const [profile,setProfile] = useState(false)

  const openBag = () => setBag(true)
  const closeBag = () => setBag(false)

  const openSide = () => setSide(true);
  const closeSide = () => setSide(false);

  const openModal = () => setModal(true);
  const closeModal = () => setModal(false); 

  const openProfile = () => setProfile(true)
  const closeProfile = () =>setProfile(false)

  const handleProfile = () =>{
    openProfile()
  }

  const getNavbarColor = () => {
    switch (role) {
      case 'vendor':
        return 'bg-light';
      case 'customer':
        return 'bg-success';
      default:
        return 'bg-success';
    }
  };

  const renderByRole = () => {
    const iconStyle = { fontSize: '1.8rem' };
    switch (role) {
      case 'vendor':
        return (
          <>
            <Nav.Link onClick={openSide} aria-label="Open sidebar"><i className="bi bi-list" style={{ ...iconStyle, color: 'black' }}></i></Nav.Link>
            <Navbar.Brand className="text-dark ms-2" as={Link} to="/vendor">Vendor Panel</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse>
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/vendor">Dashboard</Nav.Link>
                <Nav.Link onClick={handleProfile}>Profile</Nav.Link>
              </Nav>
              <Nav className="ms-auto justify-content-beetween d-flex align-item-center">
                 <Button variant="outline-success text-dark" onClick={openModal}>
                  <i className="bi bi-folder-plus me-1"></i>Add
                </Button>
                <Button variant="outline-danger ms-2" onClick={logout}>
                  <i className="bi bi-box-arrow-right"></i>
                </Button>
              </Nav>
            </Navbar.Collapse>
          </>
        );
      case 'customer':
        return (
          <>
            <Nav.Link onClick={openSide} aria-label="Open sidebar"><i className="bi bi-list text-light" style={{ ...iconStyle, color: 'black' }}></i></Nav.Link>
            <Navbar.Brand as={Link} to="/customer" className='ms-2 text-light'>CHAP</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse>
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/customer"className='text-light'>Home</Nav.Link>
                <Nav.Link onClick={handleProfile} className='text-light'>Profile</Nav.Link>
              </Nav>
              <Nav className="ms-auto">
                <Button variant="light text-dark fw-bold" onClick={openBag}>
                  <i className="bi bi-bag me-1" style={{fontSize:"1.0rem"}}></i>
                    CART
                    {totalCount>0 && (
                    <Badge bg='success' className='cart-counter-badge ms-2'>{totalCount}</Badge>
                    )}
                </Button>
                <Button variant="danger" onClick={logout} className='ms-2'>
                  <i className="bi bi-box-arrow-right"></i>
                </Button>
              </Nav>
            </Navbar.Collapse>
          </>
        );
      default:
        return (
          <>
            <Nav.Link onClick={openSide} aria-label="Open sidebar">
              <i className="bi bi-list text-light" style={{ ...iconStyle, color: 'black' }}></i>
            </Nav.Link>
            <Navbar.Brand as={Link} to="/"className='ms-2 text-light'>CHAP</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse>
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/" className='text-light'>Home</Nav.Link>
                <Nav.Link as={Link} to="/about"className='text-light'>About</Nav.Link>
                <Nav.Link as={Link} to="/contact"className='text-light'>Contact</Nav.Link>
              </Nav>
              <Nav className="ms-auto">
                <Nav.Link as={Link} to="/login" className='fw-bold text-light'>Login</Nav.Link>
                <Nav.Link as={Link} to="/register" className='fw-bold text-light'>Register</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </>
        );
    }
  };

  return (
    <>
    <Navbar expand="lg" className={`${getNavbarColor()} fixed-top p-2 shadow-lg p-2`}>
      {renderByRole()}
    </Navbar>
    <Bag bag={bag} closeBag={closeBag} />
    <Side side={side} closeSide={closeSide} />
    <AddModal modal={modal} closeModal={closeModal} />
    <ProfileModal profile={profile} closeProfile={closeProfile} />
    </>
  );
}
