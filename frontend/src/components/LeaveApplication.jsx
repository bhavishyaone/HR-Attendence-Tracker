import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/LeaveApplication.css";

const LeaveApplication = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const navigate = useNavigate();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaveBalance, setLeaveBalance] = useState(0);
  const TOTAL_ANNUAL_LEAVES = 20; // Default annual leave allowance

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem("token");
      const employeeId = localStorage.getItem("employeeId");
      if (!token || !employeeId) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/leaves/employee/${employeeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // The backend returns { message, leave: [...] }
      const leaves = response.data.leave || [];
      
      const formattedLeaves = leaves.map((leave) => ({
        id: leave.id,
        startDate: new Date(leave.startDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        endDate: new Date(leave.endDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        days: Math.ceil(
          (new Date(leave.endDate) - new Date(leave.startDate)) /
            (1000 * 60 * 60 * 24)
        ) + 1,
        reason: leave.reason,
        appliedOn: new Date(leave.createdAt || Date.now()).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        status: leave.status.charAt(0) + leave.status.slice(1).toLowerCase(),
      }));

      setLeaveRequests(formattedLeaves);
      
      // Calculate leave balance (approved + pending leaves for current year)
      const currentYear = new Date().getFullYear();
      const usedLeaves = leaves
        .filter(leave => {
          const leaveYear = new Date(leave.startDate).getFullYear();
          return leaveYear === currentYear && (leave.status === 'APPROVED' || leave.status === 'PENDING');
        })
        .reduce((total, leave) => {
          const days = Math.ceil(
            (new Date(leave.endDate) - new Date(leave.startDate)) /
              (1000 * 60 * 60 * 24)
          ) + 1;
          return total + days;
        }, 0);
      
      setLeaveBalance(TOTAL_ANNUAL_LEAVES - usedLeaves);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leaves:", error);
      setLoading(false);
    }
  };

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

  const isDateInRange = (day, month, year) => {
    if (!startDate || !endDate) return false;
    
    const currentDateObj = new Date(year, month, day);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return currentDateObj >= start && currentDateObj <= end;
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
      const isSelected = isDateInRange(day, selectedMonth, selectedYear);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const employeeId = localStorage.getItem("employeeId");
      
      await axios.post(
        `${import.meta.env.VITE_API_URL}/leaves/apply`,
        {
          employeeId,
          startDate,
          endDate,
          reason,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Leave application submitted successfully!");
      setReason("");
      fetchLeaves(); // Refresh the list
    } catch (error) {
      console.error("Error submitting leave:", error);
      alert("Failed to submit leave application.");
    }
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
      <Sidebar />

      {/* Main Content */}
      <main className="leave-main-content">
        <h1 className="page-title">Apply for Leave</h1>

        {/* Stats Cards */}
        <div className="leave-stats">
          <div className="stat-card">
            <p className="stat-label">Total Days Selected</p>
            <h2 className="stat-value">
              {startDate && endDate
                ? Math.ceil(
                    (new Date(endDate) - new Date(startDate)) /
                      (1000 * 60 * 60 * 24)
                  ) + 1
                : 0}
            </h2>
          </div>
          <div className="stat-card">
            <p className="stat-label">Remaining Leave Balance</p>
            <h2 className="stat-value">{leaveBalance} Days</h2>
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
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  required
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
