import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const { role } = useParams(); // Get role from URL
  const navigate = useNavigate();
  const [sucCode, setSucCode] = useState("");
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState(""); // For the old password during change
  const [newPassword, setNewPassword] = useState(""); // For new password
  const [confirmNewPassword, setConfirmNewPassword] = useState(""); // For confirm new password
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false); // Toggle visibility for old password
  const [showNewPassword, setShowNewPassword] = useState(false); // Toggle visibility for new password
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false); // Toggle visibility for confirm new password
  const [isPasswordChangeRequired, setIsPasswordChangeRequired] = useState(false);
  const [isPasswordMatchError, setIsPasswordMatchError] = useState(false); // Handle password mismatch error
  const [passwordError, setPasswordError] = useState(""); // Handle password validation errors
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmNewPasswordVisibility = () => {
    setShowConfirmNewPassword(!showConfirmNewPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, sucCode, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store role and ID in localStorage
        localStorage.setItem("role", role);
        if (role === "tpo") {
          localStorage.setItem("tpoId", data.tpoId); // Store tpoId when logged in as TPO
          localStorage.setItem("tpoCollege", data.tpoCollege);
        } else if (role === "student") {
          localStorage.setItem("studentId", data.studentId); // Store studentId for student role
        }

        // Show toast message for successful login
        toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} login successful!`);

        // Check if password change is required
        if (data.changePassword) {
          setIsPasswordChangeRequired(true); // Show password change form
        } else {
          // Delay navigation to allow toast message to be visible
          setTimeout(() => {
            if (role === "student") {
              navigate("/dashboard/StudentProfile");
            } else if (role === "tpo") {
              navigate("/dashboard/TPOProfile");
            } else if (role === "admin") {
              navigate("/dashboard/home");
            }
          }, 1500); // Delay of 1.5 seconds to ensure toast is visible
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Login failed! Please try again.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Check if new password and confirm new password match
    if (newPassword !== confirmNewPassword) {
      setIsPasswordMatchError(true);
      return;
    }

    // Password strength validation (one capital letter, one special symbol, and one number)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setPasswordError("Password must contain at least one uppercase letter, one number, and one special character.");
      return;
    } else {
      setPasswordError(""); // Reset error if the password is valid
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/login/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, sucCode, oldPassword, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password changed successfully. Please login again.");
        setIsPasswordChangeRequired(false);
        setPassword("");
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to change password. Please try again.");
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
      <div className="row g-0 w-100 shadow-lg" style={{ maxWidth: "1200px", borderRadius: "1rem" }}>
        <div
          className="col-md-6 d-none d-md-block position-relative"
          style={{
            backgroundImage: `url(https://source.unsplash.com/random/1200x800?tech)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "1rem",
          }}
        >
          <div className="w-100 h-100 bg-dark bg-opacity-50" style={{ borderRadius: "1rem" }}></div>
          <div className="position-absolute top-50 start-50 translate-middle text-white text-center w-75">
            <h2 className="fw-bold mb-4 text-light">Welcome Back</h2>
            <p className="lead">Streamline your workflow with our professional platform</p>
          </div>
        </div>

        <div
          className="col-md-6 bg-white p-5"
          style={{ borderTopRightRadius: "1rem", borderBottomRightRadius: "1rem" }}
        >
          <div className="text-center mb-5">
            <h2 className="fw-bold text-primary">{role.charAt(0).toUpperCase() + role.slice(1)} Login</h2>
            <p className="text-muted">Sign in as a {role}</p>
          </div>

          {!isPasswordChangeRequired ? (
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="sucCode" className="form-label fw-bold">
                  Username
                </label>
                <input
                  type="text"
                  className="form-control py-2"
                  id="sucCode"
                  placeholder="Enter username"
                  required
                  value={sucCode}
                  onChange={(e) => setSucCode(e.target.value)}
                />
              </div>

              <div className="mb-4 position-relative">
                <label htmlFor="password" className="form-label fw-bold">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control py-2 pe-5"
                  id="password"
                  placeholder="Enter Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-link position-absolute end-0 me-3"
                  style={{ top: "50%", transform: "translateY(-5%)" }}
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
                </button>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">
                Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleChangePassword}>
              <div className="mb-4 position-relative">
                <label htmlFor="oldPassword" className="form-label fw-bold">
                  Old Password
                </label>
                <input
                  type={showOldPassword ? "text" : "password"}
                  className="form-control py-2"
                  id="oldPassword"
                  placeholder="Enter Old Password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-link position-absolute end-0 me-3"
                  style={{ top: "50%", transform: "translateY(-5%)" }}
                  onClick={toggleOldPasswordVisibility}
                >
                  {showOldPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
                </button>
              </div>

              <div className="mb-4 position-relative">
                <label htmlFor="newPassword" className="form-label fw-bold">
                  New Password
                </label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="form-control py-2"
                  id="newPassword"
                  placeholder="Enter New Password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                {passwordError && <div className="text-danger mb-3">{passwordError}</div>}
                <button
                  type="button"
                  className="btn btn-link position-absolute end-0 me-3"
                  style={{ top: "50%", transform: "translateY(-5%)" }}
                  onClick={toggleNewPasswordVisibility}
                >
                  {showNewPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
                </button>
              </div>

              <div className="mb-4 position-relative">
                <label htmlFor="confirmNewPassword" className="form-label fw-bold">
                  Confirm New Password
                </label>
                <input
                  type={showConfirmNewPassword ? "text" : "password"}
                  className="form-control py-2"
                  id="confirmNewPassword"
                  placeholder="Confirm New Password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-link position-absolute end-0 me-3"
                  style={{ top: "50%", transform: "translateY(-5%)" }}
                  onClick={toggleConfirmNewPasswordVisibility}
                >
                  {showConfirmNewPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
                </button>
              </div>

              {isPasswordMatchError && (
                <div className="text-danger mb-3">New password and confirmation do not match.</div>
              )}

              <button type="submit" className="btn btn-success w-100 py-2 fw-bold">
                Change Password
              </button>
            </form>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
