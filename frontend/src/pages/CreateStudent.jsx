import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { API } from "../api";

function CreateStudent() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [branch, setBranch] = useState("");
  const [section, setSection] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/student`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          branch,
          section,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to create student account.");
        setMessageType("error");
        return;
      }

      setMessage("Student account created successfully!");
      setMessageType("success");
      setName("");
      setEmail("");
      setPassword("");
      setBranch("");
      setSection("");
    } catch {
      setMessage("Server connection failed. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Register Student</h1>
            <p className="page-subtitle">
              Provision student access filtered by their enrolled branch & section
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

        <div className="form-page-container">
          <div className="card form-narrow-card">
            <div className="card-header-icon">
              <div className="icon-badge icon-sky">
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
              <div>
                <h2 className="card-title">New Student Account</h2>
                <p className="card-subtitle">
                  Student will only see lectures corresponding to their branch and section.
                </p>
              </div>
            </div>

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

            <form onSubmit={handleSubmit} className="form-layout">
              <div className="form-group">
                <label>Student Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sakshi Sharma"
                  required
                />
              </div>

              <div className="form-group">
                <label>Student Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. sakshi@student.college.edu"
                  required
                />
              </div>

              <div className="form-group">
                <label>Account Password *</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  minLength={6}
                  required
                />
                <span className="field-hint">
                  Must be at least 6 characters long.
                </span>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Branch *</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    required
                  >
                    <option value="">Select Branch</option>
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="ME">ME</option>
                    <option value="CE">CE</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Section *</label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    required
                  >
                    <option value="">Select Section</option>
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                    <option value="D">Section D</option>
                  </select>
                </div>
              </div>

              <div className="form-actions pt-4">
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-wrap">
                      <span className="spinner" /> Creating Student...
                    </span>
                  ) : (
                    "+ Create Student Account"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateStudent;
