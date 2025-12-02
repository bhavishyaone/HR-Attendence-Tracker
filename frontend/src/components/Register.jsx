import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    department: "Engineering",
    role: "Employee",
  });
  const [showPassword, setShowPassword] = useState(false);

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const response = await axios.get(`${apiUrl}/departments/public`);
        if (Array.isArray(response.data)) {
            setDepartments(response.data);
        } else {
            console.error("Invalid departments data:", response.data);
            setDepartments([]);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
        setDepartments([]);
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        department: formData.department,
        role: formData.role,
      });

      if (response.status === 201) {
        alert("Registration successful! Please login.");
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        {/* Icon */}
        <div className="register-icon">
          <svg
            width="60"
            height="60"
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="30" cy="30" r="30" fill="#E0F2FE" />
            <path
              d="M30 20C25.5817 20 22 23.5817 22 28C22 32.4183 25.5817 36 30 36C34.4183 36 38 32.4183 38 28C38 23.5817 34.4183 20 30 20Z"
              fill="#0EA5E9"
            />
            <path
              d="M30 38C21.7157 38 15 41.134 15 45C15 45 15 48 30 48C45 48 45 45 45 45C45 41.134 38.2843 38 30 38Z"
              fill="#0EA5E9"
            />
            <circle
              cx="30"
              cy="30"
              r="22"
              stroke="#0EA5E9"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="4 4"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="register-title">Create Account</h1>
        <p className="register-subtitle">
          Join our platform to manage attendance.
        </p>

        {/* Tabs */}
        <div className="register-tabs">
          <button
            className="tab-button"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button className="tab-button active">Register</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="register-form">
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email Address */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-password"
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
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
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
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* Department */}
          <div className="form-group">
            <label htmlFor="department">Department</label>
            <div className="select-wrapper">
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
              <svg
                className="select-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>

          {/* Role */}
          <div className="form-group">
            <label>Role</label>
            <div className="role-buttons">
              <button
                type="button"
                className={`role-btn ${
                  formData.role === "Employee" ? "active" : ""
                }`}
                onClick={() => handleRoleSelect("Employee")}
              >
                Employee
              </button>
              <button
                type="button"
                className={`role-btn ${
                  formData.role === "Admin" ? "active" : ""
                }`}
                onClick={() => handleRoleSelect("Admin")}
              >
                Admin
              </button>
              <button
                type="button"
                className={`role-btn ${
                  formData.role === "HR" ? "active" : ""
                }`}
                onClick={() => handleRoleSelect("HR")}
              >
                HR
              </button>
            </div>
          </div>

          {/* Register Button */}
          <button type="submit" className="register-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
