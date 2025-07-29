import Customer_l from "../../component/Layout/Customer_l";
import ProductCard from "../../component/Design/ProductCard";
import { useProduct } from "../../context/ProductProvider";
import { Row, Col } from "react-bootstrap"; // Import Row and Col

export default function CustomerPage() {
  const { product, loading, error, success } = useProduct();

  console.log("product in CustomerPage:", product);

  return (
    <Customer_l>
      {(selectedCategory) => (
        <>
          <h2 className="text-2xl font-bold mb-4">Products</h2>
          {loading && <p className="text-gray-600">Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">Action completed successfully!</p>}
          {product.length === 0 && !loading && !error && (
            <p className="text-gray-600">No products found.</p>
          )}
          <Row className=" g-1 mt-2">
            {product
              .filter((p) => !selectedCategory || p.category_id === selectedCategory)
              .map((p) => (
                <Col key={p.product_id} xs={12} sm={6} md={4} lg={3} xl={4}>
                  <ProductCard product={p} />
                </Col>
              ))}
          </Row>
        </>
      )}
    </Customer_l>
  );
}