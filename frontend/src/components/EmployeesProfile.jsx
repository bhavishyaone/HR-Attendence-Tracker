import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/EmployeesProfile.css";

const EmployeeDetail = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("attendance");
  const [selectedPeriod, setSelectedPeriod] = useState("Last 30 Days");

  const [employee, setEmployee] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const [payrollData, setPayrollData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const token = localStorage.getItem("token");
        const employeeId = localStorage.getItem("employeeId");

        if (!token || !employeeId) {
          navigate("/login");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };
        const apiUrl = import.meta.env.VITE_API_URL;
        
        console.log("API URL:", apiUrl);
        console.log("Employee ID:", employeeId);

        // 1. Fetch Employee Details
        const empRes = await axios.get(
          `${apiUrl}/employees/${employeeId}`,
          { headers }
        );
        const empData = empRes.data;
        console.log("Employee Data:", empData);

        // 2. Fetch Attendance
        const attRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/attendance/${employeeId}`,
          { headers }
        );
        const attRecords = attRes.data;

        // 3. Fetch Leaves
        const leaveRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/leaves/employee/${employeeId}`,
          { headers }
        );
        const leaveRecords = leaveRes.data.leave || [];

        // 4. Fetch Payrolls
        const payrollRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/payrolls/employee/${employeeId}`,
          { headers }
        );
        const payrollRecords = payrollRes.data || [];

        // Calculate Stats
        const totalPresent = attRecords.filter(
          (r) => r.status === "PRESENT"
        ).length;
        const totalLeaves = leaveRecords.filter(
          (l) => l.status === "APPROVED"
        ).length;
        
        const totalHours = attRecords.reduce(
          (acc, curr) => acc + Number(curr.totalHours || 0),
          0
        );
        const avgHours =
          attRecords.length > 0
            ? (totalHours / attRecords.length).toFixed(1)
            : 0;

        setEmployee({
          ...empData,
          position: empData.role, // Mapping role to position for now
          department: empData.department?.name || "N/A",
          joinDate: new Date(empData.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          status: "Active", // Hardcoded for now, or add to DB
          avatar: null,
          stats: {
            totalPresentDays: totalPresent,
            totalLeavesTaken: totalLeaves,
            averageHours: avgHours,
          },
        });

        // Format Attendance Data
        const formattedAttendance = attRecords.map((record) => ({
          date: new Date(record.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          checkIn: record.checkInTime
            ? new Date(record.checkInTime).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : "--",
          checkOut: record.checkOutTime
            ? new Date(record.checkOutTime).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : "--",
          hours: record.totalHours ? `${record.totalHours}h` : "--",
          status: record.status.charAt(0) + record.status.slice(1).toLowerCase(),
        }));
        setAttendanceData(formattedAttendance);

        // Format Leave Data
        const formattedLeaves = leaveRecords.map((record) => ({
          startDate: new Date(record.startDate).toLocaleDateString(),
          endDate: new Date(record.endDate).toLocaleDateString(),
          reason: record.reason,
          status: record.status.charAt(0) + record.status.slice(1).toLowerCase(),
          days:
            Math.ceil(
              (new Date(record.endDate) - new Date(record.startDate)) /
                (1000 * 60 * 60 * 24)
            ) + 1,
        }));
        setLeaveData(formattedLeaves);

        // Format Payroll Data
        const formattedPayrolls = payrollRecords.map((record) => {
          const date = new Date(record.year, record.month - 1);
          const monthName = date.toLocaleString("default", { month: "long" });
          return {
            month: `${monthName} ${record.year}`,
            baseSalary: `$${record.baseSalary.toLocaleString()}`,
            bonus: "$0", // Placeholder as backend doesn't have bonus yet
            deductions: `$${record.deductions.toLocaleString()}`,
            netPay: `$${record.netSalary.toLocaleString()}`,
            status: "Paid", // Default status as records exist
          };
        });
        setPayrollData(formattedPayrolls);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching employee profile:", error);
        console.error("Error details:", error.response?.data || error.message);
        setLoading(false);
        // Set a basic employee object so the page can still render
        setEmployee(null);
      }
    };

    fetchEmployeeData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="employee-detail-container">
        <Sidebar />
        <div className="employee-detail-content">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '80vh',
            fontSize: '18px',
            color: '#6B7280'
          }}>
            Loading profile...
          </div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="employee-detail-container">
        <Sidebar />
        <div className="employee-detail-content">
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '80vh',
            gap: '16px'
          }}>
            <div style={{ fontSize: '18px', color: '#EF4444' }}>
              Failed to load profile. Please check the console for errors.
            </div>
            <button 
              onClick={() => navigate('/dashboard')}
              style={{
                padding: '12px 24px',
                background: '#667EEA',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusClass = (status) => {
    const statusLower = status.toLowerCase();
    if (
      statusLower === "present" ||
      statusLower === "approved" ||
      statusLower === "paid" ||
      statusLower === "active"
    ) {
      return "status-present";
    } else if (statusLower === "absent" || statusLower === "rejected") {
      return "status-absent";
    }
    return "";
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="employee-detail-container">
      <Sidebar />

      <div className="employee-detail-content">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span
            onClick={() => navigate("/dashboard")}
            style={{ cursor: "pointer" }}
          >
            Home
          </span>
          <span className="separator">/</span>
          <span
            onClick={() => navigate("/employees")}
            style={{ cursor: "pointer" }}
          >
            Employees
          </span>
          <span className="separator">/</span>
          <span>{employee.name}</span>
        </div>

        <div className="employee-detail-layout">
          {/* Left Profile Card */}
          <div className="profile-card">
            <div className="profile-avatar">
              {employee.avatar ? (
                <img src={employee.avatar} alt={employee.name} />
              ) : (
                <div className="avatar-placeholder">
                  {getInitials(employee.name)}
                </div>
              )}
              <div className="online-indicator"></div>
            </div>

            <h2 className="profile-name">{employee.name}</h2>
            <p className="profile-position">{employee.position}</p>

            <button className="edit-profile-btn">Edit Profile</button>

            <div className="profile-details">
              <div className="detail-item">
                <label>Email</label>
                <p>{employee.email}</p>
              </div>

              <div className="detail-item">
                <label>Phone</label>
                <p>{employee.phone}</p>
              </div>

              <div className="detail-item">
                <label>Department</label>
                <p>{employee.department}</p>
              </div>

              <div className="detail-item">
                <label>Join Date</label>
                <p>{employee.joinDate}</p>
              </div>

              <div className="detail-item">
                <label>Status</label>
                <span
                  className={`status-badge ${getStatusClass(employee.status)}`}
                >
                  {employee.status}
                </span>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="detail-right-content">
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <p className="stat-label">Total Present Days</p>
                <h3 className="stat-value">
                  {employee.stats.totalPresentDays}
                </h3>
              </div>
              <div className="stat-card">
                <p className="stat-label">Total Leaves Taken</p>
                <h3 className="stat-value">
                  {employee.stats.totalLeavesTaken}
                </h3>
              </div>
              <div className="stat-card">
                <p className="stat-label">Average Hours</p>
                <h3 className="stat-value">{employee.stats.averageHours}</h3>
              </div>
            </div>

            {/* Tabs */}
            <div className="tabs-container">
              <div className="tabs-header">
                <button
                  className={`tab-btn ${
                    activeTab === "attendance" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("attendance")}
                >
                  Attendance History
                </button>
                <button
                  className={`tab-btn ${activeTab === "leave" ? "active" : ""}`}
                  onClick={() => setActiveTab("leave")}
                >
                  Leave History
                </button>
                <button
                  className={`tab-btn ${
                    activeTab === "payroll" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("payroll")}
                >
                  Payroll Records
                </button>

                <div className="period-selector">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                  >
                    <option>Last 30 Days</option>
                    <option>Last 60 Days</option>
                    <option>Last 90 Days</option>
                    <option>This Year</option>
                  </select>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>

              <div className="tab-content">
                {/* Attendance History Tab */}
                {activeTab === "attendance" && (
                  <div className="attendance-history">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Check-in</th>
                          <th>Check-out</th>
                          <th>Hours</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceData.map((record, index) => (
                          <tr key={index}>
                            <td>{record.date}</td>
                            <td>{record.checkIn}</td>
                            <td>{record.checkOut}</td>
                            <td>{record.hours}</td>
                            <td>
                              <span
                                className={`status-badge ${getStatusClass(
                                  record.status
                                )}`}
                              >
                                {record.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Leave History Tab */}
                {activeTab === "leave" && (
                  <div className="leave-history">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Reason</th>
                          <th>Days</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaveData.map((record, index) => (
                          <tr key={index}>
                            <td>{record.startDate}</td>
                            <td>{record.endDate}</td>
                            <td>{record.reason}</td>
                            <td>{record.days}</td>
                            <td>
                              <span
                                className={`status-badge ${getStatusClass(
                                  record.status
                                )}`}
                              >
                                {record.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Payroll Records Tab */}
                {activeTab === "payroll" && (
                  <div className="payroll-records">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Month</th>
                          <th>Base Salary</th>
                          <th>Bonus</th>
                          <th>Deductions</th>
                          <th>Net Pay</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payrollData.map((record, index) => (
                          <tr key={index}>
                            <td>{record.month}</td>
                            <td>{record.baseSalary}</td>
                            <td>{record.bonus}</td>
                            <td>{record.deductions}</td>
                            <td className="net-pay">{record.netPay}</td>
                            <td>
                              <span
                                className={`status-badge ${getStatusClass(
                                  record.status
                                )}`}
                              >
                                {record.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Profile Section */}

      </div>
    </div>
  );
};

export default EmployeeDetail;
