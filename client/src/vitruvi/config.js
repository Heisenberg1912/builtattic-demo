const envBase = import.meta.env.VITE_VITRUVI_API_BASE;
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

let base = envBase && typeof envBase === "string" ? envBase : "";

if (!base && apiBaseUrl && typeof apiBaseUrl === "string") {
  base = apiBaseUrl.replace(/\/api\/?$/, "");
}

if (!base && typeof window !== "undefined" && window.location?.origin) {
  base = window.location.origin;
}

const normalized = base ? base.replace(/\/$/, "") : "";

export const API_BASE = normalized && /\/vitruvi($|\/)/i.test(normalized)
  ? normalized
  : `${normalized || ""}/vitruvi`;
