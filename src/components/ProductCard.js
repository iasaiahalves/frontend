import { Badge, Card } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Button from "./Button";

const ProductCard = ({ product }) => {
  const imageUrl = product.image
    ? `http://localhost:5000/uploads/${product.image}`
    : "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <Card className="h-100 shadow-sm w-100">
      <Card.Img
        variant="top"
        src={imageUrl}
        style={{ height: "200px", objectFit: "cover" }}
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
        }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="text-truncate">{product.name}</Card.Title>
        <Card.Text className="text-muted small flex-grow-1">
          {product.description
            ? product.description.length > 100
              ? `${product.description.substring(0, 100)}...`
              : product.description
            : "No description available"}
        </Card.Text>

        {product.categories && product.categories.length > 0 && (
          <div className="mb-2">
            {product.categories.map((category, index) => (
              <Badge key={index} bg="secondary" className="me-1">
                {category.name || category}
              </Badge>
            ))}
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mt-auto">
          <strong className="text-primary">${product.price}</strong>
          <LinkContainer to={`/products/${product._id}`}>
            <Button variant="outline-primary" size="sm">
              View Details
            </Button>
          </LinkContainer>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
