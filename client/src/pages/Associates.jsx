import React, { useState, useEffect, useRef } from "react";
import Footer from "/src/components/Footer.jsx";
import { useCurrency } from "../components/CurrencyProvider";
import { motion, AnimatePresence } from "framer-motion";

const blocks = [
  {
    id: 1,
    title: "John Doe",
    studio: "Stanford University",
    cover:
      "https://imgs.search.brave.com/cRAfi7Z-cHDCrmV0GbvgNhfTjqmgd9Q7ifhSJ4KdtoQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jbXMu/aW50ZXJpb3Jjb21w/YW55LmNvbS93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyNC8wOC9t/b2Rlcm4td29vZGVu/LWhvbWUtZGVzaWdu/LmpwZw",
    price: "$200 / week",
    details: "Graduate • Class of 2024",
    features: "Los Angeles, USA",
    logo: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  },
  {
    id: 2,
    title: "Emily Carter",
    studio: "Harvard University",
    cover: "https://via.placeholder.com/800x400",
    price: "$180 / week",
    details: "Student • 3rd Year",
    features: "Dubai, UAE",
    logo: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  },
  {
    id: 3,
    title: "Rajesh Kumar",
    studio: "IIT Delhi",
    cover: "https://via.placeholder.com/800x400",
    price: "$150 / week",
    details: "Graduate • Class of 2023",
    features: "Kerala, India",
    logo: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  },
  {
    id: 4,
    title: "Sophia Martinez",
    studio: "Oxford University",
    cover: "https://via.placeholder.com/800x400",
    price: "$210 / week",
    details: "Student • 2nd Year",
    features: "New York, USA",
    logo: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  },
  {
    id: 5,
    title: "Michael Lee",
    studio: "MIT",
    cover: "https://via.placeholder.com/800x400",
    price: "$230 / week",
    details: "Graduate • Class of 2022",
    features: "Kerala, India",
    logo: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  },
  {
    id: 6,
    title: "Aisha Khan",
    studio: "University of Toronto",
    cover: "https://via.placeholder.com/800x400",
    price: "$175 / week",
    details: "Student • Final Year",
    features: "Swiss Alps",
    logo: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  },
];

const Associates = () => {
  const { format, flag } = useCurrency();
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef(null);

  const handleBlockClick = (block) => {
    const params = new URLSearchParams(block).toString();
    window.open(
      `${window.location.origin}/associateportfolio?${params}`,
      "_blank"
    );
  };

  // Close filter when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="bg-white text-[#1D1D1F] min-h-screen p-6 sm:p-8 lg:p-12 font-sans">
        <div className="max-w-[1700px] mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#1D1D1F]">
              Hire Top Associates
            </h1>
            <p className="text-lg text-[#6E6E73] mt-3">
              Connect with the brightest students and graduates for your
              projects.
            </p>
          </motion.div>

          {/* Filter Dropdown Button */}
          <div className="relative flex justify-end mb-6" ref={filterRef}>
            <button
              onClick={() => setShowFilter((prev) => !prev)}
              className="px-5 py-2 rounded-lg bg-[#1D1D1F] text-white font-medium shadow-md hover:bg-[#333] transition"
            >
              Filters ⏷
            </button>

            <AnimatePresence>
              {showFilter && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="absolute right-0 mt-12 w-72 bg-white border rounded-xl shadow-xl p-4 z-20"
                >
                  {/* Price Range */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-1">
                      Price ($/week)
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="500"
                      className="w-full accent-[#1D1D1F]"
                    />
                  </div>

                  {/* Rooms */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-1">
                      Rooms
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      className="w-full accent-[#1D1D1F]"
                    />
                  </div>

                  {/* Area */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-1">
                      Area (sq.ft)
                    </label>
                    <input
                      type="range"
                      min="500"
                      max="10000"
                      className="w-full accent-[#1D1D1F]"
                    />
                  </div>

                  {/* Location Dropdowns */}
                  <div className="space-y-3">
                    <select className="w-full border rounded-lg px-3 py-2 text-sm">
                      <option>Country</option>
                      <option>India</option>
                      <option>USA</option>
                      <option>UAE</option>
                    </select>
                    <select className="w-full border rounded-lg px-3 py-2 text-sm">
                      <option>State</option>
                      <option>Madhya Pradesh</option>
                      <option>California</option>
                      <option>Ontario</option>
                    </select>
                    <select className="w-full border rounded-lg px-3 py-2 text-sm">
                      <option>City</option>
                      <option>Indore</option>
                      <option>Los Angeles</option>
                      <option>Dubai</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Grid of Associates */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12 px-6">
            {blocks.map((block, index) => {
              const priceNum = parseFloat(
                (block.price || "").replace(/[^0-9.]/g, "")
              );
              return (
                <motion.div
                  key={block.id}
                  onClick={() => handleBlockClick(block)}
                  className="cursor-pointer bg-white rounded-xl overflow-hidden transform transition duration-300 hover:scale-[1.01] hover:shadow-2xl"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {/* Top row */}
                  <div className="flex items-center justify-between px-4 pt-4">
                    <div>
                      <h2 className="text-lg font-bold">{block.title}</h2>
                      <p className="text-sm text-gray-500">{block.studio}</p>
                    </div>
                    <img
                      src={block.logo}
                      alt="Logo"
                      className="w-10 h-10 object-contain"
                    />
                  </div>

                  {/* Cover */}
                  <div className="relative w-full aspect-[21/9] mt-3">
                    <img
                      src={block.cover}
                      alt={block.title}
                      className="absolute rounded-lg inset-0 w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="p-5">
                    <div className="text-gray-800 font-semibold flex items-center">
                      {format(priceNum)} <span className="ml-1">{flag}</span>
                      <span className="ml-1 text-xs text-gray-500 font-normal">
                        / week
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {block.details}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {block.features}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Associates;
