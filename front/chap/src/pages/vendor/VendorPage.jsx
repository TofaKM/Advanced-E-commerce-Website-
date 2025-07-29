import Vendor_l from "../../component/Layout/Vendor_l"
import VendorCard from "../../component/Design/VendorCard"
import { useProduct } from "../../context/ProductProvider"
import { useEffect } from "react"
import { Col, Row } from "react-bootstrap"

export default function VendorPage(){
    const { vproduct, vendors, loading, error, success } = useProduct()

    useEffect(() => {
        vendors(); 
    }, []);

     console.log('vproduct in VendorPage:', vproduct)

    return(
        <>
        <Vendor_l>
            <h2 className="text-2xl font-bold mb-4">My Product</h2>
            {loading && <p className="text-gray-600">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">Action completed successfully!</p>}
            {vproduct.length === 0 && !loading && !error && (
                <p className="text-gray-600">No products found. Add a new product!</p>
            )}
            <Row className="g-2">
                {vproduct.map((product) => (
                    <Col key={product.product_id} xs={12} sm={6} md={4} lg={3} xl={4}>
                        <VendorCard  product={product} />
                    </Col>
                ))}
            </Row>
        </Vendor_l>
        </>
    )
}