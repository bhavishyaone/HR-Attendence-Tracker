import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../styles/MarkAttendance.css";

const MarkAttendance = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState("Late Arrival");
  const [manualStatus, setManualStatus] = useState("Present");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [attendanceId, setAttendanceId] = useState(null);
  const [userData, setUserData] = useState({
    name: "",
    id: "",
    department: "",
    avatar: "👤",
  });

  useEffect(() => {
    const fetchUserDataAndStatus = async () => {
      const token = localStorage.getItem("token");
      const employeeId = localStorage.getItem("employeeId");
      const name = localStorage.getItem("userName");
      const role = localStorage.getItem("userRole"); // Assuming role might be useful later

      if (!token || !employeeId) {
        // Handle not logged in
        return;
      }

      setUserData({
        name: name || "Employee",
        id: employeeId,
        department: "Engineering", // You might want to store department in localStorage too
        avatar: "👤",
      });

      try {
        const response = await axios.get(
          `http://localhost:3000/attendance/${employeeId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const todayStr = new Date().toISOString().split("T")[0];
        const todayRecord = response.data.find((record) =>
          record.date.startsWith(todayStr)
        );

        if (todayRecord) {
          setAttendanceId(todayRecord.id);
          setCheckInTime(new Date(todayRecord.checkInTime));
          if (todayRecord.checkOutTime) {
            setCheckOutTime(new Date(todayRecord.checkOutTime));
          }
        }
      } catch (error) {
        console.error("Error fetching attendance status:", error);
      }
    };

    fetchUserDataAndStatus();
  }, []);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const calculateHoursWorked = () => {
    if (!checkInTime || !checkOutTime) return "0h 0m";
    const diff = checkOutTime - checkInTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleCheckIn = async () => {
    try {
      const token = localStorage.getItem("token");
      const employeeId = localStorage.getItem("employeeId");

      const response = await axios.post(
        "http://localhost:3000/attendance/check-in",
        { employeeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const now = new Date();
      setCheckInTime(now);
      setAttendanceId(response.data.attendance.id);
      setSuccessMessage(`Checked in successfully at ${formatTime(now)}.`);
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("Check-in error:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to check in. Please try again."
      );
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const handleCheckOut = async () => {
    if (!checkInTime) {
      setErrorMessage("Please check in first before checking out.");
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/attendance/check-out",
        { id: attendanceId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const now = new Date();
      setCheckOutTime(now);
      setSuccessMessage(`Checked out successfully at ${formatTime(now)}.`);
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("Check-out error:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to check out. Please try again."
      );
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const getCreatedAt = () => {
    const now = new Date();
    return now.toISOString().slice(0, 19).replace("T", " ");
  };

  return (
    <div className="mark-attendance-container">
      <Sidebar />
      <div className="mark-attendance-content">
        <div className="attendance-header">
          <div>
            <h1 className="attendance-title">Mark Attendance</h1>
            <p className="attendance-subtitle">
              View and manage your daily attendance here.
            </p>
          </div>
        </div>

        <div className="current-time-section">
          <div className="time-display">{formatTime(currentTime)}</div>
          <div className="date-display">{formatDate(currentTime)}</div>
        </div>

        <div className="attendance-card">
          <div className="user-info-section">
            <div className="user-avatar">{userData.avatar}</div>
            <div className="user-details">
              <h2 className="user-name">{userData.name}</h2>
              <div className="user-meta">
                <span className="user-id">ID: {userData.id}</span>
                <span className="user-separator">•</span>
                <span className="user-department">{userData.department}</span>
              </div>
            </div>
          </div>

          <div className="check-buttons">
            <button
              className="check-in-btn"
              onClick={handleCheckIn}
              disabled={checkInTime !== null}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Check In
            </button>
            <button
              className="check-out-btn"
              onClick={handleCheckOut}
              disabled={checkOutTime !== null}
            >
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
              Check Out
            </button>
          </div>

          <div className="check-times">
            <div className="check-time-item">
              <div className="check-label">Checked In at:</div>
              <div className="check-value">
                {checkInTime ? formatTime(checkInTime) : "--:--"}
              </div>
            </div>
            <div className="check-time-item">
              <div className="check-label">Checked Out at:</div>
              <div className="check-value">
                {checkOutTime ? formatTime(checkOutTime) : "--:--"}
              </div>
            </div>
          </div>

          <div className="attendance-summary">
            <div className="summary-item">
              <div className="summary-label">Today's Status</div>
              <span className="status-badge late">{attendanceStatus}</span>
            </div>
            <div className="summary-item">
              <div className="summary-label">Total Hours Worked</div>
              <div className="summary-value">{calculateHoursWorked()}</div>
            </div>
          </div>

          <div className="manual-status-section">
            <label className="manual-status-label">
              Manual Attendance Status
            </label>
            <select
              className="manual-status-select"
              value={manualStatus}
              onChange={(e) => setManualStatus(e.target.value)}
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Half Day">Half Day</option>
              <option value="On Leave">On Leave</option>
              <option value="Work From Home">Work From Home</option>
            </select>
          </div>

          <div className="attendance-meta">
            <span className="meta-text">
              Created At: {getCreatedAt()} | Last Updated At: {getCreatedAt()}
            </span>
          </div>
        </div>

        {successMessage && (
          <div className="success-message">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="error-message">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkAttendance;
