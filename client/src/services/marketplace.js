import client from "../config/axios.jsx";
import {
  fallbackStudios,
  fallbackMaterials,
  fallbackFirms,
  fallbackAssociates,
} from "../data/marketplace.js";
import {
  productCatalog,
  productSearchRecords,
  productBySlug,
} from "../data/products.js";
import { associateCatalog } from "../data/services.js";

function unwrapItems(data) {
  return {
    items: data?.items || [],
    meta: data?.meta || { total: data?.items?.length ?? 0 },
  };
}

function matchesSearch(target = "", search = "") {
  if (!search) return true;
  return target.toLowerCase().includes(search.toLowerCase());
}

function filterStudios(list, params = {}) {
  const { category, style, search } = params;
  return list.filter((studio) => {
    const categoryOk =
      !category ||
      category === "All" ||
      (studio.categories || []).some((cat) =>
        cat.toLowerCase().includes(category.toLowerCase())
      );
    const styleOk =
      !style ||
      style === "All" ||
      studio.style?.toLowerCase() === style.toLowerCase() ||
      (studio.firm?.styles || []).some(
        (s) => s.toLowerCase() === style.toLowerCase()
      );
    const searchOk =
      !search ||
      matchesSearch(studio.title, search) ||
      matchesSearch(studio.summary, search) ||
      matchesSearch(studio.firm?.name, search);
    return categoryOk && styleOk && searchOk;
  });
}

function filterMaterials(list, params = {}) {
  const { category, search } = params;
  return list.filter((item) => {
    const categoryOk =
      !category ||
      category === "All" ||
      item.category?.toLowerCase() === category.toLowerCase();
    const searchOk =
      !search ||
      matchesSearch(item.title, search) ||
      matchesSearch(item.description, search) ||
      matchesSearch(item.metafields?.vendor, search);
    return categoryOk && searchOk;
  });
}

function filterFirms(list, params = {}) {
  const { category, style, search } = params;
  return list.filter((firm) => {
    const categoryOk =
      !category ||
      category === "All" ||
      firm.category?.toLowerCase() === category.toLowerCase();
    const styleOk =
      !style ||
      style === "All" ||
      (firm.styles || []).some(
        (s) => s.toLowerCase() === style.toLowerCase()
      );
    const searchOk =
      !search ||
      matchesSearch(firm.name, search) ||
      matchesSearch(firm.tagline, search) ||
      matchesSearch(firm.description, search);
    return categoryOk && styleOk && searchOk;
  });
}

function filterAssociates(list, params = {}) {
  const { search, skill, software, timezone } = params;
  return list.filter((associate) => {
    const searchOk =
      !search ||
      matchesSearch(associate.title, search) ||
      matchesSearch(associate.summary, search) ||
      matchesSearch(associate.location, search) ||
      matchesSearch(associate.user?.email, search);
    const skillOk =
      !skill ||
      (associate.specialisations || []).some((spec) =>
        spec.toLowerCase().includes(skill.toLowerCase())
      );
    const softwareOk =
      !software ||
      (associate.softwares || []).some((app) =>
        app.toLowerCase().includes(software.toLowerCase())
      );
    const timezoneOk = !timezone || associate.timezone === timezone;
    return searchOk && skillOk && timezoneOk && softwareOk;
  });
}

async function tryRequest(path, params) {
  const { data } = await client.get(path, { params });
  if (!Array.isArray(data?.items) && !Array.isArray(data?.firms)) {
    throw new Error("Unexpected response");
  }
  return data;
}

export async function fetchCatalog(params = {}) {
  try {
    const { data } = await client.get("/catalog", { params });
    if (!Array.isArray(data?.items)) {
      throw new Error("Unexpected response");
    }
    return data.items;
  } catch {
    let items = [...fallbackStudios, ...productCatalog];
    if (params.kind === "studio") {
      items = filterStudios(fallbackStudios, params);
    } else if (params.kind === "material") {
      items = filterProducts(productCatalog, params);
    } else if (params.search || params.category || params.style) {
      const studios = filterStudios(fallbackStudios, params);
      const materials = filterProducts(productCatalog, params);
      items = [...studios, ...materials];
    }

    if (params?.firmId) {
      items = items.filter(
        (item) =>
          (item.firm?._id && String(item.firm._id) === String(params.firmId)) ||
          item.firmSlug === params.firmId
      );
    }
    return items;
  }
}

export async function fetchStudios(params = {}) {
  try {
    const data = await tryRequest("/marketplace/studios", params);
    return unwrapItems(data);
  } catch {
    const filtered = filterStudios(fallbackStudios, params);
    return {
      items: filtered,
      meta: {
        total: filtered.length,
        facets: {
          categories: [],
          tags: [],
          styles: [],
          priceRange: { min: null, max: null },
        },
      },
    };
  }
}

export async function fetchMaterials(params = {}) {
  try {
    const data = await tryRequest("/marketplace/materials", params);
    return unwrapItems(data);
  } catch {
    const filtered = filterMaterials(fallbackMaterials, params);
    return {
      items: filtered,
      meta: { total: filtered.length },
    };
  }
}

export async function fetchMarketplaceFirms(params = {}) {
  try {
    const data = await tryRequest("/marketplace/firms", params);
    return data.items || [];
  } catch {
    return filterFirms(fallbackFirms, params);
  }
}

export async function fetchMarketplaceAssociates(params = {}) {
  try {
    const data = await tryRequest("/marketplace/associates", params);
    return data.items || [];
  } catch {
    return filterAssociates(associateCatalog, params);
  }
}

export async function fetchStudioBySlug(slug, params = {}) {
  if (!slug) return null;
  try {
    const { data } = await client.get(`/catalog/${slug}`, { params });
    return data?.item || null;
  } catch {
    const all = filterStudios(fallbackStudios, {});
    return all.find((studio) => studio.slug === slug) || null;
  }
}

export async function fetchFirms() {
  try {
    const { data } = await client.get("/admin/vendors");
    return data?.firms || [];
  } catch (err) {
    if (err?.response?.status === 403 || err?.response?.status === 401) {
      return [];
    }
    throw err;
  }
}

export async function fetchFirmProducts(firmId) {
  if (!firmId) return [];
  return fetchCatalog({ firmId });
}

export async function fetchAdminUsers() {
  try {
    const { data } = await client.get("/admin/users");
    return data?.users || [];
  } catch (err) {
    if (err?.response?.status === 403 || err?.response?.status === 401) {
      return [];
    }
    throw err;
  }
}

export async function fetchFirmById(firmId) {
  if (!firmId) return null;
  try {
    const { data } = await client.get(`/firms/${firmId}`);
    return data?.firm || null;
  } catch (err) {
    if (err?.response?.status === 403 || err?.response?.status === 401) {
      return null;
    }
    throw err;
  }
}

export async function fetchProductCatalog(params = {}) {
  try {
    const { data } = await client.get("/marketplace/materials", { params });
    if (!Array.isArray(data?.items)) throw new Error("Unexpected response");
    const enriched = data.items.map(
      (item) => productBySlug(item.slug) || { ...item, kind: "product" },
    );
    return {
      items: enriched,
      meta: {
        total: data.meta?.total ?? enriched.length,
        facets: buildProductFacets(enriched),
      },
    };
  } catch {
    const filtered = filterProducts(productCatalog, params);
    return {
      items: filtered,
      meta: {
        total: filtered.length,
        facets: buildProductFacets(filtered),
      },
    };
  }
}

export async function fetchProductBySlug(slug) {
  if (!slug) return null;
  try {
    const { data } = await client.get(`/marketplace/materials/${slug}`);
    const item = data?.item;
    if (!item) throw new Error("Not found");
    return productBySlug(item.slug) || { ...item, kind: "product" };
  } catch {
    return productBySlug(slug);
  }
}

export const getProductSearchRecords = () => productSearchRecords;

export const getAssociateCatalog = () => associateCatalog;

function normalize(value) {
  return String(value || "").toLowerCase();
}

function getProductPriceBounds(product) {
  const values = [];
  const pushPrice = (price) => {
    if (Number.isFinite(price)) values.push(price);
  };
  (product.variations || []).forEach((variation) =>
    pushPrice(Number(variation?.price)),
  );
  (product.offers || []).forEach((offer) => {
    Object.values(offer?.pricingByVariation || {}).forEach((pricing) =>
      pushPrice(Number(pricing?.price)),
    );
  });
  pushPrice(Number(product?.pricing?.basePrice));
  if (!values.length) return { min: 0, max: 0 };
  return { min: Math.min(...values), max: Math.max(...values) };
}

function filterProducts(list, params = {}) {
  const {
    category,
    search,
    seller,
    priceMin,
    priceMax,
    tags = [],
    attributes = {},
  } = params;
  const sellerLc = seller ? normalize(seller) : null;
  const tagFilters = Array.isArray(tags)
    ? tags.filter(Boolean).map(normalize)
    : [];
  const attributeFilters = attributes || {};
  const minPrice = Number(priceMin);
  const maxPrice = Number(priceMax);

  return list.filter((product) => {
    const categoryOk =
      !category ||
      category === "All" ||
      (product.categories || []).some(
        (cat) => normalize(cat) === normalize(category),
      );

    const searchOk =
      !search ||
      matchesSearch(product.title, search) ||
      matchesSearch(product.description, search) ||
      matchesSearch(product.metafields?.vendor, search) ||
      (product.searchKeywords || []).some((keyword) =>
        matchesSearch(keyword, search),
      );

    const sellerOk =
      !sellerLc ||
      (product.offers || []).some(
        (offer) =>
          normalize(offer?.sellerName) === sellerLc ||
          normalize(offer?.sellerId) === sellerLc,
      );

    const tagOk =
      !tagFilters.length ||
      tagFilters.every((tag) =>
        (product.tags || []).some((productTag) => normalize(productTag) === tag),
      );

    const priceBounds = getProductPriceBounds(product);
    const priceOk =
      (!Number.isFinite(minPrice) || priceBounds.max >= minPrice) &&
      (!Number.isFinite(maxPrice) || priceBounds.min <= maxPrice);

    const attributesOk = Object.entries(attributeFilters).every(
      ([code, values]) => {
        if (!values || !values.length) return true;
        const dimension = (product.variationDimensions || []).find(
          (entry) => entry.code === code,
        );
        if (!dimension) return false;
        const optionSet = new Set(
          (dimension.values || []).map((option) =>
            normalize(option?.value || option),
          ),
        );
        return values
          .map(normalize)
          .every((value) => optionSet.has(value));
      },
    );

    return categoryOk && searchOk && sellerOk && tagOk && priceOk && attributesOk;
  });
}

function buildProductFacets(items = []) {
  const categories = new Map();
  const tags = new Map();
  const sellers = new Map();
  const attributes = new Map();
  let minPrice = Number.POSITIVE_INFINITY;
  let maxPrice = Number.NEGATIVE_INFINITY;

  items.forEach((item) => {
    (item.categories || []).forEach((category) => {
      if (!category) return;
      categories.set(category, (categories.get(category) || 0) + 1);
    });
    (item.tags || []).forEach((tag) => {
      if (!tag) return;
      tags.set(tag, (tags.get(tag) || 0) + 1);
    });
    (item.offers || []).forEach((offer) => {
      if (offer?.sellerName) {
        sellers.set(offer.sellerName, (sellers.get(offer.sellerName) || 0) + 1);
      }
      Object.values(offer?.pricingByVariation || {}).forEach((pricing) => {
        const price = Number(pricing?.price);
        if (!Number.isFinite(price)) return;
        minPrice = Math.min(minPrice, price);
        maxPrice = Math.max(maxPrice, price);
      });
    });
    (item.variations || []).forEach((variation) => {
      const price = Number(variation?.price);
      if (Number.isFinite(price)) {
        minPrice = Math.min(minPrice, price);
        maxPrice = Math.max(maxPrice, price);
      }
    });
    (item.variationDimensions || []).forEach((dimension) => {
      if (!dimension?.code) return;
      const entry =
        attributes.get(dimension.code) || {
          code: dimension.code,
          label: dimension.label || dimension.code,
          values: new Map(),
        };
      (dimension.values || []).forEach((option) => {
        const value = option?.value || option;
        if (!value) return;
        entry.values.set(value, (entry.values.get(value) || 0) + 1);
      });
      attributes.set(dimension.code, entry);
    });
  });

  const priceRange =
    Number.isFinite(minPrice) && Number.isFinite(maxPrice)
      ? { min: minPrice, max: maxPrice }
      : { min: 0, max: 0 };

  return {
    categories: Array.from(categories, ([name, count]) => ({ name, count })),
    tags: Array.from(tags, ([name, count]) => ({ name, count })),
    sellers: Array.from(sellers, ([name, count]) => ({ name, count })),
    attributes: Array.from(attributes.values()).map((attribute) => ({
      code: attribute.code,
      label: attribute.label,
      values: Array.from(attribute.values, ([value, count]) => ({
        value,
        count,
      })),
    })),
    priceRange,
    currency: items?.[0]?.pricing?.currency || "INR",
  };
}
