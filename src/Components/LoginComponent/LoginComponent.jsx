// Components/LoginComponent.js
import React, { useState, useContext } from "react";
import AuthForm from "../FormComponent/FormComponent";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Authentication/AuthContext";

const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const url = import.meta.env.VITE_BASE_URL;
  const Navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${url}/login`, {
        email,
        password,
      });

      const { token, name, role } = response.data;
      localStorage.setItem("token", token);

      // Pass user data to login context function
      login({ name, role });
      Navigate("/workoutplan");
    } catch (err) {
      console.error("Login error:", err);

      // More specific error messages based on response status
      if (err.response) {
        const { status } = err.response;
        if (status === 404) {
          setError(
            "Email not found. Please check your email or sign up for an account."
          );
        } else if (status === 401) {
          setError("Incorrect password. Please try again.");
        } else {
          setError(
            err.response.data?.message || "Login failed. Please try again."
          );
        }
      } else if (err.request) {
        // Request was made but no response received (network error)
        setError(
          "Network error. Please check your internet connection and try again."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const loginFields = [
    {
      label: "Email",
      type: "email",
      value: email,
      onChange: handleEmailChange,
      required: true,
    },
    {
      label: "Password",
      type: "password",
      value: password,
      onChange: handlePasswordChange,
      required: true,
    },
  ];

  return (
    <>
      {error && (
        <div className="error-container bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <AuthForm
        onSubmit={handleLoginSubmit}
        formTitle="Login"
        submitButtonText={loading ? "Logging in..." : "Login"}
        fields={loginFields}
        disabled={loading}
      />

      <div className="mt-4 text-center">
        <p>
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
        <p className="mt-2">
          <Link
            to="/forgot-password"
            className="text-sm text-gray-600 hover:underline"
          >
            Forgot your password?
          </Link>
        </p>
      </div>
    </>
  );
};

export default LoginComponent;
