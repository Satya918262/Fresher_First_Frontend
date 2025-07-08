import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";
import logo from "../../images/logo.png";

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Logo on the left */}
      <a href="/" className="navbar-logo">
        <img
          src={logo} // Replace with your logo image URL
          alt="Logo"
          className="logo-img"
        />
      </a>

      {/* Login Dropdown */}
      <div className="navbar-login dropdown">
        <button
          className="btn btn-primary dropdown-toggle"
          type="button"
          id="loginDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Login
        </button>
        <ul className="dropdown-menu" aria-labelledby="loginDropdown">
          <li>
            <Link className="dropdown-item" to="/login/student">
              Student Login
            </Link>
          </li>
          <li>
            <Link className="dropdown-item" to="/login/tpo">
              TPO Login
            </Link>
          </li>
          <li>
            <Link className="dropdown-item" to="/login/admin">
              Admin Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
