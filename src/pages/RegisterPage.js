import React, { useState } from "react";
import axios from "axios"; // Import axios for API calls
import "../CSS/RegisterPage.css"; // Import the styles
import { Link, useNavigate } from "react-router-dom"; // useNavigate for navigation

function RegisterPage() {
  const [username, setUsername] = useState(""); // Manage state for username
  const [email, setEmail] = useState(""); // Manage state for email
  const [password, setPassword] = useState(""); // Manage state for password
  const [message, setMessage] = useState(""); // Store the message (success or error)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create an object with the form data
    const userData = {
      username: username,
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/register", // Your backend register endpoint
        userData,
        {
          headers: {
            "Content-Type": "application/json", // Set content type to JSON
          },
        }
      );
      console.log(response.data)
      if (response.data === "success") {
        setMessage("Registration successful!");
        // Optionally, navigate to the login page or dashboard
        navigate("/login");
      }
      else setMessage("Registration failed");
    } catch (error) {
      setMessage(error.response ? error.response.data : "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <h2>User Registration</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)} // Update state on change
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update state on change
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update state on change
          required
        />

        <input type="submit" value="Register" />
      </form>

      {message && <p>{message}</p>} {/* Display success or error message */}

      <div className="login-link">
        <a href="/login">
          <button type="button">Login</button>
        </a>
      </div>
    </div>
  );
}

export default RegisterPage;
