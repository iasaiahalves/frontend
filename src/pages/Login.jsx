import { useEffect, useState } from "react";
import { Alert, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";
import InputField from "../components/InputField.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, token } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card title="Login to Your Account">
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <InputField
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />

              <InputField
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />

              <div className="d-grid gap-2">
                <Button
                  type="submit"
                  loading={loading}
                  disabled={!formData.email || !formData.password}
                >
                  Login
                </Button>
              </div>
            </Form>

            <div className="text-center mt-3">
              <p className="mb-0">
                Don't have an account? <Link to="/register">Sign up here</Link>
              </p>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
