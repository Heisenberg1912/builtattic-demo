import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiOutlineSearch,
  HiOutlineSparkles,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import RegistrStrip from "../components/registrstrip";
import Footer from "../components/Footer";
import { marketplaceFeatures } from "../data/marketplace.js";
import { fetchStudios } from "../services/marketplace.js";

const MotionLink = motion(Link);

const Studio = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStyle, setSelectedStyle] = useState("All");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [studios, setStudios] = useState([]);
  const [meta, setMeta] = useState({
    facets: { categories: [], styles: [] },
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 350);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    async function loadStudios() {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (selectedCategory !== "All") params.category = selectedCategory;
        if (selectedStyle !== "All") params.style = selectedStyle;
        if (debouncedQuery) params.search = debouncedQuery;
        const { items, meta } = await fetchStudios(params);
        if (!cancelled) {
          setStudios(items);
          setMeta(meta);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Unable to load studios right now.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    loadStudios();
    return () => {
      cancelled = true;
    };
  }, [selectedCategory, selectedStyle, debouncedQuery]);

  const categories = useMemo(() => {
    const unique = new Set(
      (meta?.facets?.categories || []).map((facet) => facet.name)
    );
    studios.forEach((studio) => {
      (studio.categories || []).forEach((category) => unique.add(category));
    });
    return ["All", ...unique];
  }, [meta, studios]);

  const styles = useMemo(() => {
    const unique = new Set(
      (meta?.facets?.styles || []).map((facet) => facet.name)
    );
    studios.forEach((studio) => {
      if (studio.style) unique.add(studio.style);
      studio.firm?.styles?.forEach((style) => unique.add(style));
    });
    return ["All", ...unique];
  }, [meta, studios]);

  const filteredStudios = useMemo(() => {
    if (selectedStyle === "All") return studios;
    const target = selectedStyle.toLowerCase();
    return studios.filter((studio) => {
      const byProductStyle = studio.style?.toLowerCase() === target;
      const byFirmStyle = studio.firm?.styles?.some(
        (style) => style.toLowerCase() === target
      );
      return byProductStyle || byFirmStyle;
    });
  }, [studios, selectedStyle]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <RegistrStrip />

      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <p className="uppercase tracking-[0.35em] text-xs text-slate-400 mb-4">
            studio catalogues
          </p>
          <h1 className="text-3xl sm:text-5xl font-semibold text-slate-900 mb-4">
            Builtattic Studio Marketplace
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto">
            Browse deploy-ready design systems, BIM deliverables, and procurement
            kits from verified studios. Tune the filters to match your typology,
            style, or geography, then deep-dive into deliverables that ship within
            days.
          </p>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-10 space-y-10 w-full">
        <section className="flex flex-col lg:flex-row lg:items-center gap-4">
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
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
            <select
              value={selectedStyle}
              onChange={(event) => setSelectedStyle(event.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              {styles.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>

            <div className="relative flex-1">
              <HiOutlineSearch className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search studios, locations, or deliverables..."
                className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>
        </section>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {loading && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
            Loading studio catalog...
          </div>
        )}

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {!loading &&
            filteredStudios.map((studio) => {
              const href = studio.slug
                ? `/studio/${studio.slug}`
                : `/studio/${encodeURIComponent(studio.id)}`;
              const priceLabel =
                studio.priceSqft ??
                studio.pricing?.basePrice ??
                studio.price ??
                null;
              const currency = studio.currency || studio.pricing?.currency || "USD";
              const rating =
                typeof studio.rating === "number"
                  ? studio.rating
                  : typeof studio.metrics?.rating === "number"
                  ? studio.metrics.rating
                  : studio.firm?.rating;
              const ratingLabel = rating ? Number(rating).toFixed(1) : "-";
              const reviewLabel =
                typeof studio.reviews === "number"
                  ? studio.reviews.toLocaleString()
                  : studio.metrics?.reviews?.toLocaleString?.() || "0";
              const areaRange = studio.areaRange || studio.metrics?.areaRange;

              return (
                <MotionLink
                  key={studio._id || studio.slug}
                  to={href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group block bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-300"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={studio.heroImage}
                      alt={studio.title}
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="uppercase tracking-[0.3em] text-xs text-slate-400 mb-2">
                          {studio.categories?.join(" | ") || "Studio"}
                        </p>
                        <h2 className="text-xl font-semibold text-slate-900 group-hover:text-slate-700 transition">
                          {studio.title}
                        </h2>
                        <p className="text-sm text-slate-500">
                          {studio.studio || studio.firm?.name}
                        </p>
                      </div>
                      {priceLabel ? (
                        <span className="bg-slate-100 border border-slate-200 text-xs text-slate-600 px-3 py-1 rounded-full whitespace-nowrap">
                          {currency} {priceLabel}{" "}
                          {studio.pricing?.unit
                            ? `/ ${studio.pricing.unit}`
                            : "/ sq.ft"}
                        </span>
                      ) : null}
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {studio.summary}
                    </p>

                    <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <HiOutlineLocationMarker className="w-4 h-4 text-slate-400" />
                        <span>
                          {studio.location?.city}, {studio.location?.country}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HiOutlineSparkles className="w-4 h-4 text-slate-400" />
                        <span>{studio.style || studio.firm?.styles?.[0]}</span>
                      </div>
                      {Array.isArray(areaRange) && areaRange.length === 2 && (
                        <div>
                          <span className="text-slate-400">Area</span>
                          <div className="font-medium text-slate-800">
                            {areaRange[0].toLocaleString()} -{" "}
                            {areaRange[1].toLocaleString()} sq.ft
                          </div>
                        </div>
                      )}
                      {studio.bedrooms?.length ? (
                        <div>
                          <span className="text-slate-400">Bedrooms</span>
                          <div className="font-medium text-slate-800">
                            {studio.bedrooms.join(" - ")}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span className="text-slate-400">Programme</span>
                          <div className="font-medium text-slate-800">
                            {studio.categories?.[0] || "Mixed"}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {studio.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs rounded-full border border-slate-200 text-slate-600 bg-slate-50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 text-sm text-slate-500">
                      <span>
                        Rating {ratingLabel} | {reviewLabel} reviews
                      </span>
                      <span className="font-medium text-slate-900 group-hover:text-slate-700 transition">
                        View detail -&gt;
                      </span>
                    </div>
                  </div>
                </MotionLink>
              );
            })}
        </section>

        {!loading && filteredStudios.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
            No studios match these filters. Try adjusting the typology, style, or
            search keywords.
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

      <Footer />
    </div>
  );
};

export default Studio;
