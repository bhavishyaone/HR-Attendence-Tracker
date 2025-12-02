import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.css";
import AttendanceRecords from "./components/AttendanceRecords.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Departments from "./components/DepartmentProfile.jsx";
import LeaveApplication from "./components/LeaveApplication.jsx";
import Login from "./components/Login.jsx";
import MarkAttendance from "./components/MarkAttendance.jsx";
import Register from "./components/Register.jsx";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/mark-attendance" element={<MarkAttendance />} />
          <Route path="/attendance" element={<AttendanceRecords />} />
          <Route path="/leave-application" element={<LeaveApplication />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
