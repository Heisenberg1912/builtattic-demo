import React, { useState, useMemo } from "react";
import { HiOutlineHeart, HiHeart } from "react-icons/hi2";
import { FaChevronDown } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Range, getTrackBackground } from "react-range";

import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import RegistrStrip from "../components/registrstrip";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

// Assets
import newyork_suburban from "../assets/newyork_suburban.avif";
import california_villa from "../assets/studio/california_villa.avif";
import carolina_abbey from "../assets/studio/carolina_abbey.avif";
import mansion from "../assets/studio/mansion.avif";
import apartment from "../assets/studio/apartment.avif";

// Category icons
import Commercial from "/src/assets/category_icon/commercial.avif";
import residential from "/src/assets/category_icon/residential.avif";
import mixed_use from "/src/assets/category_icon/mixed_use.avif";
import institutional from "/src/assets/category_icon/institutional.avif";
import industrial from "/src/assets/category_icon/industrial.avif"; 
import agricultural from "/src/assets/category_icon/agricultural.avif";
import recreational from "/src/assets/category_icon/recreational.avif";
import infrastructural from "/src/assets/category_icon/infrastructural.avif";
import all from "/src/assets/category_icon/all.avif";

const categories = [
  { image: residential, label: "Residential" },
  { image: Commercial, label: "Commercial" },
  { image: mixed_use, label: "Mixed-Use" },
  { image: institutional, label: "Institutional" },
  { image: industrial, label: "Industrial" },
  { image: agricultural, label: "Agricultural" },
  { image: recreational, label: "Recreational" },
  { image: infrastructural, label: "Infrastructure" },
  { image: all, label: "All" },
];

// ================= Apple-Inspired RangeSlider =================
function AppleRangeSlider({ label, min, max, step, values, onChange, unit = "" }) {
  return (
    <div className="flex flex-col w-full mb-2">
      <label className="text-gray-700 font-semibold mb-1">
        {label}: {values[0]}{unit}
      </label>
      <Range
        step={step}
        min={min}
        max={max}
        values={values}
        onChange={onChange}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="relative h-2 w-full rounded-full cursor-pointer"
            style={{
              background: getTrackBackground({
                values,
                colors: ["#4f46e5", "#d1d5db"],
                min,
                max,
              }),
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            className="w-4 h-4 rounded-full bg-white border-2 border-gray-300 shadow-sm"
          />
        )}
      />
    </div>
  );
}

// ================= FilterDropdown Component =================
function FilterDropdown({ title, children, width = "w-64" }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 border rounded-md shadow-sm bg-white text-sm font-medium flex items-center gap-1"
      >
        {title} <FaChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className={`absolute left-0 mt-2 ${width} max-h-96 overflow-y-auto overflow-x-hidden bg-white border rounded-md shadow-lg z-50 p-3`}>
          {children}
        </div>
      )}
    </div>
  );
}

// ================= Full Filters Data =================
const fullFilters = [
  { category: "Style", options: ["Classical","Gothic","Renaissance","Baroque","Neoclassical","Victorian","Beaux-Arts","Art Nouveau","Art Deco","Modernism","Bauhaus","International Style","Mid-Century Modern","Brutalism","Postmodernism","Deconstructivism","Minimalism","Neo-Futurism","Bohemian","Industrial","Eco-architecture"] },
  { category: "Material Used", options: ["Stone","Brick","Concrete","Steel","Glass","Wood","Bamboo","Aluminum","Copper","Clay","Plaster & Stucco","Adobe","Rammed Earth","Thatch","Acrylic, PVC","Fiber-reinforced"] },
  { category: "Soil Type", options: ["Loose","Soft","Firm","Stiff","Dense","Hard","Rock","-"] },
  { category: "Terrain", options: ["Flat","Sloping","Hilly","Mountainous","Coastal","Waterfront","Sandy","Plateau","Valley"] },
  { category: "Climate Adaptability", options: ["Hot & Dry","Hot & Humid","Cold","Temperate","Coastal","Tropical","-"] },
  { category: "Roof Type", options: ["Flat","Gable","Hip","Shed","Composite","Mansard","Gambrel","Butterfly","Dome","Pyramid","Curved","Green","Sawtooth"] },
  { category: "Interior Plan", options: ["Open","Closed","Linear","Centralized","Radial","Grid","Cluster","Split-Level","Loft","Courtyard","Studio"] },
  { category: "Sustainability", options: ["Passive Solar Design","Green Roofs","Rainwater Harvesting","Greywater Recycling","Natural Ventilation","Thermal Mass","Daylighting","Net-Zero Energy Design","Low-Carbon Materials","Recycled Materials","Modular Construction","Smart Glass","Solar Panels (Photovoltaics)","Wind Energy Integration","Geothermal Heating & Cooling","Biomimicry Design","BREEAM Standards","Circular Economy Design","Adaptive Reuse","Carbon-Neutral Construction"] },
  { category: "Additional Features", options: ["Balconies","Verandas","Terraces","Patios","Decks","Pergolas","Atriums","Courtyards","Bay Windows","Skylights","Chimneys","Columns","Arches","Domes","Spires","Staircases","Elevators","Ramps","Water Features","Fireplaces","Gates"] },
  { category: "Exterior", options: ["Façade","Cladding","Siding","Stucco","Brickwork","Stone Veneer","Glass Curtain Wall","Timber Exterior","Metal Panels","Green Walls","Pergolas","Awnings","Canopies","Driveways","Fences","-"] },
];

// ================= Studio Component =================
const Studio = () => {
  const { addToCart } = useCart();
  const wishlistContext = useWishlist?.();
  const { addToWishlist, removeFromWishlist } = wishlistContext || {};
  const [wishlistIds, setWishlistIds] = useState(new Set());

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({}); // e.g., { Style: "Modernism", "Material Used": "Brick" }
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);
  const [area, setArea] = useState(1500);

  const items = [
    {
      id: 1,
      title: "New York Suburban",
      studio: "Studio Mosby",
      logo: "/logo.png",
      image: newyork_suburban,
      gallery: [newyork_suburban],
      price: "$ 9.99 /sq.ft",
      category: "Residential",
      style: "Modernism",
      material: "Brick",
      bedrooms: 3,
      bathrooms: 2,
      area: 1200,
      features: ["Front Lawn", "Fenced Backyard", "3 BHK", "Attached Garage"],
      description:
        "A modern suburban home in New York, designed for comfort and style. Features a spacious front lawn, fenced backyard, and a 3 BHK layout with an attached garage. Perfect for families seeking a blend of urban convenience and suburban tranquility.",
    },
    {
      id: 2,
      title: "California Villa",
      studio: "Studio West",
      logo: "/logo.png",
      image: california_villa,
      gallery: [california_villa],
      price: "$ 12.50 /sq.ft",
      category: "Residential",
      style: "Classical",
      material: "Concrete",
      bedrooms: 4,
      bathrooms: 3,
      area: 1500,
      features: ["Private Pool", "Lush Garden", "4 BHK", "Coastal Views"],
      description:
        "Experience luxury living in this California villa with private pool, garden and sweeping coastal views. Elegant finishes and a spacious 4 BHK layout.",
    },
    {
      id: 3,
      title: "Texas Ranch",
      studio: "Studio Lone Star",
      logo: "/logo.png",
      image: carolina_abbey,
      gallery: [carolina_abbey],
      price: "$ 8.20 /sq.ft",
      category: "Mixed-Use",
      style: "Neo-Futurism",
      material: "Wood",
      bedrooms: 5,
      bathrooms: 2,
      area: 1800,
      features: ["Open Land", "Barn", "5 BHK", "Large Garage"],
      description:
        "Rustic ranch living with expansive land and traditional barn structures. Ideal for countryside living and outdoor activities.",
    },
    {
      id: 4,
      title: "Florida Beach House",
      studio: "Studio Palm",
      logo: "/logo.png",
      image: mansion,
      gallery: [mansion],
      price: "$ 15.00 /sq.ft",
      category: "Residential",
      style: "Modernism",
      material: "Steel",
      bedrooms: 3,
      bathrooms: 2,
      area: 1400,
      features: ["Sea View", "Private Pool", "3 BHK", "Patio"],
      description:
        "Wake up to the sound of waves in this modern Florida beach house with sea view, private pool and a relaxing patio.",
    },
    {
      id: 5,
      title: "Chicago Apartment",
      studio: "Studio Skyline",
      logo: "/logo.png",
      image: apartment,
      gallery: [apartment],
      price: "$ 10.75 /sq.ft",
      category: "Residential",
      style: "Modernism",
      material: "Concrete",
      bedrooms: 2,
      bathrooms: 1,
      area: 1000,
      features: ["Gym Access", "Rooftop", "2 BHK", "Balcony"],
      description:
        "Stylish city apartment in the heart of Chicago with rooftop amenities and modern finishes.",
    },
  ];

  const toggleWishlist = (id) => {
    const item = items.find(i => String(i.id) === String(id));
    if (!item) return;
    
    const newSet = new Set(wishlistIds);
    if (newSet.has(id)) {
      newSet.delete(id);
      removeFromWishlist?.(id);
      toast.success("Removed from wishlist");
    } else {
      newSet.add(id);
      // Pass complete item data to wishlist context
      addToWishlist?.(item);
      toast.success("Added to wishlist");
    }
    setWishlistIds(newSet);
  };

  // Listen for messages from detail windows
  React.useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'TOGGLE_WISHLIST') {
        toggleWishlist(String(event.data.itemId));
      } else if (event.data.type === 'OPEN_DESIGN_DETAIL') {
        const item = items.find(i => i.id === event.data.itemId);
        if (item) {
          openDetailWindow(item);
        }
      } else if (event.data.type === 'ADD_TO_CART') {
        const item = items.find(i => i.id === event.data.itemId);
        if (item) {
          addToCart(item);
          toast.success("Added to cart");
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [items, addToCart]);

  // Open a simple responsive detail page in a new tab for the clicked item
  const openDetailWindow = (item) => {
    const w = window.open("", "_blank");
    if (!w) return;

    // Get similar designs (same category or style, excluding current item)
    const similarDesigns = items
      .filter(i => i.id !== item.id && (i.category === item.category || i.style === item.style))
      .slice(0, 4);
    
    // Generate similar designs HTML
    const similarDesignsHtml = similarDesigns.map(design => `
      <div style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;background:#fff;cursor:pointer;transition:all 0.3s ease;box-shadow:0 2px 8px rgba(0,0,0,0.1)" onclick="openSimilarDesign(${design.id})" onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 8px 25px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'">
        <img src="${design.image}" alt="${design.title}" style="width:100%;height:140px;object-fit:cover" />
        <div style="padding:16px">
          <h4 style="margin:0 0 8px 0;font-size:16px;font-weight:700;color:#111827;line-height:1.3">${design.title}</h4>
          <p style="margin:0 0 6px 0;font-size:13px;color:#6b7280">${design.studio}</p>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
            <p style="margin:0;font-size:14px;font-weight:600;color:#059669">${design.price}</p>
            <span style="background:#eef2ff;color:#3730a3;padding:4px 8px;border-radius:12px;font-size:11px;font-weight:500">${design.category}</span>
          </div>
        </div>
      </div>
    `).join("");

    const galleryHtml = (item.gallery || []).map(src => `<img src="${src}" style="width:100%;height:auto;border-radius:6px;margin-bottom:8px;object-fit:cover" />`).join("");
    const featuresHtml = (item.features || []).map(f => `<li style="margin-bottom:6px;padding-left:6px">${f}</li>`).join("");
    const specsHtml = `
      <div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:12px">
        <div style="min-width:120px"><div style="font-size:12px;color:#6b7280">Bedrooms</div><div style="font-weight:600">${item.bedrooms ?? "-"}</div></div>
        <div style="min-width:120px"><div style="font-size:12px;color:#6b7280">Bathrooms</div><div style="font-weight:600">${item.bathrooms ?? "-"}</div></div>
        <div style="min-width:120px"><div style="font-size:12px;color:#6b7280">Area</div><div style="font-weight:600">${item.area ? item.area + " sq.ft" : "-"}</div></div>
        <div style="min-width:120px"><div style="font-size:12px;color:#6b7280">Material</div><div style="font-weight:600">${item.material || "-"}</div></div>
        <div style="min-width:120px"><div style="font-size:12px;color:#6b7280">Style</div><div style="font-weight:600">${item.style || "-"}</div></div>
      </div>`;

    const isWishlisted = wishlistIds.has(String(item.id));

    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<base href="${window.location.origin}/">
<title>${item.title} — Details</title>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
<style>
  :root{--accent:#4f46e5;--muted:#6b7280;--bg:#f8fafc}
  html,body{height:100%;margin:0;font-family:'Montserrat',system-ui,Arial;color:#0f172a;background:var(--bg)}
  .wrap{max-width:1100px;margin:20px auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 8px 30px rgba(2,6,23,0.06)}
  .hero{width:100%;height:44vh;background:#000;position:relative;display:block}
  .hero img{width:100%;height:100%;object-fit:cover;display:block}
  .logo{position:absolute;left:20px;top:20px;background:rgba(255,255,255,0.9);padding:8px;border-radius:8px}
  .wishlist-btn{position:absolute;right:20px;top:20px;background:rgba(255,255,255,0.9);border:none;padding:8px;border-radius:50%;cursor:pointer;font-size:20px}
  .meta{padding:20px}
  h1{margin:0;font-size:24px}
  .muted{color:var(--muted);margin-top:6px}
  .quick{display:flex;gap:12px;align-items:center;margin-top:12px;flex-wrap:wrap}
  .badge{background:#eef2ff;color:#3730a3;padding:6px 10px;border-radius:999px;font-size:13px}
  .content{display:grid;grid-template-columns:1fr 320px;gap:20px;padding:20px;border-top:1px solid #eef2f6}
  .left{}
  .right{border-left:1px solid #f1f5f9;padding-left:16px}
  .features{margin-top:12px}
  .specs{margin-top:12px}
  .actions{display:flex;gap:8px;margin-top:16px;flex-wrap:wrap}
  .btn{padding:10px 14px;border-radius:8px;text-decoration:none;font-size:14px;border:none;cursor:pointer}
  .btn-primary{background:var(--accent);color:#fff}
  .btn-secondary{background:#10b981;color:#fff}
  .btn-muted{background:#fff;border:1px solid #e6edf3;color:#374151}
  .btn:hover{opacity:0.9}
  .similar-section{background:#f9fafb;border-top:2px solid #e5e7eb;padding:32px 24px;margin-top:0}
  .similar-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px;margin-top:20px}
  .section-header{text-align:center;margin-bottom:8px}
  .section-title{font-size:24px;font-weight:800;color:#111827;margin:0}
  .section-subtitle{font-size:14px;color:#6b7280;margin:8px 0 0 0}
  @media(max-width:900px){ .content{grid-template-columns:1fr} .right{border-left:none;padding-left:0} .logo{left:12px;top:12px} .wishlist-btn{right:12px;top:12px} }
  @media(max-width:768px){ .similar-grid{grid-template-columns:repeat(2,1fr);gap:16px} .similar-section{padding:24px 16px} }
  @media(max-width:480px){ .similar-grid{grid-template-columns:1fr} }
</style>
</head>
<body>
  <div class="wrap" role="main">
    <div class="hero">
      <img src="${item.image}" alt="${item.title}" />
      <div class="logo"><img src="${item.logo || ''}" alt="logo" style="height:36px;width:36px;object-fit:contain" /></div>
      <button class="wishlist-btn" onclick="toggleWishlist()" id="wishlistBtn">
        ${isWishlisted ? '❤️' : '🤍'}
      </button>
    </div>

    <div class="meta">
      <h1>${item.title}</h1>
      <div class="muted">${item.studio || ""}</div>
      <div class="quick">
        <div class="badge">${item.price || ""}</div>
        <div class="badge">${item.category || ""}</div>
      </div>
      ${specsHtml}
    </div>

    <div class="content">
      <div class="left">
        <h3 style="margin:0 0 8px 0">Overview</h3>
        <p style="margin:0;color:#334155;line-height:1.5">${(item.description || "").replace(/\n/g, "<br/>")}</p>

        <div class="features">
          <h4 style="margin-top:16px;margin-bottom:8px">Key Features</h4>
          <ul style="padding-left:18px;margin:0;color:#334155">${featuresHtml}</ul>
        </div>

        <div style="margin-top:18px">
          <h4 style="margin-bottom:8px">Gallery</h4>
          ${galleryHtml}
        </div>
      </div>

      <aside class="right" aria-label="Details">
        <div style="font-weight:600;margin-bottom:8px">Quick details</div>
        <div style="font-size:14px;color:#374151">
          <div style="margin-bottom:8px"><strong>Price:</strong> ${item.price || "-"}</div>
          <div style="margin-bottom:8px"><strong>Bedrooms:</strong> ${item.bedrooms ?? "-"}</div>
          <div style="margin-bottom:8px"><strong>Bathrooms:</strong> ${item.bathrooms ?? "-"}</div>
          <div style="margin-bottom:8px"><strong>Area:</strong> ${item.area ? item.area + " sq.ft" : "-"}</div>
          <div style="margin-bottom:8px"><strong>Material:</strong> ${item.material || "-"}</div>
          <div style="margin-bottom:8px"><strong>Style:</strong> ${item.style || "-"}</div>
        </div>

        <div class="actions">
          <button class="btn btn-secondary" onclick="addToCart()">Add to Cart</button>
          <button class="btn btn-primary" onclick="window.print();return false">Print</button>
          <a class="btn btn-muted" href="${window.location.href}">Back</a>
        </div>
      </aside>
    </div>

    ${similarDesigns.length > 0 ? `
    <div class="similar-section">
      <div class="section-header">
        <h3 class="section-title">Similar Designs</h3>
        <p class="section-subtitle">Explore more ${item.category.toLowerCase()} designs ${item.style ? `with ${item.style.toLowerCase()} style` : ''}</p>
      </div>
      <div class="similar-grid">
        ${similarDesignsHtml}
      </div>
    </div>
    ` : ''}
  </div>

  <script>
    // All items data for similar designs navigation
    const allItems = ${JSON.stringify(items)};
    
    let isWishlisted = ${isWishlisted};
    
    function toggleWishlist() {
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({
          type: 'TOGGLE_WISHLIST',
          itemId: ${item.id}
        }, '*');
        
        isWishlisted = !isWishlisted;
        document.getElementById('wishlistBtn').innerHTML = isWishlisted ? '❤️' : '🤍';
      }
    }
    
    function addToCart() {
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({
          type: 'ADD_TO_CART',
          itemId: ${item.id}
        }, '*');
        
        // Show success feedback
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = 'Added!';
        btn.style.background = '#059669';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '#10b981';
        }, 1500);
      }
    }
    
    function openSimilarDesign(designId) {
      const design = allItems.find(item => item.id === designId);
      if (design && window.opener && !window.opener.closed) {
        // Send message to parent to open the new design
        window.opener.postMessage({
          type: 'OPEN_DESIGN_DETAIL',
          itemId: designId
        }, '*');
        window.close(); // Close current detail window
      }
    }
  </script>
</body>
</html>`;

    w.document.open();
    w.document.write(html);
    w.document.close();
  };

  // ================= Filtering Logic =================
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilters = Object.entries(selectedFilters).every(([key, val]) => !val || item[key] === val);
      return matchCategory && matchSearch && matchFilters;
    });
  }, [items, selectedCategory, searchQuery, selectedFilters]);

  const handleFilterChange = (category, option) => {
    setSelectedFilters(prev => ({ ...prev, [category]: prev[category] === option ? "" : option }));
  };

  return (
    <>
      <RegistrStrip />
      <motion.div className="px-2 mt-3 py-4 sm:px-4 md:px-6 lg:px-8 space-y-6 overflow-x-hidden">

        {/* Category Icons */}
        <div className="flex flex-wrap justify-center gap-10 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setSelectedCategory(cat.label === "All" ? "All" : cat.label)}
              className={`flex flex-col items-center min-w-[90px] ${selectedCategory === cat.label || (cat.label === "All" && cat.label === "All") ? "text-gray-100" : "text-gray-500"}`}
            >
              <img src={cat.image} alt={cat.label} className="h-8 w-8 mb-1" />
              <span className="text-xs">{cat.label}</span>
            </button>
          ))}
        </div>

        <hr className="my-2" />

        {/* Filters Row */}
        <div className="flex flex-wrap gap-4 items-center mb-8">
          <FilterDropdown title="Filters" width="w-72 sm:w-96 max-w-[90vw]">
            {fullFilters.map(f => (
              <div key={f.category} className="mb-4 border-b pb-2 last:border-b-0">
                <h4 className="font-semibold text-sm mb-1">{f.category}</h4>
                <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto">
                  {f.options.map(opt => (
                    <label key={opt} className="flex items-center gap-2 text-xs py-1 hover:bg-gray-50 rounded px-1">
                      <input
                        type="radio"
                        name={f.category}
                        className="accent-indigo-600"
                        checked={selectedFilters[f.category] === opt}
                        onChange={() => handleFilterChange(f.category, opt)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                  <label className="flex items-center gap-2 text-xs py-1 hover:bg-gray-50 rounded px-1">
                    <input
                      type="radio"
                      name={f.category}
                      className="accent-indigo-600"
                      checked={!selectedFilters[f.category]}
                      onChange={() => handleFilterChange(f.category, "")}
                    />
                    <span>All</span>
                  </label>
                </div>
              </div>
            ))}
          </FilterDropdown>

          {/* Search */}
          <input
            type="text"
            placeholder="Search for your favorite design"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2 text-sm min-w-[260px]"
          />

          {/* Ranges */}
          <FilterDropdown title="Adjust Ranges" width="w-72 sm:w-96 max-w-[90vw]">
            <div className="w-full space-y-3">
              <AppleRangeSlider label="Bedrooms" min={1} max={10} step={1} values={[bedrooms]} onChange={v => setBedrooms(v[0])} />
              <AppleRangeSlider label="Bathrooms" min={1} max={10} step={1} values={[bathrooms]} onChange={v => setBathrooms(v[0])} />
              <AppleRangeSlider label="Area (sq.ft)" min={500} max={5000} step={100} values={[area]} onChange={v => setArea(v[0])} />
            </div>
          </FilterDropdown>
        </div>

        {/* Cards */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredItems.length > 0 ? filteredItems.map(item => {
            return (
              <motion.div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer relative"
                whileHover={{ scale: 1.02 }}
                onClick={() => openDetailWindow(item)}
              >
                <motion.img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.studio}</p>
                  <p className="font-semibold mt-2">{item.price}</p>
                </div>
              </motion.div>
            )
          }) : <p className="col-span-full text-center text-gray-500">No results found.</p>}
        </motion.div>

      </motion.div>
      <Footer />
    </>
  );
};

export default Studio;
