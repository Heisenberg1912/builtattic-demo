import client from "../config/axios.jsx";
import {
  fallbackStudios,
  fallbackMaterials,
  fallbackFirms,
  fallbackAssociates,
} from "../data/marketplace.js";

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
    let items = [...fallbackStudios, ...fallbackMaterials];
    if (params.kind === "studio") {
      items = filterStudios(fallbackStudios, params);
    } else if (params.kind === "material") {
      items = filterMaterials(fallbackMaterials, params);
    } else if (params.search || params.category || params.style) {
      const studios = filterStudios(fallbackStudios, params);
      const materials = filterMaterials(fallbackMaterials, params);
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
    return filterAssociates(fallbackAssociates, params);
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
