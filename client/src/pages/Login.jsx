import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/auth.js";
import api from "../config/axios.jsx"; // ensure backend baseURL is available

// Role -> path map
const roleRedirectMap = {
  superadmin: "/dashboard/superadmin",
  associate: "/dashboard/associate",
  client: "/dashboard/client",
  firm: "/dashboard/firm",
  sales: "/dashboard/sales",
  admin: "/dashboard/admin",
  user: "/dashboard/user",
};

// normalize role names to keys above
function normalizeRole(role) {
  const r = String(role || "").toLowerCase();
  const alias = {
    business: "firm",
    company: "firm",
    vendor: "firm",
    government: "admin",
    govt: "admin",
    super_admin: "superadmin",
    owner: "superadmin",
    customer: "client",
    assoc: "associate",
    sale: "sales",
    salesperson: "sales",
  };
  return alias[r] || r || "user";
}

// optional query redirect override (?redirect=/x, ?returnTo=/x, ?next=/x, ?r=/x)
function getQueryRedirect() {
  try {
    const u = new URL(window.location.href);
    const keys = ["redirect", "returnTo", "next", "r"];
    for (const k of keys) {
      const v = u.searchParams.get(k);
      if (v && v.startsWith("/")) return v;
    }
  } catch {}
  return null;
}

function resolveRedirect(role, serverPath, qsPath) {
  const q = qsPath && qsPath.startsWith("/") ? qsPath : null;
  const s = serverPath && serverPath.startsWith("/") ? serverPath : null;
  const norm = normalizeRole(role);
  return q || s || roleRedirectMap[norm] || (norm ? `/dashboard/${norm}` : "/dashboard");
}

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // 1) Try the existing service first
      let data = null;
      let only404s = true;
      try {
        const res = await login({ email, password });
        data = res?.data ?? res ?? null;
        if (data) only404s = false;
      } catch {
        // proceed to backend probes
      }

      // 2) Probe absolute backend URLs based on axios baseURL (avoid 5173)
      if (!data) {
        const apiBase = api?.defaults?.baseURL || "http://localhost:5000/api";
        const baseURL = new URL(apiBase, window.location.origin); // e.g. http://localhost:5000/api
        const serverOrigin = `${baseURL.protocol}//${baseURL.host}`; // http://localhost:5000

        const norm = (s) => (s || "").replace(/\/+$/, "");
        const unique = (arr) => Array.from(new Set(arr.map(norm)));

        const prefixes = unique([
          baseURL.pathname || "",                 // e.g. /api
          norm(baseURL.pathname) + "/studio",    // e.g. /api/studio
          "/api",
          "/api/studio",
          "/api/v1",
          "/api/v1/studio",
          "/v1",
          "/v1/studio",
          "", // root
        ]);

        const paths = ["/auth/login", "/login", "/users/login", "/signin", "/auth/signin"];

        const postJson = async (absUrl, body) => {
          const resp = await fetch(absUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(body),
          });
          if (!resp.ok) {
            const err = new Error(resp.statusText);
            err.status = resp.status;
            throw err;
          }
          return resp.json();
        };

        outer: for (const prefix of prefixes) {
          for (const p of paths) {
            const url = `${serverOrigin}${norm(prefix)}${p}`;
            try {
              const json = await postJson(url, { email, password });
              data = json;
              break outer;
            } catch (err) {
              if (err?.status && err.status !== 404) {
                only404s = false;
                throw err; // real server error; stop probing
              }
              // continue on 404
            }
          }
        }
      }

      // 3) Local fallback (if all endpoints 404 and you used Register local mode)
      if (!data && only404s) {
        const regs = JSON.parse(localStorage.getItem("registrations") || "[]");
        const normEmail = String(email || "").trim().toLowerCase();
        const u = regs.find((r) => String(r.email || "").trim().toLowerCase() === normEmail);
        if (!u) throw new Error("User not found");
        if (String(u.password || "") !== String(password)) throw new Error("Invalid credentials");
        data = {
          token: `local-${Date.now().toString(36)}`,
          role: u.role || "user",
          user: { id: u.id, email: u.email, role: u.role || "user" },
          redirectPath: null,
        };
      }

      if (!data) throw new Error("Not Found");

      // 4) Persist and navigate
      const token = data.token || data.accessToken || data.jwt || data.idToken;
      const role = data.role || data.user?.role || data.profile?.role || "user";
      const user = data.user || data.profile || null;
      const serverPath = data.redirectPath || data.redirect || null;
      const qsPath = getQueryRedirect();
      if (!token) throw new Error(data.message || "Invalid login response");

      // notify host if provided
      if (typeof onLogin === "function") {
        onLogin({ token, role: normalizeRole(role), user, redirectPath: resolveRedirect(role, serverPath, qsPath) });
      }

      // persist locally (idempotent)
      try { localStorage.setItem("token", token); } catch {}
      try { localStorage.setItem("role", normalizeRole(role)); } catch {}
      try { localStorage.setItem("user", JSON.stringify(user)); } catch {}

      const dest = resolveRedirect(role, serverPath, qsPath);
      navigate(dest, { replace: true });
    } catch (err) {
      console.error("[LOGIN] error", err);
      setError(err?.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-[#1D1D1F] mb-8">
          Sign in to your account
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#6E6E73] mb-1"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-[#1D1D1F] placeholder-[#A1A1A6] focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#6E6E73] mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-[#1D1D1F] placeholder-[#A1A1A6] focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}

          {/* Forgot password */}
          <div className="flex items-center justify-between text-sm">
            <Link
              to="/forgot-password"
              className="text-[#0071E3] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0071E3] hover:bg-[#005BB5] disabled:opacity-50 text-white font-semibold py-3 rounded-lg shadow-md transition-colors duration-300"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-3 text-[#6E6E73] text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Social Login */}
        <button className="w-full flex items-center justify-center bg-white hover:bg-gray-100 text-[#1D1D1F] font-medium py-3 rounded-lg shadow-sm transition-colors duration-300 border border-gray-300">
          <svg
            className="w-5 h-5 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
          >
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3C34.6 32.7 29.9 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11.1 0 20-8.9 20-20 0-1.3-.1-2.7-.4-3.9z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.6 16.2 18.9 14 24 14c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.5 29.3 4 24 4c-7.9 0-14.7 4.6-17.7 11.3z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.8 0 10.7-1.9 14.2-5.1l-6.6-5.5C29.9 36 27 37 24 37c-5.9 0-10.6-3.3-12.7-8h-7l-7 5.4C9.3 39.4 16.1 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3c-1.2 3.3-4.6 6-9.3 6-5.1 0-9.4-3.2-10.9-7.7h-7l-7 5.4C9.3 39.4 16.1 44 24 44c11.1 0 20-8.9 20-20 0-1.3-.1-2.7-.4-3.9z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Signup link */}
        <p className="text-center text-[#6E6E73] text-sm mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[#0071E3] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
