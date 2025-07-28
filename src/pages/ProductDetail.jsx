import { useEffect, useState } from "react";
import { Alert, Badge, Col, Container, Row, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { productsAPI } from "../services/api";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productsAPI.getById(id);
      setProduct(response.data);
    } catch (err) {
      setError("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productsAPI.delete(id);
        navigate("/products");
      } catch (err) {
        setError("Failed to delete product");
      }
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">{error}</Alert>
        <Button variant="outline-primary" onClick={() => navigate("/products")}>
          Back to Products
        </Button>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container>
        <Alert variant="warning">Product not found</Alert>
        <Button variant="outline-primary" onClick={() => navigate("/products")}>
          Back to Products
        </Button>
      </Container>
    );
  }

  const imageUrl = product.image
    ? `http://localhost:5000/uploads/${product.image}`
    : "https://via.placeholder.com/500x400?text=No+Image";

  return (
    <Container>
      <Row className="mb-3">
        <Col>
          <Button
            variant="outline-secondary"
            onClick={() => navigate("/products")}
          >
            ← Back to Products
          </Button>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <img
            src={imageUrl}
            alt={product.name}
            className="img-fluid rounded shadow"
            style={{ width: "100%", maxHeight: "500px", objectFit: "cover" }}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/500x400?text=No+Image";
            }}
          />
        </Col>

        <Col md={6}>
          <Card>
            <h1 className="mb-3">{product.name}</h1>

            <div className="mb-3">
              <h2 className="text-primary">${product.price}</h2>
            </div>

            {product.categories && product.categories.length > 0 && (
              <div className="mb-3">
                <h6>Categories:</h6>
                {product.categories.map((category, index) => (
                  <Badge key={index} bg="secondary" className="me-1">
                    {category.name || category}
                  </Badge>
                ))}
              </div>
            )}

            <div className="mb-4">
              <h6>Description:</h6>
              <p className="text-muted">
                {product.description ||
                  "No description available for this product."}
              </p>
            </div>

            {product.createdAt && (
              <div className="mb-3">
                <small className="text-muted">
                  Added on: {new Date(product.createdAt).toLocaleDateString()}
                </small>
              </div>
            )}

            {token && (
              <div className="d-flex gap-2">
                <Button
                  variant="outline-primary"
                  onClick={() =>
                    navigate(`/dashboard/products/edit/${product._id}`)
                  }
                >
                  Edit Product
                </Button>
                <Button variant="outline-danger" onClick={handleDelete}>
                  Delete Product
                </Button>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Related products or additional info can be added here */}
    </Container>
  );
};

export default ProductDetail;
