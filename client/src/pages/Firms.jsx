import React, { useState } from "react";
import Footer from "/src/components/Footer.jsx";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import tech_corp from "/src/assets/firms/tech_corp.avif";
import global_finance_tower from "/src/assets/firms/global_finance_tower.avif";
import innovation_hub from "/src/assets/firms/innovation_hub.avif";
import metro_business from "/src/assets/firms/metro_business.avif";
import healthcare from "/src/assets/firms/healthcare.avif";
import cultural_center from "/src/assets/firms/cultural_center.avif";
import gov from "/src/assets/firms/gov.jpeg";
import Commercial from "/src/assets/category_icon/commercial.avif";
import residential from "/src/assets/category_icon/residential.avif";
import mixed_use from "/src/assets/category_icon/mixed_use.avif";
import institutional from "/src/assets/category_icon/institutional.avif";
import industrial from "/src/assets/category_icon/industrial.avif"; 
import agricultural from "/src/assets/category_icon/agricultural.avif";
import recreational from "/src/assets/category_icon/recreational.avif";
import infrastructural from "/src/assets/category_icon/infrastructural.avif";
import all from "/src/assets/category_icon/all.avif";
import RegistrStrip from "../components/registrstrip";

import {
  FiHome,
  FiBriefcase,
  FiLayers,
  FiBookOpen,
  FiSettings,
  FiMap,
  FiAward,
  FiGrid,
  FiSearch,
} from "react-icons/fi";

// Blocks (sample data)
const blocks = [
  {
    id: 1,
    title: "TechCorp Headquarters",
    studio: "Foster + Partners, USA",
    cover: tech_corp,
    price: "$25.00 per sq. ft",
    details: "Commercial; 5000; Urban; 20",
    features: "Smart Offices + Green Roof + Auditorium",
    category: "Commercial",
    style: "Modernism",
    logo: "https://cdn-icons-png.flaticon.com/512/3068/3068200.png",
  },
  {
    id: 2,
    title: "Global Finance Tower",
    studio: "Skidmore, Owings & Merrill, UK",
    cover: global_finance_tower,
    price: "$32.00 per sq. ft",
    details: "Commercial; 8000; CBD; 35",
    features: "Trading Floors + Conference Halls + Sky Lounge",
    category: "Commercial",
    style: "International Style",
    logo: "https://cdn-icons-png.flaticon.com/512/3068/3068200.png",
  },
  {
    id: 3,
    title: "Innovation Hub",
    studio: "BIG Architects, Denmark",
    cover: innovation_hub,
    price: "$18.50 per sq. ft",
    details: "Institutional; 3000; Tech Park; 6",
    features: "Open Labs + Co-working + Solar Energy",
    category: "Institutional",
    style: "Neo-Futurism",
    logo: "https://cdn-icons-png.flaticon.com/512/3068/3068200.png",
  },
  {
    id: 4,
    title: "Industrial Park",
    studio: "Perkins & Will, Canada",
    cover:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format",
    price: "$12.25 per sq. ft",
    details: "Industrial; 6000; Outskirts; 8",
    features: "Warehouses + Logistics Hubs + Power Backup",
    category: "Industrial",
    style: "Brutalism",
    logo: "https://cdn-icons-png.flaticon.com/512/3068/3068200.png",
  },
  {
    id: 5,
    title: "Cultural Center",
    studio: "OMA, Greece",
    cover: cultural_center,
    price: "$16.40 per sq. ft",
    details: "Institutional; 2200; Coastal; 4",
    features: "Theater + Exhibition Halls + Public Plaza",
    category: "Institutional",
    style: "Classical",
    logo: "https://cdn-icons-png.flaticon.com/512/3068/3068200.png",
  },
];

// Categories
const categories = [
  { icon: <img src={residential} alt="Residential" className="w-8 h-8" />, label: "Residential" },
  { icon: <img src={Commercial} alt="Commercial" className="w-8 h-8" />, label: "Commercial" },
  { icon: <img src={mixed_use} alt="Mixed-Use" className="w-8 h-8" />, label: "Mixed-Use" },
  { icon: <img src={institutional} alt="Institutional" className="w-8 h-8" />, label: "Institutional" },
  { icon: <img src={industrial} alt="Industrial" className="w-8 h-8" />, label: "Industrial" },
  { icon: <img src={agricultural} alt="Agricultural" className="w-8 h-8" />, label: "Agricultural" },
  { icon: <img src={recreational} alt="Recreational" className="w-8 h-8" />, label: "Recreational" },
  { icon: <img src={infrastructural} alt="Infrastructure" className="w-8 h-8" />, label: "Infrastructure" },
  { icon: <img src={all} alt="All" className="w-8 h-8" />, label: "All" },
];


// Styles
const styles = [
  "Classical",
  "Gothic",
  "Renaissance",
  "Baroque",
  "Neoclassical",
  "Victorian",
  "Beaux-Arts",
  "Art Nouveau",
  "Art Deco",
  "Modernism",
  "Bauhaus",
  "International Style",
  "Mid-Century Modern",
  "Brutalism",
  "Postmodernism",
  "Deconstructivism",
  "Minimalism",
  "Neo-Futurism",
  "Bohemian",
  "Industrial",
  "Eco-architecture",
];

const Urban = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStyle, setSelectedStyle] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter logic
  const filteredBlocks = blocks.filter((block) => {
    const matchCategory =
      selectedCategory === "All" || block.category === selectedCategory;
    const matchStyle = selectedStyle === "All" || block.style === selectedStyle;
    const matchSearch = block.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchCategory && matchStyle && matchSearch;
  });

  const handleBlockClick = (block) => {
    const params = new URLSearchParams(block).toString();
    window.open(`${window.location.origin}/firmportfolio?${params}`, "_blank");
  };

  return (
    <>
      <RegistrStrip />
      <div className="bg-white text-[#1D1D1F] min-h-screen p-6 sm:p-8 lg:p-12 font-sans">
        <div className="max-w-[1700px] mx-auto">
          {/* Category Row */}
          <div className="flex flex-wrap justify-center gap-8 mb-6">
            {categories.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setSelectedCategory(cat.label === "All" ? "All" : cat.label)}
                className={`flex flex-col items-center min-w-[80px] transition ${
                  selectedCategory === cat.label ? "text-black" : "text-gray-500"
                }`}
              >
                <div className="mb-1">{cat.icon}</div>
                <span className="text-xs">{cat.label}</span>
              </button>
            ))}
          </div>
          <hr className="my-2" />

          {/* Filter/Search Row */}
          <div className="flex flex-wrap gap-4 items-center mb-8">
            {/* Style Dropdown */}
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm min-w-[200px]"
            >
              <option value="All">Filter by Style (All)</option>
              {styles.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>

            {/* Search */}
            <input
              type="text"
              placeholder="Search for your favorite firm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2 text-sm min-w-[260px]"
            />

            {/* Sort */}
            <select className="border rounded-lg px-3 py-2 text-sm min-w-[160px]">
              <option>Sort by</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
            </select>
          </div>

          {/* Grid of Firms */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12 px-6">
            {filteredBlocks.length > 0 ? (
              filteredBlocks.map((block, index) => (
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
                    <div className="text-gray-800 font-semibold">
                      {block.price}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{block.details}</p>
                    <p className="text-sm text-gray-600 mt-1">{block.features}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No results found.
              </p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Urban;
