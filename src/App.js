import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DeveloperHomePage from "./pages/DeveloperHomePage";
import ManagerHomePage from "./pages/ManagerHomePage";
import TaskDetailsPage from "./pages/TaskDetailsPage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/developerhome" element={<DeveloperHomePage />} />
        <Route path="/managerhome" element={<ManagerHomePage />} />
        <Route path="/adminhome" element={<AdminPage />} />
        <Route path="/task-details/:taskId" element={<TaskDetailsPage />} />
        {/* Add a default route */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
  );
}

export default App;
