import React, { useState, useEffect } from "react";
import "../CSS/DeveloperHomePage.css";
import { useNavigate } from "react-router-dom";

const DeveloperHomePage = () => {
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  const navigate = useNavigate();
  const handleViewDetails = (task) => {
    navigate(`/task-details/${task.taskId}`, { state: { task } });
  };

  useEffect(() => {
    
    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      // Redirect to login page if userId is not set
      navigate("/login");
    }

    if (!userId) {
      console.error("No userId found in sessionStorage. Please log in.");
      return;
    }

    // Fetch assigned tasks
    fetch(`http://localhost:8080/getdevAssignedTasks?userId=${userId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Assigned tasks data:", data);
        const formattedTasks = data
          .filter((task) => task.status === "ONGOING") // Filter only ongoing tasks
          .map((task) => ({
            taskId: task.taskId,
            description: task.description,
            priority: convertPriority(task.priority), // Convert numeric priority to text
            dueDate: task.dueDate || "No Due Date", // Handle missing dueDate
          }));
        setAssignedTasks(formattedTasks);
      })
      .catch((error) => console.error("Error fetching assigned tasks:", error));

    // Fetch completed tasks
    fetch(`http://localhost:8080/getdevCompletedTasks?userId=${userId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Completed tasks data:", data);
        const formattedTasks = data
          .filter((task) => task.status === "COMPLETED") // Filter only completed tasks
          .map((task) => ({
            description: task.description,
            priority: convertPriority(task.priority), // Convert numeric priority to text
            dueDate: task.dueDate || "No Due Date", // Handle missing dueDate
          }));
        setCompletedTasks(formattedTasks);
      })
      .catch((error) => console.error("Error fetching completed tasks:", error));
  }, []);


  
  // Map numeric priority to readable text
  const convertPriority = (priority) => {
    switch (priority) {
      case 1:
        return "High";
      case 2:
        return "Medium";
      case 3:
        return "Low";
      case 5:
        return "Very Low";
      default:
        return "Unknown";
    }
  };

  const handleLogout = () => {
    alert("Logged out successfully.");
    sessionStorage.clear();
    localStorage.removeItem("authToken"); // Example, adjust based on your implementation
    sessionStorage.removeItem("authToken"); 
    window.location.href = "/login";
  };

  return (
    <div className="developer-home">
      <header className="header">
        <h1>Your Assigned and Completed Tasks</h1>
      </header>

      {/* Assigned Tasks */}
      <div className="task-container">
        <h3>Assigned Tasks</h3>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignedTasks.length > 0 ? (
              assignedTasks.map((task) => (
                <tr key={task.taskId}>
                  <td>{task.description}</td>
                  <td>{task.priority}</td>
                  <td>{task.dueDate}</td>
                  <td>
                  <button
                    className="view-button"
                    onClick={() => handleViewDetails(task)}
                  >
                    View Details
                  </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No assigned tasks.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Completed Tasks */}
      <div className="task-container">
        <h3>Completed Tasks</h3>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Priority</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {completedTasks.length > 0 ? (
              completedTasks.map((task, index) => (
                <tr key={index}>
                  <td>{task.description}</td>
                  <td>{task.priority}</td>
                  <td>{task.dueDate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No completed tasks.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default DeveloperHomePage;
