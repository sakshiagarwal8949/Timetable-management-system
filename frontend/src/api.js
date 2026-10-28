const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
export const API = `${API_BASE_URL.replace(/\/$/, "")}/api`;
export default API;
