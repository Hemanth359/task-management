import React, { useState } from "react";
import axios from "axios"; // Import axios
import "../CSS/LoginPage.css"; // Import the styles
import { Link, useNavigate } from "react-router-dom"; // useNavigate for navigation

function LoginPage() {
  const [username, setUsername] = useState(""); // Manage state for username
  const [password, setPassword] = useState(""); // Manage state for password
  const [message, setMessage] = useState(""); // Manage response message
  const navigate = useNavigate(); // useNavigate to navigate to different routes after successful login

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/login", {
        username,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data)
    
      if (response.data.role === "developer") {
        sessionStorage.setItem("userId", response.data.userId);
    sessionStorage.setItem("role", response.data.role);
        console.log(response.data)
        navigate("/developerhome"); 
      }
      else if (response.data.role === "manager") {
        sessionStorage.setItem("userId", response.data.userId);
    sessionStorage.setItem("role", response.data.role);
        console.log(response.data)
        navigate("/managerhome"); 
      }
      else if(response.data.role === "admin") {
        sessionStorage.setItem("userId", response.data.userId);
    sessionStorage.setItem("role", response.data.role);
    navigate("/adminhome");
      }
      else alert("invalid credentials");

      setMessage(response.data.role); // Show success message
    } catch (error) {
      // Handle error
      setMessage(error.response ? error.response.data : "Login failed");
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      <h2>TASK MANAGEMENT</h2>
      {/* <h2>Login</h2> */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username} // Controlled input
          onChange={(e) => setUsername(e.target.value)} // Update state on change
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password} // Controlled input
          onChange={(e) => setPassword(e.target.value)} // Update state on change
          required
        />
        <input type="submit" value="Login" />
      </form>
    
      {message && <p>{message}</p>} {/* Display message (success or error) */}

      <button onClick={handleRegister} className="register-button">
        Register
      </button>
    </div>
  );
}

export default LoginPage;
