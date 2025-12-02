import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userName", response.data.employee.name);
        localStorage.setItem("userRole", response.data.employee.role);
        localStorage.setItem("employeeId", response.data.employee.id);
        // Navigate based on role if needed, for now default to dashboard
        navigate("/dashboard");
      }
    } catch (error) {
        console.error("Login error:", error);
        alert(error.response?.data?.message || "Login failed");
    }
  };

  const handleRegisterClick = () => {
    setActiveTab("register");
    navigate("/register");
  };

  return (
    <div className="auth-container">
      {/* Left Side - Branding */}
      <div className="auth-left-panel">
        <div className="branding-content">
          <div className="logo-section">
            <svg
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="60"
                height="60"
                rx="12"
                fill="white"
                fillOpacity="0.2"
              />
              <path
                d="M30 15L42 22.5V37.5L30 45L18 37.5V22.5L30 15Z"
                fill="white"
              />
            </svg>
            <h2 className="brand-name">HR Attendance Tracker</h2>
          </div>
          <p className="brand-tagline">
            Streamline your workforce management with our comprehensive
            attendance tracking solution.
          </p>
          <div className="features-list">
            <div className="feature-item">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Real-time attendance monitoring</span>
            </div>
            <div className="feature-item">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Automated leave management</span>
            </div>
            <div className="feature-item">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Comprehensive reports & analytics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="auth-right-panel">
        <div className="auth-form-container">
          <div className="auth-icon">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="50" r="50" fill="#E0F7FA" />
              <path
                d="M50 30C45 30 41 34 41 39C41 44 45 48 50 48C55 48 59 44 59 39C59 34 55 30 50 30Z"
                fill="#00BCD4"
              />
              <path
                d="M50 35C47 35 45 37 45 40C45 43 47 45 50 45C53 45 55 43 55 40C55 37 53 35 50 35Z"
                fill="#E0F7FA"
              />
              <ellipse cx="50" cy="60" rx="15" ry="10" fill="#00BCD4" />
              <path
                d="M40 58C40 55 43 53 50 53C57 53 60 55 60 58"
                stroke="#E0F7FA"
                strokeWidth="2"
              />
            </svg>
          </div>

          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">
            Please sign in to access your dashboard.
          </p>

          <div className="auth-tabs">
            <button
              className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={`auth-tab ${activeTab === "register" ? "active" : ""}`}
              onClick={handleRegisterClick}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-password">
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="auth-submit-btn">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
