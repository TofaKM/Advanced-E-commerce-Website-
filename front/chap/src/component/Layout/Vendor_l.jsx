import { Container, Row, Col, Form, Navbar } from "react-bootstrap";
import { useAuth } from "../../context/AuthProvider";

export default function Vendor_l({children}){
    const { user } = useAuth()

    const InitialsCircle = ({ size = 35 }) => (
        <div className="rounded-circle d-flex justify-content-center align-items-center bg-dark text-white" style={{width: size,height: size,fontSize: size === 35 ? "0.9rem" : "1.2rem",}}>
            <strong>
                {user ? `${user.firstname?.[0] ?? ""}${user.lastname?.[0] ?? ""}`.toUpperCase(): ""}
            </strong>
        </div>
    )
    return(
        <>
        <Container fluid className="min-vh-100 px-4 py-3 mt-4">
            {/* Sub-navbar */}
            <Navbar bg="light" className="rounded shadow-sm px-4 py-2 mb-4 shadow-sm">
                <Container fluid>
                    <Form.Control type="text" placeholder="Search products..." className="me-auto w-50" />
                    <div className="d-flex align-items-center gap-3">
                        <span className="fw-semibold text-muted">Welcome, {user?.firstname} {user?.lastname}</span>
                        <InitialsCircle />
                    </div>
                </Container>
            </Navbar>
            {/* Main content */}
            <Row>
                <Col>{children}</Col>
            </Row>
        </Container>
        </>
    )
}