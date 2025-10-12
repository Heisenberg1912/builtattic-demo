import React, { useState, useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import main_logo from "/src/assets/main_logo/main_logo.png";
import {
  HiOutlineShoppingCart,
  HiOutlineHeart,
  HiOutlineGlobeAlt,
} from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import { normalizeRole, resolveDashboardPath } from "../constants/roles.js";

/* ---------- helpers for dashboard path ---------- */
function getJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function getCurrentUser() {
  // supports various shapes: {token,user}, plain user, or separate keys
  const auth = getJSON("auth");
  const user = auth?.user || auth || getJSON("user");
  return user && typeof user === "object" ? user : null;
}
function readAuthSnapshot() {
  try {
    const rawToken =
      localStorage.getItem("auth_token") || localStorage.getItem("token");
    const token =
      rawToken && rawToken !== "null" && rawToken !== "undefined" ? rawToken : null;
    const role = normalizeRole(localStorage.getItem("role") || "user");
    return { token, role };
  } catch {
    return { token: null, role: "user" };
  }
}
function deriveRoleFromUser(user, fallbackRole) {
  if (!user) return normalizeRole(fallbackRole);
  if (user.role) return normalizeRole(user.role);
  const globals = user.rolesGlobal || [];
  if (globals.includes("superadmin")) return "superadmin";
  if (globals.includes("admin")) return "admin";
  const membershipRole = user.memberships?.[0]?.role;
  if (membershipRole === "owner") return "vendor";
  if (membershipRole === "admin") return "firm";
  if (membershipRole === "associate") return "associate";
  return normalizeRole(fallbackRole);
}
function computeDashboardPath(user, role) {
  const resolved = deriveRoleFromUser(user, role);
  return resolveDashboardPath(resolved);
}
/* ----------------------------------------------- */

const currencyOptions = [
  { code: "USD", country: "United States", flag: "🇺🇸", name: "US Dollar" },
  { code: "EUR", country: "Eurozone", flag: "🇪🇺", name: "Euro" },
  { code: "INR", country: "India", flag: "🇮🇳", name: "Indian Rupee" },
  { code: "GBP", country: "United Kingdom", flag: "🇬🇧", name: "Pound Sterling" },
  { code: "JPY", country: "Japan", flag: "🇯🇵", name: "Japanese Yen" },
  { code: "AUD", country: "Australia", flag: "🇦🇺", name: "Australian Dollar" },
  { code: "CAD", country: "Canada", flag: "🇨🇦", name: "Canadian Dollar" },
  { code: "CHF", country: "Switzerland", flag: "🇨🇭", name: "Swiss Franc" },
  { code: "CNY", country: "China", flag: "🇨🇳", name: "Chinese Yuan" },
  { code: "HKD", country: "Hong Kong", flag: "🇭🇰", name: "Hong Kong Dollar" },
  { code: "SGD", country: "Singapore", flag: "🇸🇬", name: "Singapore Dollar" },
  { code: "KRW", country: "South Korea", flag: "🇰🇷", name: "South Korean Won" },
  { code: "NZD", country: "New Zealand", flag: "🇳🇿", name: "New Zealand Dollar" },
  { code: "SEK", country: "Sweden", flag: "🇸🇪", name: "Swedish Krona" },
  { code: "NOK", country: "Norway", flag: "🇳🇴", name: "Norwegian Krone" },
  { code: "DKK", country: "Denmark", flag: "🇩🇰", name: "Danish Krone" },
  { code: "ZAR", country: "South Africa", flag: "🇿🇦", name: "South African Rand" },
  { code: "BRL", country: "Brazil", flag: "🇧🇷", name: "Brazilian Real" },
  { code: "MXN", country: "Mexico", flag: "🇲🇽", name: "Mexican Peso" },
  { code: "AED", country: "United Arab Emirates", flag: "🇦🇪", name: "UAE Dirham" },
  { code: "SAR", country: "Saudi Arabia", flag: "🇸🇦", name: "Saudi Riyal" },
  { code: "THB", country: "Thailand", flag: "🇹🇭", name: "Thai Baht" },
  { code: "IDR", country: "Indonesia", flag: "🇮🇩", name: "Indonesian Rupiah" },
  { code: "MYR", country: "Malaysia", flag: "🇲🇾", name: "Malaysian Ringgit" },
  { code: "PHP", country: "Philippines", flag: "🇵🇭", name: "Philippine Peso" },
];

const Navbar = () => {
  // Currency state
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    try {
      return localStorage.getItem("fx_to") || "INR";
    } catch {
      return "INR";
    }
  });

  // fire initial currency event once
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("currency:change", { detail: { code: selectedCurrency } })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCurrencyChange = (code) => {
    setSelectedCurrency(code);
    try {
      localStorage.setItem("fx_to", code);
    } catch {}
    if (window.currency && typeof window.currency.setCode === "function") {
      window.currency.setCode(code);
    }
    window.dispatchEvent(new CustomEvent("currency:change", { detail: { code } }));
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Context values (safe fallback)
  const cartCtx = (typeof useCart === "function" ? useCart() : null) || {};
  const wishlistCtx = (typeof useWishlist === "function" ? useWishlist() : null) || {};
  const cartItems = Array.isArray(cartCtx.cartItems) ? cartCtx.cartItems : [];
  const wishlistItems = Array.isArray(wishlistCtx.wishlistItems) ? wishlistCtx.wishlistItems : [];
  const cartCount = cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const wishlistCount = wishlistItems.length;

  const [authState, setAuthState] = useState(() => readAuthSnapshot());
  const [user, setUser] = useState(() => getCurrentUser());
  const isAuthed = Boolean(authState.token);
  const dashboardPath = useMemo(() => computeDashboardPath(user, authState.role), [user, authState.role]);

  useEffect(() => {
    const refresh = () => {
      setAuthState(readAuthSnapshot());
      setUser(getCurrentUser());
    };
    window.addEventListener("storage", refresh);
    window.addEventListener("auth:login", refresh);
    window.addEventListener("auth:logout", refresh);
    refresh();
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("auth:login", refresh);
      window.removeEventListener("auth:logout", refresh);
    };
  }, []);

  // Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <>
      <nav className="bg-black/95 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          {/* Logo */}
          <NavLink to="/" className="flex items-center text-xl font-bold text-gray-100">
            <img src={main_logo} alt="Builtattic Logo" className="h-12 w-12 object-contain" />
            builtattic.
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <NavLink to="/ai" className="text-gray-100 hover:text-gray-100 text-xs">AI</NavLink>
            <NavLink to="/studio" className="text-gray-100 hover:text-gray-100 text-xs">Studio</NavLink>
            <NavLink to="/firms" className="text-gray-100 hover:text-gray-100 text-xs">Firms</NavLink>
            <NavLink to="/associates" className="text-gray-100 hover:text-gray-100 text-xs">Associates</NavLink>
            <NavLink to="/warehouse" className="text-gray-100 hover:text-gray-100 text-xs">Warehouse</NavLink>

            {/* Avatar dropdown */}
            <div className="relative">
              <button
                className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-300 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 overflow-hidden transition"
                onClick={() => setIsDropdownOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
                title="Open user menu"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
                </svg>
              </button>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50 flex flex-col gap-2 p-3"
                    style={{ originY: 0, originX: 1 }}
                  >
                    {/* Currency Selector */}
                    <div className="flex items-center gap-2">
                      <HiOutlineGlobeAlt className="text-xl text-gray-700" />
                      <select
                        value={selectedCurrency}
                        onChange={(e) => handleCurrencyChange(e.target.value)}
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-md bg-white"
                        title="Select currency"
                      >
                        {currencyOptions.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.code}
                          </option>
                        ))}
                      </select>
                    </div>
                    <NavLink
                      to="/wishlist"
                      className="flex items-center gap-2 text-black hover:text-pink-600 py-1"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <HiOutlineHeart className="text-xl" />
                      Wishlist
                      {wishlistCount > 0 && (
                        <span className="ml-auto bg-pink-500 text-white rounded-full text-xs font-bold px-2">
                          {wishlistCount}
                        </span>
                      )}
                    </NavLink>
                    <NavLink
                      to="/cart"
                      className="flex items-center gap-2 text-black hover:text-blue-600 py-1"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <HiOutlineShoppingCart className="text-xl" />
                      Cart
                      {cartCount > 0 && (
                        <span className="ml-auto bg-blue-600 text-white rounded-full text-xs font-bold px-2">
                          {cartCount}
                        </span>
                      )}
                    </NavLink>
                    {isAuthed && (
                      <NavLink
                        to="/orders"
                        className="flex items-center gap-2 text-black hover:text-slate-700 py-1"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Order history
                      </NavLink>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth-aware link */}
            {isAuthed ? (
              <NavLink to={dashboardPath} className="text-gray-100 hover:text-gray-100 text-xs">
                Dashboard
              </NavLink>
            ) : (
              <NavLink to="/login" className="text-gray-100 hover:text-gray-300 text-xs">
                Login
              </NavLink>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-100 hover:text-gray-300">
            {isMenuOpen ? "Close" : "Menu"}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden px-4 pb-4 flex flex-col space-y-3">
            <NavLink to="/studio" className="text-gray-100 text-xs" onClick={() => setIsMenuOpen(false)}>
              Studio
            </NavLink>
            <NavLink to="/firms" className="text-gray-100 text-xs" onClick={() => setIsMenuOpen(false)}>
              Firms
            </NavLink>
            <NavLink to="/associates" className="text-gray-100 text-xs" onClick={() => setIsMenuOpen(false)}>
              Associates
            </NavLink>
            <NavLink to="/warehouse" className="text-gray-100 text-xs" onClick={() => setIsMenuOpen(false)}>
              Warehouse
            </NavLink>

            {/* Dropdown (mobile) */}
            <div className="relative">
              <button
                className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-400 bg-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 overflow-hidden transition"
                onClick={() => setIsDropdownOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
                title="Open user menu"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
                </svg>
              </button>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50 flex flex-col gap-2 p-3"
                    style={{ originY: 0, originX: 1 }}
                  >
                    <div className="flex items-center gap-2">
                      <HiOutlineGlobeAlt className="text-xl text-black" />
                      <select
                        value={selectedCurrency}
                        onChange={(e) => handleCurrencyChange(e.target.value)}
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-md bg-white"
                        title="Select currency"
                      >
                        {currencyOptions.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.code}
                          </option>
                        ))}
                      </select>
                    </div>

                    <NavLink
                      to="/wishlist"
                      className="flex items-center gap-2 text-black hover:text-pink-600 py-1"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsMenuOpen(false);
                      }}
                    >
                      <HiOutlineHeart className="text-xl" />
                      Wishlist
                      {wishlistCount > 0 && (
                        <span className="ml-auto bg-pink-500 text-white rounded-full text-xs font-bold px-2">
                          {wishlistCount}
                        </span>
                      )}
                    </NavLink>

                    <NavLink
                      to="/cart"
                      className="flex items-center gap-2 text-black hover:text-blue-600 py-1"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsMenuOpen(false);
                      }}
                    >
                      <HiOutlineShoppingCart className="text-xl" />
                      Cart
                      {cartCount > 0 && (
                        <span className="ml-auto bg-blue-600 text-white rounded-full text-xs font-bold px-2">
                          {cartCount}
                        </span>
                      )}
                    </NavLink>
                    {isAuthed && (
                      <NavLink
                        to="/orders"
                        className="flex items-center gap-2 text-black hover:text-slate-700 py-1"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setIsMenuOpen(false);
                        }}
                      >
                        Order history
                      </NavLink>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {isAuthed ? (
              <NavLink
                to={dashboardPath}
                className="text-gray-100 text-xs"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </NavLink>
            ) : (
              <NavLink
                to="/login"
                className="text-gray-100 text-xs"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </NavLink>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
