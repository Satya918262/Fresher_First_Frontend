import React from "react";
import { Button } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import logo from "../../images/logo.png";

const Sidebar = ({ sidebarOpen, toggleSidebar, activeMenu, onMenuSelect, role }) => {
  // Get the current location (path)
  const location = useLocation();

  // Menu items based on role
  const studentMenuItems = [
    { name: "Home", path: "/dashboard/StudentProfile" },
    { name: "Job List", path: "/dashboard/joblist" },
    { name: "Applied Jobs", path: "/dashboard/appliedjobs" },
    { name: "Expired Jobs", path: "/dashboard/expired-jobs" },
    { name: "Notification", path: "/dashboard/notificationviewer" },
  ];

  const tpoMenuItems = [
    { name: "Home", path: "/dashboard/TPOProfile" },
    { name: "Add Student", path: "/dashboard/students" },
    { name: "Student List", path: "/dashboard/studentlist" },
    { name: "Job List", path: "/dashboard/joblist" },
    { name: "Applied Candidates", path: "/dashboard/appliedcandidates" },
    { name: "Expired Jobs", path: "/dashboard/expired-jobs" },
    { name: "Notification", path: "/dashboard/notificationviewer" },
  ];

  // Admin menu items
  const adminMenuItems = [
    { name: "Home", path: "/dashboard/home" },
    { name: "Add Student", path: "/dashboard/students" },
    { name: "Student List", path: "/dashboard/studentlist" },
    { name: "Add TPO", path: "/dashboard/addtpo" },
    { name: "TPO List", path: "/dashboard/tpolist" },
    { name: "Add Job", path: "/dashboard/addjob" },
    { name: "Job List", path: "/dashboard/joblist" },
    { name: "Notification", path: "/dashboard/notificationsender" },
    { name: "Applied Candidates", path: "/dashboard/appliedcandidates" },
    { name: "Expired Jobs", path: "/dashboard/expired-jobs" },
  ];

  // Depending on the role, choose the appropriate menu items
  const menuItems =
    role === "student"
      ? studentMenuItems
      : role === "tpo"
      ? tpoMenuItems
      : role === "admin"
      ? adminMenuItems
      : [];

  // Set active menu based on the current path
  const getActiveMenu = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const handleClick = (itemName) => {
    onMenuSelect(itemName);
    if (window.innerWidth < 992) {
      toggleSidebar();
    }
  };

  return (
    <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        {/* Replace the text with your logo image */}
        <img src={logo} alt="Logo" className="sidebar-logo" />
        <Button
          variant="link"
          className="close-btn d-lg-none"
          onClick={toggleSidebar}
        >
          <FaTimes size={24} color="#fff" />
        </Button>
      </div>
      <br/><br/>
      <ul className="menu-list">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={getActiveMenu(item.path)} // Use location.pathname to check active menu
            onClick={() => handleClick(item.name)}
          >
            <Link to={item.path}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
