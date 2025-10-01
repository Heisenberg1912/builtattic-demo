import axios from "../config/axios.jsx"; // ensure baseURL is http://localhost:5000

export async function login(email, password) {
  try {
    const res = await axios.post("/auth/login", { email, password }); // was /api/auth/login
    const data = res.data || {};
    return {
      token: data.token,
      role: data.role || data.user?.role || null,
      dashboardPath: data.dashboardPath,
      user: data.user || null,
    };
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.message ||
      "Login failed";
    throw new Error(message);
  }
  // After successful login you already store in localStorage in the page.
  // No state set here -> avoids loops.
}
