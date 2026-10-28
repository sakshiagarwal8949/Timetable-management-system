import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { API } from "../api";

function CreateFaculty() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/faculty`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to create faculty account.");
        setMessageType("error");
        return;
      }

      setMessage("Faculty account created successfully!");
      setMessageType("success");
      setName("");
      setEmail("");
      setPassword("");
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
            <h1 className="page-title">Register Faculty</h1>
            <p className="page-subtitle">
              Create portal accounts for professors and teaching faculty
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
              <div className="icon-badge icon-emerald">
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
              <div>
                <h2 className="card-title">New Faculty Account</h2>
                <p className="card-subtitle">
                  Faculty will be able to log in and view their assigned lectures.
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
                <label>Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Kumar"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rajesh@college.edu"
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

              <div className="form-actions pt-4">
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-wrap">
                      <span className="spinner" /> Creating Account...
                    </span>
                  ) : (
                    "+ Create Faculty Account"
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

export default CreateFaculty;
