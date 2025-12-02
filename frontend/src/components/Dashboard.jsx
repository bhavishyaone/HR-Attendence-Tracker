import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "User",
    role: "Employee",
  });

  useEffect(() => {
    const name = localStorage.getItem("userName");
    const role = localStorage.getItem("userRole");
    if (name) {
      setUserData({ name, role: role || "Employee" });
    }
  }, []);

  const [stats, setStats] = useState([
    { label: "Total Present Days", value: "0" },
    { label: "Total Absent Days", value: "0" },
    { label: "Pending Leaves", value: "0" },
    { label: "This Month's Hours", value: "0h" },
  ]);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [upcomingLeaves, setUpcomingLeaves] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const employeeId = localStorage.getItem("employeeId");
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        if (!employeeId) {
          alert("Please log out and log back in to load your dashboard data.");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        // Fetch Attendance
        const attendanceRes = await axios.get(
          `http://localhost:3000/attendance/${employeeId}`,
          { headers }
        );
        const attendanceRecords = attendanceRes.data;

        // Fetch Leaves
        const leavesRes = await axios.get(
          `http://localhost:3000/leaves/employee/${employeeId}`,
          { headers }
        );
        const leaveRecords = leavesRes.data.leave || [];

        // Calculate Stats
        const presentDays = attendanceRecords.filter(
          (r) => r.status === "PRESENT"
        ).length;
        const absentDays = attendanceRecords.filter(
          (r) => r.status === "ABSENT"
        ).length;
        const pendingLeaves = leaveRecords.filter(
          (l) => l.status === "PENDING"
        ).length;
        
        const currentMonth = new Date().getMonth();
        const totalHours = attendanceRecords
          .filter((r) => new Date(r.date).getMonth() === currentMonth)
          .reduce((acc, curr) => acc + Number(curr.totalHours || 0), 0);

        setStats([
          { label: "Total Present Days", value: presentDays.toString() },
          { label: "Total Absent Days", value: absentDays.toString() },
          { label: "Pending Leaves", value: pendingLeaves.toString() },
          { label: "This Month's Hours", value: `${Number(totalHours).toFixed(1)}h` },
        ]);

        // Format Recent Attendance (Last 5)
        const sortedAttendance = attendanceRecords
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5)
          .map((record) => ({
            date: new Date(record.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
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
        setRecentAttendance(sortedAttendance);

        // Format Upcoming Leaves
        const upcoming = leaveRecords
          .filter((l) => new Date(l.startDate) > new Date())
          .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
          .slice(0, 3)
          .map((leave) => ({
            type: leave.reason || "Leave", // Using reason as type for now
            date: `${new Date(leave.startDate).toLocaleDateString()} - ${new Date(
              leave.endDate
            ).toLocaleDateString()}`,
            icon: "📅",
            color: "#E0F7FA",
            badge: leave.status,
          }));
        setUpcomingLeaves(upcoming);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "present":
        return "status-present";
      case "absent":
        return "status-absent";
      case "half-day":
        return "status-halfday";
      case "holiday":
        return "status-holiday";
      default:
        return "";
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo-container">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="40" height="40" rx="8" fill="#00BCD4" />
              <path d="M20 10L28 15V25L20 30L12 25V15L20 10Z" fill="white" />
            </svg>
          </div>
          <h1 className="dashboard-title">Attendance Dashboard</h1>
        </div>
        <div className="header-right">
          <span className="user-name">{userData.name} </span>
          <span className="user-role">{userData.role}</span>
          <div className="user-avatar">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="20" cy="20" r="20" fill="#F5A962" />
              <circle cx="20" cy="16" r="6" fill="#8B5A3C" />
              <path
                d="M10 32C10 25 14 22 20 22C26 22 30 25 30 32"
                fill="#8B5A3C"
              />
            </svg>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Welcome Section */}
        <section className="welcome-section">
          <div className="welcome-text">
            <h2 className="welcome-title">Welcome back, {userData.name}!</h2>
            <p className="welcome-subtitle">
              Here is your attendance summary for this month.
            </p>
          </div>
          <div className="action-buttons">
            <button className="btn-primary" onClick={() => navigate("/mark-attendance")}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
              </svg>
              Mark Attendance
            </button>
            <button className="btn-secondary" onClick={() => navigate("/leave-application")}>
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
              Apply for Leave
            </button>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="stats-section">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <p className="stat-label">{stat.label}</p>
              <h3 className="stat-value">{stat.value}</h3>
            </div>
          ))}
        </section>

        {/* Content Grid */}
        <div className="content-grid">
          {/* Recent Attendance */}
          <section className="attendance-section">
            <h3 className="section-title">Recent Attendance</h3>
            <div className="attendance-table-container">
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>DATE</th>
                    <th>CHECK-IN</th>
                    <th>CHECK-OUT</th>
                    <th>TOTAL HOURS</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAttendance.map((record, index) => (
                    <tr key={index}>
                      <td className="date-cell">{record.date}</td>
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
            {/* <button className="view-all-btn">View All Activity</button> */}
          </section>

          {/* Upcoming Leaves */}
          <section className="leaves-section">
            <h3 className="section-title">Upcoming Leaves</h3>
            <div className="leaves-list">
              {upcomingLeaves.map((leave, index) => (
                <div key={index} className="leave-item">
                  <div
                    className="leave-icon"
                    style={{ backgroundColor: leave.color }}
                  >
                    {leave.icon}
                  </div>
                  <div className="leave-details">
                    <div className="leave-header">
                      <h4 className="leave-type">{leave.type}</h4>
                      {leave.badge && (
                        <span className="leave-badge">{leave.badge}</span>
                      )}
                    </div>
                    <p className="leave-date">{leave.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
