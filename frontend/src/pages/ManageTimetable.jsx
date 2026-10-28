import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { API } from "../api";

function ManageTimetable() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const [timetable, setTimetable] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("default");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState("");

  const [date, setDate] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [subject, setSubject] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [branch, setBranch] = useState("");
  const [section, setSection] = useState("");
  const [room, setRoom] = useState("");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchTimetable();
    fetchFaculty();

    // Check if redirected with an item to edit
    if (location.state?.editItem) {
      populateEdit(location.state.editItem);
    }
  }, []);

  const fetchTimetable = async () => {
    setTableLoading(true);
    try {
      const response = await fetch(`${API}/timetable`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

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
      setTableLoading(false);
    }
  };

  const fetchFaculty = async () => {
    try {
      const response = await fetch(`${API}/faculty`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (response.ok) {
        setFacultyList(Array.isArray(data) ? data : []);
      } else {
        setMessage(data.message || "Unable to load faculty list.");
        setMessageType("error");
      }
    } catch {
      setMessage("Unable to load faculty list.");
      setMessageType("error");
    }
  };

  const populateEdit = (item) => {
    setEditingId(item._id);
    setDate(item.date);
    setDay(item.day);
    setTime(item.time);
    setSubject(item.subject);
    setFacultyId(item.facultyId || "");
    setBranch(item.branch || "");
    setSection(item.section || "");
    setRoom(item.room || "");
    setMessage(`Editing timetable for "${item.subject}"`);
    setMessageType("info");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setDate("");
    setDay("");
    setTime("");
    setSubject("");
    setFacultyId("");
    setBranch("");
    setSection("");
    setRoom("");
    setEditingId("");
    setMessage("");
  };

  const handleDateChange = (value) => {
    setDate(value);
    if (value) {
      const selectedDate = new Date(`${value}T12:00:00`);
      setDay(
        selectedDate.toLocaleDateString("en-US", {
          weekday: "long",
        }),
      );
    } else {
      setDay("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (
      !date ||
      !time ||
      !subject.trim() ||
      !facultyId ||
      !branch ||
      !section ||
      !room.trim()
    ) {
      setMessage("Please fill in all fields.");
      setMessageType("error");
      return;
    }

    const selectedDate = new Date(`${date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setMessage("Past dates are not allowed.");
      setMessageType("error");
      return;
    }

    if (day === "Sunday") {
      setMessage("Classes cannot be scheduled on Sunday.");
      setMessageType("error");
      return;
    }

    const selectedFaculty = facultyList.find((item) => item._id === facultyId);

    if (!selectedFaculty) {
      setMessage("Please select a valid faculty.");
      setMessageType("error");
      return;
    }

    const payload = {
      date,
      day,
      time: time.trim(),
      subject: subject.trim(),
      faculty: selectedFaculty.name,
      facultyId,
      branch,
      section,
      room: room.trim(),
    };

    setLoading(true);

    try {
      const url = editingId
        ? `${API}/timetable/${editingId}`
        : `${API}/timetable`;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to save timetable.");
        setMessageType("error");
        return;
      }

      setMessage(
        editingId
          ? "Timetable schedule updated successfully."
          : "New class scheduled successfully.",
      );
      setMessageType("success");
      resetForm();
      await fetchTimetable();
    } catch {
      setMessage("Unable to connect to the server.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this class?")) {
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

  const filteredTimetable = timetable.filter(
    (item) =>
      item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.faculty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.branch && item.branch.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.room && item.room.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const sortedTimetable = [...filteredTimetable].sort((a, b) => {
    if (sortOrder === "default") return 0;
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === "ascending" ? dateA - dateB : dateB - dateA;
  });

  const timeSlotsPreset = [
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:15 AM - 12:15 PM",
    "01:00 PM - 02:00 PM",
    "02:00 PM - 03:00 PM",
    "03:15 PM - 04:15 PM",
  ];

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Manage Timetable</h1>
            <p className="page-subtitle">
              Add new classes, update schedules, and manage lecture allocations
            </p>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>

        {message && (
          <div
            className={`alert ${
              messageType === "success"
                ? "alert-success"
                : messageType === "error"
                  ? "alert-error"
                  : "alert-info"
            }`}
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

        {/* Form Card */}
        <div className="card">
          <div className="card-header-flex">
            <div>
              <h2 className="card-title">
                {editingId ? "Update Class Schedule" : "Add New Class"}
              </h2>
              <p className="card-subtitle">
                Fill details below. Conflict checking ensures no overlapping
                faculty or rooms.
              </p>
            </div>
            {editingId && (
              <span className="badge badge-warning">Editing Schedule</span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="form-layout">
            <div className="form-grid-3">
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  value={date}
                  min={new Date().toLocaleDateString("en-CA")}
                  onChange={(e) => handleDateChange(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Day (Auto)</label>
                <input
                  value={day || "Select date first"}
                  readOnly
                  className="input-readonly"
                />
              </div>

              <div className="form-group">
                <label>Time Slot *</label>
                <input
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 09:00 AM - 10:00 AM"
                  required
                />
              </div>
            </div>

            {/* Quick time slot selector */}
            <div className="quick-slot-wrap">
              <span className="quick-slot-label">Quick Slots:</span>
              <div className="quick-slots">
                {timeSlotsPreset.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    className={`slot-chip ${time === slot ? "active" : ""}`}
                    onClick={() => setTime(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label>Subject Name *</label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Operating Systems"
                  required
                />
              </div>

              <div className="form-group">
                <label>Assigned Faculty *</label>
                <select
                  value={facultyId}
                  onChange={(e) => setFacultyId(e.target.value)}
                  required
                >
                  <option value="">-- Select Faculty --</option>
                  {facultyList.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name} ({item.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Room Number *</label>
                <input
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="e.g. Lab 3 / Room 204"
                  required
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Branch *</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  required
                >
                  <option value="">-- Select Branch --</option>
                  <option value="CSE">CSE (Computer Science)</option>
                  <option value="IT">IT (Information Technology)</option>
                  <option value="ECE">ECE (Electronics & Comm)</option>
                  <option value="ME">ME (Mechanical)</option>
                  <option value="CE">CE (Civil)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Section *</label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  required
                >
                  <option value="">-- Select Section --</option>
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                  <option value="D">Section D</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : editingId
                    ? "✓ Update Schedule"
                    : "+ Add Class Schedule"}
              </button>

              {editingId ? (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Cancel Edit
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Reset Form
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Existing Records Table */}
        <div className="card table-card">
          <div className="table-card-header">
            <div>
              <h2 className="card-title">All Timetable Records</h2>
              <p className="card-subtitle">
                {filteredTimetable.length} record
                {filteredTimetable.length === 1 ? "" : "s"} scheduled in total
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
              </div>

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
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tableLoading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8">
                      <div className="loading-state">
                        <span className="spinner" /> Loading timetable...
                      </div>
                    </td>
                  </tr>
                ) : sortedTimetable.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8">
                      <div className="empty-state">
                        <div className="empty-icon">📅</div>
                        <h3>No classes found</h3>
                        <p>Use the form above to schedule your first class.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedTimetable.map((item) => (
                    <tr
                      key={item._id}
                      className={editingId === item._id ? "row-highlight" : ""}
                    >
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
                      <td className="text-right">
                        <div className="action-buttons-group">
                          <button
                            type="button"
                            className="btn-action btn-edit"
                            onClick={() => populateEdit(item)}
                            title="Edit this record"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn-action btn-delete"
                            onClick={() => handleDelete(item._id)}
                            title="Delete this record"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ManageTimetable;
