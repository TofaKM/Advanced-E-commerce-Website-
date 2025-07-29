import Navigation from '../Nav/Navigation'
import { Col,Container,Row } from 'react-bootstrap'

function Layout({children}){
    return(
        <>
        <Container>
            <Row>
                <Col md={12}>
                    <Navigation />
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <main>{children}</main>
                </Col>
            </Row>
        </Container>
        </>
    )
}
export default Layout