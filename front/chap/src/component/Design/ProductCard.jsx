import { Badge, Card, Button } from "react-bootstrap";
import { useState } from "react";
import { ModalDetails } from "./ModalDetails";

const ProductCard = ({ product }) => {
  const [view, setView] = useState(false);

  const openView = () => setView(true);
  const closeView = () => setView(false);

  const {
    product_id = 0,
    name = "Unnamed Product",
    img_url = "/default.jpg",
    description = "No description",
    base_price = 0,
    availability = "Unknown",
  } = product;

  const statusColor = {
    available: "success",
    sold_out: "danger",
    unknown: "secondary",
  }

  const formatPrice = (amount) => {
    if (amount == null || isNaN(amount)) return "Ksh ";
    const formatter = new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    });
    return `${formatter.format(amount)}.00`;
  }

  return (
    <>
      <Card className="border-0 shadow-sm rounded overflow-hidden card-hover-effect d-flex flex-column" style={{ width: "100%", maxWidth: "250px", height: "400px",}}>
        <div style={{ position: "relative" }}>
          <Card.Img src={img_url} alt={name} style={{ height: "180px", width: "100%", objectFit: "cover" }} onError={(e) => (e.target.src = "/default.jpg")} />
          <Badge bg={statusColor[availability.toLowerCase()] || "secondary"} className="text-capitalize position-absolute top-0 end-0 m-2 px-2 py-1">
            {availability}
          </Badge>
        </div>
        <Card.Body className="p-2 d-flex flex-column">
          <h6 className="fw-bold mb-1" style={{overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",}} >
            {name}
          </h6>
          <p className="text-muted small mb-0" style={{ fontSize: "0.8rem", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical"}}>
            {description}
          </p>
          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-semibold text-dark">{formatPrice(base_price)}</span>
              <i className="bi bi-check-circle-fill text-success" title="Verified product"></i>
            </div>
          </div>
        </Card.Body>
        <Card.Footer className="bg-light p-2 mt-auto">
          <div className="text-center">
            <Button variant="success" onClick={openView}>
              View
            </Button>
          </div>
        </Card.Footer>
      </Card>
      <ModalDetails view={view} closeView={closeView} product_id={product_id} />
    </>
  );
};

export default ProductCard;