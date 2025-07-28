import { useEffect, useState } from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Button from "../components/Button.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { productsAPI } from "../services/api";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token, user } = useAuth();

  useEffect(() => {
    // Only fetch products if user is authenticated
    if (token) {
      fetchFeaturedProducts();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      // Show only first 6 products as featured
      setProducts(response.data.slice(0, 6));
    } catch (err) {
      setError("Failed to load featured products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      {/* Hero Section */}
      <div className="bg-primary text-white p-5 rounded mb-5 text-center">
        <h1 className="display-4">
          {token
            ? `Welcome back, ${user?.username || "User"}!`
            : "Welcome to Our Store"}
        </h1>
        <p className="lead">
          {token
            ? "Manage your products, browse categories, and explore our extensive catalog."
            : "Discover amazing products at great prices. Please log in to access our full catalog and features."}
        </p>
        {token ? (
          <LinkContainer to="/dashboard">
            <Button variant="light" size="lg">
              Go to Dashboard
            </Button>
          </LinkContainer>
        ) : (
          <div className="d-flex gap-3 justify-content-center">
            <LinkContainer to="/login">
              <Button variant="light" size="lg">
                Login
              </Button>
            </LinkContainer>
            <LinkContainer to="/register">
              <Button variant="outline-light" size="lg">
                Sign Up
              </Button>
            </LinkContainer>
          </div>
        )}
      </div>

      {/* Featured Products */}
      {token ? (
        <Row className="mb-5">
          <Col>
            <h2 className="text-center mb-4">Featured Products</h2>
            {error && <Alert variant="danger">{error}</Alert>}

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : products.length > 0 ? (
              <>
                <Row className="g-4">
                  {products.map((product) => (
                    <Col
                      key={product._id}
                      xs={12}
                      sm={6}
                      md={4}
                      lg={4}
                      xl={2}
                      className="d-flex"
                    >
                      <ProductCard product={product} />
                    </Col>
                  ))}
                </Row>
                <div className="text-center mt-4">
                  <LinkContainer to="/products">
                    <Button variant="primary">View All Products</Button>
                  </LinkContainer>
                </div>
              </>
            ) : (
              <Alert variant="info" className="text-center">
                No products available yet. Visit the{" "}
                <LinkContainer to="/dashboard">
                  <span className="text-primary" style={{ cursor: "pointer" }}>
                    Dashboard
                  </span>
                </LinkContainer>{" "}
                to add some products!
              </Alert>
            )}
          </Col>
        </Row>
      ) : (
        <Row className="mb-5">
          <Col>
            <div className="text-center py-5">
              <h2 className="mb-4">Login Required</h2>
              <p className="lead text-muted mb-4">
                Please log in to access our product catalog, manage categories,
                and use the dashboard.
              </p>
              <div className="d-flex gap-3 justify-content-center">
                <LinkContainer to="/login">
                  <Button variant="primary" size="lg">
                    Login to Continue
                  </Button>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Button variant="outline-primary" size="lg">
                    Create Account
                  </Button>
                </LinkContainer>
              </div>
            </div>
          </Col>
        </Row>
      )}

      {/* Features Section */}
      <Row className="mb-5">
        <Col md={4} className="text-center mb-4">
          <div className="bg-light p-4 rounded">
            <h4>Fast Shipping</h4>
            <p>
              Get your orders delivered quickly and safely to your doorstep.
            </p>
          </div>
        </Col>
        <Col md={4} className="text-center mb-4">
          <div className="bg-light p-4 rounded">
            <h4>Quality Products</h4>
            <p>
              We ensure all our products meet the highest quality standards.
            </p>
          </div>
        </Col>
        <Col md={4} className="text-center mb-4">
          <div className="bg-light p-4 rounded">
            <h4>24/7 Support</h4>
            <p>Our customer support team is here to help you anytime.</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
