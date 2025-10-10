import innovationHub from "../assets/firms/innovation_hub.avif";
import techCorp from "../assets/firms/tech_corp.avif";
import metroBusiness from "../assets/firms/metro_business.avif";
import culturalCenter from "../assets/firms/cultural_center.avif";
import globalFinanceTower from "../assets/firms/global_finance_tower.avif";
import healthcareCampus from "../assets/firms/healthcare.avif";

import californiaVilla from "../assets/studio/california_villa.avif";
import mansion from "../assets/studio/mansion.avif";
import apartment from "../assets/studio/apartment.avif";
import carolinaAbbey from "../assets/studio/carolina_abbey.avif";

import ultratechCement from "../assets/warehouse/ultratech_cement.webp";
import tmtSteel from "../assets/warehouse/tmt_steelbar.jpeg";

export const marketplaceFeatures = [
  {
    title: "Catalogue-backed delivery",
    description:
      "Studios publish encrypted BIM kits, IFCs, and marketing collateral with SLAs for fulfilment and change management.",
  },
  {
    title: "Associate talent network",
    description:
      "Pull vetted BIM leads, computational designers, analysts, and visualisation artists into engagements on demand.",
  },
  {
    title: "Procurement-ready warehouse",
    description:
      "Mobilise materials with QA documentation, freight orchestration, and payment-linked release of digital assets.",
  },
];

const firmsById = {
  "firm-lumen": {
    _id: "firm-lumen",
    name: "Lumen Atelier",
    slug: "lumen-atelier",
    tagline: "Modular coastal living systems built for sustainability.",
    category: "Residential",
    styles: ["Modernism", "Brutalism"],
    locations: ["San Diego, USA", "Muscat, Oman"],
    priceSqft: 12.5,
    services: [
      {
        title: "Concept to IFC Delivery",
        description:
          "Full-stack design documentation bundles with BIM coordination, energy modelling, and procurement schedules.",
        leadTimeWeeks: 8,
      },
      {
        title: "Modular Housing Program",
        description:
          "Catalog-driven housing typologies optimised for coastal climates with plug-and-play wet cores.",
        leadTimeWeeks: 6,
      },
    ],
    rating: 4.8,
    coverImage: innovationHub,
    gallery: [techCorp, metroBusiness],
    contact: {
      email: "studio@lumenatelier.com",
      phone: "+1 415 555 0123",
      website: "https://lumenatelier.com",
      timezone: "America/Los_Angeles",
      address: "210 Lightwave Ave, San Diego, CA 92101",
    },
  },
  "firm-gridline": {
    _id: "firm-gridline",
    name: "Gridline Collective",
    slug: "gridline-collective",
    tagline: "Data-led urban design for adaptive cities.",
    category: "Mixed-Use",
    styles: ["International Style", "Postmodern"],
    locations: ["Singapore", "Dubai"],
    priceSqft: 18.4,
    services: [
      {
        title: "Transit Urbanism Toolkit",
        description:
          "GIS, ridership, and energy modelling suite to fast-track approvals for TOD precincts.",
        leadTimeWeeks: 10,
      },
      {
        title: "Retail Podium Conversion",
        description:
          "Adaptive reuse playbooks for mall-to-mixed-use transformations with anchor tenant coordination.",
        leadTimeWeeks: 7,
      },
    ],
    rating: 4.9,
    coverImage: culturalCenter,
    gallery: [globalFinanceTower, metroBusiness],
    contact: {
      email: "hello@gridline.co",
      phone: "+65 6235 2212",
      website: "https://gridline.co",
      timezone: "Asia/Singapore",
      address: "11 Marina Blvd, #20-01, Singapore 018939",
    },
  },
  "firm-oryza": {
    _id: "firm-oryza",
    name: "Atelier Oryza",
    slug: "atelier-oryza",
    tagline: "Low-carbon estates inspired by vernacular craft.",
    category: "Residential",
    styles: ["Neo-futurism", "Minimalism"],
    locations: ["Lisbon, Portugal", "Kerala, India"],
    priceSqft: 15.75,
    services: [
      {
        title: "Eco Resort Charter",
        description:
          "Zero-carbon resort blueprint with passive cooling, water reuse, and modular FF&E packages.",
        leadTimeWeeks: 9,
      },
      {
        title: "Luxury Villa Customisation",
        description:
          "Customisable villa shells with digital twins, concierge-ready fit-outs, and remote monitoring.",
        leadTimeWeeks: 6,
      },
    ],
    rating: 4.7,
    coverImage: healthcareCampus,
    gallery: [culturalCenter, innovationHub],
    contact: {
      email: "contact@atelieroryza.com",
      phone: "+351 21 234 567",
      website: "https://atelieroryza.com",
      timezone: "Europe/Lisbon",
      address: "Rua do Ouro 118, 1100-060 Lisboa, Portugal",
    },
  },
};

export const fallbackFirms = Object.values(firmsById);

export const fallbackStudios = [
  {
    _id: "studio-skyline-loft",
    title: "Skyline Loft Residences",
    slug: "skyline-loft-residences",
    firmSlug: "lumen-atelier",
    firm: firmsById["firm-lumen"],
    kind: "studio",
    description: "Open-plan loft typologies tuned for coastal climates.",
    summary:
      "Sculpted concrete and expansive glazing with modular interiors ideal for fast-track residential developments.",
    heroImage: californiaVilla,
    gallery: [californiaVilla, mansion, apartment],
    priceSqft: 12.5,
    pricing: {
      unit: "sq.ft",
      unitLabel: "Per sq.ft",
      currency: "USD",
      basePrice: 12.5,
      minQuantity: 1000,
      tierPricing: [
        { min: 1000, max: 2500, price: 12.5 },
        { min: 2501, max: 5000, price: 11.75 },
      ],
    },
    currency: "USD",
    status: "published",
    categories: ["Residential", "Modernism"],
    tags: ["prefab", "mid-rise", "coastal"],
    style: "Modernism",
    highlights: [
      "Parametric shell optimized for coastal climates",
      "Plug-and-play kitchen and wet-core services",
      "Net-zero ready envelope with BIM kit",
    ],
    delivery: {
      leadTimeWeeks: 4,
      fulfilmentType: "digital",
      handoverMethod: "download",
      includesInstallation: false,
      items: ["IFC drawings", "Revit model", "Render pack"],
      instructions:
        "Deliverables shared via secure download within 24 hours of payment confirmation.",
    },
    location: { city: "San Diego", country: "United States", timezone: "America/Los_Angeles" },
    specs: [
      { label: "GFA", value: "1,200 - 2,400", unit: "sq.ft" },
      { label: "Structure", value: "RC Frame + CLT Panels" },
      { label: "Energy", value: "Net-zero ready" },
    ],
  },
  {
    _id: "studio-terraced-villa",
    title: "Terraced Courtyard Villa",
    slug: "terraced-courtyard-villa",
    firmSlug: "atelier-oryza",
    firm: firmsById["firm-oryza"],
    kind: "studio",
    description: "Layered terraces with passive ventilation and water harvesting.",
    summary:
      "Sunken courtyards and cascading terraces tuned for Mediterranean climates using cross-laminated timber.",
      heroImage: carolinaAbbey,
      gallery: [carolinaAbbey, mansion],
    priceSqft: 15.75,
    pricing: {
      unit: "sq.ft",
      unitLabel: "Per sq.ft",
      currency: "USD",
      basePrice: 15.75,
      minQuantity: 2000,
      tierPricing: [
        { min: 2000, max: 4000, price: 15.75 },
        { min: 4001, max: 6500, price: 14.9 },
      ],
    },
    currency: "USD",
    status: "published",
    categories: ["Residential"],
    tags: ["luxury", "sustainable"],
    style: "Neo-futurism",
    highlights: [
      "Rainwater harvesting integrated into landscape",
      "CLT primary structure with BIM fabrication set",
      "Flexible wings for home-office or studio suites",
    ],
    delivery: {
      leadTimeWeeks: 5,
      fulfilmentType: "digital",
      handoverMethod: "download",
      includesInstallation: false,
      items: ["Fabrication set", "Lumion renders", "FF&E schedule"],
      instructions:
        "FF&E schedule and models issued through secure workspace within 24 hours of payment.",
    },
    location: { city: "Lisbon", country: "Portugal", timezone: "Europe/Lisbon" },
    specs: [
      { label: "GFA", value: "1,800 - 3,200", unit: "sq.ft" },
      { label: "Structure", value: "Cross Laminated Timber" },
      { label: "Sustainability", value: "Passive ventilation + rainwater reuse" },
    ],
  },
  {
    _id: "studio-urban-hub",
    title: "Urban Mixed-Use Podium",
    slug: "urban-mixed-use-podium",
    firmSlug: "gridline-collective",
    firm: firmsById["firm-gridline"],
    kind: "studio",
    description: "Retail podium with co-working tower engineered for tropical density.",
    summary:
      "Retail podium with co-working tower and landscaped decks engineered for tropical high-density parcels.",
    heroImage:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&auto=format",
    ],
    priceSqft: 18.4,
    pricing: {
      unit: "sq.ft",
      unitLabel: "Per sq.ft (GFA)",
      currency: "USD",
      basePrice: 18.4,
      minQuantity: 45000,
      tierPricing: [
        { min: 45000, max: 60000, price: 18.4 },
        { min: 60001, max: 90000, price: 17.8 },
      ],
    },
    currency: "USD",
    status: "published",
    categories: ["Mixed-Use", "Commercial"],
    tags: ["retail", "cowork", "podium-tower"],
    style: "International Style",
    highlights: [
      "MEP coordination pack with clash-free BIM",
      "Occupancy analytics for retail circulation",
      "GreenMark Platinum envelope detailing",
    ],
    delivery: {
      leadTimeWeeks: 6,
      fulfilmentType: "hybrid",
      handoverMethod: "download",
      includesInstallation: true,
      items: ["BIM LOD 300 model", "Lease plans", "Tenant guide"],
      instructions:
        "Dedicated success manager schedules tenancy alignment workshops within 72 hours of purchase.",
    },
    location: { city: "Singapore", country: "Singapore", timezone: "Asia/Singapore" },
    specs: [
      { label: "Built-up area", value: "45,000 - 88,000", unit: "sq.ft" },
      { label: "Use mix", value: "Retail podium + Office tower" },
      { label: "Compliance", value: "BCA GreenMark Platinum ready" },
    ],
  },
];

export const fallbackMaterials = [
  {
    _id: "material-ultratech",
    title: "UltraTech OPC 53 Grade Cement",
    slug: "ultratech-opc-53",
    kind: "material",
    description: "High-strength OPC cement compliant with IS 12269.",
    heroImage: ultratechCement,
    pricing: {
      unit: "bag",
      unitLabel: "Per 50kg bag",
      currency: "INR",
      basePrice: 325,
      minQuantity: 50,
    },
    status: "published",
    categories: ["Cement"],
    tags: ["structure", "ready-stock"],
    highlights: ["Shelf life 3 months", "Packed in 50kg bags"],
    specs: [
      { label: "Grade", value: "OPC 53" },
      { label: "Packaging", value: "50kg moisture-proof bag" },
      { label: "Compliance", value: "IS 12269" },
    ],
    delivery: {
      leadTimeWeeks: 1,
      fulfilmentType: "logistics",
      handoverMethod: "courier",
      includesInstallation: false,
      items: ["Consignment tracking", "QA certificates", "Batch testing reports"],
      instructions:
        "Delivery slots confirmed within 12 hours. Upload unloading instructions via the order workspace.",
    },
    location: {
      city: "Navi Mumbai",
      country: "India",
      timezone: "Asia/Kolkata",
    },
    metafields: {
      unit: "bag",
      leadTimeDays: 3,
      moq: 50,
      vendor: "BuildMart Logistics",
      location: "Navi Mumbai, India",
    },
  },
  {
    _id: "material-fe500d",
    title: "Fe 500D TMT Rebars",
    slug: "fe500d-tmt-rebars",
    kind: "material",
    description: "High ductility TMT bars supplied in 12m lengths.",
    heroImage: tmtSteel,
    pricing: {
      unit: "kg",
      unitLabel: "Per kg",
      currency: "INR",
      basePrice: 58,
      minQuantity: 2000,
    },
    status: "published",
    categories: ["Steel"],
    tags: ["structure", "isi-certified"],
    highlights: ["Available in 8mm-32mm dia", "Includes mill certificates"],
    specs: [
      { label: "Diameter Range", value: "8mm - 32mm" },
      { label: "Length", value: "12m standard" },
      { label: "Compliance", value: "ISI / IS 1786:2008" },
    ],
    delivery: {
      leadTimeWeeks: 1,
      fulfilmentType: "logistics",
      handoverMethod: "courier",
      includesInstallation: false,
      items: ["Dispatch tracking", "QA certificate bundle"],
      instructions:
        "Bundle strapped and dispatched with crane-offload support available on request.",
    },
    location: { city: "Vizag", country: "India", timezone: "Asia/Kolkata" },
    metafields: {
      unit: "kg",
      leadTimeDays: 7,
      moq: 2000,
      vendor: "SteelMart Asia",
      location: "Vizag, India",
    },
  },
  {
    _id: "material-laminate",
    title: "Matte Laminate Flooring",
    slug: "matte-laminate-flooring",
    kind: "material",
    description: "Matte laminate flooring with AC4 abrasion rating.",
    heroImage:
      "https://images.unsplash.com/photo-1616628182508-7f5d4ec17993?w=1200&auto=format",
    pricing: {
      unit: "sq.m",
      unitLabel: "Per sq.m",
      currency: "INR",
      basePrice: 540,
      minQuantity: 200,
    },
    status: "published",
    categories: ["Finishes"],
    tags: ["flooring", "interiors"],
    highlights: ["Includes underlay", "10-year manufacturer warranty"],
    specs: [
      { label: "Abrasion Rating", value: "AC4" },
      { label: "Thickness", value: "10mm" },
      { label: "Warranty", value: "10 years" },
    ],
    delivery: {
      leadTimeWeeks: 2,
      fulfilmentType: "logistics",
      handoverMethod: "courier",
      includesInstallation: false,
      items: ["Underlay rolls", "Installation guide"],
      instructions:
        "Ships on pallets with moisture barrier packaging. Schedule receiving dock before dispatch.",
    },
    location: {
      city: "Kuala Lumpur",
      country: "Malaysia",
      timezone: "Asia/Kuala_Lumpur",
    },
    metafields: {
      unit: "sq.m",
      leadTimeDays: 10,
      moq: 200,
      vendor: "FloorHub Studios",
      location: "Kuala Lumpur, Malaysia",
    },
  },
];

export const fallbackAssociates = [
  {
    _id: "assoc-rahul-iyer",
    user: { email: "associate@builtattic.com" },
    title: "BIM Coordinator",
    location: "Bengaluru, India",
    rates: { hourly: 40, daily: 320, currency: "USD" },
    availability: "Full-time contract",
    availabilityWindows: [
      { day: "mon", from: "09:00", to: "18:00" },
      { day: "tue", from: "09:00", to: "18:00" },
      { day: "wed", from: "09:00", to: "18:00" },
      { day: "thu", from: "09:00", to: "18:00" },
      { day: "fri", from: "09:00", to: "16:00" },
    ],
    timezone: "Asia/Kolkata",
    experienceYears: 5,
    specialisations: ["LOD 400 modelling", "MEP coordination"],
    softwares: ["Revit", "Navisworks", "Dynamo"],
    languages: ["English", "Hindi"],
    completedProjects: 52,
    rating: 4.7,
    avatar: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&auto=format",
    summary:
      "Experienced BIM coordinator specialising in complex mixed-use developments and clash detection.",
    keyProjects: [
      {
        title: "Azure Marina Mixed-Use",
        scope: "LOD 350 modelling + coordination",
        year: 2023,
        role: "BIM Lead",
      },
      {
        title: "Transit Hub Redevelopment",
        scope: "MEP clash detection + federated BIM",
        year: 2024,
        role: "Coordination Specialist",
      },
    ],
  },
  {
    _id: "assoc-laia-fernandez",
    user: { email: "associate.eu@builtattic.com" },
    title: "Computational Designer",
    location: "Barcelona, Spain",
    rates: { hourly: 65, daily: 520, currency: "EUR" },
    availability: "15 hrs / week",
    availabilityWindows: [
      { day: "mon", from: "10:00", to: "14:00" },
      { day: "wed", from: "10:00", to: "18:00" },
      { day: "fri", from: "09:00", to: "15:00" },
    ],
    timezone: "Europe/Madrid",
    experienceYears: 4,
    specialisations: ["Parametric facades", "Scripting", "Visualization"],
    softwares: ["Rhino", "Grasshopper", "Revit", "3ds Max"],
    languages: ["English", "Spanish"],
    completedProjects: 38,
    rating: 4.9,
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format",
    summary:
      "Computational designer building complex facade systems and high-impact visualisation assets.",
    keyProjects: [
      {
        title: "Helix Pavilion",
        scope: "Parametric facade scripting + fabrication files",
        year: 2022,
        role: "Lead Designer",
      },
      {
        title: "Aurora Tower Visualisation",
        scope: "AR + realtime viz pipelines",
        year: 2024,
        role: "Visualization Lead",
      },
    ],
  },
  {
    _id: "assoc-lin-zhang",
    user: { email: "associate.apac@builtattic.com" },
    title: "Sustainability Analyst",
    location: "Singapore",
    rates: { hourly: 72, daily: 540, currency: "SGD" },
    availability: "Project-based",
    availabilityWindows: [
      { day: "tue", from: "13:00", to: "19:00" },
      { day: "thu", from: "09:00", to: "17:00" },
    ],
    timezone: "Asia/Singapore",
    experienceYears: 6,
    specialisations: ["Energy modelling", "LEED documentation"],
    softwares: ["Ladybug", "Sefaira", "IES VE"],
    languages: ["English", "Mandarin"],
    completedProjects: 44,
    rating: 4.8,
    avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=400&auto=format",
    summary:
      "Performs daylighting, ventilation, and energy simulations with actionable recommendations.",
    keyProjects: [
      {
        title: "Harbourfront Innovation Hub",
        scope: "Energy + daylight optimisation",
        year: 2023,
        role: "Lead Analyst",
      },
      {
        title: "Skyline Residences Retrofit",
        scope: "LEED Gold submission package",
        year: 2024,
        role: "Sustainability Consultant",
      },
    ],
  },
];

export default marketplaceFeatures;
