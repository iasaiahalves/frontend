import {
  Navbar as BootstrapNavbar,
  Container,
  Nav,
  NavDropdown,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout, token } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <LinkContainer to="/">
          <BootstrapNavbar.Brand>E-Commerce App</BootstrapNavbar.Brand>
        </LinkContainer>

        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            {token && (
              <>
                <LinkContainer to="/products">
                  <Nav.Link>Products</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/categories">
                  <Nav.Link>Categories</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/dashboard">
                  <Nav.Link>Dashboard</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>

          <Nav>
            {token ? (
              <NavDropdown title={user?.username || "User"} id="user-dropdown">
                <LinkContainer to="/profile">
                  <NavDropdown.Item>Profile</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link>Register</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
