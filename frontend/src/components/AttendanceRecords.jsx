import { useState } from "react";
import "../styles/AttendanceRecords.css";

const AttendanceRecords = () => {
  const [filters, setFilters] = useState({
    fromDate: "10/01/2023",
    toDate: "10/31/2023",
    department: "All Departments",
    status: "All Statuses",
    searchEmployee: "",
  });

  const [currentPage, setCurrentPage] = useState(1);

  const stats = [
    { icon: "✓", label: "Total Present", value: "1,204", color: "#d1fae5", iconColor: "#10b981" },
    { icon: "✕", label: "Total Absent", value: "58", color: "#fee2e2", iconColor: "#ef4444" },
    { icon: "🏆", label: "Total Half Days", value: "32", color: "#fef3c7", iconColor: "#f59e0b" },
    { icon: "📅", label: "Total on Leave", value: "112", color: "#e0e7ff", iconColor: "#6366f1" },
  ];

  const attendanceData = [
    {
      date: "Oct 26, 2023",
      employeeName: "Alex Johnson",
      department: "Engineering",
      checkIn: "09:05 AM",
      checkOut: "06:10 PM",
      totalHours: "9h 5m",
      status: "Present",
    },
    {
      date: "Oct 26, 2023",
      employeeName: "Maria Garcia",
      department: "Marketing",
      checkIn: "-",
      checkOut: "-",
      totalHours: "-",
      status: "Absent",
    },
    {
      date: "Oct 26, 2023",
      employeeName: "James Smith",
      department: "Sales",
      checkIn: "01:00 PM",
      checkOut: "05:30 PM",
      totalHours: "4h 30m",
      status: "Half Day",
    },
    {
      date: "Oct 26, 2023",
      employeeName: "David Miller",
      department: "Engineering",
      checkIn: "-",
      checkOut: "-",
      totalHours: "-",
      status: "On Leave",
    },
    {
      date: "Oct 25, 2023",
      employeeName: "Sarah Wilson",
      department: "Marketing",
      checkIn: "09:15 AM",
      checkOut: "06:00 PM",
      totalHours: "8h 45m",
      status: "Present",
    },
    {
      date: "Oct 25, 2023",
      employeeName: "Michael Brown",
      department: "Sales",
      checkIn: "08:50 AM",
      checkOut: "05:55 PM",
      totalHours: "9h 5m",
      status: "Present",
    },
  ];

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleReset = () => {
    setFilters({
      fromDate: "10/01/2023",
      toDate: "10/31/2023",
      department: "All Departments",
      status: "All Statuses",
      searchEmployee: "",
    });
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase().replace(" ", "-")) {
      case "present":
        return "status-present";
      case "absent":
        return "status-absent";
      case "half-day":
        return "status-halfday";
      case "on-leave":
        return "status-leave";
      default:
        return "";
    }
  };

  return (
    <div className="attendance-records-container">
      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="nav-left">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#00BCD4" />
              <path
                d="M16 8L20 12L16 16L12 12L16 8Z"
                fill="white"
                opacity="0.9"
              />
              <path
                d="M16 16L20 20L16 24L12 20L16 16Z"
                fill="white"
                opacity="0.7"
              />
            </svg>
            <span className="logo-text">HR Tracker</span>
          </div>
        </div>

        <div className="nav-center">
          <a href="/dashboard" className="nav-link">
            Dashboard
          </a>
          <a href="/attendance" className="nav-link active">
            Attendance
          </a>
          <a href="/leave" className="nav-link">
            Leave
          </a>
          <a href="/reports" className="nav-link">
            Reports
          </a>
        </div>

        <div className="nav-right">
          <button className="icon-btn">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
          <button className="icon-btn">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          </button>
          <div className="user-avatar">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
            >
              <circle cx="16" cy="16" r="16" fill="#F3E5D8" />
              <circle cx="16" cy="12" r="5" fill="#8B5A3C" />
              <path
                d="M6 28C6 22 10 19 16 19C22 19 26 22 26 28"
                fill="#8B5A3C"
              />
            </svg>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="attendance-main">
        <div className="attendance-header">
          <div>
            <h1 className="page-title">Attendance Records</h1>
            <p className="page-subtitle">
              View and manage employee attendance data for your organization.
            </p>
          </div>
          <button className="export-btn">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export Data
          </button>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <label>From Date</label>
            <div className="date-input">
              <input
                type="text"
                value={filters.fromDate}
                onChange={(e) => handleFilterChange("fromDate", e.target.value)}
              />
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
            </div>
          </div>

          <div className="filter-group">
            <label>To Date</label>
            <div className="date-input">
              <input
                type="text"
                value={filters.toDate}
                onChange={(e) => handleFilterChange("toDate", e.target.value)}
              />
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
            </div>
          </div>

          <div className="filter-group">
            <label>Department</label>
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange("department", e.target.value)}
            >
              <option>All Departments</option>
              <option>Engineering</option>
              <option>Marketing</option>
              <option>Sales</option>
              <option>HR</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option>All Statuses</option>
              <option>Present</option>
              <option>Absent</option>
              <option>Half Day</option>
              <option>On Leave</option>
            </select>
          </div>

          <div className="filter-group search-group">
            <label>Search Employee</label>
            <div className="search-input">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Enter name..."
                value={filters.searchEmployee}
                onChange={(e) =>
                  handleFilterChange("searchEmployee", e.target.value)
                }
              />
            </div>
          </div>

          <div className="filter-actions">
            <button className="reset-btn" onClick={handleReset}>
              Reset
            </button>
            <button className="apply-btn">Apply Filters</button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div
                className="stat-icon"
                style={{ backgroundColor: stat.color, color: stat.iconColor }}
              >
                {stat.icon}
              </div>
              <div className="stat-info">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Attendance Table */}
        <div className="table-container">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>DATE</th>
                <th>EMPLOYEE NAME</th>
                <th>DEPARTMENT</th>
                <th>CHECK-IN</th>
                <th>CHECK-OUT</th>
                <th>TOTAL HOURS</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((record, index) => (
                <tr key={index}>
                  <td>{record.date}</td>
                  <td className="employee-name">{record.employeeName}</td>
                  <td>{record.department}</td>
                  <td>{record.checkIn}</td>
                  <td>{record.checkOut}</td>
                  <td>{record.totalHours}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <div className="pagination-info">Showing 1-6 of 100</div>
          <div className="pagination-controls">
            <button className="pagination-btn" disabled>
              Previous
            </button>
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn">2</button>
            <button className="pagination-btn">3</button>
            <button className="pagination-btn">Next</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AttendanceRecords;
