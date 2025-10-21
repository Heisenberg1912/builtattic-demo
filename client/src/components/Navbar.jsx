import React, { useState, useEffect, useMemo, useRef } from "react";
import { NavLink } from "react-router-dom";
import main_logo from "/src/assets/main_logo/main_logo.png";
import accountLogo from "/src/assets/icons/account-logo.png";
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

const Navbar = () => {
  const [selectedCurrency] = useState(() => {
    try {
      return localStorage.getItem("fx_to") || "INR";
    } catch {
      return "INR";
    }
  });

  useEffect(() => {
    if (window.currency && typeof window.currency.setCode === "function") {
      window.currency.setCode(selectedCurrency);
    }
    window.dispatchEvent(
      new CustomEvent("currency:change", { detail: { code: selectedCurrency } }),
    );
  }, [selectedCurrency]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(min-width: 768px)").matches;
  });

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

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const media = window.matchMedia("(min-width: 768px)");
    const handleMediaChange = (event) => setIsDesktop(event.matches);
    handleMediaChange(media);
    if (media.addEventListener) {
      media.addEventListener("change", handleMediaChange);
    } else if (media.addListener) {
      media.addListener(handleMediaChange);
    }
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", handleMediaChange);
      } else if (media.removeListener) {
        media.removeListener(handleMediaChange);
      }
    };
  }, []);

  // Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownItems = useMemo(
    () => [
      { label: "Dashboard", to: isAuthed ? dashboardPath : "/login" },
      { label: "Account", to: "/account" },
      { label: "Wishlist", to: "/wishlist" },
      { label: "Cart", to: "/cart" },
      { label: "Settings", to: "/settings" },
    ],
    [isAuthed, dashboardPath],
  );

  useEffect(() => {
    if (!isDropdownOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDropdownOpen]);

  useEffect(() => {
    if (!isDropdownOpen) return undefined;
    const handleClick = (event) => {
      if (
        triggerRef.current?.contains(event.target) ||
        dropdownRef.current?.contains(event.target)
      ) {
        return;
      }
      setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isDropdownOpen]);

  const closeDropdown = (shouldCloseMenu = false) => {
    setIsDropdownOpen(false);
    if (shouldCloseMenu) {
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <nav className="bg-black/95 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          {/* Logo */}
          <NavLink to="/" className="flex items-center text-xl font-bold text-gray-100">
            <span className="flex items-center text-inherit leading-none">
              <img src={main_logo} alt="Builtattic Logo" className="h-10 w-auto object-contain" />
              <span className="-ml-2 text-[1.50rem] font-semibold tracking-[0.01em]">uiltattic.</span>
            </span>
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center relative">
            <NavLink to="/ai" className="text-gray-100 hover:text-gray-100 text-xs">VitruviAI</NavLink>
            <NavLink to="/studio" className="text-gray-100 hover:text-gray-100 text-xs">Design Studio</NavLink>
            <NavLink to="/associates" className="text-gray-100 hover:text-gray-100 text-xs">Skill Studio</NavLink>
            <NavLink to="/warehouse" className="text-gray-100 hover:text-gray-100 text-xs">Material Studio</NavLink>
            <NavLink to="/matters" className="text-gray-100 hover:text-gray-100 text-xs">Matters</NavLink>

            <div className="relative" ref={triggerRef}>
              <button
                className="group inline-flex items-center justify-center text-gray-100 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                onClick={() => setIsDropdownOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
                title="Open user menu"
              >
                <img
                  src={accountLogo}
                  alt="Account menu"
                  className="h-6 w-6 object-contain transition group-hover:brightness-110"
                />
              </button>
              <AnimatePresence>
                {isDropdownOpen && isDesktop && (
                  <motion.div
                    ref={dropdownRef}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-3 w-56 rounded-[28px] bg-black/92 text-white shadow-[0_24px_60px_rgba(0,0,0,0.55)] ring-1 ring-white/15"
                  >
                    <nav className="flex flex-col overflow-hidden text-center text-sm font-semibold tracking-wide">
                      {dropdownItems.map((item) => (
                        <NavLink
                          key={item.label}
                          to={item.to}
                          className="px-6 py-3 hover:bg-white/10 transition first:rounded-t-[28px] last:rounded-b-[28px]"
                          onClick={() => closeDropdown(true)}
                        >
                          {item.label}
                        </NavLink>
                      ))}
                    </nav>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {isAuthed ? null : (
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
            <NavLink to="/ai" className="text-gray-100 text-xs" onClick={() => setIsMenuOpen(false)}>
              VitruviAI
            </NavLink>
            <NavLink to="/studio" className="text-gray-100 text-xs" onClick={() => setIsMenuOpen(false)}>
              Design Studio
            </NavLink>
            <NavLink to="/associates" className="text-gray-100 text-xs" onClick={() => setIsMenuOpen(false)}>
              Skill Studio
            </NavLink>
            <NavLink to="/warehouse" className="text-gray-100 text-xs" onClick={() => setIsMenuOpen(false)}>
              Material Studio
            </NavLink>
            <NavLink to="/matters" className="text-gray-100 text-xs" onClick={() => setIsMenuOpen(false)}>
              Matters
            </NavLink>

            <button
              className="inline-flex items-center justify-center self-start text-gray-100 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              onClick={() => {
                setIsDropdownOpen(true);
                setIsMenuOpen(false);
              }}
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
              title="Open user menu"
            >
              <img
                src={accountLogo}
                alt="Account menu"
                className="h-6 w-6 object-contain transition hover:brightness-110"
              />
            </button>

            {isAuthed ? null : (
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

      <AnimatePresence>
        {isDropdownOpen && !isDesktop && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-start justify-center bg-black/55 backdrop-blur-sm pt-24 md:pt-28"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => closeDropdown(true)}
          >
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.18 }}
              className="w-56 rounded-[28px] bg-black/92 text-white shadow-[0_24px_60px_rgba(0,0,0,0.55)] ring-1 ring-white/15"
              onClick={(event) => event.stopPropagation()}
            >
              <nav className="flex flex-col overflow-hidden text-center text-sm font-semibold tracking-wide">
                {dropdownItems.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    className="px-6 py-3 hover:bg-white/10 transition first:rounded-t-[28px] last:rounded-b-[28px]"
                    onClick={() => closeDropdown(true)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
