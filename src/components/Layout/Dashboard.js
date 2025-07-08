import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./Topbar";
import { Outlet } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState("Home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState(""); // State to store role

  // Toggle Sidebar
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Handle menu selection
  const handleMenuSelect = (menu) => setSelectedMenu(menu);

  // Fetch role from localStorage (or from API/Redux)
  useEffect(() => {
    const userRole = localStorage.getItem("role"); // Or use any state management logic
    setRole(userRole);
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        activeMenu={selectedMenu}
        onMenuSelect={handleMenuSelect}
        role={role} // Pass the role here
      />
      <div className="main-content">
        <TopBar selectedMenu={selectedMenu} toggleSidebar={toggleSidebar} />
        <div className="content-area p-3">
          <Outlet /> {/* Dynamic content goes here based on the selected route */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
