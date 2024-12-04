import React, { useState, useEffect } from "react";
import "../CSS/AdminPage.css"; // Importing the CSS file
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  const [selectedRole, setSelectedRole] = useState({});
  useEffect(() => {

    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      // Redirect to login page if userId is not set
      navigate("/login");
    }

    // Fetch users data from backend
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8080/fetchUsers");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUsers();
  }, []);

  // Handle role change and submit
  const handleRoleChange = async (userId, role) => {
    try {
        const response = await fetch(
            `http://localhost:8080/assign-role?userId=${userId}&role=${role}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
      if (response.ok) {
        alert("Role updated successfully!");
      } else {
        throw new Error("Failed to update role");
      }
    } catch (error) {
      alert(error.message);
    }
  };

    // Update selected role for a specific user
    const handleRoleSelect = (userId, role) => {
        setSelectedRole((prevSelectedRole) => ({
          ...prevSelectedRole,
          [userId]: role,
        }));
      };

      const handleLogout = () => {
        alert("Logged out successfully.");
        sessionStorage.clear();
        localStorage.removeItem("authToken"); // Example, adjust based on your implementation
        sessionStorage.removeItem("authToken"); 
        window.location.href = "/login";
      };

  return (
    
    <div className="container">
         <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      <h1>Assign Roles to Users</h1>
      {error && <p className="error">{error}</p>}
      <table className="user-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Current Role</th>
            <th>Assign Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userId}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
               <select class="tests"
                  value={selectedRole[user.userId] || user.role} // Use selectedRole state to manage changes
                  onChange={(e) => handleRoleSelect(user.userId, e.target.value)} // Update the selected role
                >
                  <option value="MANAGER">MANAGER</option>
                  <option value="DEVELOPER">DEVELOPER</option>
                </select>
              </td>
              <td>
              <button
                  type="button"
                  onClick={() => handleRoleChange(user.userId, selectedRole[user.userId] || user.role)} // Pass selected role when submitting
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
