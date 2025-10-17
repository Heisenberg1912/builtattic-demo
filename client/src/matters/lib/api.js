const API =
  import.meta.env.VITE_MATTERS_API_BASE ??
  (() => {
    const root = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL
    if (!root) return "http://127.0.0.1:8000"
    const normalized = root.replace(/\/+$/, "")
    if (/\/(api|v1)$/i.test(normalized)) {
      return `${normalized.replace(/\/(api|v1)$/i, "")}/matters`
    }
    return `${normalized}/matters`
  })()

async function request(path, { method = "GET", body, headers = {} } = {}) {
  const finalHeaders = new Headers(headers)
  if (body !== undefined && !finalHeaders.has("Content-Type")) {
    finalHeaders.set("Content-Type", "application/json")
  }
  const res = await fetch(`${API}${path}`, {
    method,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const message = await res.text().catch(() => `${res.status}`)
    throw new Error(message || `${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}

const buildQuery = (params = {}) => {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return
    search.append(key, value)
  })
  const qs = search.toString()
  return qs ? `?${qs}` : ""
}

export const api = {
  getModes: () => request("/modes"),
  getDashboardSummary: ({ mode }) =>
    request(`/dashboard/summary${buildQuery({ mode })}`),
  getWeatherInsight: (payload) =>
    request("/insights/weather", { method: "POST", body: payload }),
  getInventory: (params = {}) =>
    request(`/inventory${buildQuery(params)}`),
  createInventory: (payload) =>
    request("/inventory", { method: "POST", body: payload }),
  getFinance: (params = {}) =>
    request(`/finance${buildQuery(params)}`),
  createFinance: (payload) =>
    request("/finance", { method: "POST", body: payload }),
  getGallery: (params = {}) =>
    request(`/gallery${buildQuery(params)}`),
  createGallery: (payload) =>
    request("/gallery", { method: "POST", body: payload }),
  getInsights: (params = {}) =>
    request(`/insights${buildQuery(params)}`),
  createInsight: (payload) =>
    request("/insights", { method: "POST", body: payload }),
  getChatConfig: () => request("/chat/config"),
  updateRiskStatus: (id, payload) =>
    request(`/risks/${id}`, { method: "PATCH", body: payload }),
}
