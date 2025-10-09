import client from "../config/axios.jsx";

const pickTokenPayload = (payload = {}) => ({
  ok: payload.ok ?? true,
  token: payload.token || payload.accessToken || null,
  user: payload.user || null,
  rolesGlobal: payload.user?.rolesGlobal || payload.rolesGlobal || [],
});

export async function register({ email, password, role }) {
  try {
    const { data } = await client.post("/auth/register", { email, password, role });
    return pickTokenPayload(data);
  } catch (err) {
    const message =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      "Registration failed";
    throw new Error(message);
  }
}

export async function login(email, password) {
  try {
    const { data } = await client.post("/auth/login", { email, password });
    return pickTokenPayload(data);
  } catch (err) {
    const message =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      "Login failed";
    throw new Error(message);
  }
}

export async function fetchCurrentUser() {
  const { data } = await client.get("/auth/me");
  return data?.user || null;
}

export async function loginWithGoogle(idToken) {
  try {
    const { data } = await client.post("/auth/google", { idToken });
    return pickTokenPayload(data);
  } catch (err) {
    const message =
      err.response?.data?.error || err.response?.data?.message || err.message || "Google sign-in failed";
    throw new Error(message);
  }
}
