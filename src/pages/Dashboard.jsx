import { useEffect, useState } from "react";
import { Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import CategoryManagement from "../components/CategoryManagement";
import ProductManagement from "../components/ProductManagement";
import { useAuth } from "../context/AuthContext";
import { categoriesAPI, productsAPI } from "../services/api";

const Dashboard = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productsAPI.getAll(),
        categoriesAPI.getAll(),
      ]);

      setStats({
        products: productsRes.data.length,
        categories: categoriesRes.data.length,
        users: 0, // We'll set this if user has admin access
      });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1>Dashboard</h1>
          <p className="text-muted">
            Welcome back, {user?.username || "User"}!
          </p>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center bg-primary text-white">
            <h3>{stats.products}</h3>
            <p className="mb-0">Total Products</p>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center bg-success text-white">
            <h3>{stats.categories}</h3>
            <p className="mb-0">Total Categories</p>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center bg-info text-white">
            <h3>{user ? 1 : 0}</h3>
            <p className="mb-0">Active Users</p>
          </Card>
        </Col>
      </Row>

      {/* Management Tabs */}
      <Row>
        <Col>
          <Tabs
            defaultActiveKey="products"
            id="dashboard-tabs"
            className="mb-3"
          >
            <Tab eventKey="products" title="Product Management">
              <ProductManagement />
            </Tab>
            <Tab eventKey="categories" title="Category Management">
              <CategoryManagement />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
