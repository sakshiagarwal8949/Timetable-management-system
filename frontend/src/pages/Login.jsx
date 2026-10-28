import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Invalid email or password.");
        return;
      }

      const token = data.token;
      const role = data.role || data.data?.role;
      const userName = data.name || data.data?.name || role;

      if (!token || !role) {
        setMessage("Login response is missing token or role.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userName", userName);

      navigate("/dashboard");
    } catch {
      setMessage("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (userEmail, userPass) => {
    setEmail(userEmail);
    setPassword(userPass);
    setMessage("");
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Sign in to Timetable Management System</p>
        </div>

        {message && (
          <div className="alert alert-error">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@gmail.com"
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? (
              <span className="spinner-wrap">
                <span className="spinner" /> Logging in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="auth-quick-fill">
          <p className="quick-title">Quick Demo Login:</p>
          <div className="quick-chips">
            <button
              type="button"
              className="chip"
              onClick={() => fillCredentials("admin@gmail.com", "admin")}
            >
              👑 Admin
            </button>
            <button
              type="button"
              className="chip"
              onClick={() => fillCredentials("faculty@gmail.com", "faculty123")}
            >
              👨‍🏫 Faculty
            </button>
            <button
              type="button"
              className="chip"
              onClick={() => fillCredentials("sakshi@gmail.com", "sakshi123")}
            >
              🎓 Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
