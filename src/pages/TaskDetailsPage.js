import React, { useState, useEffect } from "react";
import "../CSS/TaskDetailsPage.css";
import { useParams } from "react-router-dom"; // Import useParams
import { useNavigate } from "react-router-dom";

const TaskDetailsPage = ({ onTaskUpdate, onAddComment, onLogout }) => {
    const { taskId } = useParams(); // Capture taskId from the URL
    const [task, setTask] = useState(null);
    const [users, setUsers] = useState([]);
    const [description, setDescription] = useState("");
    const [assignedTo, setAssignedTo] = useState("0");
    const [priority, setPriority] = useState("1");
    const [status, setStatus] = useState("ONGOING");
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
 
    const navigate = useNavigate();  
  // Fetch task details from API
  useEffect(() => {

    const userId = sessionStorage.getItem("userId");
        if (!userId) {
          // Redirect to login page if userId is not set
          navigate("/login");
        }

    const fetchTask = async () => {
      try {
        setLoading(true);
        setError("");

        // Call your API here
        const response = await fetch(`http://localhost:8080/view/${taskId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch task: ${response.status}`);
        }

        const data = await response.json();

        // Update state with task data
        setTask(data);
        setDescription(data.description);
        setAssignedTo(data.assignedTo.toString());
        setPriority(data.priority.toString());
        setStatus(data.status);
        setComments(data.comments || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  // Fetch users from the backend
  useEffect(() => {
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

  // Handle task update
  const handleUpdateTask = async (e) => {
    e.preventDefault();

    // Validate inputs before making the API call
    if (!assignedTo || assignedTo === "0") {
        alert("Please assign the task to a valid user.");
        return;
    }

    const updatedTask = {
        description,
        assignedTo,
        priority,
        status,
    };


    // Call the API to update the task on the server
    try {
        const response = await fetch(`http://localhost:8080/updateAssignedAndPriority?id=${taskId}&description=${encodeURIComponent(description)}&assignedTo=${assignedTo}&priority=${priority}&status=${encodeURIComponent(status)}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });


        // Optionally, update any additional state if needed
        // For example: onTaskUpdated(updatedTask); or a success message
        console.log("Task updated successfully");
        alert("Task updated successfully!");
        navigate(-1); 
    } catch (error) {
        console.error("Error updating task:", error);
        setError("Failed to update task.");
    }
};


  // Handle adding a comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    const comment = {
      author: "Current User", // Replace with logged-in user's name
      text: newComment,
      timestamp: new Date().toLocaleString(),
    };

    setComments([...comments, comment]);
    setNewComment("");
      // Call the API to save the new comment
      try {
        const response = await fetch(`http://localhost:8080/addComment?taskId=${taskId}&text=${encodeURIComponent(newComment)}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });


    } catch (error) {
        console.error("Error adding comment:", error);
        setError("Failed to add comment.");
    }
};

  const handleLogout = () => {
    // Clear any authentication tokens or session
    sessionStorage.clear();
    localStorage.removeItem("authToken"); // Example, adjust based on your implementation
    sessionStorage.removeItem("authToken"); // If you use sessionStorage for authentication

    // Call the parent onLogout function (if necessary)
   // onLogout();

    // Redirect user to the login page
    navigate("/login");  // Use navigate to redirect
};

  // Render loading state or error
  if (loading) return <p>Loading task details...</p>;
  if (error) return <p>Error: {error}</p>;

  const role = sessionStorage.getItem("role");
  console.log(role)

  // Render task details
  return (
    <div className="container">
     
     <button className="logout2-button" onClick={handleLogout}>
        Logout
      </button>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
    <div></div>
    <div></div><div></div>
      <h2>Task Details</h2>
      <div></div>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleUpdateTask}>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="5"
          placeholder="Task Description"
        />
        <label htmlFor="assignedTo">Assigned To:</label>
        <select
          id="assignedTo"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          disabled={role === "developer"}
        >
          <option value="0" disabled>
            Choose one
          </option>
          {users.map((user) => (
            <option key={user.userId} value={user.userId}>
              {user.userId} - {user.username}
            </option>
          ))}
        </select>

        <label htmlFor="priority">Priority:</label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          disabled={role === "DEVELOPER"}
        >
          {[1, 2, 3, 4, 5].map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>

        <label htmlFor="status">Status:</label>
        <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="UNASSIGNED">UNASSIGNED</option>
          <option value="ONGOING">ONGOING</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>

        <h3>Comments</h3>
        {comments.length > 0 ? (
          <ul className="comments-list">
            {comments.map((comment, index) => (
              <li key={index}>
                <strong>{comment.author}:</strong> {comment.text}{" "}
                <em>({comment.timestamp})</em>
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments yet.</p>
        )}

        <input type="submit" value="Update Task" className="btn" />
      </form>

      <h3>Add a New Comment</h3>
      <form onSubmit={handleAddComment}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows="3"
          placeholder="Add a comment..."
        />
        <button type="submit" className="btn">
          Add Comment
        </button>
      </form>
    </div>
  );
};

export default TaskDetailsPage;
