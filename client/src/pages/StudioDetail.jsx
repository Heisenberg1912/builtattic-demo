import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

import newyork_suburban from "../assets/newyork_suburban.avif";
import california_villa from "../assets/studio/california_villa.avif";
import carolina_abbey from "../assets/studio/carolina_abbey.avif";
import mansion from "../assets/studio/mansion.avif";
import apartment from "../assets/studio/apartment.avif";

const items = [
  {
    id: 1,
    title: "New York Suburban",
    studio: "Studio Mosby, USA",
    logo: "/logo.png",
    image: newyork_suburban,
    price: "$ 9.99 per sq. ft",
    details: "Modern; 1200; Urban; 2",
    features: "Front Lawn + Fenced Backyard, 3 BHK with Garage",
    description:
      "A modern suburban home in New York, designed for comfort and style. Features a spacious front lawn, fenced backyard, and a 3 BHK layout with an attached garage. Perfect for families seeking a blend of urban convenience and suburban tranquility.",
  },
  {
    id: 2,
    title: "California Villa",
    studio: "Studio West, USA",
    logo: "/logo.png",
    image: california_villa,
    price: "$ 12.50 per sq. ft",
    details: "Luxury; 1500; Coastal; 3",
    features: "Pool + Garden, 4 BHK with Balcony",
    description:
      "Experience luxury living in this California villa. Enjoy a private pool, lush garden, and a spacious 4 BHK layout with balconies overlooking the coast. Designed for those who appreciate elegance and comfort.",
  },
  {
    id: 3,
    title: "Texas Ranch",
    studio: "Studio Lone Star, USA",
    logo: "/logo.png",
    image: carolina_abbey,
    price: "$ 8.20 per sq. ft",
    details: "Rustic; 1800; Countryside; 1",
    features: "Open Land + Barn, 5 BHK with Garage",
    description:
      "A rustic Texas ranch with open land and a classic barn. This 5 BHK property is ideal for countryside living, offering ample space for family and outdoor activities. Includes a large garage and traditional ranch features.",
  },
  {
    id: 4,
    title: "Florida Beach House",
    studio: "Studio Palm, USA",
    logo: "/logo.png",
    image: mansion,
    price: "$ 15.00 per sq. ft",
    details: "Modern; 1400; Beachfront; 2",
    features: "Sea View + Pool, 3 BHK with Patio",
    description:
      "Wake up to the sound of waves in this modern Florida beach house. Features a sea view, private pool, and a 3 BHK layout with a relaxing patio. Perfect for beach lovers and those seeking a serene lifestyle.",
  },
  {
    id: 5,
    title: "Chicago Apartment",
    studio: "Studio Skyline, USA",
    logo: "/logo.png",
    image: apartment,
    price: "$ 10.75 per sq. ft",
    details: "Urban; 1000; City Center; 5",
    features: "Gym + Rooftop, 2 BHK with Balcony",
    description:
      "Live in the heart of Chicago with this stylish apartment. Enjoy access to a gym, rooftop views, and a 2 BHK layout with a private balcony. Ideal for urban professionals and small families.",
  },
  {
    id: 6,
    title: "Colorado Cabin",
    studio: "Studio Rocky, USA",
    logo: "/logo.png",
    image: "https://picsum.photos/id/1039/1200/600",
    price: "$ 7.50 per sq. ft",
    details: "Rustic; 1300; Mountains; 2",
    features: "Wood Deck + Fireplace, 4 BHK",
    description:
      "Escape to the mountains in this cozy Colorado cabin. Features a wood deck, fireplace, and a 4 BHK layout. Perfect for those who love nature and mountain living.",
  },
];

const StudioDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = items.find((i) => String(i.id) === String(id));

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Not Found</h2>
        <button
          className="px-4 py-2 bg-gray-200 rounded"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-slate-800">
      {/* Full-width Hero */}
      <motion.header
        className="relative w-full h-[50vh] md:h-[60vh] lg:h-[68vh] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <img
          src={item.image}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-transparent"></div>

        <div className="absolute inset-0 flex flex-col justify-between">
          <div className="flex items-center justify-between px-4 md:px-8 py-4">
            <div className="flex items-center gap-3">
              <img
                src={item.logo}
                alt="logo"
                className="h-10 w-10 rounded-md bg-white/60 p-1"
              />
              <span className="font-semibold text-white text-lg md:text-xl">
                Buildatic
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="bg-white/90 text-slate-800 px-3 py-1 rounded-md text-sm shadow-sm hover:bg-white"
              >
                ← Back
              </button>
            </div>
          </div>

          <div className="px-4 md:px-12 pb-8 md:pb-12">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight drop-shadow-sm">
              {item.title}
            </h1>
            <p className="mt-2 text-sm md:text-lg text-white/90">
              {item.studio}
            </p>
          </div>
        </div>
      </motion.header>

      {/* Full-width Content */}
      <main className="w-full px-4 md:px-8 py-10 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {/* Main column */}
          <section className="md:col-span-2 space-y-8">
            {/* Summary row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                  {item.title}
                </h2>
                <p className="text-sm text-slate-600 mt-1">{item.studio}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-slate-500">Price</div>
                  <div className="text-lg font-semibold text-slate-900">
                    {item.price}
                  </div>
                </div>
              </div>
            </div>

            {/* Overview */}
            <section className="prose max-w-full text-slate-700">
              <h3 className="text-xl font-semibold">Overview</h3>
              <p>{item.description}</p>
            </section>

            {/* Features grid */}
            <section>
              <h3 className="text-lg font-semibold mb-3">Key Features</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 list-none p-0 m-0">
                {item.features.split(",").map((feat, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 bg-white/80 border border-slate-100 rounded-md p-3"
                  >
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium">
                      ✓
                    </span>
                    <span className="text-sm text-slate-700">
                      {feat.trim()}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Additional details / specs */}
            <section className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Specifications</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {item.details.split(";").map((d, i) => (
                  <div
                    key={i}
                    className="bg-white/80 border border-slate-100 rounded-md p-3 text-sm"
                  >
                    <div className="text-slate-500 text-xs">Spec {i + 1}</div>
                    <div className="mt-1 font-medium text-slate-800">
                      {d.trim()}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </section>

          {/* Sidebar */}
          <aside className="md:col-span-1">
            <div className="md:sticky md:top-24 space-y-4">
              <div className="bg-white/95 border border-slate-100 rounded-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500">Studio</div>
                    <div className="font-semibold text-slate-900">
                      {item.studio}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Price</div>
                    <div className="font-semibold text-indigo-700">
                      {item.price}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-600">
                  <div>
                    <strong>ID</strong>
                    <div className="text-slate-500">{item.id}</div>
                  </div>
                  <div>
                    <strong>Type</strong>
                    <div className="text-slate-500">
                      {item.details.split(";")[0] || "-"}
                    </div>
                  </div>
                  <div>
                    <strong>Area</strong>
                    <div className="text-slate-500">
                      {item.details.split(";")[1] || "-"}
                    </div>
                  </div>
                  <div>
                    <strong>Location</strong>
                    <div className="text-slate-500">
                      {item.details.split(";")[2] || "-"}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() =>
                      navigator.clipboard?.writeText(window.location.href)
                    }
                    className="flex-1 bg-indigo-600 text-white py-2 rounded-md text-sm hover:bg-indigo-700"
                  >
                    Share
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex-1 bg-white border border-slate-200 text-slate-800 py-2 rounded-md text-sm hover:bg-slate-50"
                  >
                    Print
                  </button>
                </div>
              </div>

              <div className="bg-white/95 border border-slate-100 rounded-md p-3">
                <div className="text-sm text-slate-600 mb-2">Preview</div>
                <img
                  src={item.image}
                  alt={`${item.title} preview`}
                  className="w-full h-36 object-cover rounded-md"
                />
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StudioDetail;
