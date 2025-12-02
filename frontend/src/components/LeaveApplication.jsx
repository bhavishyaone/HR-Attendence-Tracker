import { useState } from "react";
import "../styles/LeaveApplication.css";

const LeaveApplication = () => {
  const [startDate, setStartDate] = useState("12/05/2023");
  const [endDate, setEndDate] = useState("12/09/2023");
  const [reason, setReason] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(11); // December (0-indexed)
  const [selectedYear, setSelectedYear] = useState(2023);

  const leaveRequests = [
    {
      startDate: "Nov 20, 2023",
      endDate: "Nov 21, 2023",
      days: 2,
      reason: "Family vacation to the mountains...",
      appliedOn: "Nov 1, 2023",
      status: "Approved",
    },
    {
      startDate: "Oct 10, 2023",
      endDate: "Oct 10, 2023",
      days: 1,
      reason: "Personal appointment",
      appliedOn: "Oct 2, 2023",
      status: "Rejected",
    },
    {
      startDate: "Sep 05, 2023",
      endDate: "Sep 07, 2023",
      days: 3,
      reason: "Feeling unwell, sick leave.",
      appliedOn: "Sep 4, 2023",
      status: "Pending",
    },
  ];

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = day >= 5 && day <= 9; // Highlight selected range (5-9)
      days.push(
        <div
          key={day}
          className={`calendar-day ${isSelected ? "selected" : ""}`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Leave application submitted:", {
      startDate,
      endDate,
      reason,
    });
    // Add API call here
  };

  const handleCancel = (index) => {
    console.log("Cancelling leave request:", index);
    // Add API call here
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "status-approved";
      case "rejected":
        return "status-rejected";
      case "pending":
        return "status-pending";
      default:
        return "";
    }
  };

  return (
    <div className="leave-application-container">
      {/* Sidebar */}
      <aside className="leave-sidebar">
        <div className="sidebar-header">
          <div className="user-profile">
            <div className="user-avatar">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
              >
                <circle cx="20" cy="20" r="20" fill="#F3E5D8" />
                <circle cx="20" cy="16" r="6" fill="#8B5A3C" />
                <path
                  d="M10 32C10 25 14 22 20 22C26 22 30 25 30 32"
                  fill="#8B5A3C"
                />
              </svg>
            </div>
            <div className="user-info">
              <h3>Alex Doe</h3>
              <p>Software Engineer</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a href="/dashboard" className="nav-item">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <span>Dashboard</span>
          </a>
          <a href="/attendance" className="nav-item">
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
            <span>My Attendance</span>
          </a>
          <a href="/leave-application" className="nav-item active">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span>Leave Application</span>
          </a>
          <a href="/team" className="nav-item">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>Team</span>
          </a>
          <a href="/settings" className="nav-item">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" />
            </svg>
            <span>Settings</span>
          </a>
        </nav>

        <button className="logout-btn">
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
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="leave-main-content">
        <h1 className="page-title">Apply for Leave</h1>

        {/* Stats Cards */}
        <div className="leave-stats">
          <div className="stat-card">
            <p className="stat-label">Total Days Selected</p>
            <h2 className="stat-value">5</h2>
          </div>
          <div className="stat-card">
            <p className="stat-label">Remaining Leave Balance</p>
            <h2 className="stat-value">12 Days</h2>
          </div>
        </div>

        {/* Leave Request Form */}
        <div className="leave-form-section">
          <h2 className="section-title">New Leave Request</h2>

          <form onSubmit={handleSubmit} className="leave-form">
            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="text"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="12/05/2023"
                />
              </div>

              <div className="form-group">
                <label>End Date</label>
                <input
                  type="text"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="12/09/2023"
                />
              </div>

              {/* Calendar */}
              <div className="calendar-widget">
                <div className="calendar-header">
                  <button
                    type="button"
                    onClick={handlePreviousMonth}
                    className="calendar-nav"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  <span className="calendar-title">
                    {monthNames[selectedMonth]} {selectedYear}
                  </span>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="calendar-nav"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>

                <div className="calendar-weekdays">
                  <div className="weekday">S</div>
                  <div className="weekday">M</div>
                  <div className="weekday">T</div>
                  <div className="weekday">W</div>
                  <div className="weekday">T</div>
                  <div className="weekday">F</div>
                  <div className="weekday">S</div>
                </div>

                <div className="calendar-days">{renderCalendar()}</div>
              </div>
            </div>

            <div className="form-group">
              <label>Reason for Leave</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please provide a reason for your leave request..."
                rows="5"
              />
            </div>

            <button type="submit" className="submit-btn">
              Submit Application
            </button>
          </form>
        </div>

        {/* Leave Requests Table */}
        <div className="leave-requests-section">
          <h2 className="section-title">My Leave Requests</h2>

          <div className="table-container">
            <table className="leave-table">
              <thead>
                <tr>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((request, index) => (
                  <tr key={index}>
                    <td>{request.startDate}</td>
                    <td>{request.endDate}</td>
                    <td>{request.days}</td>
                    <td className="reason-cell">{request.reason}</td>
                    <td>{request.appliedOn}</td>
                    <td>
                      <span
                        className={`status-badge ${getStatusClass(
                          request.status
                        )}`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td>
                      {request.status === "Pending" && (
                        <button
                          className="cancel-btn"
                          onClick={() => handleCancel(index)}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LeaveApplication;
