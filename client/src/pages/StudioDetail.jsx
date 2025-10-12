import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import { fallbackStudios } from "../data/marketplace.js";
import { fetchStudioBySlug } from "../services/marketplace.js";

const StudioDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [studio, setStudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function loadStudio() {
      setLoading(true);
      setError(null);
      try {
        const item = await fetchStudioBySlug(id);
        if (!cancelled) {
          setStudio(item);
          if (!item) {
            setError("Studio not found.");
          }
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err?.response?.status === 404
              ? "Studio not found."
              : err?.message || "We could not load this studio right now.";
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadStudio();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const pricing = useMemo(() => studio?.pricing, [studio]);
  const specs = useMemo(() => studio?.specs || [], [studio]);
  const highlights = studio?.highlights || [];
  const deliverables = studio?.delivery?.items || [];
  const gallery = useMemo(
    () => studio?.gallery?.filter((asset) => asset !== studio?.heroImage) || [],
    [studio]
  );

  const previewAssets = useMemo(
    () => (studio?.assets || []).filter((asset) => asset.kind !== "deliverable"),
    [studio]
  );

  const secureAssets = useMemo(
    () => (studio?.assets || []).filter((asset) => asset.kind === "deliverable"),
    [studio]
  );

  const recommendations = useMemo(() => {
    const pool = fallbackStudios.filter(
      (item) =>
        item.slug !== studio?.slug &&
        item._id !== studio?._id &&
        item.kind === "studio"
    );
    const preferredCategory = studio?.categories?.[0];
    if (preferredCategory) {
      const categoryMatches = pool.filter((item) =>
        (item.categories || []).includes(preferredCategory)
      );
      if (categoryMatches.length >= 5) return categoryMatches.slice(0, 6);
    }
    return pool.slice(0, 6);
  }, [studio]);

  const priceLabel =
    studio?.priceSqft ??
    pricing?.basePrice ??
    studio?.price ??
    null;
  const currency = studio?.currency || pricing?.currency || "USD";

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white border border-slate-200 rounded-xl px-6 py-4 text-slate-500 text-sm">
            Loading studioâ€¦
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !studio) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 px-4">
        <h2 className="text-2xl font-semibold mb-3">{error || "Studio not found"}</h2>
        <p className="text-sm text-slate-600 mb-6 text-center max-w-md">
          Try returning to the studio marketplace to explore other catalogue-ready
          systems.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-slate-300 rounded-md text-sm text-slate-700 hover:bg-slate-100"
          >
            Go back
          </button>
          <Link
            to="/studio"
            className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm hover:bg-slate-800"
          >
            Studio marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <motion.header
        className="relative w-full h-[50vh] md:h-[60vh] lg:h-[68vh] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {studio.heroImage && (
          <img
            src={studio.heroImage}
            alt={studio.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-between">
          <div className="flex items-start justify-between px-4 md:px-8 py-6 text-white">
            <div>
              <p className="uppercase tracking-[0.3em] text-xs text-white/70 mb-2">
                {studio.categories?.join(" | ") || "Studio"}
              </p>
              <h1 className="text-3xl md:text-4xl font-semibold">{studio.title}</h1>
              <p className="text-sm text-white/80 mt-1">
                {studio.studio || studio.firm?.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                price
              </p>
              {priceLabel ? (
                <p className="text-lg font-semibold">
                  {currency} {priceLabel}{" "}
                  {pricing?.unit ? `/ ${pricing.unit}` : "/ sq.ft"}
                </p>
              ) : (
                <p className="text-lg font-semibold">Talk to sales</p>
              )}
            </div>
          </div>
          <div className="px-4 md:px-8 pb-6 text-white text-sm space-y-2">
            <div className="inline-flex flex-wrap items-center gap-4 bg-black/35 backdrop-blur px-4 py-2 rounded-full">
              {studio.style && <span>{studio.style}</span>}
              {pricing?.tierPricing?.length ? (
                <span>{pricing.tierPricing.length} pricing tiers</span>
              ) : null}
              {studio.location?.city && (
                <span>
                  {studio.location.city}, {studio.location.country}
                </span>
              )}
              {studio.delivery?.leadTimeWeeks && (
                <span>
                  Lead time {studio.delivery.leadTimeWeeks} weeks Â·{" "}
                  {studio.delivery.fulfilmentType}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 lg:px-0 py-10 lg:py-16 space-y-10">
          <nav className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
            <button
              onClick={() => navigate(-1)}
              className="hover:text-slate-600 transition"
            >
              Back
            </button>
          <Link to="/studio" className="hover:text-slate-600 transition">
            All studios
          </Link>
        </nav>

          {(studio.heroImage || gallery.length > 0) && (
            <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Gallery</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {studio.heroImage && (
                  <div className="md:col-span-2 lg:col-span-2 rounded-xl overflow-hidden border border-slate-100">
                    <img
                      src={studio.heroImage}
                      alt={`${studio.title} hero`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                {(gallery.length ? gallery : []).map((image) => (
                  <div
                    key={image}
                    className="rounded-xl overflow-hidden border border-slate-100"
                  >
                    <img
                      src={image}
                      alt={`${studio.title} gallery asset`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="grid md:grid-cols-3 gap-10 lg:gap-16">
            <section className="md:col-span-2 space-y-8">
              <article className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Overview
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {studio.summary || studio.description}
                </p>
                <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-600">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Programme
                    </p>
                    <p className="mt-2 font-medium text-slate-900">
                      {studio.categories?.join(", ") || "Multiple"}
                    </p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Location
                    </p>
                    <p className="mt-2 font-medium text-slate-900">
                      {studio.location?.city}, {studio.location?.country}
                    </p>
                  </div>
                  {pricing?.tierPricing?.length ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        Pricing tiers
                      </p>
                      <ul className="mt-2 space-y-1 text-slate-700">
                        {pricing.tierPricing.map((tier, idx) => (
                          <li key={`${tier.min}-${tier.max}-${idx}`}>
                            {tier.min?.toLocaleString()} â€“{" "}
                            {tier.max?.toLocaleString()}{" "}
                            {pricing.unit || "sq.ft"} Â· {currency} {tier.price}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {studio.delivery?.leadTimeWeeks && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        Fulfilment
                      </p>
                      <p className="mt-2 font-medium text-slate-900">
                        {studio.delivery.leadTimeWeeks} weeks Â·{" "}
                        {studio.delivery.fulfilmentType}
                      </p>
                    </div>
                  )}
                </div>
              </article>

              {highlights.length > 0 && (
                <article className="bg-white border border-slate-200 rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    Highlights
                  </h2>
                  <ul className="space-y-3 text-sm text-slate-600">
                    {highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3"
                      >
                        <span className="mt-1 h-2 w-2 rounded-full bg-slate-400 flex-shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              )}

              {specs.length > 0 && (
                <article className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Specifications
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-600">
                    {specs.map((spec, idx) => (
                      <div
                        key={`${spec.label}-${idx}`}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-4"
                      >
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                          {spec.label}
                        </p>
                        <p className="mt-2 font-medium text-slate-900">
                          {spec.value} {spec.unit || ""}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>
              )}

              {recommendations.length > 0 && (
                <article className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">For you</h2>
                      {studio.categories?.length ? (
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mt-1">
                          Inspired by {studio.categories[0]}
                        </p>
                      ) : null}
                    </div>
                    <Link
                      to="/studio"
                      className="text-xs text-slate-500 hover:text-slate-700"
                    >
                      Browse all
                    </Link>
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {recommendations.map((item) => (
                      <Link
                        key={item._id || item.slug}
                        to={item.slug ? `/studio/${item.slug}` : "#"}
                        className="min-w-[220px] max-w-[240px] bg-slate-50 border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition flex-shrink-0"
                      >
                        {item.heroImage && (
                          <img
                            src={item.heroImage}
                            alt={item.title}
                            className="w-full h-32 object-cover"
                            loading="lazy"
                          />
                        )}
                        <div className="p-4 space-y-2">
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                            {item.categories?.[0] || "Studio"}
                          </p>
                          <p className="text-sm font-semibold text-slate-800 line-clamp-2">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-500 line-clamp-2">
                            {item.summary || item.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </article>
              )}

              {secureAssets.length > 0 && (
                <article className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Secure deliverables
                  </h2>
                  <p className="text-xs text-slate-500">
                    Delivered via encrypted download after payment and contract acceptance.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {secureAssets.map((asset) => (
                      <li
                        key={asset.key}
                        className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                      >
                        <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-slate-800">{asset.filename}</p>
                          <p className="text-xs text-slate-500">
                            {asset.kind} Â· {asset.mimeType || "file"}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </article>
              )}
            </section>

            <aside className="space-y-6 md:col-span-1 md:sticky md:top-24">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Studio
                    </p>
                    <p className="text-lg font-semibold text-slate-900">
                      {studio.studio || studio.firm?.name}
                    </p>
                    {studio.firm?.tagline && (
                      <p className="text-xs text-slate-500 mt-1">
                        {studio.firm.tagline}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Rating
                    </p>
                    <p className="text-lg font-semibold text-slate-900">
                      {studio.firm?.rating?.toFixed?.(1) ?? "â€”"}
                    </p>
                  </div>
                </div>

                {studio.firm?.services?.length ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-2">
                      Services
                    </p>
                    <ul className="space-y-2 text-sm text-slate-600">
                      {studio.firm.services.slice(0, 3).map((service) => (
                        <li key={service.title}>
                          <span className="font-medium text-slate-800">
                            {service.title}
                          </span>
                          <p className="text-xs text-slate-500">
                            {service.description}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Type
                    </p>
                    <p className="mt-1 font-medium text-slate-900">
                      {studio.categories?.[0] || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Style
                    </p>
                    <p className="mt-1 font-medium text-slate-900">
                      {studio.style || studio.firm?.styles?.[0] || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Lead time
                    </p>
                    <p className="mt-1 font-medium text-slate-900">
                      {studio.delivery?.leadTimeWeeks
                        ? `${studio.delivery.leadTimeWeeks} weeks`
                        : "On request"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Fulfilment
                    </p>
                    <p className="mt-1 font-medium text-slate-900">
                      {studio.delivery?.handOverMethod || studio.delivery?.handoverMethod || "Digital"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <a
                    href={`mailto:${studio.firm?.contact?.email || "hello@builtattic.com"}`}
                    className="flex-1 bg-slate-900 text-white py-2.5 rounded-md text-sm text-center hover:bg-slate-800 transition"
                  >
                    Request access
                  </a>
                  <button
                    onClick={() => window.print()}
                    className="flex-1 border border-slate-300 text-slate-700 py-2.5 rounded-md text-sm hover:bg-slate-100 transition"
                  >
                    Print dossier
                  </button>
                </div>
              </div>

              {deliverables.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    Deliverables
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {deliverables.map((deliverable) => (
                      <li key={deliverable} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-slate-400 flex-shrink-0" />
                        <span>{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                  {studio.delivery?.instructions && (
                    <p className="text-xs text-slate-500 mt-3">
                      {studio.delivery.instructions}
                    </p>
                  )}
                </div>
              )}

              {previewAssets.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Preview assets
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {previewAssets.map((asset) => (
                      <li key={asset.key}>
                        <a
                          href={asset.url || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-900 hover:text-slate-700 font-medium"
                        >
                          {asset.filename || asset.key}
                        </a>
                        <p className="text-xs text-slate-500">
                          {asset.mimeType || "file"} {asset.secure ? "Â· secure" : ""}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StudioDetail;

