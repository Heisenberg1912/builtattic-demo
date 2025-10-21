import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Toaster, toast } from "react-hot-toast";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Studio from "./pages/Studio";
import Warehouse from "./pages/Warehouse";
import WarehouseDetail from "./pages/WarehouseDetail";
import Firms from "./pages/Firms";
import CartPage from "./pages/CartPage";
import Associates from "./pages/Associates";
import FirmPortfolio from "./pages/FirmPortfolio";
import Ai from "./pages/Ai";
import Matters from "./pages/Matters";
import CurrencyConverter from "./pages/CurrencyConverter";
import OrderHistory from "./pages/OrderHistory";
import Buy from "./pages/Buy";
import Account from "./pages/Account";
import Settings from "./pages/Settings";
import SupportChatWidget from "./components/SupportChatWidget";

// Dashboard pages
import SuperAdminDashboard from "./pages/dashboard/SuperAdminDashboard";
import UserDashboard from "./pages/dashboard/UserDashboard";
import AssociateDashboard from "./pages/dashboard/AssociateDashboard";
import FirmDashboard from "./pages/dashboard/FirmDashboard";
import ClientDashboard from "./pages/dashboard/ClientDashboard";
import VendorDashboard from "./pages/dashboard/SaleDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import StudioDetail from "./pages/StudioDetail";
import RegistrStrip from "./components/registrstrip";
import { roleDashboardPath } from "./constants/roles.js";
import { isValidSecretCode } from "./constants/secretCodes";
import { LOI_TEXT } from "./constants/loiText";
import apiClient from "./config/axios.jsx";

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } catch {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return null;
};

const LOI_ROLE_OPTIONS = [
  "Architect / Firm",
  "Architectural Student / Graduate",
  "Land Owner / Consumer",
  "Vendor",
  "Builder / Real Estate Agency",
];


const App = () => {
  const [hasAccess, setHasAccess] = useState(false);
  const [codeAccepted, setCodeAccepted] = useState(false);
  const [acceptedCode, setAcceptedCode] = useState('');
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState("");

  const createEmptyProfile = () => ({
    name: "",
    contact: "",
    pincode: "",
    country: "",
    role: "",
    isContributor: true,
  });
  const [profileForm, setProfileForm] = useState(() => createEmptyProfile());
  const [profileError, setProfileError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);

  const handleSecretSubmit = (event) => {
    event.preventDefault();
    const candidate = codeInput.trim();
    if (isValidSecretCode(candidate)) {
      setAcceptedCode(candidate);
      setCodeAccepted(true);
      setCodeInput("");
      setCodeError("");
      setProfileError("");
      setProfileForm(createEmptyProfile());
      setFieldErrors({});
    } else {
      setCodeError("Invalid code. Please try again.");
    }
  };

  const handleProfileChange = (field) => (event) => {
    const value = event.target.value;
    setProfileForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const { [field]: _removed, ...rest } = prev;
      return rest;
    });
    if (profileError) setProfileError("");
  };

  const handleProfileCheckbox = (field) => (event) => {
    const checked = event.target.checked;
    setProfileForm((prev) => ({ ...prev, [field]: checked }));
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const { [field]: _removed, ...rest } = prev;
      return rest;
    });
    if (profileError) setProfileError("");
  };

  const handleResetSecret = () => {
    setCodeAccepted(false);
    setAcceptedCode("");
    setProfileForm(createEmptyProfile());
    setProfileError("");
    setFieldErrors({});
    setCodeInput("");
    setCodeError("");
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setProfileError("");

    if (!codeAccepted || !isValidSecretCode(acceptedCode)) {
      setProfileError("Please enter a valid invitation code first.");
      setCodeAccepted(false);
      return;
    }

    const trimmed = {
      name: profileForm.name.trim(),
      contact: profileForm.contact.trim(),
      pincode: profileForm.pincode.trim(),
      country: profileForm.country.trim(),
      role: profileForm.role,
      isContributor: Boolean(profileForm.isContributor),
    };

    const errors = {};
    if (!trimmed.name) errors.name = 'Name is required.';
    if (!trimmed.contact) errors.contact = 'Contact is required.';
    if (!trimmed.pincode) errors.pincode = 'Pincode is required.';
    if (!trimmed.country) errors.country = 'Country is required.';
    if (!trimmed.role) errors.role = 'Role selection is required.';

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmail = emailPattern.test(trimmed.contact);
    const contactDigits = trimmed.contact.replace(/[^0-9]/g, '');
    const isPhone = contactDigits.length >= 6;
    if (trimmed.contact && !isEmail && !isPhone) {
      errors.contact = 'Enter a valid email address or phone number.';
    }

    const pincodeDigits = trimmed.pincode.replace(/[^0-9]/g, '');
    if (trimmed.pincode && pincodeDigits.length < 4) {
      errors.pincode = 'Enter a valid pincode.';
    }

    if (!LOI_ROLE_OPTIONS.includes(trimmed.role)) {
      errors.role = 'Please select a valid role.';
    }

    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      setProfileError('Please fix the highlighted fields.');
      return;
    }

    setFieldErrors({});

    const normalizedContact = isEmail ? trimmed.contact.toLowerCase() : trimmed.contact;
    const normalizedPincode = pincodeDigits;

    const submission = {
      ...trimmed,
      contact: normalizedContact,
      pincode: normalizedPincode,
      secretCode: acceptedCode.trim(),
    };

    setIsSubmittingProfile(true);
    try {
      const { data } = await apiClient.post('/access-requests', submission);

      setHasAccess(true);
      setProfileForm(createEmptyProfile());
      setProfileError("");
      setFieldErrors({});
      setTimeout(() => {
        try { toast.success('Access granted. Welcome!'); } catch {}
      }, 120);

      if (!data?.success) {
        console.warn('Unexpected access request response', data);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Unable to save your details. Please try again.';
      setProfileError(message);
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  // Single source of auth truth (kept if used by other parts of the app)
  const [auth, setAuth] = useState({ token: null, role: null, loaded: false });

  const getDashboardPath = (role) => roleDashboardPath[role] || "/login";

  // Called by Login component after successful authentication
  const handleLoginSuccess = ({ token, role }) => {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("role", role);
    setAuth({ token, role, loaded: true });
    toast.success("Login successful");
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("role");
    setAuth({ token: null, role: null, loaded: true });
    toast.success("Logged out");
  };

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const role = localStorage.getItem("role");
    setAuth({ token, role, loaded: true });
  }, []);

  // ---- Global currency store (selection + rates) ----
  const [currencyCode, setCurrencyCode] = useState(() => {
    try { return localStorage.getItem("fx_to") || "INR"; } catch { return "INR"; }
  });
  const [fxBase, setFxBase] = useState(() => {
    try { return JSON.parse(localStorage.getItem("fx_rates_cache") || "null")?.base || "USD"; } catch { return "USD"; }
  });
  const [fxRates, setFxRates] = useState(() => {
    try { return JSON.parse(localStorage.getItem("fx_rates_cache") || "null")?.rates || {}; } catch { return {}; }
  });

  // Convert using USD-based rates (open.er-api.com)
  const getRate = (code) => {
    if (!code) return 1;
    if (code === fxBase) return 1;
    const r = fxRates?.[code];
    return typeof r === "number" && isFinite(r) ? r : 1;
  };
  // Convert amt from 'fromCode' to 'toCode'
  const convert = (amt, fromCode = fxBase, toCode = currencyCode) => {
    const a = Number(amt);
    if (!isFinite(a)) return 0;
    if (fromCode === toCode) return a;
    // all stored rates are relative to fxBase (usually USD)
    const rFrom = fromCode === fxBase ? 1 : getRate(fromCode);
    const rTo = toCode === fxBase ? 1 : getRate(toCode);
    if (!rFrom || !rTo) return 0;
    // base -> from -> to: amount in base = a / rFrom; then * rTo
    return (a / rFrom) * rTo;
  };
  // Format helper
  const format = (amt, fromCode = fxBase, toCode = currencyCode) => {
    const v = convert(amt, fromCode, toCode);
    try {
      return new Intl.NumberFormat(undefined, { style: "currency", currency: toCode, maximumFractionDigits: 2 }).format(v);
    } catch {
      return `${v.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${toCode}`;
    }
  };

  // Keep a global API on window for any component to use without extra imports
  useEffect(() => {
    try {
      window.currency = {
        get code() { return currencyCode; },
        setCode: (code) => setCurrencyCode(code),
        base: fxBase,
        rates: fxRates,
        convert,
        format,
        // notify listeners manually if needed
        emit: (detail = {}) => window.dispatchEvent(new CustomEvent("currency:change", { detail: { code: currencyCode, base: fxBase, rates: fxRates, ...detail } })),
      };
    } catch {}
  }, [currencyCode, fxBase, fxRates]);

  // Listen for Navbar updates and update state
  useEffect(() => {
    const onChange = (e) => {
      const { code, base, rates } = e?.detail || {};
      if (code) setCurrencyCode(code);
      if (base) setFxBase(base);
      if (rates) setFxRates(rates);
    };
    window.addEventListener("currency:change", onChange);
    // announce ready with current values
    window.dispatchEvent(new CustomEvent("currency:ready", { detail: { code: currencyCode, base: fxBase, rates: fxRates } }));
    return () => window.removeEventListener("currency:change", onChange);
  }, []); // run once

  if (!hasAccess) {
    const showProfileForm = codeAccepted;

    return (
      <div className="secret-gate">
        <div className="secret-gate__panel">
          <h1>Invite-Only Access</h1>
          <p className="secret-gate__subtitle">
            {showProfileForm
              ? "Almost there. We just need a few details from you."
              : "Enter your invitation code to continue."}
          </p>

          {!showProfileForm ? (
            <form onSubmit={handleSecretSubmit} className="secret-gate__form">
              <input
                type="text"
                value={codeInput}
                onChange={(event) => {
                  setCodeInput(event.target.value);
                  if (codeError) setCodeError("");
                }}
                placeholder="Enter invitation code"
                className="secret-gate__input secret-gate__input--code"
                autoFocus
              />
              {codeError && <p className="secret-gate__error">{codeError}</p>}
              <button type="submit" className="secret-gate__button">
                Continue
              </button>
            </form>
          ) : (
            <>
              <div className="secret-gate__chip">
                Invitation Code <span>{acceptedCode}</span>
              </div>
              <form onSubmit={handleProfileSubmit} className="secret-gate__form secret-gate__form--details">
                <div className="secret-gate__grid">
                  <label className="secret-gate__field">
                    <span>Name</span>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={handleProfileChange('name')}
                      className="secret-gate__input"
                      placeholder="Your full name"
                      autoComplete="name"
                    />
                    {fieldErrors.name && <span className="secret-gate__field-error">{fieldErrors.name}</span>}
                  </label>
                  <label className="secret-gate__field">
                    <span>Email / Phone Number</span>
                    <input
                      type="text"
                      value={profileForm.contact}
                      onChange={handleProfileChange('contact')}
                      className="secret-gate__input"
                      placeholder="Your Contact"
                      autoComplete="email"
                    />
                    {fieldErrors.contact && <span className="secret-gate__field-error">{fieldErrors.contact}</span>}
                  </label>
                  <label className="secret-gate__field">
                    <span>Pincode</span>
                    <input
                      type="text"
                      value={profileForm.pincode}
                      onChange={handleProfileChange('pincode')}
                      className="secret-gate__input"
                      placeholder="Pincode"
                      autoComplete="postal-code"
                      inputMode="numeric"
                    />
                    {fieldErrors.pincode && <span className="secret-gate__field-error">{fieldErrors.pincode}</span>}
                  </label>
                  <label className="secret-gate__field">
                    <span>Country</span>
                    <input
                      type="text"
                      value={profileForm.country}
                      onChange={handleProfileChange('country')}
                      className="secret-gate__input"
                      placeholder="Country"
                      autoComplete="country-name"
                    />
                    {fieldErrors.country && <span className="secret-gate__field-error">{fieldErrors.country}</span>}
                  </label>
                  <label className="secret-gate__field secret-gate__field--full">
                    <span>Role</span>
                    <select
                      value={profileForm.role}
                      onChange={handleProfileChange('role')}
                      className={`secret-gate__input secret-gate__select${profileForm.role ? '' : ' secret-gate__select--placeholder'}`}
                    >
                      <option value="" disabled>
                        Select your role
                      </option>
                      {LOI_ROLE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.role && <span className="secret-gate__field-error">{fieldErrors.role}</span>}
                  </label>
                  <div className="secret-gate__document secret-gate__field--full">
                    <span className="secret-gate__section-title">LETTER OF INTENT</span>
                    <div
                      className="secret-gate__document-box"
                      role="textbox"
                      aria-label="Builtattic Letter of Intent terms"
                      aria-readonly="true"
                      tabIndex={0}
                    >
                      {LOI_TEXT}
                    </div>
                  </div>

                  <label className="secret-gate__checkbox secret-gate__field--full">
                    <input
                      type="checkbox"
                      checked={profileForm.isContributor}
                      onChange={handleProfileCheckbox('isContributor')}
                    />
                    <span>I would like to be an LOI contributor</span>
                  </label>
                </div>

                {profileError && <p className="secret-gate__error">{profileError}</p>}
                <button type="submit" className="secret-gate__button" disabled={isSubmittingProfile}>
                  {isSubmittingProfile ? 'SUBMITTING...' : 'SUBMIT'}
                </button>
                <button type="button" className="secret-gate__link-button" onClick={handleResetSecret}>
                  Use a different code
                </button>
              </form>
            </>
          )}

          <p className="secret-gate__hint">
            {showProfileForm
              ? "Your details stay private and help us tailor the experience."
              : "Only invited guests can access this experience."}
          </p>
          {showProfileForm && (
            <p className="secret-gate__note">
              Please review the Builtattic Demo Agreement presented below before proceeding.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <CartProvider>
      <WishlistProvider>
        <>
          <ScrollToTop />
          <Navbar />
          <Toaster position="top-right" gutter={8} toastOptions={{ duration: 3000 }} />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLoginSuccess} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/buy" element={<Buy />} />
            <Route path="/buy/:id" element={<Buy />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/cartpage" element={<CartPage />} />
            {/* AI routes */}
            <Route path="/ai" element={<Ai />} />
            <Route path="/aisetting" element={<Ai />} />
            <Route path="/matters" element={<Matters />} />
            {/* Studio (formerly Amazon) */}
            <Route path="/studio" element={<Studio />} />
            {/* Warehouse (formerly Blinkit) */}
            <Route path="/warehouse" element={<Warehouse />} />
            <Route path="/warehouse/:id" element={<WarehouseDetail />} />
            {/* Firms (formerly Urban) */}
            <Route path="/firms" element={<Firms />} />
            {/* NEW: Associates and portfolio routes */}
            <Route path="/associates" element={<Associates />} />
            <Route path="/firmportfolio" element={<FirmPortfolio />} />
            <Route path="/associateportfolio" element={<FirmPortfolio />} />
            {/* Currency converter page route */}
            <Route path="/currencyconver" element={<CurrencyConverter />} />
            {/* Backward-compatible redirects */}
            <Route path="/amazon" element={<Navigate to="/studio" replace />} />
            <Route path="/blinkit" element={<Navigate to="/warehouse" replace />} />
            <Route path="/urban" element={<Navigate to="/firms" replace />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/account" element={<Account />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/orders" element={<OrderHistory />} />
            {/* Dashboard routes */}
            <Route path="/dashboard/super-admin" element={<SuperAdminDashboard />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/dashboard/user" element={<UserDashboard />} />
            <Route path="/dashboard/associate" element={<AssociateDashboard />} />
            <Route path="/dashboard/firm" element={<FirmDashboard />} />
            <Route path="/dashboard/client" element={<ClientDashboard />} />
            <Route path="/dashboard/vendor" element={<VendorDashboard />} />
            {/*  */}
            <Route path="/studioDetail" element={<StudioDetail />} />
            <Route path="/studio/:id" element={<StudioDetail />} />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />


            {/*  */}
            <Route path="/registrstrip" element={<RegistrStrip />} />
          </Routes>
          <SupportChatWidget />
        </>
      </WishlistProvider>
    </CartProvider>
  );
};

export default App;


