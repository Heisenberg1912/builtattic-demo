import React, { useState } from "react";
import { HiOutlineFilter, HiOutlineSearch, HiHeart, HiOutlineHeart } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
// Import all your product images
import ultratech_cement from "/src/assets/warehouse/ultratech_cement.webp";
import redbricks from "/src/assets/warehouse/redbricks.jpg";
import riversand from "/src/assets/warehouse/riversand.jpeg";
import tmt_steelbar from "/src/assets/warehouse/tmt_steelbar.jpeg";
import crushed_gravel from "/src/assets/warehouse/crushed_gravel.jpeg";
import ceramic_floor_tile from "/src/assets/warehouse/ceramic_floor_tile.jpeg";
import timber_plank from "/src/assets/warehouse/timber_plank.jpeg";
import tempered_glass from "/src/assets/warehouse/tempered_glass.jpeg";

// Full product array
const allProducts = [
  { id: 1, name: "UltraTech Cement", category: "Cement", price: "₹350 / bag", img: ultratech_cement, seller: { name: "ABC Traders", logo: "https://i.pravatar.cc/40?img=1" } },
  { id: 2, name: "Red Clay Bricks", category: "Bricks", price: "₹6 / piece", img: redbricks, seller: { name: "BrickHouse", logo: "https://i.pravatar.cc/40?img=2" } },
  { id: 3, name: "River Sand", category: "Sand", price: "₹1500 / ton", img: riversand, seller: { name: "Sand Depot", logo: "https://i.pravatar.cc/40?img=3" } },
  { id: 4, name: "TMT Steel Bars", category: "Steel", price: "₹65 / kg", img: tmt_steelbar, seller: { name: "SteelMart", logo: "https://i.pravatar.cc/40?img=4" } },
  { id: 5, name: "Crushed Gravel", category: "Gravel", price: "₹1200 / ton", img: crushed_gravel, seller: { name: "Stone Suppliers", logo: "https://i.pravatar.cc/40?img=5" } },
  { id: 6, name: "Ceramic Floor Tiles", category: "Tiles", price: "₹45 / sq.ft", img: ceramic_floor_tile, seller: { name: "Tile Gallery", logo: "https://i.pravatar.cc/40?img=6" } },
  { id: 7, name: "Timber Planks", category: "Wood", price: "₹850 / piece", img: timber_plank, seller: { name: "WoodCraft", logo: "https://i.pravatar.cc/40?img=7" } },
  { id: 8, name: "Tempered Glass", category: "Glass", price: "₹200 / sq.ft", img: tempered_glass, seller: { name: "Glass World", logo: "https://i.pravatar.cc/40?img=8" } },
  { id: 9, name: "Asian Paints", category: "Paints", price: "₹450 / 4L", img: "https://source.unsplash.com/400x300/?paint", seller: { name: "Paint Depot", logo: "https://i.pravatar.cc/40?img=9" } },
  { id: 10, name: "PVC Pipes", category: "Pipes", price: "₹120 / piece", img: "https://source.unsplash.com/400x300/?pipes", seller: { name: "Pipe Suppliers", logo: "https://i.pravatar.cc/40?img=10" } },
  { id: 11, name: "Electrical Wires", category: "Electrical", price: "₹900 / roll", img: "https://source.unsplash.com/400x300/?electric", seller: { name: "PowerHub", logo: "https://i.pravatar.cc/40?img=11" } },
  { id: 12, name: "Bathroom Fittings", category: "Plumbing", price: "₹3500 / set", img: "https://source.unsplash.com/400x300/?plumbing", seller: { name: "PlumbStore", logo: "https://i.pravatar.cc/40?img=12" } },
  { id: 13, name: "Metal Roofing Sheets", category: "Roofing", price: "₹550 / sheet", img: "https://source.unsplash.com/400x300/?roof", seller: { name: "Roofing Co.", logo: "https://i.pravatar.cc/40?img=13" } },
  { id: 14, name: "Wooden Doors", category: "Doors", price: "₹7500 / unit", img: "https://source.unsplash.com/400x300/?door", seller: { name: "DoorCraft", logo: "https://i.pravatar.cc/40?img=14" } },
  { id: 15, name: "Sliding Windows", category: "Windows", price: "₹6000 / unit", img: "https://source.unsplash.com/400x300/?window", seller: { name: "WindowMart", logo: "https://i.pravatar.cc/40?img=15" } },
  { id: 16, name: "LED Lights", category: "Lighting", price: "₹450 / piece", img: "https://source.unsplash.com/400x300/?light", seller: { name: "LightZone", logo: "https://i.pravatar.cc/40?img=16" } },
  { id: 17, name: "Thermal Insulation Sheets", category: "Insulation", price: "₹75 / sq.ft", img: "https://source.unsplash.com/400x300/?insulation", seller: { name: "BuildInsulate", logo: "https://i.pravatar.cc/40?img=17" } },
  { id: 18, name: "Vinyl Flooring", category: "Flooring", price: "₹65 / sq.ft", img: "https://source.unsplash.com/400x300/?flooring", seller: { name: "FloorHub", logo: "https://i.pravatar.cc/40?img=18" } },
  { id: 19, name: "Nails & Screws", category: "Hardware", price: "₹250 / box", img: "https://source.unsplash.com/400x300/?hardware", seller: { name: "FixIt Hardware", logo: "https://i.pravatar.cc/40?img=19" } },
  { id: 20, name: "Construction Chemicals", category: "Chemicals", price: "₹1800 / can", img: "https://source.unsplash.com/400x300/?chemical", seller: { name: "ChemBuild", logo: "https://i.pravatar.cc/40?img=20" } },
  { id: 21, name: "Italian Marble", category: "Marble", price: "₹250 / sq.ft", img: "https://source.unsplash.com/400x300/?marble", seller: { name: "Marble Palace", logo: "https://i.pravatar.cc/40?img=21" } },
  { id: 22, name: "Granite Slabs", category: "Granite", price: "₹180 / sq.ft", img: "https://source.unsplash.com/400x300/?granite", seller: { name: "Granite Depot", logo: "https://i.pravatar.cc/40?img=22" } },
  { id: 23, name: "POP False Ceiling", category: "False Ceiling", price: "₹75 / sq.ft", img: "https://source.unsplash.com/400x300/?ceiling", seller: { name: "Ceiling World", logo: "https://i.pravatar.cc/40?img=23" } },
  { id: 24, name: "Tile Adhesive", category: "Adhesives", price: "₹1200 / bag", img: "https://source.unsplash.com/400x300/?adhesive", seller: { name: "FixBond", logo: "https://i.pravatar.cc/40?img=24" } },
  { id: 25, name: "Safety Helmets", category: "Safety Gear", price: "₹350 / unit", img: "https://source.unsplash.com/400x300/?helmet", seller: { name: "SafeBuild", logo: "https://i.pravatar.cc/40?img=25" } },
  { id: 26, name: "Power Tools", category: "Tools", price: "₹6500 / set", img: "https://source.unsplash.com/400x300/?tools", seller: { name: "ToolZone", logo: "https://i.pravatar.cc/40?img=26" } },
  { id: 27, name: "White Cement", category: "Cement", price: "₹520 / bag", img: "https://source.unsplash.com/400x300/?white-cement", seller: { name: "CemWorld", logo: "https://i.pravatar.cc/40?img=27" } },
  { id: 28, name: "Fly Ash Bricks", category: "Bricks", price: "₹8 / piece", img: "https://source.unsplash.com/400x300/?flyash-bricks", seller: { name: "EcoBricks", logo: "https://i.pravatar.cc/40?img=28" } },
  { id: 29, name: "M-Sand", category: "Sand", price: "₹1400 / ton", img: "https://source.unsplash.com/400x300/?msand", seller: { name: "SandHub", logo: "https://i.pravatar.cc/40?img=29" } },
  { id: 30, name: "H-Beams", category: "Steel", price: "₹72 / kg", img: "https://source.unsplash.com/400x300/?hbeam", seller: { name: "SteelWorks", logo: "https://i.pravatar.cc/40?img=30" } },
  { id: 31, name: "Pebbles & Gravel Mix", category: "Gravel", price: "₹1600 / ton", img: "https://source.unsplash.com/400x300/?pebbles", seller: { name: "Rock Depot", logo: "https://i.pravatar.cc/40?img=31" } },
  { id: 32, name: "Porcelain Tiles", category: "Tiles", price: "₹60 / sq.ft", img: "https://source.unsplash.com/400x300/?porcelain-tiles", seller: { name: "Tiles Hub", logo: "https://i.pravatar.cc/40?img=32" } },
  { id: 33, name: "Plywood Sheets", category: "Wood", price: "₹950 / sheet", img: "https://source.unsplash.com/400x300/?plywood", seller: { name: "WoodMart", logo: "https://i.pravatar.cc/40?img=33" } },
  { id: 34, name: "Glass Blocks", category: "Glass", price: "₹350 / block", img: "https://source.unsplash.com/400x300/?glass-blocks", seller: { name: "GlassHub", logo: "https://i.pravatar.cc/40?img=34" } },
  { id: 35, name: "Berger Paints", category: "Paints", price: "₹480 / 4L", img: "https://source.unsplash.com/400x300/?paint-bucket", seller: { name: "Berger Depot", logo: "https://i.pravatar.cc/40?img=35" } },
  { id: 36, name: "HDPE Pipes", category: "Pipes", price: "₹250 / piece", img: "https://source.unsplash.com/400x300/?hdpe-pipes", seller: { name: "PipeZone", logo: "https://i.pravatar.cc/40?img=36" } },
  { id: 37, name: "MCB Switches", category: "Electrical", price: "₹450 / unit", img: "https://source.unsplash.com/400x300/?switchboard", seller: { name: "ElectroMart", logo: "https://i.pravatar.cc/40?img=37" } },
  { id: 38, name: "Sink Faucets", category: "Plumbing", price: "₹1200 / unit", img: "https://source.unsplash.com/400x300/?faucet", seller: { name: "PlumbMart", logo: "https://i.pravatar.cc/40?img=38" } },
  { id: 39, name: "Clay Roof Tiles", category: "Roofing", price: "₹70 / piece", img: "https://source.unsplash.com/400x300/?clay-roof", seller: { name: "RoofCraft", logo: "https://i.pravatar.cc/40?img=39" } },
  { id: 40, name: "Fiberglass Doors", category: "Doors", price: "₹9800 / unit", img: "https://source.unsplash.com/400x300/?fiberglass-door", seller: { name: "DoorWorld", logo: "https://i.pravatar.cc/40?img=40" } },
  { id: 41, name: "UPVC Windows", category: "Windows", price: "₹7200 / unit", img: "https://source.unsplash.com/400x300/?upvc-windows", seller: { name: "WinPro", logo: "https://i.pravatar.cc/40?img=41" } },
  { id: 42, name: "Chandeliers", category: "Lighting", price: "₹5200 / piece", img: "https://source.unsplash.com/400x300/?chandelier", seller: { name: "BrightHomes", logo: "https://i.pravatar.cc/40?img=42" } },
  { id: 43, name: "Foam Insulation Rolls", category: "Insulation", price: "₹95 / sq.ft", img: "https://source.unsplash.com/400x300/?foam-insulation", seller: { name: "InsulMart", logo: "https://i.pravatar.cc/40?img=43" } },
  { id: 44, name: "Laminate Flooring", category: "Flooring", price: "₹85 / sq.ft", img: "https://source.unsplash.com/400x300/?laminate-flooring", seller: { name: "FloorZone", logo: "https://i.pravatar.cc/40?img=44" } },
  { id: 45, name: "Door Hinges", category: "Hardware", price: "₹150 / pair", img: "https://source.unsplash.com/400x300/?hinges", seller: { name: "FixMart", logo: "https://i.pravatar.cc/40?img=45" } },
  { id: 46, name: "Waterproofing Chemical", category: "Chemicals", price: "₹2000 / can", img: "https://source.unsplash.com/400x300/?waterproofing", seller: { name: "ChemZone", logo: "https://i.pravatar.cc/40?img=46" } },
  { id: 47, name: "Onyx Marble", category: "Marble", price: "₹450 / sq.ft", img: "https://source.unsplash.com/400x300/?onyx-marble", seller: { name: "StoneLux", logo: "https://i.pravatar.cc/40?img=47" } },
  { id: 48, name: "Black Galaxy Granite", category: "Granite", price: "₹220 / sq.ft", img: "https://source.unsplash.com/400x300/?black-granite", seller: { name: "GraniteLux", logo: "https://i.pravatar.cc/40?img=48" } },
  { id: 49, name: "Gypsum Board Ceiling", category: "False Ceiling", price: "₹95 / sq.ft", img: "https://source.unsplash.com/400x300/?gypsum", seller: { name: "CeilPro", logo: "https://i.pravatar.cc/40?img=49" } },
  { id: 50, name: "Epoxy Adhesive", category: "Adhesives", price: "₹450 / tube", img: "https://source.unsplash.com/400x300/?epoxy", seller: { name: "BondIt", logo: "https://i.pravatar.cc/40?img=50" } },
  { id: 51, name: "Safety Gloves", category: "Safety Gear", price: "₹250 / pair", img: "https://source.unsplash.com/400x300/?safety-gloves", seller: { name: "SafeHands", logo: "https://i.pravatar.cc/40?img=51" } },
  { id: 52, name: "Drill Machine", category: "Tools", price: "₹3200 / unit", img: "https://source.unsplash.com/400x300/?drill", seller: { name: "ToolMasters", logo: "https://i.pravatar.cc/40?img=52" } },
  { id: 53, name: "Rapid Hardening Cement", category: "Cement", price: "₹420 / bag", img: "https://source.unsplash.com/400x300/?cement-bag", seller: { name: "FastCem", logo: "https://i.pravatar.cc/40?img=53" } },
  { id: 54, name: "AAC Blocks", category: "Bricks", price: "₹55 / block", img: "https://source.unsplash.com/400x300/?aac-blocks", seller: { name: "BlockDepot", logo: "https://i.pravatar.cc/40?img=54" } },
  { id: 55, name: "Plastering Sand", category: "Sand", price: "₹1300 / ton", img: "https://source.unsplash.com/400x300/?plaster-sand", seller: { name: "SandPlus", logo: "https://i.pravatar.cc/40?img=55" } },
];

// Categories array
const categories = [
  "Cement", "Bricks", "Sand", "Steel", "Gravel", "Tiles", "Wood", "Glass", "Paints",
  "Pipes", "Electrical", "Plumbing", "Roofing", "Doors", "Windows", "Lighting",
  "Insulation", "Flooring", "Hardware", "Chemicals", "Marble", "Granite",
  "False Ceiling", "Adhesives", "Safety Gear", "Tools",
];

const Marketplace = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlistIds, setWishlistIds] = useState(new Set());

  const handleToggleWishlist = (product) => {
    setWishlistIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(product.id)) newSet.delete(product.id);
      else newSet.add(product.id);
      return newSet;
    });
  };

  // Open seller detail page in new browser tab
  const openSellerDetailWindow = (product) => {
    const w = window.open("", "_blank");
    if (!w) return;

    // Get all products from this seller
    const sellerProducts = allProducts.filter(p => p.seller.name === product.seller.name);
    
    // Get similar products (same category or from different sellers with similar category)
    const similarProducts = allProducts
      .filter(p => p.id !== product.id && p.category === product.category && p.seller.name !== product.seller.name)
      .slice(0, 4);
    
    // Generate similar products HTML
    const similarProductsHtml = similarProducts.map(p => `
      <div style="background:white;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;cursor:pointer;transition:all 0.3s ease;box-shadow:0 2px 8px rgba(0,0,0,0.1)" onclick="openSimilarProduct(${p.id})" onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 8px 25px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'">
        <div style="position:relative">
          <img src="${p.img}" alt="${p.name}" style="width:100%;height:140px;object-fit:cover" />
          <div style="position:absolute;top:8px;right:8px">
            <span style="background:rgba(255,255,255,0.9);backdrop-filter:blur(4px);color:#374151;padding:4px 8px;border-radius:12px;font-size:11px;font-weight:600">${p.category}</span>
          </div>
        </div>
        <div style="padding:16px">
          <h4 style="margin:0 0 8px 0;font-size:16px;font-weight:700;color:#111827;line-clamp:1">${p.name}</h4>
          <p style="margin:0 0 6px 0;font-size:13px;color:#6b7280">${p.seller.name}</p>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
            <span style="font-size:16px;font-weight:700;color:#059669">${p.price}</span>
            <span style="font-size:12px;color:#6b7280">⭐ 4.8/5</span>
          </div>
        </div>
      </div>
    `).join("");
    
    // Generate product HTML for seller's catalog
    const productsHtml = sellerProducts.map(p => `
      <div style="display:flex;align-items:center;gap:12px;padding:16px;border:1px solid #e5e7eb;border-radius:12px;margin-bottom:12px;background:#fff;transition:all 0.3s ease;box-shadow:0 2px 4px rgba(0,0,0,0.05)">
        <img src="${p.img}" alt="${p.name}" style="width:70px;height:70px;object-fit:cover;border-radius:8px;border:2px solid #e5e7eb" />
        <div style="flex:1">
          <h4 style="margin:0;font-size:15px;font-weight:600;color:#111827">${p.name}</h4>
          <p style="margin:4px 0;color:#6b7280;font-size:12px">${p.category}</p>
          <p style="margin:0;color:#059669;font-weight:700;font-size:16px">${p.price}</p>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <button onclick="toggleWishlist(${p.id})" id="wishlist-${p.id}" style="background:transparent;border:2px solid #e5e7eb;color:#6b7280;padding:6px;border-radius:6px;cursor:pointer;font-size:16px;transition:all 0.3s ease" onmouseover="this.style.borderColor='#ef4444'" onmouseout="this.style.borderColor='#e5e7eb'">🤍</button>
          <button style="background:linear-gradient(135deg,#4f46e5,#7c3aed);color:white;border:none;padding:8px 16px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;transition:all 0.3s ease" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">Add to Cart</button>
        </div>
      </div>
    `).join("");

     const html = `<!doctype html>
 <html>
 <head>
   <meta charset="utf-8" />
   <meta name="viewport" content="width=device-width,initial-scale=1" />
   <base href="${window.location.origin}/">
   <title>${product.seller.name} — Seller Profile | Builtattic</title>
   <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
   <style>
     :root{--bg-primary:#f8fafc;--bg-secondary:#ffffff;--bg-tertiary:#f1f5f9;--text-primary:#111827;--text-secondary:#374151;--text-muted:#6b7280;--accent:#4f46e5;--accent-secondary:#7c3aed;--success:#059669;--border:#e5e7eb}
     *{margin:0;padding:0;box-sizing:border-box}
     html,body{height:100%;font-family:'Montserrat',system-ui,Arial;color:var(--text-primary);background:var(--bg-primary);line-height:1.6}
     
     /* Navbar Styles */
     .navbar{background:rgba(0,0,0,0.95);backdrop-filter:blur(10px);border-bottom:1px solid var(--border);padding:12px 0;position:sticky;top:0;z-index:1000}
     .navbar-content{max-width:1400px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:0 24px}
     .logo{display:flex;align-items:center;gap:12px;font-size:24px;font-weight:800;color:#f8fafc;text-decoration:none}
     .logo img{width:40px;height:40px;border-radius:8px}
     .nav-links{display:flex;gap:32px;align-items:center}
     .nav-link{color:#e2e8f0;text-decoration:none;font-size:14px;font-weight:500;transition:color 0.3s ease}
     .nav-link:hover{color:var(--accent)}
     .wishlist-count{background:var(--accent);color:white;border-radius:50%;padding:2px 6px;font-size:11px;margin-left:4px}
     
     /* Main Content */
     .wrap{max-width:1400px;margin:0 auto;background:var(--bg-primary);min-height:calc(100vh - 120px)}
     .header{background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:40px 24px;text-align:center;position:relative;overflow:hidden}
     .seller-avatar{width:100px;height:100px;border-radius:50%;border:4px solid rgba(255,255,255,0.3);margin:0 auto 20px;box-shadow:0 8px 32px rgba(0,0,0,0.1);position:relative;z-index:1}
     .seller-name{font-size:36px;font-weight:800;margin:0;color:white;position:relative;z-index:1}
     .seller-tagline{opacity:0.9;margin-top:12px;font-size:16px;font-weight:500;color:white;position:relative;z-index:1}
     .content{display:grid;grid-template-columns:1fr 380px;gap:32px;padding:32px;max-width:1400px}
     .main-content{background:var(--bg-secondary);border-radius:16px;padding:24px;border:1px solid var(--border);box-shadow:0 4px 6px rgba(0,0,0,0.05)}
     .sidebar{background:var(--bg-secondary);border-radius:16px;padding:24px;border:1px solid var(--border);box-shadow:0 4px 6px rgba(0,0,0,0.05)}
     .section{margin-bottom:32px}
     .section h3{margin:0 0 16px 0;font-size:20px;font-weight:700;color:var(--text-primary);border-bottom:2px solid var(--accent);padding-bottom:8px}
     .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:32px}
     .stat{text-align:center;padding:20px;background:var(--bg-tertiary);border-radius:12px;border:1px solid var(--border);transition:transform 0.3s ease;box-shadow:0 2px 4px rgba(0,0,0,0.05)}
     .stat:hover{transform:translateY(-4px)}
     .stat-number{font-size:28px;font-weight:800;color:var(--accent)}
     .stat-label{font-size:13px;color:var(--text-muted);margin-top:6px;font-weight:500}
     .contact-info{background:var(--bg-tertiary);padding:20px;border-radius:12px;border:1px solid var(--border);box-shadow:0 2px 4px rgba(0,0,0,0.05)}
     .contact-item{display:flex;align-items:center;gap:12px;margin-bottom:12px;font-size:14px;color:var(--text-secondary);padding:8px;border-radius:8px;transition:background 0.3s ease}
     .contact-item:hover{background:rgba(79,70,229,0.05)}
     .contact-item:last-child{margin-bottom:0}
     .contact-item span:first-child{font-size:16px;width:20px;text-align:center}
     .btn{padding:14px 24px;border-radius:10px;font-size:14px;border:none;cursor:pointer;display:inline-block;text-align:center;font-weight:600;transition:all 0.3s ease;text-decoration:none;font-family:'Montserrat'}
     .btn-primary{background:linear-gradient(135deg,var(--accent),var(--accent-secondary));color:#fff;box-shadow:0 4px 15px rgba(79,70,229,0.4)}
     .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(79,70,229,0.6)}
     .btn-success{background:linear-gradient(135deg,#059669,#047857);color:#fff;box-shadow:0 4px 15px rgba(5,150,105,0.4)}
     .btn-success:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(5,150,105,0.6)}
     .btn-outline{background:transparent;border:2px solid var(--border);color:var(--text-secondary)}
     .btn-outline:hover{background:var(--bg-tertiary);border-color:var(--accent)}
     .products-grid{display:grid;gap:16px;max-height:600px;overflow-y:auto;padding-right:8px}
     .products-grid::-webkit-scrollbar{width:6px}
     .products-grid::-webkit-scrollbar-track{background:var(--bg-tertiary);border-radius:3px}
     .products-grid::-webkit-scrollbar-thumb{background:var(--accent);border-radius:3px}
     .info-grid{display:grid;gap:8px;font-size:13px;color:var(--text-muted)}
     .info-item{padding:8px 0;border-bottom:1px solid var(--border)}
     .info-item:last-child{border-bottom:none}
     .actions-grid{display:flex;flex-direction:column;gap:12px}
     
     /* Similar Products Section */
     .similar-section{background:var(--bg-tertiary);border-top:2px solid var(--border);padding:32px 24px;margin-top:0}
     .similar-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px;margin-top:20px}
     .section-header{text-align:center;margin-bottom:8px}
     .section-title{font-size:24px;font-weight:800;color:var(--text-primary);margin:0}
     .section-subtitle{font-size:14px;color:var(--text-muted);margin:8px 0 0 0}
     
     /* Footer Styles */
     .footer{background:var(--bg-secondary);border-top:1px solid var(--border);padding:40px 0 20px;margin-top:0}
     .footer-content{max-width:1400px;margin:0 auto;padding:0 24px}
     .footer-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:32px;margin-bottom:32px}
     .footer-section h4{color:var(--text-primary);font-size:16px;font-weight:700;margin-bottom:16px}
     .footer-section ul{list-style:none}
     .footer-section li{margin-bottom:8px}
     .footer-section a{color:var(--text-muted);text-decoration:none;font-size:14px;transition:color 0.3s ease}
     .footer-section a:hover{color:var(--accent)}
     .footer-bottom{border-top:1px solid var(--border);padding-top:20px;text-align:center;color:var(--text-muted);font-size:14px}
     
     @media(max-width:1200px){ 
       .content{grid-template-columns:1fr;gap:24px;padding:24px} 
       .stats{grid-template-columns:repeat(3,1fr)}
       .nav-links{display:none}
       .similar-grid{grid-template-columns:repeat(2,1fr);gap:16px}
     }
     @media(max-width:768px){ 
       .seller-name{font-size:28px} 
       .stats{grid-template-columns:1fr;gap:12px}
       .content{padding:16px}
       .navbar-content{padding:0 16px}
       .similar-section{padding:24px 16px}
       .similar-grid{grid-template-columns:1fr}
     }
   </style>
 </head>
 <body>
   <!-- Navigation Bar -->
   <nav class="navbar">
     <div class="navbar-content">
       <a href="${window.location.origin}/" class="logo">
         <img src="${window.location.origin}/src/assets/main_logo/main_logo.png" alt="Builtattic" />
         builtattic.
       </a>
       <div class="nav-links">
         <a href="${window.location.origin}/studio" class="nav-link">Studio</a>
         <a href="${window.location.origin}/firms" class="nav-link">Firms</a>
         <a href="${window.location.origin}/warehouse" class="nav-link">Warehouse</a>
         <a href="${window.location.origin}/wishlist" class="nav-link">
           Wishlist <span class="wishlist-count" id="wishlist-count">0</span>
         </a>
         <a href="${window.location.origin}/cart" class="nav-link">Cart</a>
       </div>
     </div>
   </nav>

   <div class="wrap">
     <div class="header">
       <img src="${product.seller.logo}" alt="${product.seller.name}" class="seller-avatar" />
       <h1 class="seller-name">${product.seller.name}</h1>
       <p class="seller-tagline">Premium Construction Materials Supplier</p>
     </div>

     <div class="content">
       <div class="main-content">
         <div class="stats">
           <div class="stat">
             <div class="stat-number">${sellerProducts.length}</div>
             <div class="stat-label">Products Available</div>
           </div>
           <div class="stat">
             <div class="stat-number">4.8★</div>
             <div class="stat-label">Customer Rating</div>
           </div>
           <div class="stat">
             <div class="stat-number">500+</div>
             <div class="stat-label">Orders Completed</div>
           </div>
         </div>

         <div class="section">
           <h3>About ${product.seller.name}</h3>
           <p style="color:var(--text-secondary);line-height:1.8;font-size:15px">
             <strong>${product.seller.name}</strong> is a leading supplier of premium construction materials with over <strong>10 years of excellence</strong> in the industry. 
             We specialize in providing high-quality <strong>${product.category.toLowerCase()}</strong> and comprehensive construction solutions to builders, contractors, architects, and homeowners across India.
             <br/><br/>
             Our commitment to quality, reliability, and customer satisfaction has established us as a trusted partner for construction projects ranging from residential homes to large commercial developments.
           </p>
         </div>

         <div class="section">
           <h3>Our Product Catalog (${sellerProducts.length} Items)</h3>
           <div class="products-grid">
             ${productsHtml}
           </div>
         </div>
       </div>

       <div class="sidebar">
         <div class="section">
           <h3>Contact Information</h3>
           <div class="contact-info">
             <div class="contact-item">
               <span>📱</span>
               <span>+91 98765 43210</span>
             </div>
             <div class="contact-item">
               <span>📧</span>
               <span>${product.seller.name.toLowerCase().replace(/\s+/g, '')}@suppliers.com</span>
             </div>
             <div class="contact-item">
               <span>📍</span>
               <span>Industrial Area, Construction Hub, New Delhi</span>
             </div>
             <div class="contact-item">
               <span>🕒</span>
               <span>Monday - Saturday: 8:00 AM - 7:00 PM</span>
             </div>
           </div>
         </div>

         <div class="section">
           <h3>Quick Actions</h3>
           <div class="actions-grid">
             <button class="btn btn-primary">💬 Send Message</button>
             <button class="btn btn-success">📞 Call Now</button>
             <button class="btn btn-outline">📍 View on Map</button>
             <button class="btn btn-outline">📋 Request Quote</button>
           </div>
         </div>

         <div class="section">
           <h3>Certifications & Trust</h3>
           <div class="info-grid">
             <div class="info-item">✅ ISO 9001:2015 Quality Certified</div>
             <div class="info-item">✅ GST Registered & Compliant</div>
             <div class="info-item">✅ Bureau of Indian Standards Approved</div>
             <div class="info-item">✅ Verified Supplier Badge</div>
             <div class="info-item">✅ Quality Assurance Guarantee</div>
           </div>
         </div>

         <div class="section">
           <h3>Delivery & Services</h3>
           <div class="info-grid">
             <div class="info-item">🚚 Free delivery on orders above ₹5,000</div>
             <div class="info-item">⚡ Same day delivery available in Delhi NCR</div>
             <div class="info-item">🇮🇳 Pan-India shipping network</div>
             <div class="info-item">💰 Bulk order discounts up to 15%</div>
             <div class="info-item">🔄 Easy returns & exchanges</div>
             <div class="info-item">💳 Multiple payment options accepted</div>
           </div>
         </div>

         <div class="section">
           <h3>Business Hours</h3>
           <div class="info-grid">
             <div class="info-item">Monday - Friday: 8:00 AM - 7:00 PM</div>
             <div class="info-item">Saturday: 9:00 AM - 6:00 PM</div>
             <div class="info-item">Sunday: Closed</div>
             <div class="info-item">Emergency Contact: Available 24/7</div>
           </div>
         </div>
       </div>
     </div>

     ${similarProducts.length > 0 ? `
     <div class="similar-section">
       <div class="section-header">
         <h3 class="section-title">Similar Products</h3>
         <p class="section-subtitle">Explore more ${product.category.toLowerCase()} from other trusted suppliers</p>
       </div>
       <div class="similar-grid">
         ${similarProductsHtml}
       </div>
     </div>
     ` : ''}
   </div>

   <!-- Footer -->
   <footer class="footer">
     <div class="footer-content">
       <div class="footer-grid">
         <div class="footer-section">
           <h4>Company</h4>
           <ul>
             <li><a href="#">About Us</a></li>
             <li><a href="#">Careers</a></li>
             <li><a href="#">Press</a></li>
             <li><a href="#">Contact</a></li>
           </ul>
         </div>
         <div class="footer-section">
           <h4>Services</h4>
           <ul>
             <li><a href="#">Studio</a></li>
             <li><a href="#">Firms</a></li>
             <li><a href="#">Warehouse</a></li>
             <li><a href="#">Associates</a></li>
           </ul>
         </div>
         <div class="footer-section">
           <h4>Support</h4>
           <ul>
             <li><a href="#">Help Center</a></li>
             <li><a href="#">Terms of Service</a></li>
             <li><a href="#">Privacy Policy</a></li>
             <li><a href="#">Refund Policy</a></li>
           </ul>
         </div>
         <div class="footer-section">
           <h4>Connect</h4>
           <ul>
             <li><a href="#">Facebook</a></li>
             <li><a href="#">Twitter</a></li>
             <li><a href="#">Instagram</a></li>
             <li><a href="#">LinkedIn</a></li>
           </ul>
         </div>
       </div>
       <div class="footer-bottom">
         <p>&copy; 2024 Builtattic. All rights reserved. Built with ❤️ for construction professionals.</p>
       </div>
     </div>
   </footer>

   <script>
     // All products data for similar products navigation
     const allProductsData = ${JSON.stringify(allProducts)};
     
     // Wishlist functionality with complete product details
     let wishlistItems = JSON.parse(localStorage.getItem('warehouseWishlist') || '[]');
    
     // Complete product data for wishlist
     const productData = {
       ${sellerProducts.map(p => `
       ${p.id}: {
         id: ${p.id},
         name: "${p.name}",
         category: "${p.category}",
         price: "${p.price}",
         image: "${p.img}",
         seller: {
           name: "${p.seller.name}",
           logo: "${p.seller.logo}"
         },
         description: "High-quality ${p.category.toLowerCase()} from ${p.seller.name}",
         specifications: {
           category: "${p.category}",
           supplier: "${p.seller.name}",
           availability: "In Stock"
         },
         addedAt: new Date().toISOString()
       }`).join(',')}
     };
    
     // Update wishlist count on load
     updateWishlistCount();
    
     // Initialize wishlist buttons
     ${sellerProducts.map(p => `
     initializeWishlistButton(${p.id});
     `).join('')}
    
     function initializeWishlistButton(productId) {
       const wishlistBtn = document.getElementById('wishlist-' + productId);
       if (wishlistBtn) {
         const isInWishlist = wishlistItems.some(item => item.id === productId);
         wishlistBtn.innerHTML = isInWishlist ? '❤️' : '🤍';
         wishlistBtn.style.borderColor = isInWishlist ? '#ef4444' : '#4b5563';
       }
     }
    
     function toggleWishlist(productId) {
       const product = productData[productId];
       if (!product) return;
      
       const existingIndex = wishlistItems.findIndex(item => item.id === productId);
       const wishlistBtn = document.getElementById('wishlist-' + productId);
      
       if (existingIndex > -1) {
         // Remove from wishlist
         wishlistItems.splice(existingIndex, 1);
         wishlistBtn.innerHTML = '🤍';
         wishlistBtn.style.borderColor = '#4b5563';
         showToast('Removed from wishlist', 'success');
       } else {
         // Add to wishlist with complete details
         wishlistItems.push({
           ...product,
           addedAt: new Date().toISOString()
         });
         wishlistBtn.innerHTML = '❤️';
         wishlistBtn.style.borderColor = '#ef4444';
         showToast('Added to wishlist', 'success');
       }
      
       localStorage.setItem('warehouseWishlist', JSON.stringify(wishlistItems));
       updateWishlistCount();
      
       // Sync with parent window if available
       if (window.opener && !window.opener.closed) {
         window.opener.postMessage({
           type: 'WAREHOUSE_WISHLIST_UPDATE',
           wishlistItems: wishlistItems
         }, '*');
       }
     }
    
     function updateWishlistCount() {
       const countElement = document.getElementById('wishlist-count');
       if (countElement) {
         countElement.textContent = wishlistItems.length;
         countElement.style.display = wishlistItems.length > 0 ? 'inline' : 'none';
       }
     }
    
     function showToast(message, type = 'info') {
       const toast = document.createElement('div');
       toast.style.cssText = \`
         position: fixed;
         top: 20px;
         right: 20px;
         background: \${type === 'success' ? '#10b981' : '#ef4444'};
         color: white;
         padding: 12px 20px;
         border-radius: 8px;
         font-size: 14px;
         font-weight: 600;
         z-index: 10000;
         box-shadow: 0 4px 12px rgba(0,0,0,0.3);
         transform: translateX(100%);
         transition: transform 0.3s ease;
       \`;
       toast.textContent = message;
       document.body.appendChild(toast);
      
       setTimeout(() => toast.style.transform = 'translateX(0)', 100);
       setTimeout(() => {
         toast.style.transform = 'translateX(100%)';
         setTimeout(() => document.body.removeChild(toast), 300);
       }, 3000);
     }
    
     // Handle navigation clicks
     document.querySelectorAll('.nav-link').forEach(link => {
       link.addEventListener('click', function(e) {
         e.preventDefault();
         const href = this.getAttribute('href');
         if (href && href !== '#') {
           window.open(href, '_blank');
         }
       });
     });

     function openSimilarProduct(productId) {
       const product = allProductsData.find(p => p.id === productId);
       if (product && window.opener && !window.opener.closed) {
         // Send message to parent to open the new product seller page
         window.opener.postMessage({
           type: 'OPEN_SELLER_DETAIL',
           product: product
         }, '*');
         window.close(); // Close current detail window
       }
     }
     
     // Listen for messages to open new seller detail windows
     React.useEffect(() => {
       const handleMessage = (event) => {
         if (event.data.type === 'OPEN_SELLER_DETAIL') {
           openSellerDetailWindow(event.data.product);
         }
       };
    
       window.addEventListener('message', handleMessage);
       return () => window.removeEventListener('message', handleMessage);
     }, []);
   </script>
 </body>
 </html>`;

     w.document.open();
     w.document.write(html);
     w.document.close();
   };

  const filteredProducts = allProducts.filter(
    (p) =>
      (selectedCategories.length === 0 || selectedCategories.includes(p.category)) &&
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <motion.div
        className="flex items-center justify-between px-4 py-3 bg-white border-b"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 60 }}
      >
        <motion.h1
          className="text-xl font-bold text-gray-900"
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          Construction Marketplace
        </motion.h1>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex items-center">
            <AnimatePresence>
              {showSearch && (
                <motion.input
                  key="search-input"
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border rounded-full px-4 py-1 text-sm focus:ring-gray-400 focus:border-gray-400"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 180, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </AnimatePresence>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowSearch(!showSearch)}
              className="ml-1 bg-gray-100 p-2 rounded-full hover:bg-gray-200"
            >
              <HiOutlineSearch className="text-gray-700" />
            </motion.button>
          </div>

          {/* Filter */}
          {/* <div className="relative">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowFilter(!showFilter)}
              className="bg-gray-100 p-2 rounded-full hover:bg-gray-200"
            >
              <HiOutlineFilter className="text-gray-700" />
            </motion.button>
            <AnimatePresence>
              {showFilter && (
                <motion.div
                  key="filter-dropdown"
                  className="absolute right-0 mt-2 w-64 max-h-72 overflow-y-auto bg-white border rounded-lg shadow-lg p-4 z-50"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">
                    Filter by Category
                  </h3>
                  <div className="space-y-2">
                    {categories.map((cat, idx) => (
                      <motion.label
                        key={idx}
                        className="flex items-center space-x-2 text-sm text-gray-700"
                        whileHover={{ x: 5 }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCategories([...selectedCategories, cat]);
                            } else {
                              setSelectedCategories(
                                selectedCategories.filter((c) => c !== cat)
                              );
                            }
                          }}
                          className="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-400"
                        />
                        <span>{cat}</span>
                      </motion.label>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div> */}
        </div>
      </motion.div>

      {/* Category Scroll (Blinkit style) */}
      <div className="flex overflow-x-auto gap-2 p-2 bg-white border-b">
        {categories.map((cat, idx) => (
          <motion.button
            key={idx}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-1 text-sm whitespace-nowrap rounded-full border ${
              selectedCategories.includes(cat)
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-gray-100 text-gray-700 border-gray-100"
            }`}
            onClick={() => {
              if (selectedCategories.includes(cat)) {
                setSelectedCategories(selectedCategories.filter(c => c !== cat));
              } else {
                setSelectedCategories([...selectedCategories, cat]);
              }
            }}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Product Grid */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <motion.div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredProducts.map((product) => {
            const isSaved = wishlistIds.has(product.id);
            return (
              <motion.div
                key={product.id}
                className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm relative flex flex-col"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => openSellerDetailWindow(product)}
                style={{ cursor: 'pointer' }}
              >
                {/* Wishlist */}
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={(e) => { e.stopPropagation(); handleToggleWishlist(product); }}
                  className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow hover:bg-white"
                >
                  {isSaved ? (
                    <HiHeart className="text-pink-600 text-lg" />
                  ) : (
                    <HiOutlineHeart className="text-gray-700 text-lg" />
                  )}
                </motion.button>

                {/* Image */}
                <motion.img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-32 object-contain mb-2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Info */}
                <h3 className="font-medium text-gray-900 text-sm truncate">{product.name}</h3>
                <p className="text-gray-500 text-xs">{product.price}</p>

                {/* Seller */}
                <div className="flex items-center mt-1 gap-2 text-xs text-gray-600">
                  <img src={product.seller.logo} alt={product.seller.name} className="w-5 h-5 rounded-full border"/>
                  <span className="truncate">{product.seller.name}</span>
                </div>

                {/* Add to Cart */}
                <motion.button
                  className="mt-2 w-full bg-gray-900 text-white px-2 py-1 rounded-full text-xs hover:bg-gray-800"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={(e) => { e.stopPropagation(); /* Add to cart logic */ }}
                >
                  Add to Cart
                </motion.button>
              </motion.div>
            );
          })}
          {filteredProducts.length === 0 && (
            <motion.div
              className="col-span-full text-center text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No products found.
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Marketplace;
