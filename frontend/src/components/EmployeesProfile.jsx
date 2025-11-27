import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/EmployeesProfile.css";

const EmployeeDetail = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("attendance");
  const [selectedPeriod, setSelectedPeriod] = useState("Last 30 Days");

  // Mock data - replace with actual API calls
  const employee = {
    id: 1,
    name: "Jane Doe",
    position: "Product Designer",
    email: "jane.doe@example.com",
    phone: "+1 234 567 890",
    department: "Product",
    joinDate: "August 15, 2022",
    status: "Active",
    avatar: null,
    stats: {
      totalPresentDays: 248,
      totalLeavesTaken: 12,
      averageHours: 8.1,
    },
  };

  const attendanceData = [
    {
      date: "Oct 24, 2023",
      checkIn: "09:02 AM",
      checkOut: "05:30 PM",
      hours: "8.5h",
      status: "Present",
    },
    {
      date: "Oct 23, 2023",
      checkIn: "--",
      checkOut: "--",
      hours: "--",
      status: "Absent",
    },
    {
      date: "Oct 22, 2023",
      checkIn: "09:05 AM",
      checkOut: "05:01 PM",
      hours: "8.0h",
      status: "Present",
    },
    {
      date: "Oct 21, 2023",
      checkIn: "09:15 AM",
      checkOut: "05:35 PM",
      hours: "8.3h",
      status: "Present",
    },
  ];

  const leaveData = [
    {
      startDate: "Nov 15, 2023",
      endDate: "Nov 16, 2023",
      reason: "Sick Leave",
      status: "Approved",
      days: 2,
    },
    {
      startDate: "Oct 10, 2023",
      endDate: "Oct 12, 2023",
      reason: "Personal",
      status: "Approved",
      days: 3,
    },
    {
      startDate: "Sep 05, 2023",
      endDate: "Sep 05, 2023",
      reason: "Medical",
      status: "Rejected",
      days: 1,
    },
  ];

  const payrollData = [
    {
      month: "October 2023",
      baseSalary: "$5,000",
      bonus: "$500",
      deductions: "$200",
      netPay: "$5,300",
      status: "Paid",
    },
    {
      month: "September 2023",
      baseSalary: "$5,000",
      bonus: "$300",
      deductions: "$200",
      netPay: "$5,100",
      status: "Paid",
    },
    {
      month: "August 2023",
      baseSalary: "$5,000",
      bonus: "$0",
      deductions: "$200",
      netPay: "$4,800",
      status: "Paid",
    },
  ];

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
        <div className="bottom-profile">
          <div className="profile-avatar-small">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="20" cy="20" r="20" fill="#4A5568" />
              <circle cx="20" cy="16" r="6" fill="#E2E8F0" />
              <path
                d="M10 32C10 25 14 22 20 22C26 22 30 25 30 32"
                fill="#E2E8F0"
              />
            </svg>
          </div>
          <div className="profile-info">
            <h3>Alex Grim</h3>
            <p>HR Manager</p>
          </div>
          <button className="logout-btn-small">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
