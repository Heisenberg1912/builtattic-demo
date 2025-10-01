import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

// Helpers: env, url join, storage, normalization
const trimEndSlash = (s) => (s || "").replace(/\/+$/, "");
const leadSlash = (s) => (s?.startsWith("/") ? s : `/${s || ""}`);
const API_BASE = trimEndSlash(import.meta?.env?.VITE_API_BASE_URL || "");
const withBase = (path) => (API_BASE ? `${API_BASE}${leadSlash(path)}` : leadSlash(path));

const demoHeaders = { headers: { "x-demo-user": "demo-user" } };
const CART_LS_KEY = "cart";
const safeParse = (s, fb) => { try { return JSON.parse(s); } catch { return fb; } };
const readLocal = () => safeParse(localStorage.getItem(CART_LS_KEY), []);
const writeLocal = (items) => localStorage.setItem(CART_LS_KEY, JSON.stringify(items || []));
const keyOf = (item) => item?.productId ?? item?.id ?? item?._id;
const normalizeForLocal = (item) => {
  const id = keyOf(item);
  return {
    id,
    title: item?.title ?? item?.name ?? "Untitled",
    price: Number(item?.price ?? 0),
    image: item?.image ?? item?.img ?? "",
    quantity: Number(item?.quantity ?? 1),
  };
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  // If no API base set, start in local mode
  const [apiAvailable, setApiAvailable] = useState(Boolean(API_BASE));

  const fetchCart = async () => {
    if (!apiAvailable) {
      setCartItems(readLocal());
      return;
    }
    try {
      const { data } = await axios.get(withBase("/api/cart"), demoHeaders);
      setCartItems(data?.items || []);
    } catch (e) {
      console.warn("Cart API unavailable, switching to localStorage:", e?.message || e);
      setApiAvailable(false);
      setCartItems(readLocal());
    }
  };

  const addToCart = async (item) => {
    if (!apiAvailable) {
      const normalized = normalizeForLocal(item);
      const items = readLocal();
      const idx = items.findIndex((it) => keyOf(it) === normalized.id);
      if (idx >= 0) {
        items[idx].quantity = Number(items[idx].quantity || 1) + Number(normalized.quantity || 1);
      } else {
        items.push(normalized);
      }
      writeLocal(items);
      setCartItems(items);
      return;
    }
    try {
      await axios.post(
        withBase("/api/cart/add"),
        {
          productId: keyOf(item),
          source: item?.source || "Studio",
          name: item?.title ?? item?.name ?? "Untitled",
          image: item?.image ?? item?.img ?? "",
          price: Number(item?.price ?? 0),
          quantity: Number(item?.quantity ?? 1),
        },
        demoHeaders
      );
      await fetchCart();
    } catch (e) {
      console.warn("addToCart API failed, switching to localStorage:", e?.message || e);
      setApiAvailable(false);
      return addToCart(item); // retry locally
    }
  };

  const updateQuantity = async (item, quantity) => {
    if (!apiAvailable) {
      const items = readLocal();
      const id = keyOf(item);
      const idx = items.findIndex((it) => keyOf(it) === id);
      if (idx >= 0) {
        if (quantity <= 0) items.splice(idx, 1);
        else items[idx].quantity = Number(quantity);
        writeLocal(items);
        setCartItems(items);
      }
      return;
    }
    try {
      await axios.post(
        withBase("/api/cart/update"),
        {
          productId: keyOf(item),
          source: item?.source || "Studio",
          quantity: Number(quantity),
        },
        demoHeaders
      );
      await fetchCart();
    } catch (e) {
      console.warn("updateQuantity API failed, switching to localStorage:", e?.message || e);
      setApiAvailable(false);
      return updateQuantity(item, quantity); // retry locally
    }
  };

  const removeFromCart = async (item) => {
    if (!apiAvailable) {
      const items = readLocal().filter((it) => keyOf(it) !== keyOf(item));
      writeLocal(items);
      setCartItems(items);
      return;
    }
    try {
      await axios.post(
        withBase("/api/cart/remove"),
        {
          productId: keyOf(item),
          source: item?.source || "Studio",
        },
        demoHeaders
      );
      await fetchCart();
    } catch (e) {
      console.warn("removeFromCart API failed, switching to localStorage:", e?.message || e);
      setApiAvailable(false);
      return removeFromCart(item); // retry locally
    }
  };

  useEffect(() => { fetchCart(); }, []);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQuantity, removeFromCart, fetchCart, apiAvailable }}
    >
      {children}
    </CartContext.Provider>
  );
};