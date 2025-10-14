import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  HiOutlineInformationCircle,
  HiOutlineReceiptPercent,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlineArrowPathRoundedSquare,
} from "react-icons/hi2";
import { useCart } from "../context/CartContext";
import { associateCatalog } from "../data/services.js";

const ADDRESS_STORAGE_KEY = "builtattic_profile_addresses";

const readStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const COUPONS = [
  {
    code: "BULK5",
    description: "5% off on material carts above INR 50,000",
    type: "percent",
    value: 5,
    condition: (subtotal) => subtotal >= 50000,
  },
  {
    code: "FREIGHT1000",
    description: "INR 1,000 freight credit on multi-seller orders",
    type: "flat",
    value: 1000,
    condition: (_subtotal, sellers) => sellers > 1,
  },
];
const formatCurrency = (value, currency = "INR") => {
  if (!Number.isFinite(value)) return "On request";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
};

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const addresses = readStorage(ADDRESS_STORAGE_KEY, []);

  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses.find((addr) => addr.isDefault)?.id || addresses[0]?.id || null,
  );
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [gstInvoice, setGstInvoice] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");
  const [serviceSchedules, setServiceSchedules] = useState({});

  useEffect(() => {
    setCouponError("");
  }, [couponCode]);

  const groupedItems = useMemo(() => {
    const map = new Map();
    cartItems.forEach((item) => {
      const seller = item.seller || "Builtattic Fulfilled";
      if (!map.has(seller)) map.set(seller, []);
      map.get(seller).push(item);
    });
    return Array.from(map.entries()).map(([seller, items]) => ({ seller, items }));
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const lineTotal = Number(item.totalPrice ?? item.price * item.quantity);
      const addonTotal = Array.isArray(item.addons)
        ? item.addons.reduce((acc, addon) => acc + Number(addon.price || 0), 0)
        : 0;
      return sum + lineTotal + addonTotal;
    }, 0);
  }, [cartItems]);

  const sellersCount = groupedItems.length;

  const computedCoupon = useMemo(() => {
    if (!appliedCoupon) return null;
    const entry = COUPONS.find((coupon) => coupon.code === appliedCoupon);
    if (!entry) return null;
    if (entry.condition && !entry.condition(subtotal, sellersCount)) return null;
    return entry;
  }, [appliedCoupon, subtotal, sellersCount]);

  const couponValue = computedCoupon
    ? computedCoupon.type === "percent"
      ? (subtotal * computedCoupon.value) / 100
      : computedCoupon.value
    : 0;

  const tax = gstInvoice ? subtotal * 0.18 : 0;
  const grandTotal = Math.max(subtotal - couponValue + tax, 0);

  const handleApplyCoupon = () => {
    const entry = COUPONS.find((coupon) => coupon.code === couponCode.toUpperCase());
    if (!entry) {
      setCouponError("Coupon not recognized");
      return;
    }
    if (entry.condition && !entry.condition(subtotal, sellersCount)) {
      setCouponError("Cart does not meet coupon criteria");
      return;
    }
    setAppliedCoupon(entry.code);
    setCouponError("");
    toast.success(`Coupon ${entry.code} applied`);
  };

  const handleScheduleChange = (itemId, slot) => {
    setServiceSchedules((prev) => ({ ...prev, [itemId]: slot }));
  };

  const getServiceDetails = (item) => {
    if (!item) return null;
    const id = item.serviceId || item.productId || item.id;
    return associateCatalog.find((associate) => associate._id === id) || null;
  };

  useEffect(() => {
    setServiceSchedules((prev) => {
      const next = { ...prev };
      cartItems.forEach((item) => {
        if (item.kind === "service" && !next[item.id]) {
          const fallback = item.schedule || getServiceDetails(item)?.booking?.slots?.[0] || null;
          if (fallback) next[item.id] = fallback;
        }
      });
      return next;
    });
  }, [cartItems]);
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500">
        <HiOutlineInformationCircle className="w-10 h-10 mb-3" />
        <p>Your cart is empty. Explore the marketplace to add materials or service engagements.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className="uppercase tracking-[0.35em] text-xs text-slate-400">
              checkout
            </p>
            <h1 className="text-3xl font-semibold">Order review</h1>
            <p className="text-sm text-slate-600">
              {cartItems.length} line items across {sellersCount} seller{ sellersCount > 1 ? "s" : "" }.
            </p>
          </div>
          <div className="text-sm text-slate-500 flex items-center gap-2">
            <HiOutlineShieldCheck className="w-5 h-5" />
            Payment secured with escrow release on QA approval.
          </div>
        </header>

        <section className="grid lg:grid-cols-[1.6fr_0.8fr] gap-6">
          <div className="space-y-6">
            {groupedItems.map(({ seller, items }) => {
              const isMultiSeller = groupedItems.length > 1;
              return (
                <article key={seller} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                  <header className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-[0.3em]">
                        Seller
                      </p>
                      <h2 className="text-base font-semibold text-slate-900">{seller}</h2>
                    </div>
                    {isMultiSeller && (
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <HiOutlineTruck className="w-4 h-4" /> Consolidated freight available
                      </span>
                    )}
                  </header>

                  <div className="space-y-4">
                    {items.map((item) => {
                      const serviceDetails = item.kind === "service" ? getServiceDetails(item) : null;
                      const slots = serviceDetails?.booking?.slots || [];
                      const selectedSlot = serviceSchedules[item.id] || slots[0];
                      const lineTotal = Number(item.totalPrice ?? item.price * item.quantity);
                      return (
                        <div key={item.id} className="border border-slate-200 rounded-xl px-4 py-3">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                              {item.variation && (
                                <p className="text-xs text-slate-500">Variation: {item.variation}</p>
                              )}
                              <p className="text-xs text-slate-500">
                                Qty {item.quantity} · {formatCurrency(item.price)} each
                              </p>
                              {item.addons?.length > 0 && (
                                <p className="text-xs text-slate-500">
                                  Add-ons: {item.addons.map((addon) => addon.name || addon.title).join(", ")}
                                </p>
                              )}
                              {item.giftMessage && (
                                <p className="text-xs text-slate-500">Gift note: {item.giftMessage}</p>
                              )}
                              {item.subscriptionPlan && (
                                <p className="text-xs text-emerald-600">
                                  Subscription plan: {item.subscriptionPlan}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-2 text-sm text-slate-700">
                              <span className="font-semibold text-slate-900">
                                {formatCurrency(lineTotal)}
                              </span>
                              <div className="inline-flex border border-slate-200 rounded-lg">
                                <button
                                  onClick={() => updateQuantity(item, Math.max(1, Number(item.quantity) - 1))}
                                  className="px-3 py-1"
                                >
                                  -
                                </button>
                                <span className="px-3 py-1 border-l border-r border-slate-200">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item, Number(item.quantity) + 1)}
                                  className="px-3 py-1"
                                >
                                  +
                                </button>
                              </div>
                              <button
                                onClick={() => removeFromCart(item)}
                                className="text-xs text-slate-500 hover:text-slate-700"
                              >
                                Remove
                              </button>
                            </div>
                          </div>

                          {serviceDetails && (
                            <div className="mt-4 border-t border-slate-200 pt-3 text-xs text-slate-600 space-y-2">
                              <p className="uppercase tracking-[0.2em] text-slate-400">
                                Service schedule
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {slots.map((slot) => {
                                  const active = selectedSlot?.date === slot.date && selectedSlot?.start === slot.start;
                                  return (
                                    <button
                                      key={`${slot.date}-${slot.start}`}
                                      onClick={() => handleScheduleChange(item.id, slot)}
                                      className={`px-3 py-1.5 rounded-lg border text-xs ${
                                        active
                                          ? "border-slate-900 bg-slate-900 text-white"
                                          : "border-slate-200 bg-white hover:border-slate-300"
                                      }`}
                                    >
                                      {slot.date} · {slot.start} - {slot.end} ({slot.type})
                                    </button>
                                  );
                                })}
                              </div>
                              <div className="flex items-center gap-2 text-slate-500">
                                <HiOutlineClock className="w-4 h-4" />
                                Lead time {serviceDetails.booking?.leadTimeHours || 24} hours · Reschedule window {serviceDetails.booking?.rescheduleWindowHours || 6} hours
                              </div>
                              <div className="flex items-center gap-2 text-slate-500">
                                <HiOutlineArrowPathRoundedSquare className="w-4 h-4" />
                                Cancel up to {serviceDetails.booking?.cancelWindowHours || 12} hours before slot start
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="space-y-6">
            <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-slate-900">Delivery & billing</h2>
              <div className="space-y-2 text-sm text-slate-600">
                <label className="uppercase tracking-[0.3em] text-xs text-slate-400">
                  Deliver to
                </label>
                <select
                  value={selectedAddressId || ""}
                  onChange={(event) => setSelectedAddressId(event.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2"
                >
                  {addresses.map((address) => (
                    <option key={address.id} value={address.id}>
                      {address.label} · {address.city}
                    </option>
                  ))}
                </select>
                <label className="flex items-center gap-2 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={gstInvoice}
                    onChange={(event) => setGstInvoice(event.target.checked)}
                  />
                  Generate GST invoice with order
                </label>
                <textarea
                  value={orderNotes}
                  onChange={(event) => setOrderNotes(event.target.value)}
                  placeholder="Delivery instructions or compliance notes"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  rows={3}
                />
              </div>
            </section>

            <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <HiOutlineReceiptPercent className="w-5 h-5 text-slate-500" />
                Apply coupon
              </h2>
              <div className="flex gap-2">
                <input
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value)}
                  placeholder="Enter code"
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-xs text-rose-500">{couponError}</p>}
              <ul className="text-xs text-slate-500 space-y-1">
                {COUPONS.map((coupon) => (
                  <li key={coupon.code}>
                    <span className="font-medium text-slate-700">{coupon.code}</span> · {coupon.description}
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2 text-sm text-slate-600">
              <h2 className="text-base font-semibold text-slate-900">Order summary</h2>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {computedCoupon && (
                <div className="flex justify-between text-emerald-600">
                  <span>Coupon {computedCoupon.code}</span>
                  <span>-{formatCurrency(couponValue)}</span>
                </div>
              )}
              {gstInvoice && (
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-semibold text-slate-900 border-t border-slate-200 pt-2">
                <span>Grand total</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
              <button
                onClick={() => toast.success("Checkout initiated with Builtattic operations")}
                className="w-full mt-4 inline-flex justify-center items-center gap-2 px-4 py-3 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
              >
                Place order
              </button>
              <p className="text-xs text-slate-500">
                Escrow released once QA certificates and delivery milestones are acknowledged.
              </p>
            </section>
          </aside>
        </section>
      </main>
    </div>
  );
};

export default Cart;




