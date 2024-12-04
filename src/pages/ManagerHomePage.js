import React, { useState, useEffect } from "react";
import "../CSS/ManagerHomePage.css"; // Importing CSS file
import { useNavigate } from "react-router-dom";

const ManagerHomePage = () => {
 const [users, setUsers] = useState([]);
  const [ongoingTasks, setOngoingTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [unassignedTasks, setUnassignedTasks] = useState([]);
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(1);
  const [assignedTo, setAssignedTo] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const handleViewDetails = (task) => {
    navigate(`/task-details/${task.taskId}`, { state: { task } });
  };

  // Fetch users
    // Fetch users from the backend
    useEffect(() => {

        const userId = sessionStorage.getItem("userId");
        if (!userId) {
          // Redirect to login page if userId is not set
          navigate("/login");
        }
        
        const fetchUsers = async () => {
          try {
            const response = await fetch(`http://localhost:8080/alldevelopers`); // Update the endpoint with your actual users API
            if (!response.ok) {
              throw new Error(`Failed to fetch users: ${response.status}`);
            }
    
            const data = await response.json();
            setUsers(data); // Populate the users state with the API response
          } catch (err) {
            console.error("Error fetching users:", err);
          }
        };
    
        fetchUsers();
      }, []);

  // Fetch ongoing tasks
  const fetchOngoingTasks = async () => {
    try {
      const response = await fetch(`http://localhost:8080/getongoingTasks?status=ONGOING`); // Replace with your actual API
      const data = await response.json();
      setOngoingTasks(data);
    } catch (error) {
      setError("Error fetching ongoing tasks");
    }
  };

  // Fetch completed tasks
  const fetchCompletedTasks = async () => {
    try {
      const response = await fetch(`http://localhost:8080/getongoingTasks?status=COMPLETED`); // Replace with your actual API
      const data = await response.json();
      setCompletedTasks(data);
    } catch (error) {
      setError("Error fetching completed tasks");
    }
  };

  // Fetch unassigned tasks
  const fetchUnassignedTasks = async () => {
    try {
      const response = await fetch(`http://localhost:8080/getongoingTasks?status=UNASSIGNED`); // Replace with your actual API
      const data = await response.json();
      setUnassignedTasks(data);
    } catch (error) {
      setError("Error fetching unassigned tasks");
    }
  };

  // Create Task
  const handleCreateTask = async (e) => {
    e.preventDefault();

    const newTask = {
      description,
      priority,
      assignedTo,
    };

    try {
      const response = await fetch("http://localhost:8080/create-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        setDescription("");
        setPriority(1);
        setAssignedTo("");
        // Reload tasks after creating
        fetchOngoingTasks();
        fetchUnassignedTasks();
      } else {
        setError("Failed to create task");
      }
    } catch (error) {
      setError("Error creating task");
    }
  };

  useEffect(() => {
    fetchOngoingTasks();
    fetchCompletedTasks();
    fetchUnassignedTasks();
  }, []);

  const handleLogout = () => {
    alert("Logged out successfully.");
    sessionStorage.clear();
    localStorage.removeItem("authToken"); // Example, adjust based on your implementation
    sessionStorage.removeItem("authToken"); 
    window.location.href = "/login";
  };
  
  return (
    <div className="container">
      <div className="header">
        <h1>Manager Dashboard</h1>
      </div>

      {/* Create New Task Section */}
      <div className="task-section">
        <h2>Create New Task</h2>
        <form onSubmit={handleCreateTask}>
            Description : 
          <input type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task Description"
            required
          />
          Priority : 
          <input
            type="number"
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            placeholder="Priority (1-5)"
            required
          />
          Assigned To : <br></br>
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            
          >
            <option value="">Please Select</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
          <input type="submit" value="Create Task" />
        </form>
      </div>

      {/* Ongoing Tasks Section */}
      <div className="task-section">
        <h2>Ongoing Tasks</h2>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Assigned To</th>
              <th>Priority</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ongoingTasks.map((task) => (
              <tr key={task.id}>
                <td>{task.description}</td>
                <td>{task.assignedTo}</td>
                <td>{task.priority}</td>
                <td>
                  {/* <a href={`/tasks/view/${task.id}`}>View</a> */}
                  <button
                    className="view-button"
                    onClick={() => handleViewDetails(task)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Completed Tasks Section */}
      <div className="task-section">
        <h2>Completed Tasks</h2>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Assigned To</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {completedTasks.map((task) => (
              <tr key={task.id}>
                <td>{task.description}</td>
                <td>{task.assignedTo}</td>
                <td>{task.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Unassigned Tasks Section */}
      <div className="task-section">
        <h2>Unassigned Tasks</h2>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Priority</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {unassignedTasks.map((task) => (
              <tr key={task.id}>
                <td>{task.description}</td>
                <td>{task.priority}</td>
                <td>
                  {/* <a href={`/tasks/view/${task.id}`}>View</a> */}
                  <button
                    className="view-button"
                    onClick={() => handleViewDetails(task)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Error Message */}
      {error && <p className="error">{error}</p>}

      <button className="logout1-button" onClick={handleLogout}>
        Logout
      </button>

      <div className="footer">
        <p>&copy; 2024 Task Management System</p>
      </div>
    </div>
  );
};

export default ManagerHomePage;
