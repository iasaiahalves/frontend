import { useEffect, useState } from "react";
import { Alert, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";
import InputField from "../components/InputField.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, token } = useAuth();
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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    const result = await register(
      formData.username,
      formData.email,
      formData.password
    );

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  const isFormValid =
    formData.username &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword;

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card title="Create Your Account">
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <InputField
                label="Username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
              />

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

              <InputField
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                error={
                  formData.confirmPassword &&
                  formData.password !== formData.confirmPassword
                    ? "Passwords do not match"
                    : ""
                }
              />

              <div className="d-grid gap-2">
                <Button type="submit" loading={loading} disabled={!isFormValid}>
                  Register
                </Button>
              </div>
            </Form>

            <div className="text-center mt-3">
              <p className="mb-0">
                Already have an account? <Link to="/login">Login here</Link>
              </p>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
