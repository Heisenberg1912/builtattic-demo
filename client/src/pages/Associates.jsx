import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import Footer from "../components/Footer";
import RegistrStrip from "../components/registrstrip";
import { fetchMarketplaceAssociates } from "../services/marketplace.js";
import { useCart } from "../context/CartContext";
import {
  applyFallback,
  getAssociateAvatar,
  getAssociateFallback,
} from "../utils/imageFallbacks.js";

const Associates = () => {
  const { addToCart } = useCart();
  const [query, setQuery] = useState("");
  const [selectedSpecialisation, setSelectedSpecialisation] = useState("All");
  const [associates, setAssociates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function loadAssociates() {
      setLoading(true);
      setError(null);
      try {
        const items = await fetchMarketplaceAssociates();
        if (!cancelled) {
          setAssociates(items);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Unable to load associates right now.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    loadAssociates();
    return () => {
      cancelled = true;
    };
  }, []);

  const specialisations = useMemo(() => {
    const all = associates.flatMap((associate) => associate.specialisations || []);
    return ["All", ...new Set(all)];
  }, [associates]);

  const handleBookCall = (associate) => {
    const slot = associate.booking?.slots?.[0] || null;
    addToCart({
      productId: associate._id,
      title: `${associate.title} discovery session`,
      price: associate.rates?.hourly || associate.rates?.daily || 0,
      quantity: 1,
      seller: associate.user?.email || "Associate network",
      kind: "service",
      serviceId: associate._id,
      schedule: slot,
      addons: [],
      giftMessage: "",
      metadata: {
        timezone: associate.booking?.timezones?.[0] || associate.timezone,
        availability: associate.availability,
      },
      source: "Service",
    });
    toast.success(`Discovery call with ${associate.user?.email || associate.title} added to cart`);
  };

  const filteredAssociates = useMemo(() => {
    return associates.filter((associate) => {
      const matchesQuery =
        !query ||
        associate.title?.toLowerCase().includes(query.toLowerCase()) ||
        associate.summary?.toLowerCase().includes(query.toLowerCase()) ||
        associate.location?.toLowerCase().includes(query.toLowerCase()) ||
        associate.user?.email?.toLowerCase().includes(query.toLowerCase());
      const matchesSpecialisation =
        selectedSpecialisation === "All" ||
        (associate.specialisations || []).includes(selectedSpecialisation);
      return matchesQuery && matchesSpecialisation;
    });
  }, [associates, query, selectedSpecialisation]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <RegistrStrip />
  <main className="flex-1 max-w-6xl mx-auto px-4 py-10 space-y-8">
        <section className="flex flex-col md:flex-row gap-3 md:items-center">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search associates, tools, or locations..."
            className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
          <select
            value={selectedSpecialisation}
            onChange={(event) => setSelectedSpecialisation(event.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            {specialisations.map((specialisation) => (
              <option key={specialisation} value={specialisation}>
                {specialisation}
              </option>
            ))}
          </select>
        </section>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {loading && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
            Loading associates…
          </div>
        )}

        <section className="grid gap-6 md:grid-cols-2">
          {!loading &&
            filteredAssociates.map((associate) => {
              const hourlyRate =
                associate.rates?.hourly ?? associate.hourlyRate ?? null;
              const dailyRate = associate.rates?.daily ?? null;
              const avatarImage = getAssociateAvatar(associate);
              const avatarFallback = getAssociateFallback(associate);
              return (
                <motion.article
                  key={associate._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
                >
                  <div className="p-5 space-y-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={avatarImage}
                        alt={associate.user?.email || associate.title}
                        className="w-20 h-20 rounded-full object-cover border border-slate-200"
                        loading="lazy"
                        onError={(event) => applyFallback(event, avatarFallback)}
                      />
                      <div>
                        <h2 className="text-xl font-semibold text-slate-900">
                          {associate.user?.email?.split("@")[0] || associate.title}
                        </h2>
                        <p className="text-sm text-slate-500">{associate.title}</p>
                        <p className="text-sm text-slate-500">
                          {associate.location}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm text-slate-600">
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">
                          Rate
                        </p>
                        <p>
                          {hourlyRate
                            ? `$${hourlyRate}/${associate.rates?.currency || "hr"}`
                            : "On request"}
                        </p>
                        {dailyRate && (
                          <p className="text-xs text-slate-500">
                            ${dailyRate}/{associate.rates?.currency || "day"}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">
                          Experience
                        </p>
                        <p>{associate.experienceYears} years</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">
                          Availability
                        </p>
                        <p>{associate.availability}</p>
                      </div>
                    </div>

                    <div className="bg-slate-100 border border-slate-200 rounded-lg p-4 text-sm text-slate-600">
                      <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">
                        Specialisations
                      </p>
                      <p>{(associate.specialisations || []).join(" · ")}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                      {(associate.softwares || []).map((software) => (
                        <span
                          key={software}
                          className="px-3 py-1 rounded-full border border-slate-200 bg-slate-100"
                        >
                          {software}
                        </span>
                      ))}
                      {(associate.languages || []).map((language) => (
                        <span
                          key={language}
                          className="px-3 py-1 rounded-full border border-slate-200 bg-slate-100"
                        >
                          {language}
                        </span>
                      ))}
                    </div>

                    {associate.keyProjects?.length ? (
                      <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs text-slate-500">
                        <p className="text-slate-400 uppercase tracking-widest mb-2">
                          Portfolio highlights
                        </p>
                        <ul className="space-y-1">
                          {associate.keyProjects.slice(0, 3).map((project) => (
                            <li key={`${project.title}-${project.year}`}>
                              <span className="text-slate-700 font-medium">
                                {project.title}
                              </span>{" "}
                              · {project.scope} ({project.year})
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleBookCall(associate)}
                        className="bg-slate-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition"
                      >
                        Book discovery call
                      </button>
                      <Link
                        to="/associateportfolio"
                        state={{ associate }}
                        className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:border-slate-300 transition"
                      >
                        View portfolio
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
        </section>

        {!loading && filteredAssociates.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
            No associates found. Try a different role or keyword.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Associates;


