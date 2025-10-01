import React, { useState, useEffect } from "react";
import api from "../config/axios.jsx";
import axios from "axios"; // add: for absolute-URL fallbacks
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const roleInputLayouts = {
  user: [
    { key: "fullName", label: "Full Name", type: "text", placeholder: "John Doe" },
    { key: "email", label: "Email Address", type: "email", placeholder: "you@example.com" },
    { key: "password", label: "Password", type: "password", placeholder: "••••••••" },
    { key: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Repeat password" },
  ],
  business: [
    { key: "businessName", label: "Business Name", type: "text", placeholder: "Registered business name" },
    { key: "contactPerson", label: "Contact Person Name", type: "text", placeholder: "Full name of contact" },
    { key: "phone", label: "Phone", type: "tel", placeholder: "9876543210" },
    { key: "email", label: "Email", type: "email", placeholder: "business@example.com" },
    { key: "logo", label: "Logo URL", type: "url", placeholder: "https://logo..." },
    { key: "city", label: "City", type: "text", placeholder: "Mumbai" },
    { key: "state", label: "State", type: "text", placeholder: "Maharashtra" },
    { key: "gstId", label: "GST / Tax ID", type: "text", placeholder: "22AAAAA0000A1Z5" },
    { key: "address", label: "Address", type: "text", placeholder: "Complete business address" },
    { key: "bio", label: "Bio / Description", type: "text", placeholder: "Short about your business" },
    { key: "website", label: "Website (Optional)", type: "url", placeholder: "https://business...", optional: true },
    {
      key: "industryType",
      label: "Industry Type",
      type: "select",
      options: ["Real Estate", "Developer", "Contractor", "Interior", "PMC", "Urban Planning / Design"],
    },
    { key: "password", label: "Password", type: "password", placeholder: "Create password" },
    { key: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Repeat password" },
  ],
  govt: [
    { key: "departmentName", label: "Department Name", type: "text", placeholder: "e.g. PWD, NHAI" },
    { key: "contactPerson", label: "Contact Person Name", type: "text", placeholder: "Full name of contact" },
    { key: "phone", label: "Phone", type: "tel", placeholder: "9876543210" },
    { key: "email", label: "Email", type: "email", placeholder: "dept@example.gov.in" },
    { key: "logo", label: "Logo / Seal URL", type: "url", placeholder: "https://logo..." },
    { key: "city", label: "City", type: "text", placeholder: "New Delhi" },
    { key: "state", label: "State", type: "text", placeholder: "Delhi" },
    { key: "govtId", label: "Govt ID / Tender ID", type: "text", placeholder: "Unique ID or Tender ID" },
    { key: "address", label: "Address", type: "text", placeholder: "Department office address" },
    { key: "bio", label: "Bio / Description", type: "text", placeholder: "Short about the department" },
    { key: "website", label: "Website / Portal (Optional)", type: "url", placeholder: "https://govportal...", optional: true },
    { key: "password", label: "Password", type: "password", placeholder: "Create password" },
    { key: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Repeat password" },
  ],
  associate: [
    { key: "fullName", label: "Full Name", type: "text", placeholder: "Designer name" },
    { key: "countryCode", label: "Country Code", type: "text", placeholder: "+91" },
    { key: "phone", label: "Phone", type: "tel", placeholder: "9876543210" },
    { key: "email", label: "Email", type: "email", placeholder: "designer@example.com" },
    { key: "pfp", label: "Profile Photo URL", type: "url", placeholder: "https://photo..." },
    { key: "isStudent", label: "Are you a student?", type: "select", options: ["Yes", "No"] },
    { key: "university", label: "University", type: "text", placeholder: "University name" },
    { key: "enrollmentYear", label: "Year of Enrollment", type: "number", placeholder: "2023" },
    { key: "collegeId", label: "College ID / Alumni ID", type: "text", placeholder: "ID number" },
    { key: "city", label: "City", type: "text", placeholder: "Bengaluru" },
    { key: "state", label: "State", type: "text", placeholder: "Karnataka" },
    { key: "age", label: "Age", type: "number", placeholder: "22" },
    { key: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"] },
    { key: "languages", label: "Languages Known", type: "text", placeholder: "English, Hindi" },
    { key: "portfolioUrl", label: "Portfolio URL", type: "url", placeholder: "https://portfolio..." },
    { key: "password", label: "Password", type: "password", placeholder: "Create password" },
    { key: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Repeat password" },
  ],
  firm: [
    { key: "firmName", label: "Firm Name", type: "text", placeholder: "Registered firm name" },
    { key: "phone", label: "Phone", type: "tel", placeholder: "9876543210" },
    { key: "email", label: "Email", type: "email", placeholder: "firm@example.com" },
    { key: "logo", label: "Logo URL", type: "url", placeholder: "https://logo..." },
    { key: "city", label: "City", type: "text", placeholder: "Mumbai" },
    { key: "state", label: "State", type: "text", placeholder: "Maharashtra" },
    { key: "avgCostPerSqft", label: "Avg. Design Cost / sqft", type: "number", placeholder: "₹200" },
    { key: "primaryCategory", label: "Primary Category", type: "text", placeholder: "Residential / Commercial" },
    { key: "primaryStyle", label: "Primary Style", type: "text", placeholder: "Modern / Traditional" },
    { key: "foundedIn", label: "Founded In", type: "number", placeholder: "2012" },
    { key: "headArchitect", label: "Head Architect", type: "text", placeholder: "Name of head architect" },
    { key: "license", label: "License Number", type: "text", placeholder: "Reg / License No." },
    { key: "address", label: "Address", type: "text", placeholder: "Complete office address" },
    { key: "bio", label: "Firm Bio", type: "text", placeholder: "Short description of firm" },
    { key: "cover", label: "Cover Image URL", type: "url", placeholder: "https://cover..." },
    { key: "website", label: "Website", type: "url", placeholder: "https://firm.com" },
    { key: "adminName", label: "Admin (POC) Name", type: "text", placeholder: "Admin person name" },
    { key: "adminEmail", label: "Admin (POC) Email", type: "email", placeholder: "admin@firm.com" },
    { key: "adminPhone", label: "Admin (POC) Phone", type: "tel", placeholder: "9876543210" },
    { key: "password", label: "Password", type: "password", placeholder: "Secure password" },
    { key: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Repeat password" },
  ],
};

// map UI roles to backend-expected role values
const roleServerMap = {
  user: "user",
  business: "business",
  govt: "government",
  associate: "associate",
  firm: "firm",
};

const RegisterPage = () => {
  const [role, setRole] = useState("user");
  // initialize default form fields for the default role ('user')
  const [form, setForm] = useState(() => {
    const init = {};
    roleInputLayouts.user.forEach((f) => (init[f.key] = ""));
    return init;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const navigate = useNavigate();

  // normalize role key (fix 'buisness' -> 'business')
  const roleKey = role === "buisness" ? "business" : role;
  const currentLayout = roleInputLayouts[roleKey];

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    const normalized = newRole === "buisness" ? "business" : newRole;
    setRole(normalized);
    const newForm = {};
    roleInputLayouts[normalized].forEach((f) => (newForm[f.key] = ""));
    setForm(newForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errs = [];
    currentLayout.forEach((f) => {
      if (!f.optional && !String(form[f.key] || "").trim()) errs.push(`${f.label} required`);
    });
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) errs.push("Invalid email");
    if (form.password && form.password.length < 6) errs.push("Password must be at least 6 characters");
    if (form.password !== form.confirmPassword) errs.push("Passwords do not match");
    return errs;
  };

  // Local fallback: save registered user in localStorage when backend endpoints are missing (404s)
  const localRegister = (data) => {
    try {
      const list = JSON.parse(localStorage.getItem("registrations") || "[]");
      const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
      const record = { id, ...data, createdAt: new Date().toISOString() };
      list.push(record);
      localStorage.setItem("registrations", JSON.stringify(list));
      try {
        // convenience for login form autofill (optional)
        if (data.email) localStorage.setItem("lastRegisteredEmail", String(data.email));
      } catch {}
      return record;
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    const issues = validate();
    if (issues.length) {
      toast.error(issues.join(", "));
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Build sanitized payload (only send allowed top-level keys)
      const nameKeys = ["fullName", "businessName", "departmentName", "firmName", "adminName", "contactPerson"];
      const nameFromForm = nameKeys.map((k) => form[k]).find((v) => v && String(v).trim());
      const emailFromForm = (form.email || form.adminEmail || "").toString().trim().toLowerCase();

      const profile = {};
      currentLayout.forEach((f) => {
        const k = f.key;
        if (["password", "confirmPassword", "email"].includes(k)) return;
        const raw = form[k];
        if (raw === undefined || raw === null || String(raw).trim() === "") return;

        let val;
        if (f.type === "number") {
          const n = Number(raw);
          if (!Number.isFinite(n)) return; // skip invalid numbers
          val = n;
        } else {
          val = String(raw).trim();
        }
        // NOTE: send raw "Yes"/"No" values so backend string schemas don't drop them
        profile[k] = val;
      });
      // combine phone with countryCode when available
      if (!profile.phone && form.phone) profile.phone = String(form.phone).trim();
      if (form.countryCode && profile.phone) profile.phone = `${String(form.countryCode).trim()} ${profile.phone}`;

      const serverRole = roleServerMap[roleKey] || roleKey;
      const payload = {
        role: serverRole,
        name: (nameFromForm || "").toString().trim() || undefined,
        email: emailFromForm || undefined,
        password: form.password,
        profile,
      };
      if (payload.profile && Object.keys(payload.profile).length === 0) delete payload.profile;

      // Try both shapes: nested (with profile) and flattened (merge profile fields at top level)
      const candidatePayloads = [payload];
      if (payload.profile) {
        const flattened = { ...payload, ...payload.profile };
        delete flattened.profile;
        candidatePayloads.push(flattened);
      }

      // Derive server origin
      const apiBase = api?.defaults?.baseURL || "/api";
      const baseURL = new URL(apiBase, window.location.origin);
      const serverOrigin = `${baseURL.protocol}//${baseURL.host}`;

      const paths = [
        "/auth/register",
        "/register",
        "/users/register",
        "/auth/signup",
        "/signup",
        "/user/register",
        "/user/signup",
        "/users/signup",
      ];

      let finalRes = null;
      let lastErr = null;
      let only404s = true;

      // Phase 1: try with configured api (keeps any /api prefix)
      for (const body of candidatePayloads) {
        for (const p of paths) {
          try {
            const res = await api.post(p, body, { headers: { "Content-Type": "application/json" }, withCredentials: true });
            if (res?.status >= 200 && res?.status < 300) {
              finalRes = res;
              break;
            }
            lastErr = new Error(`Unexpected status: ${res?.status}`);
            only404s = false;
          } catch (err) {
            lastErr = err;
            const st = err?.response?.status;
            if (st !== 404) {
              only404s = false;
              // continue trying other endpoints with same body
              continue;
            }
          }
        }
        if (finalRes) break;
      }

      // Phase 2: try absolute URLs with common prefixes
      if (!finalRes) {
        const prefixes = ["", "/api", "/api/v1", "/v1"];
        outer: for (const body of candidatePayloads) {
          for (const prefix of prefixes) {
            for (const p of paths) {
              const url = `${serverOrigin}${prefix}${p}`;
              try {
                const res = await axios.post(url, body, { headers: { "Content-Type": "application/json" }, withCredentials: true });
                if (res?.status >= 200 && res?.status < 300) {
                  finalRes = res;
                  break outer;
                }
                lastErr = new Error(`Unexpected status: ${res?.status}`);
                only404s = false;
              } catch (err) {
                lastErr = err;
                const st = err?.response?.status;
                if (st !== 404) {
                  only404s = false;
                  // keep iterating other endpoints
                }
              }
            }
          }
        }
      }

      // If every attempt was a 404, fall back to local registration
      if (!finalRes && only404s) {
        localRegister(payload);
        toast.success("Registered locally (no auth API found).");
        setOk(true);
        setTimeout(() => navigate("/login"), 900);
        return;
      }

      if (!finalRes) throw lastErr || new Error("Registration failed");

      toast.success(finalRes.data?.message || "Registered successfully");
      setOk(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // rerender when global currency changes so placeholders reflect selection
  const [currencyCode, setCurrencyCode] = useState(() => (typeof window !== "undefined" && window.currency?.code) || "INR");
  useEffect(() => {
    const onChange = (e) => setCurrencyCode((e?.detail && e.detail.code) || (window.currency?.code || "INR"));
    window.addEventListener("currency:change", onChange);
    window.addEventListener("currency:ready", onChange);
    return () => {
      window.removeEventListener("currency:change", onChange);
      window.removeEventListener("currency:ready", onChange);
    };
  }, []);

  // safe currency formatter
  const fmt = (amount, baseCode) => {
    try {
      if (window?.currency?.format) return window.currency.format(amount, baseCode);
    } catch {}
    try {
      return new Intl.NumberFormat(undefined, { style: "currency", currency: currencyCode, maximumFractionDigits: 2 }).format(Number(amount || 0));
    } catch {
      return `${Number(amount || 0).toLocaleString()} ${currencyCode}`;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eef2ff] to-[#f5f5f7] px-4 py-10">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg border border-gray-200 p-8">
        <h1 className="text-3xl font-semibold text-center text-gray-900">Create Account</h1>
        <p className="text-center text-gray-500 mt-2">Register to get started</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5 max-h-[70vh] overflow-y-auto pr-2">
          <div className="sticky top-0 bg-white py-2 z-10">
            <label className="block text-sm font-medium text-gray-600 mb-1">Select Role</label>
            <select
              value={role}
              onChange={handleRoleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.keys(roleInputLayouts).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {currentLayout.map((field) => {
            // dynamically format known currency field placeholders
            const dynamicPlaceholder =
              field.key === "avgCostPerSqft"
                ? fmt(200, "INR") // base price defined in INR; will be converted to selected currency
                : field.placeholder;

            return (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {field.label} {!field.optional && <span className="text-red-500">*</span>}
                </label>
                {field.type === "select" ? (
                  <select
                    name={field.key}
                    value={form[field.key] || ""}
                    onChange={handleChange}
                    required={!field.optional}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    name={field.key}
                    type={field.type}
                    value={form[field.key] || ""}
                    onChange={handleChange}
                    placeholder={dynamicPlaceholder}
                    required={!field.optional}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            );
          })}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {ok && <p className="text-green-600 text-sm text-center">Registered successfully. Redirecting...</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg shadow-md transition-all duration-300"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
