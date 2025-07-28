import { useState } from "react";
import { Alert, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import InputField from "../components/InputField";
import { useAuth } from "../context/AuthContext";
import { usersAPI } from "../services/api";

const Profile = () => {
  const { user, token, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    avatar: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const loadUserProfile = async () => {
    try {
      const response = await usersAPI.getCurrentProfile(user._id);
      updateUser(response.data);
      setFormData({
        username: response.data.username || "",
        email: response.data.email || "",
        avatar: null,
      });
    } catch (err) {
      console.error("Failed to load user profile:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Debug logging
    console.log("User object:", user);
    console.log("User keys:", user ? Object.keys(user) : "No user");
    console.log("User ID (_id):", user?._id);
    console.log("User ID (id):", user?.id);
    console.log("Form data:", formData);

    // Handle both _id and id properties
    const userId = user?._id || user?.id;

    if (!userId) {
      setError("User ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    console.log("Using user ID:", userId);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("username", formData.username);
      submitData.append("email", formData.email);

      if (formData.avatar) {
        submitData.append("avatar", formData.avatar);
        console.log("Avatar file:", formData.avatar);
      }

      console.log("FormData contents:");
      for (let [key, value] of submitData.entries()) {
        console.log(key, value);
      }

      console.log("Sending request to update user profile...");

      // Call the backend API to update user profile
      const response = await usersAPI.update(userId, submitData);

      console.log("Update response:", response.data);

      // Update the user context with new data
      if (response.data) {
        updateUser(response.data);
        // Update form data to reflect changes
        setFormData((prev) => ({
          ...prev,
          username: response.data.username,
          email: response.data.email,
          avatar: null, // Reset file input
        }));
        setAvatarPreview(null); // Clear preview to show the actual uploaded image
      }

      setSuccess("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update error:", err);
      console.error("Error response:", err.response);

      let errorMessage = "Failed to update profile";
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card title="User Profile">
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              {/* Avatar Section */}
              <div className="text-center mb-4">
                <div className="mb-3">
                  <img
                    src={
                      avatarPreview ||
                      (user?.avatar
                        ? `http://localhost:5000/uploads/${user.avatar}`
                        : "https://via.placeholder.com/150x150?text=Avatar")
                    }
                    alt="Profile Avatar"
                    className="rounded-circle"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/150x150?text=Avatar";
                    }}
                  />
                </div>
                <Form.Group>
                  <Form.Label>Change Avatar</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  <Form.Text className="text-muted">
                    Choose a profile picture (JPG, PNG, etc.)
                  </Form.Text>
                </Form.Group>
              </div>

              <InputField
                label="Username *"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
              />

              <InputField
                label="Email *"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />

              <div className="mb-3">
                <strong>Account Information:</strong>
                <ul className="list-unstyled mt-2">
                  <li>
                    <small className="text-muted">
                      Member since:{" "}
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </small>
                  </li>
                  <li>
                    <small className="text-muted"></small>
                  </li>
                </ul>
              </div>

              <div className="d-flex gap-2 flex-wrap">
                <Button type="submit" loading={loading} variant="primary">
                  Update Profile
                </Button>

                <Button
                  variant="outline-secondary"
                  onClick={() => navigate("/dashboard")}
                >
                  Go to Dashboard
                </Button>

                <Button variant="outline-danger" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
