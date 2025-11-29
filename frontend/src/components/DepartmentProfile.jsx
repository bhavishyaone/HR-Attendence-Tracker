import { useState } from "react";
import Sidebar from "./Sidebar";
import "../styles/DepartmentProfile.css";
const Departments = () => {
  const [departments, setDepartments] = useState([
    {
      id: 1,
      name: "Engineering",
      description: "Responsible for product development and innov...",
      fullDescription: "Responsible for product development and innovation",
      employees: 42,
    },
    {
      id: 2,
      name: "Marketing",
      description: "Manages brand promotion and customer outrea...",
      fullDescription: "Manages brand promotion and customer outreach",
      employees: 15,
    },
    {
      id: 3,
      name: "Human Resources",
      description: "Oversees employee relations and company cult...",
      fullDescription: "Oversees employee relations and company culture",
      employees: 8,
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const handleAddDepartment = () => {
    setEditingDept(null);
    setFormData({ name: "", description: "" });
    setShowModal(true);
  };
  const handleEditDepartment = (dept) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      description: dept.fullDescription,
    });
    setShowModal(true);
  };
  const handleDeleteDepartment = (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      setDepartments(departments.filter((dept) => dept.id !== id));
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingDept) {
      // Update existing department
      setDepartments(
        departments.map((dept) =>
          dept.id === editingDept.id
            ? {
                ...dept,
                name: formData.name,
                description:
                  formData.description.length > 45
                    ? formData.description.substring(0, 42) + "..."
                    : formData.description,
                fullDescription: formData.description,
              }
            : dept
        )
      );
    } else {
      // Add new department
      const newDept = {
        id: departments.length + 1,
        name: formData.name,
        description:
          formData.description.length > 45
            ? formData.description.substring(0, 42) + "..."
            : formData.description,
        fullDescription: formData.description,
        employees: 0,
      };
      setDepartments([...departments, newDept]);
    }
    setShowModal(false);
    setFormData({ name: "", description: "" });
  };
  return (
    <div className="departments-container">
      <Sidebar />
      <div className="departments-content">
        <div className="departments-header">
          <div>
            <h1 className="departments-title">Departments</h1>
            <p className="departments-subtitle">
              Manage all company departments.
            </p>
          </div>
          <button className="add-department-btn" onClick={handleAddDepartment}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Department
          </button>
        </div>
        <div className="departments-table-container">
          <table className="departments-table">
            <thead>
              <tr>
                <th>DEPARTMENT NAME</th>
                <th>DESCRIPTION</th>
                <th>EMPLOYEES</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr key={dept.id}>
                  <td className="dept-name">{dept.name}</td>
                  <td className="dept-description">{dept.description}</td>
                  <td>
                    <span className="employee-count">{dept.employees}</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEditDepartment(dept)}
                        title="Edit"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteDepartment(dept.id)}
                        title="Delete"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingDept ? "Edit Department" : "Add Department"}</h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Department Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter department name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter department description"
                  rows="4"
                  required
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingDept ? "Update" : "Add"} Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Departments;