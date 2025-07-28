import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Set axios default authorization header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      setToken(token);
      setUser(user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Login failed",
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        username,
        email,
        password,
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          // Verify token and get user data from backend
          const response = await axios.get("http://localhost:5000/api/auth/me");
          setUser(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Token validation failed:", error);
          logout();
        }
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [token]);

  const value = {
    user,
    token,
    login,
    register,
    logout,
    updateUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
