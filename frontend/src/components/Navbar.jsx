import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "User";
  const userName = localStorage.getItem("userName") || role;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const getRoleBadgeClass = () => {
    if (role === "Admin") return "role-badge role-admin";
    if (role === "Faculty") return "role-badge role-faculty";
    return "role-badge role-student";
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => navigate("/dashboard")}>
          <div className="brand-icon">
            <svg
              width="22"
              height="22"
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
          <div className="brand-text">
            <span className="brand-title">Timetable Portal</span>
          </div>
        </div>

        <nav className="navbar-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Dashboard
          </NavLink>

          {role === "Admin" && (
            <>
              <NavLink
                to="/manage-timetable"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Manage Timetable
              </NavLink>
              <NavLink
                to="/create-faculty"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                + Faculty
              </NavLink>
              <NavLink
                to="/create-student"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                + Student
              </NavLink>
            </>
          )}
        </nav>

        <div className="navbar-user">
          <div className="user-info">
            <span className="user-name">{userName}</span>
            <span className={getRoleBadgeClass()}>{role}</span>
          </div>
          <button
            onClick={handleLogout}
            className="btn-logout"
            title="Log out from session"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
