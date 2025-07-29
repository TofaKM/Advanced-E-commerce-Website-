import { Modal, Button, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../context/AuthProvider';
import { useLocation } from '../../context/LocProvider'

export default function ProfileModal({ profile, closeProfile }) {
    const { user,logout } = useAuth();
    const { locations } = useLocation();
    const location = locations?.find(loc => loc.location_id === user?.location_id);
    const locationName = location
            ? `${location.town}, ${location.county}`
            : `#${user?.location_id}`

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const InitialsCircle = ({ size = 60 }) => (
    <div
      className="rounded-circle d-flex justify-content-center align-items-center bg-dark text-white mx-auto"
      style={{
        width: size,
        height: size,
        fontSize: '1.5rem',
        fontWeight: 'bold',
      }}
    >
      {user ? `${user.firstname?.[0] ?? ''}${user.lastname?.[0] ?? ''}`.toUpperCase() : ''}
    </div>
  );

  return (
    <Modal centered size="md" show={profile} onHide={closeProfile}>
      <Modal.Header closeButton>
        <Modal.Title>{user?.firstname} {user?.lastname}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row className="text-center mb-4">
          <Col>
            <InitialsCircle />
            <h5 className="mt-3 mb-0">
              {user?.firstname} {user?.lastname}
            </h5>
            <span className="text-muted">{user?.email}</span>
            <div className="mt-2">
              <span className="badge bg-secondary text-uppercase">{user?.role}</span>
            </div>
          </Col>
        </Row>

        <hr />

        <Row className="mb-2">
          <Col xs={5}><strong>Phone:</strong></Col>
          <Col>{user?.phone}</Col>
        </Row>
        <Row className="mb-2">
          <Col xs={5}><strong>Gender:</strong></Col>
          <Col className="text-capitalize">{user?.gender}</Col>
        </Row>
        <Row className="mb-2">
          <Col xs={5}><strong>Date of Birth:</strong></Col>
          <Col>{formatDate(user?.date_of_birth)}</Col>
        </Row>
        
       <Row className="mb-2">
            <Col xs={5}><strong>Location:</strong></Col>
            <Col>{locationName}</Col>
        </Row>
        <div className="d-flex justify-content-end gap-2">
          <Button variant="outline-primary">Edit Profile</Button>
          <Button variant="outline-danger" onClick={logout}>Log Out</Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
