import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner, ListGroup, Badge, Modal, Form } from 'react-bootstrap';
import { categoriesAPI, productsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import InputField from '../components/InputField';
import Card from '../components/Card';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const { token } = useAuth();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (err) {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  };

  const getProductCountForCategory = (categoryId) => {
    return products.filter(product => 
      product.categories && product.categories.some(cat => 
        (typeof cat === 'string' ? cat : cat._id) === categoryId
      )
    ).length;
  };

  const handleShowModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
      });
    }
    setShowModal(true);
    setError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingCategory) {
        await categoriesAPI.update(editingCategory._id, formData);
      } else {
        await categoriesAPI.create(formData);
      }
      
      await fetchCategories();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoriesAPI.delete(categoryId);
        setCategories(categories.filter(cat => cat._id !== categoryId));
      } catch (err) {
        setError('Failed to delete category');
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

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1>Categories</h1>
              <p className="text-muted">Browse and manage product categories</p>
            </div>
            {token && (
              <Button 
                variant="primary"
                onClick={() => handleShowModal()}
              >
                Add New Category
              </Button>
            )}
          </div>
        </Col>
      </Row>

      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      <Row>
        {categories.length > 0 ? (
          <Col>
            <ListGroup>
              {categories.map(category => (
                <ListGroup.Item 
                  key={category._id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div>
                    <h5 className="mb-1">{category.name}</h5>
                    {category.description && (
                      <p className="mb-1 text-muted">{category.description}</p>
                    )}
                    <Badge bg="info">
                      {getProductCountForCategory(category._id)} products
                    </Badge>
                  </div>
                  
                  <div className="d-flex gap-2">
                    {token && (
                      <>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleShowModal(category)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteCategory(category._id)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        ) : (
          <Col>
            <Card>
              <Alert variant="info" className="text-center mb-0">
                No categories available at the moment.
                {token && (
                  <>
                    <br />
                    <Button 
                      variant="primary" 
                      className="mt-3"
                      onClick={() => handleShowModal()}
                    >
                      Create First Category
                    </Button>
                  </>
                )}
              </Alert>
            </Card>
          </Col>
        )}
      </Row>

      {/* Category Statistics */}
      {categories.length > 0 && (
        <Row className="mt-5">
          <Col>
            <Card title="Category Statistics">
              <Row>
                <Col md={4} className="text-center">
                  <h3 className="text-primary">{categories.length}</h3>
                  <p className="text-muted">Total Categories</p>
                </Col>
                <Col md={4} className="text-center">
                  <h3 className="text-success">{products.length}</h3>
                  <p className="text-muted">Total Products</p>
                </Col>
                <Col md={4} className="text-center">
                  <h3 className="text-info">
                    {categories.length > 0 ? Math.round(products.length / categories.length) : 0}
                  </h3>
                  <p className="text-muted">Avg Products per Category</p>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      )}

      {/* Category Form Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <InputField
              label="Category Name *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter category name"
              required
            />
            
            <InputField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter category description"
              as="textarea"
              rows={3}
            />
            
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingCategory ? 'Update Category' : 'Create Category'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Categories;
