import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
import Firms from "./pages/Firms";
import CartPage from "./pages/CartPage";
import Associates from "./pages/Associates";
import FirmPortfolio from "./pages/FirmPortfolio";
import Ai from "./pages/Ai";
import CurrencyConverter from "./pages/CurrencyConverter";

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

// Single shared map & export (avoid redefining later)
export const roleDashboardPath = {
  superadmin: "/dashboard/super-admin",
  admin: "/dashboard/admin",
  user: "/dashboard/user",
  associate: "/dashboard/associate",
  firm: "/dashboard/firm",
  client: "/dashboard/client",
  vendor: "/dashboard/vendor",
};

const App = () => {
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

  return (
    <CartProvider>
      <WishlistProvider>
        <>
          <Navbar />
          <Toaster position="top-right" gutter={8} toastOptions={{ duration: 3000 }} />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLoginSuccess} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/cartpage" element={<CartPage />} />
            {/* AI routes */}
            <Route path="/ai" element={<Ai />} />
            <Route path="/aisetting" element={<Ai />} />
            {/* Studio (formerly Amazon) */}
            <Route path="/studio" element={<Studio />} />
            {/* Warehouse (formerly Blinkit) */}
            <Route path="/warehouse" element={<Warehouse />} />
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
        </>
      </WishlistProvider>
    </CartProvider>
  );
};

export default App;


