import { useState, useEffect } from "react";
import axios from "axios";
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

  const [attendanceData, setAttendanceData] = useState([]);

  // Calculate stats dynamically
  const totalPresent = attendanceData.filter((r) => r.status === "Present").length;
  const totalAbsent = attendanceData.filter((r) => r.status === "Absent").length;
  const totalHalfDays = attendanceData.filter((r) => r.status === "Half Day").length;
  const totalLeaves = attendanceData.filter((r) => r.status === "On Leave").length;

  const stats = [
    {
      icon: "✓",
      label: "Total Present",
      value: totalPresent,
      color: "#d1fae5",
      iconColor: "#10b981",
    },
    {
      icon: "✕",
      label: "Total Absent",
      value: totalAbsent,
      color: "#fee2e2",
      iconColor: "#ef4444",
    },
    {
      icon: "🏆",
      label: "Total Half Days",
      value: totalHalfDays,
      color: "#fef3c7",
      iconColor: "#f59e0b",
    },
    {
      icon: "📅",
      label: "Total on Leave",
      value: totalLeaves,
      color: "#e0e7ff",
      iconColor: "#6366f1",
    },
  ];

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/attendance`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const formattedData = response.data.map((record) => ({
          date: new Date(record.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          employeeName: record.employee.name,
          department: record.employee.department?.name || "N/A",
          checkIn: record.checkInTime
            ? new Date(record.checkInTime).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-",
          checkOut: record.checkOutTime
            ? new Date(record.checkOutTime).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-",
          totalHours: record.totalHours ? `${record.totalHours}h` : "-",
          status: record.status.charAt(0) + record.status.slice(1).toLowerCase(),
        }));
        setAttendanceData(formattedData);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };

    fetchAttendance();
  }, []);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(attendanceData.length / itemsPerPage);
  const currentData = attendanceData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
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
          {/* <button className="export-btn">
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
          </button> */}
        </div>

        {/* Filters */}

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
              {currentData.map((record, index) => (
                <tr key={index}>
                  <td>{record.date}</td>
                  <td className="employee-name">{record.employeeName}</td>
                  <td>{record.department}</td>
                  <td>{record.checkIn}</td>
                  <td>{record.checkOut}</td>
                  <td>{record.totalHours}</td>
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

        {/* Pagination */}
        <div className="pagination">
          <div className="pagination-info">
            Showing {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, attendanceData.length)} of{" "}
            {attendanceData.length}
          </div>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination-btn ${
                  currentPage === page ? "active" : ""
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AttendanceRecords;
