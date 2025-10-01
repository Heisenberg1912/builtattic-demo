import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

// Helpers
const WISHLIST_LS_KEY = "wishlist";
const trimEndSlash = (s) => (s || "").replace(/\/+$/, "");
const leadSlash = (s) => (s?.startsWith("/") ? s : `/${s || ""}`);
const API_BASE = trimEndSlash(import.meta?.env?.VITE_API_BASE_URL || "");
const withBase = (path) => (API_BASE ? `${API_BASE}${leadSlash(path)}` : leadSlash(path));
const demoHeaders = { headers: { "x-demo-user": "demo-user" } };

const safeParse = (s, fb) => { try { return JSON.parse(s); } catch { return fb; } };
const readLocal = () => safeParse(localStorage.getItem(WISHLIST_LS_KEY), []);
const writeLocal = (items) => localStorage.setItem(WISHLIST_LS_KEY, JSON.stringify(items || []));
const keyOf = (item) => item?.productId ?? item?.id ?? item?._id;

// Client normalized item (local mode)
const normalize = (item) => {
  const pid = String(keyOf(item));
  return {
    id: pid,            // string id for consistent Set checks
    productId: pid,     // include productId for API/remove compatibility
    title: item?.title ?? item?.name ?? "Untitled",
    price: Number(item?.price ?? 0),
    image: item?.image ?? item?.img ?? "",
    source: item?.source || "Studio",
  };
};

// Server item -> client normalized (API mode)
const normalizeServerItem = (it) => {
  const pid = String(it?.productId ?? it?.id ?? it?._id);
  return {
    id: pid,
    productId: pid,
    title: it?.name ?? it?.title ?? "Untitled",
    price: Number(it?.price ?? 0),
    image: it?.image ?? it?.img ?? "",
    source: it?.source || "Studio",
  };
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [apiAvailable, setApiAvailable] = useState(Boolean(API_BASE));

  const fetchWishlist = async () => {
    if (!apiAvailable) {
      // normalize local items for consistent shape
      const local = (readLocal() || []).map(normalize);
      setWishlistItems(local);
      return;
    }
    try {
      const { data } = await axios.get(withBase("/api/wishlist"), demoHeaders);
      const serverItems = Array.isArray(data?.items) ? data.items : [];
      setWishlistItems(serverItems.map(normalizeServerItem));
    } catch (e) {
      console.warn("Wishlist API unavailable, using localStorage:", e?.message || e);
      setApiAvailable(false);
      const local = (readLocal() || []).map(normalize);
      setWishlistItems(local);
    }
  };

  const addToWishlist = async (item) => {
    if (!apiAvailable) {
      const norm = normalize(item);
      const items = readLocal();
      if (!items.find((it) => String(keyOf(it)) === norm.id)) items.push(norm);
      writeLocal(items);
      setWishlistItems(items.map(normalize));
      return;
    }
    try {
      await axios.post(
        withBase("/api/wishlist/add"),
        {
          productId: keyOf(item),
          source: item?.source || "Studio",
          name: item?.title ?? item?.name ?? "Untitled",
          image: item?.image ?? item?.img ?? "",
          price: Number(item?.price ?? 0),
        },
        demoHeaders
      );
      await fetchWishlist();
    } catch (e) {
      console.warn("addToWishlist API failed, using localStorage:", e?.message || e);
      setApiAvailable(false);
      return addToWishlist(item); // retry locally
    }
  };

  const removeFromWishlist = async (item) => {
    if (!apiAvailable) {
      const id = String(keyOf(item));
      const items = readLocal().filter((it) => String(keyOf(it)) !== id);
      writeLocal(items);
      setWishlistItems(items.map(normalize));
      return;
    }
    try {
      await axios.post(
        withBase("/api/wishlist/remove"),
        { productId: keyOf(item), source: item?.source || "Studio" },
        demoHeaders
      );
      await fetchWishlist();
    } catch (e) {
      console.warn("removeFromWishlist API failed, using localStorage:", e?.message || e);
      setApiAvailable(false);
      return removeFromWishlist(item); // retry locally
    }
  };

  useEffect(() => { fetchWishlist(); }, []);

  return (
    <WishlistContext.Provider
      value={{ wishlistItems, addToWishlist, removeFromWishlist, fetchWishlist, apiAvailable }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
