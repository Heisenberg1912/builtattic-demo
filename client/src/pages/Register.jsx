import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { register as apiRegister } from "../services/auth.js";

const roleInputLayouts = {
  user: [
    { key: "fullName", label: "Full Name", type: "text", placeholder: "John Doe" },
    { key: "email", label: "Email Address", type: "email", placeholder: "you@example.com" },
    { key: "password", label: "Password", type: "password", placeholder: "Create password" },
    { key: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Repeat password" },
  ],
  client: [
    { key: "fullName", label: "Full Name", type: "text", placeholder: "Acme Procurement Lead" },
    { key: "company", label: "Organisation (Optional)", type: "text", placeholder: "Company / Department", optional: true },
    { key: "email", label: "Email Address", type: "email", placeholder: "client@example.com" },
    { key: "password", label: "Password", type: "password", placeholder: "Create password" },
    { key: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Repeat password" },
  ],
  vendor: [
    { key: "businessName", label: "Vendor / Studio Name", type: "text", placeholder: "Registered business name" },
    { key: "contactPerson", label: "Primary Contact", type: "text", placeholder: "Contact person" },
    { key: "email", label: "Business Email", type: "email", placeholder: "studio@example.com" },
    { key: "phone", label: "Phone", type: "tel", placeholder: "+91 98765 43210", optional: true },
    { key: "password", label: "Password", type: "password", placeholder: "Create password" },
    { key: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Repeat password" },
  ],
  firm: [
    { key: "firmName", label: "Firm Name", type: "text", placeholder: "BuiltAttic Architects" },
    { key: "adminName", label: "Admin Name", type: "text", placeholder: "Operations lead" },
    { key: "email", label: "Firm Email", type: "email", placeholder: "firm@example.com" },
    { key: "website", label: "Website (Optional)", type: "url", placeholder: "https://yourfirm.com", optional: true },
    { key: "password", label: "Password", type: "password", placeholder: "Secure password" },
    { key: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Repeat password" },
  ],
  associate: [
    { key: "fullName", label: "Full Name", type: "text", placeholder: "Designer name" },
    { key: "email", label: "Email", type: "email", placeholder: "designer@example.com" },
    { key: "speciality", label: "Speciality", type: "text", placeholder: "Landscape / Interiors", optional: true },
    { key: "portfolioUrl", label: "Portfolio URL (Optional)", type: "url", placeholder: "https://portfolio...", optional: true },
    { key: "password", label: "Password", type: "password", placeholder: "Create password" },
    { key: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Repeat password" },
  ],
  admin: [
    { key: "fullName", label: "Full Name", type: "text", placeholder: "Platform Admin" },
    { key: "email", label: "Work Email", type: "email", placeholder: "admin@example.com" },
    { key: "password", label: "Password", type: "password", placeholder: "Create password" },
    { key: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Repeat password" },
  ],
  superadmin: [
    { key: "fullName", label: "Full Name", type: "text", placeholder: "Super Admin" },
    { key: "email", label: "Email", type: "email", placeholder: "superadmin@example.com" },
    { key: "accessKey", label: "Access Key", type: "text", placeholder: "Provided onboarding code", optional: true },
    { key: "password", label: "Password", type: "password", placeholder: "Create password" },
    { key: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Repeat password" },
  ],
};

const roleOptions = [
  { value: "user", label: "User" },
  { value: "client", label: "Client" },
  { value: "vendor", label: "Vendor" },
  { value: "firm", label: "Firm" },
  { value: "associate", label: "Associate" },
  { value: "admin", label: "Admin" },
  { value: "superadmin", label: "Super Admin" },
];

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

  const safeRole = roleInputLayouts[role] ? role : "user";
  const currentLayout = roleInputLayouts[safeRole];

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    const nextRole = roleInputLayouts[newRole] ? newRole : "user";
    setRole(nextRole);
    const newForm = {};
    roleInputLayouts[nextRole].forEach((f) => (newForm[f.key] = ""));
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
    if (form.password && form.password.length < 8) errs.push("Password must be at least 8 characters");
    if (form.password !== form.confirmPassword) errs.push("Passwords do not match");
    return errs;
  };

  // Local fallback: save registered user in localStorage when backend endpoints are missing (404s)
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
      const emailField = currentLayout.find((f) => f.type === "email");
      const emailFromForm = emailField ? String(form[emailField.key] || "").trim().toLowerCase() : "";
      if (!emailFromForm) {
        throw new Error("Email is required");
      }

      await apiRegister({ email: emailFromForm, password: form.password, role: safeRole });

      toast.success("Registered successfully");
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
              {roleOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
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
