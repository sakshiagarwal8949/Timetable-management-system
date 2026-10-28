import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { API } from "../api";

function Dashboard() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role") || "Student";
  const userName = localStorage.getItem("userName") || role;

  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [searchTerm, setSearchTerm] = useState("");
  const [dayFilter, setDayFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/timetable`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.status === 401) {
        localStorage.clear();
        navigate("/login");
        return;
      }

      if (!response.ok) {
        setMessage(data.message || "Unable to load timetable.");
        setMessageType("error");
        return;
      }

      setTimetable(Array.isArray(data) ? data : []);
    } catch {
      setMessage("Unable to connect to the server.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this class schedule?")) {
      return;
    }

    try {
      const response = await fetch(`${API}/timetable/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to delete schedule.");
        setMessageType("error");
        return;
      }

      setMessage("Class schedule deleted successfully.");
      setMessageType("success");
      await fetchTimetable();
    } catch {
      setMessage("Unable to connect to the server.");
      setMessageType("error");
    }
  };

  const handleEdit = (item) => {
    navigate("/manage-timetable", { state: { editItem: item } });
  };

  // Filter & Search
  const filteredTimetable = timetable.filter((item) => {
    const matchesSearch =
      item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.faculty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.branch && item.branch.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.room && item.room.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDay = dayFilter === "all" || item.day === dayFilter;

    return matchesSearch && matchesDay;
  });

  const sortedTimetable = [...filteredTimetable].sort((a, b) => {
    if (sortOrder === "default") return 0;
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === "ascending" ? dateA - dateB : dateB - dateA;
  });

  const todayStr = new Date().toISOString().split("T")[0];
  const todayClassesCount = timetable.filter((c) => c.date === todayStr).length;

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        {/* Hero Banner */}
        <section className="hero-banner">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="pulse-dot" /> Live Schedule Overview
            </div>
            <h1>Welcome back, {userName}!</h1>
            <p>
              {role === "Admin"
                ? "Full management access to college schedules, faculty assignments, and rooms."
                : role === "Faculty"
                  ? "Here are all the lectures assigned to you across branches and sections."
                  : "Here is your branch & section class schedule."}
            </p>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-num">{timetable.length}</div>
              <div className="stat-label">Total Classes</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{todayClassesCount}</div>
              <div className="stat-label">Classes Today</div>
            </div>
          </div>
        </section>

        {/* Admin Quick Actions */}
        {role === "Admin" && (
          <section className="quick-actions-section">
            <h2 className="section-title">Admin Quick Actions</h2>
            <div className="action-cards-grid">
              <div
                className="action-card"
                onClick={() => navigate("/manage-timetable")}
              >
                <div className="action-icon icon-indigo">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
                <div className="action-info">
                  <h3>Manage Timetable</h3>
                  <p>Add new classes, update timing, or resolve room conflicts</p>
                </div>
              </div>

              <div
                className="action-card"
                onClick={() => navigate("/create-faculty")}
              >
                <div className="action-icon icon-emerald">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="19" y2="14" />
                    <line x1="22" y1="11" x2="16" y2="11" />
                  </svg>
                </div>
                <div className="action-info">
                  <h3>Create Faculty</h3>
                  <p>Register new professor and instructor portal accounts</p>
                </div>
              </div>

              <div
                className="action-card"
                onClick={() => navigate("/create-student")}
              >
                <div className="action-icon icon-sky">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                </div>
                <div className="action-info">
                  <h3>Create Student</h3>
                  <p>Register student accounts with branch & section assignment</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {message && (
          <div
            className={`alert ${messageType === "success" ? "alert-success" : "alert-error"}`}
          >
            <span>{message}</span>
            <button
              className="alert-close"
              onClick={() => setMessage("")}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        )}

        {/* Timetable Table Card */}
        <section className="card table-card">
          <div className="table-card-header">
            <div>
              <h2 className="card-title">Class Timetable</h2>
              <p className="card-subtitle">
                {filteredTimetable.length} lecture
                {filteredTimetable.length === 1 ? "" : "s"} found
              </p>
            </div>

            <div className="table-controls">
              <div className="search-box">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search subject, faculty, room..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="clear-search"
                    onClick={() => setSearchTerm("")}
                  >
                    ×
                  </button>
                )}
              </div>

              <select
                className="select-input"
                value={dayFilter}
                onChange={(e) => setDayFilter(e.target.value)}
              >
                <option value="all">All Days</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
              </select>

              <select
                className="select-input"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="default">Default Sort</option>
                <option value="ascending">Date (Oldest First)</option>
                <option value="descending">Date (Newest First)</option>
              </select>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Time Slot</th>
                  <th>Subject</th>
                  <th>Faculty</th>
                  <th>Branch / Sec</th>
                  <th>Room</th>
                  {role === "Admin" && <th className="text-right">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={role === "Admin" ? 8 : 7}
                      className="text-center py-8"
                    >
                      <div className="loading-state">
                        <span className="spinner" /> Loading schedule records...
                      </div>
                    </td>
                  </tr>
                ) : sortedTimetable.length === 0 ? (
                  <tr>
                    <td
                      colSpan={role === "Admin" ? 8 : 7}
                      className="text-center py-8"
                    >
                      <div className="empty-state">
                        <div className="empty-icon">📅</div>
                        <h3>No classes found</h3>
                        <p>
                          {searchTerm || dayFilter !== "all"
                            ? "Try clearing your search query or day filters."
                            : "There are currently no classes scheduled."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedTimetable.map((item) => (
                    <tr key={item._id}>
                      <td className="font-medium">{item.date}</td>
                      <td>
                        <span className="badge badge-day">{item.day}</span>
                      </td>
                      <td>
                        <span className="time-tag">{item.time}</span>
                      </td>
                      <td className="font-semibold text-primary">
                        {item.subject}
                      </td>
                      <td>
                        <div className="faculty-cell">
                          <div className="avatar-circle">
                            {item.faculty?.charAt(0).toUpperCase() || "F"}
                          </div>
                          <span>{item.faculty}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-branch">
                          {item.branch || "-"}
                        </span>
                        {item.section && (
                          <span className="badge badge-section ml-1">
                            Sec {item.section}
                          </span>
                        )}
                      </td>
                      <td>
                        <span className="badge badge-room">📍 {item.room}</span>
                      </td>
                      {role === "Admin" && (
                        <td className="text-right">
                          <div className="action-buttons-group">
                            <button
                              className="btn-action btn-edit"
                              onClick={() => handleEdit(item)}
                              title="Edit Class Schedule"
                            >
                              Edit
                            </button>
                            <button
                              className="btn-action btn-delete"
                              onClick={() => handleDelete(item._id)}
                              title="Delete Class Schedule"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
