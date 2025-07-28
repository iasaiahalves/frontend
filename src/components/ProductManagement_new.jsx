import { useEffect, useState } from "react";
import { Alert, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { categoriesAPI, productsAPI } from "../services/api";
import Button from "./Button.jsx";
import InputField from "./InputField.jsx";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categories: [],
    image: null,
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      categories: [],
      image: null,
    });
  };

  const handleShowModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price.toString(),
        categories:
          product.categories?.map((cat) =>
            typeof cat === "string" ? cat : cat._id
          ) || [],
        image: null,
      });
    } else {
      setEditingProduct(null);
      resetForm();
    }
    setShowModal(true);
    setError("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    resetForm();
    setError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleCategoryChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData((prev) => ({ ...prev, categories: selectedOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Create FormData for file upload
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("description", formData.description);
    submitData.append("price", formData.price);

    // Add categories as individual entries
    formData.categories.forEach((categoryId) => {
      submitData.append("categories", categoryId);
    });

    if (formData.image) {
      submitData.append("image", formData.image);
    }

    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct._id, submitData);
      } else {
        await productsAPI.create(submitData);
      }

      await fetchProducts();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product");
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productsAPI.delete(productId);
        await fetchProducts();
      } catch (err) {
        setError("Failed to delete product");
      }
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading products...</div>;
  }

  return (
    <div>
      <Row className="mb-3">
        <Col>
          <Button variant="primary" onClick={() => handleShowModal()}>
            Add New Product
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Categories</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <img
                      src={
                        product.image
                          ? `http://localhost:5000/uploads/${product.image}`
                          : "https://via.placeholder.com/50x50?text=No+Image"
                      }
                      alt={product.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/50x50?text=No+Image";
                      }}
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>
                    {product.categories
                      ?.map((cat) => (typeof cat === "string" ? cat : cat.name))
                      .join(", ") || "No categories"}
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowModal(product)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {products.length === 0 && (
            <Alert variant="info" className="text-center">
              No products found. Create your first product!
            </Alert>
          )}
        </Col>
      </Row>

      {/* Product Form Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProduct ? "Edit Product" : "Add New Product"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <InputField
              label="Product Name *"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
              required
            />

            <InputField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter product description"
              as="textarea"
              rows={3}
            />

            <InputField
              label="Price *"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />

            <Form.Group className="mb-3">
              <Form.Label>Categories</Form.Label>
              <Form.Select
                multiple
                value={formData.categories}
                onChange={handleCategoryChange}
                size="sm"
              >
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Text className="text-muted">
                Hold Ctrl/Cmd to select multiple categories
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Product Image</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
                accept="image/*"
              />
              <Form.Text className="text-muted">
                Choose an image file (JPG, PNG, etc.)
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingProduct ? "Update Product" : "Create Product"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProductManagement;
