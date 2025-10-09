import React, { useEffect, useMemo, useState } from "react";
import {
  HiOutlineFilter,
  HiOutlineSearch,
  HiOutlineHeart,
  HiHeart,
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { marketplaceFeatures } from "../data/marketplace.js";
import { fetchMaterials } from "../services/marketplace.js";

const Warehouse = () => {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [favourites, setFavourites] = useState(new Set());
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const toggleFavourite = (id) => {
    setFavourites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <p className="uppercase tracking-[0.35em] text-xs text-slate-400 mb-4">
            procurement
          </p>
          <h1 className="text-3xl sm:text-5xl font-semibold text-slate-900 mb-4">
            Builtattic Warehouse
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl">
            Source certified materials with transparent pricing, logistics, and
            QA documentation. Every partner is vetted for compliance with
            regional building codes.
          </p>
        </div>
      </header>

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

        <div className="relative">
          <HiOutlineSearch className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search materials, vendors, or specifications…"
            className="w-full bg-white border border-slate-200 rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </div>

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
                  Domestic orders ship on Buildattic trucks with live tracking.
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

        <section className="grid gap-6 md:grid-cols-2">
          {!loading &&
            filteredItems.map((item) => {
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

              return (
                <motion.article
                  key={item._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
                >
                  <div className="relative">
                    <img
                      src={item.heroImage}
                      alt={item.title}
                      className="h-48 w-full object-cover"
                      loading="lazy"
                    />
                    <button
                      onClick={() => toggleFavourite(item._id)}
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
                      <p className="text-sm text-slate-500 mt-1">
                        {vendor} · {location}
                      </p>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-600">
                      {(item.specs || []).map((spec) => (
                        <li key={spec.label || spec} className="flex gap-2 items-start">
                          <span className="mt-1 text-slate-400">•</span>
                          <span>
                            {spec.label ? `${spec.label}: ` : ""}
                            {spec.value || spec}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-4 items-center text-sm text-slate-600">
                      <span className="font-semibold text-slate-900">
                        {pricing.currency || item.currency || "USD"}{" "}
                        {pricing.basePrice || item.price} /{" "}
                        {pricing.unit || item.unit || "unit"}
                      </span>
                      {moq ? <span>MOQ {moq.toLocaleString()}</span> : null}
                      {leadTime ? <span>Lead time {leadTime} days</span> : null}
                    </div>
                    <div className="flex gap-3">
                      <button className="flex-1 bg-slate-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition">
                        Request quote
                      </button>
                      <button className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:border-slate-300 transition">
                        Download spec
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
        </section>

        {!loading && filteredItems.length === 0 && (
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

