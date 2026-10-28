import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo" style={{ background: "#fef3c7", color: "#d97706" }}>
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
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2>Registration Disabled</h2>
          <p className="auth-subtitle">
            Student and Faculty accounts are provisioned exclusively by the System Administrator.
          </p>
        </div>

        <div className="alert alert-info">
          <span>
            If you are a student or faculty member and need an account, please reach out to your college department administrator.
          </span>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={() => navigate("/login")}
        >
          Return to Sign In
        </button>
      </div>
    </div>
  );
}

export default Register;
