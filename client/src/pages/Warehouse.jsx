﻿import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineFilter,
  HiOutlineSearch,
  HiOutlineHeart,
  HiHeart,
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { marketplaceFeatures } from "../data/marketplace.js";
import { fetchMaterials } from "../services/marketplace.js";
import { analyzeImage } from "../utils/imageSearch.js";

const Warehouse = () => {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [favourites, setFavourites] = useState(new Set());
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [imageKeywords, setImageKeywords] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageStatus, setImageStatus] = useState("");
  const [imageSearching, setImageSearching] = useState(false);
  const imageInputRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    async function loadMaterials() {
      setLoading(true);
      setError(null);
      try {
        const { items } = await fetchMaterials();
        if (!cancelled) {
          setMaterials(items);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Unable to load warehouse catalogue.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    loadMaterials();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const unique = new Set(materials.map((item) => item.category).filter(Boolean));
    return ["All", ...unique];
  }, [materials]);

  const filteredItems = useMemo(() => {
    return materials.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchesQuery =
        !query ||
        item.title?.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase()) ||
        item.metafields?.vendor?.toLowerCase().includes(query.toLowerCase()) ||
        item.metafields?.location?.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [materials, selectedCategory, query]);

  const displayItems = useMemo(() => {
    if (!imageKeywords.length) return filteredItems;
    const needles = imageKeywords.map((kw) => kw.toLowerCase());
    return filteredItems.filter((item) => {
      const haystack = [
        item.title,
        item.description,
        item.category,
        item.metafields?.vendor,
        item.metafields?.location,
      ]
        .filter(Boolean)
        .map((value) => String(value).toLowerCase());
      return needles.some((needle) => haystack.some((part) => part.includes(needle)));
    });
  }, [filteredItems, imageKeywords]);

  const toggleFavourite = (id) => {
    setFavourites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleReverseSearchClick = () => {
    imageInputRef.current?.click();
  };

  const handleImageSelected = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageSearching(true);
    setImageStatus("Analysing reference image...");
    try {
      const result = await analyzeImage(file);
      setImagePreview(result.dataUrl);
      setImageKeywords(result.keywords);
      setImageStatus(`Matched colour keywords: ${result.keywords.join(", ")}`);
    } catch (err) {
      console.error("Reverse image search failed", err);
      setImagePreview(null);
      setImageKeywords([]);
      setImageStatus(err?.message || "Could not analyse the image.");
    } finally {
      setImageSearching(false);
      if (event.target) event.target.value = "";
    }
  };

  const clearImageSearch = () => {
    setImageKeywords([]);
    setImagePreview(null);
    setImageStatus("");
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900">
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  selectedCategory === category
                    ? "bg-slate-900 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:border-slate-300"
          >
            <HiOutlineFilter className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <HiOutlineSearch className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search materials, vendors, or specifications…"
              className="w-full bg-white border border-slate-200 rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>
          <button
            type="button"
            onClick={handleReverseSearchClick}
            disabled={imageSearching}
            className="whitespace-nowrap px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 bg-white hover:border-slate-300 disabled:opacity-60"
          >
            {imageSearching ? "Scanning..." : "Reverse image"}
          </button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelected}
          />
        </div>

        {(imageStatus || imagePreview || imageKeywords.length > 0) && (
          <section className="bg-white border border-slate-200 rounded-xl px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm">
            <div className="space-y-1">
              <p className="font-semibold text-slate-700">Reverse image search</p>
              <p className="text-slate-500">
                {imageStatus || "Upload a reference photo to surface similar inventory."}
              </p>
              {imageKeywords.length > 0 && (
                <p className="text-slate-400 text-xs uppercase tracking-wide">
                  Matched keywords: {imageKeywords.join(", ")}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Reverse search preview"
                  className="w-16 h-16 rounded-lg border border-slate-200 object-cover"
                />
              )}
              {imageKeywords.length > 0 && (
                <button
                  type="button"
                  onClick={clearImageSearch}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:border-slate-300"
                >
                  Clear
                </button>
              )}
            </div>
          </section>
        )}

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white border border-slate-200 rounded-xl p-6 grid sm:grid-cols-2 gap-6"
            >
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-2">
                  Freight options
                </p>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Domestic orders ship on Builtattic trucks with live tracking.
                  International consignments include customs brokerage and
                  consolidated documentation.
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-2">
                  Quality assurance
                </p>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Mill certificates, QA test reports, and warranty statements are
                  bundled with every shipment. Our team audits batches for IS/ASTM
                  compliance.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {loading && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
            Loading warehouse inventory…
          </div>
        )}

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {!loading &&
            displayItems.map((item) => {
              const favourite = favourites.has(item._id);
              const pricing = item.pricing || {};
              const vendor = item.metafields?.vendor || "Builtattic partner";
              const location = item.metafields?.location || "Global";
              const moq =
                item.metafields?.moq ??
                pricing.minQuantity ??
                item.inventory ??
                0;
              const leadTime =
                item.metafields?.leadTimeDays ||
                (item.delivery?.leadTimeWeeks
                  ? `${item.delivery.leadTimeWeeks * 7}`
                  : null);

              const detailPath = item.slug
                ? `/warehouse/${item.slug}`
                : `/warehouse/${item._id}`;

              return (
                <motion.article
                  key={item._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
                >
                  <Link to={detailPath} className="block h-full">
                    <div className="relative">
                      <img
                        src={item.heroImage}
                        alt={item.title}
                        className="h-48 w-full object-cover"
                        loading="lazy"
                      />
                      <button
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          toggleFavourite(item._id);
                        }}
                        className="absolute top-3 right-3 bg-white/85 rounded-full p-2 shadow-sm"
                        aria-label="Toggle favourite"
                      >
                        {favourite ? (
                          <HiHeart className="text-rose-500 w-5 h-5" />
                        ) : (
                          <HiOutlineHeart className="text-slate-700 w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <div className="p-5 space-y-4">
                      <div>
                        <p className="uppercase tracking-[0.3em] text-xs text-slate-400 mb-2">
                          {item.category}
                        </p>
                        <h2 className="text-xl font-semibold text-slate-900">
                          {item.title}
                        </h2>
                        <p className="text-sm text-slate-500">
                          {vendor} • {location}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs text-slate-600">
                        <div className="bg-slate-100 border border-slate-200 rounded-lg p-3">
                          <p className="text-slate-500 uppercase tracking-widest text-[10px] mb-1">
                            Unit price
                          </p>
                          <p className="text-sm font-semibold text-slate-900">
                            {pricing.basePrice
                              ? `${pricing.currency || "USD"} ${pricing.basePrice}`
                              : "On request"}
                          </p>
                          {pricing.unitLabel && (
                            <p className="text-[11px] text-slate-500 mt-1">
                              {pricing.unitLabel}
                            </p>
                          )}
                        </div>
                        <div className="bg-slate-100 border border-slate-200 rounded-lg p-3">
                          <p className="text-slate-500 uppercase tracking-widest text-[10px] mb-1">
                            MOQ & lead time
                          </p>
                          <p className="text-sm font-semibold text-slate-900">
                            MOQ {moq.toLocaleString()}
                          </p>
                          {leadTime && (
                            <p className="text-[11px] text-slate-500 mt-1">
                              Lead time {leadTime} days
                            </p>
                          )}
                        </div>
                      </div>

                      {item.highlights?.length ? (
                        <ul className="text-xs text-slate-500 space-y-1">
                          {item.highlights.slice(0, 3).map((highlight) => (
                            <li key={highlight}>• {highlight}</li>
                          ))}
                        </ul>
                      ) : null}

                      {item.delivery?.items?.length ? (
                        <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs text-slate-500">
                          <p className="text-slate-400 uppercase tracking-widest mb-2">
                            Portfolio deliverables
                          </p>
                          <ul className="space-y-1">
                            {item.delivery.items.slice(0, 3).map((deliverable) => (
                              <li key={deliverable}>• {deliverable}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      <div className="flex gap-3">
                        <button className="bg-slate-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition">
                          Add to cart
                        </button>
                        <button className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:border-slate-300 transition">
                          Enquire
                        </button>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
        </section>

        {!loading && displayItems.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
            No materials match the current filters. Adjust your search to explore
            more inventory.
          </div>
        )}

        <section className="bg-white border border-slate-200 rounded-2xl p-8">
          <div className="grid md:grid-cols-3 gap-8">
            {marketplaceFeatures.map((feature) => (
              <div key={feature.title}>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Warehouse;
