import { Badge, Card, Button } from 'react-bootstrap';
import EditModal from '../others/Edit'
import DeleteModal from '../others/Delete'
import VendorModalDetails from './VendorDetails';
import { useState } from 'react';

const VendorCard = ({ product }) => {
    const [showView, setShowView] = useState(false)
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false)
    
    const openView = () => setShowView(true);
    const closeView = () => setShowView(false)

    const openEdit = () => setShowEdit(true);
    const closeEdit = () => setShowEdit(false);

    const openDelete = () => setShowDelete(true);
    const closeDelete = () => setShowDelete(false);
    
    const {
      product_id = 0,
      name = 'Unnamed Product',
      img_url = '/default.jpg',
      base_price = 0,
      category_name = 'Unknown',
      availability = 'Unknown',
    } = product;

    const statusColor = {
      available: 'success',
      sold_out: 'danger',
      unknown: 'secondary', // Fallback for unexpected values
    };

    // Format price in Kenyan Shillings
    const formatPrice = (amount) => {
      if (amount == null || isNaN(amount)) return 'Ksh 0/day';
        const formatter = new Intl.NumberFormat('en-KE', {
          style: 'currency',
          currency: 'KES',
          minimumFractionDigits: 0,
        });
      return `${formatter.format(amount)}`;
    };

    return (
      <>
        <div className='d-flex justify-content-start'>
          <Card className="border-0 shadow-sm rounded overflow-hidden card-hover-effect" style={{ cursor: 'pointer' }}>
            <div style={{ position: 'relative' }}>
              <Card.Img src={img_url} style={{ height: '180px', width: '180px', objectFit: 'cover' }} onError={(e) => (e.target.src = '/default.jpg')}/>
              <Badge bg={statusColor[availability.toLowerCase()] || 'secondary'} className="text-capitalize position-absolute top-0 end-0 m-2 px-2 py-1">
                {availability}
              </Badge>
            </div>
            <Card.Body className="p-2">
              <h6 className="fw-bold mb-1">{name} <span className="text-muted">({category_name})</span></h6>
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-semibold text-primary">{formatPrice(base_price)}</span>
                <i className="bi bi-check-circle-fill text-success" title="Verified product"></i>
              </div>
            </Card.Body>
            <Card.Footer className="bg-white border-0 px-2 py-2">
              <div className="d-flex gap-1 align-item-center justify-content-center">
                <Button variant="success" size='sm' onClick={openView}>View</Button>
                <Button variant="primary" size='sm' onClick={openEdit}>Edit</Button>
                <Button variant="danger" size='sm' onClick={openDelete}>Delete</Button>
              </div>
            </Card.Footer>
          </Card>
          <VendorModalDetails showView={showView}closeView={closeView}product_id={product_id}openEdit={openEdit}openDelete={openDelete}/>
          <EditModal show={showEdit} onHide={closeEdit} product_id={product_id} />
          <DeleteModal show={showDelete} onHide={closeDelete} product_id={product_id} />
      </div>
      </>
  );
};

export default VendorCard;