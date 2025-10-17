import { useEffect, useMemo, useRef, useState } from "react"
import Topbar from "../components/Topbar"
import Sidebar from "../components/Sidebar"
import { useApi } from "../lib/ctx"

const formatCurrency = (amount, currency = "USD") => {
  if (amount === undefined || amount === null) return "—"
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `${currency} ${Number(amount).toLocaleString()}`
  }
}

const formatDate = (value) => {
  if (!value) return "—"
  const date = new Date(value)
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function ModeSelector({ modes = [], activeMode, onSelect }) {
  if (!modes.length) {
    return (
      <div className="rounded-xl border border-dashed border-border px-3 py-4 text-sm text-textMuted">
        No modes configured yet. Add modes in your backend seed or through the modes collection.
      </div>
    )
  }
  return (
    <div className="flex flex-wrap gap-2">
      {modes.map((mode) => {
        const isActive = mode.name === activeMode
        return (
          <button
            key={mode.name}
            onClick={() => onSelect?.(mode.name)}
            className={`flex min-w-[140px] flex-col rounded-2xl border px-3 py-2 text-left transition ${
              isActive
                ? "border-accent bg-accent/10 text-accent"
                : "border-border bg-surfaceSoft text-textMuted hover:border-accent"
            }`}
          >
            <span className="text-sm font-semibold">{mode.label}</span>
            <span className="text-[11px] leading-tight text-textMuted">
              {mode.description}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function SummaryMetrics({ summary, inventory, finance }) {
  const metrics = useMemo(() => {
    const inventorySummary = summary?.metrics?.inventorySummary || {}
    const financeSummary = summary?.metrics?.financeSummary || {}
    const totalQuantity = inventory.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0,
    )
    const totalSuppliers = new Set(
      inventory.map((item) => item.supplier).filter(Boolean),
    ).size
    return [
      {
        label: "Inventory Items",
        value: inventory.length,
        hint: "Tracked entries",
      },
      {
        label: "Total Quantity",
        value: `${totalQuantity.toLocaleString()} units`,
        hint: "Across all statuses",
      },
      {
        label: "Active Suppliers",
        value: totalSuppliers,
        hint: "Distinct partners",
      },
      {
        label: "Budget",
        value: formatCurrency(financeSummary.budget),
        hint: "Total planned",
      },
      {
        label: "Expenses",
        value: formatCurrency(financeSummary.expense),
        hint: "Committed spend",
      },
      {
        label: "Invoices",
        value: formatCurrency(financeSummary.invoice),
        hint: "Pending approval",
      },
    ]
  }, [summary, inventory, finance])

  return (
    <div className="card space-y-3 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wide text-textMuted">Mode Metrics</div>
          <div className="text-sm text-textMuted">
            Snapshot updates when you switch modes.
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="flex flex-col rounded-xl border border-border bg-surfaceSoft px-3 py-2"
          >
            <span className="text-[11px] uppercase tracking-wide text-textMuted">
              {metric.label}
            </span>
            <span className="mt-1 text-lg font-semibold text-textPrimary">
              {metric.value}
            </span>
            <span className="mt-1 text-[10px] text-textMuted">{metric.hint}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function WeatherCard({ weather, onRefresh, loading }) {
  if (!weather) {
    return (
      <div className="card space-y-3 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-textMuted">
              Weather & AI Insight
            </div>
            <div className="text-sm text-textMuted">
              Connect an OpenWeatherMap API key to see live data.
            </div>
          </div>
          <button
            onClick={onRefresh}
            className="rounded-full border border-border px-3 py-1 text-xs text-textMuted transition hover:bg-surfaceSoft"
          >
            Check now
          </button>
        </div>
        <div className="rounded-xl border border-dashed border-border px-3 py-6 text-center text-sm text-textMuted">
          Provide `OPENWEATHER_API_KEY` and `GEMINI_API_KEY` in the backend environment to activate the weather assistant.
        </div>
      </div>
    )
  }

  return (
    <div className="card space-y-3 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wide text-textMuted">Weather Insight</div>
          <div className="text-sm text-textMuted">
            {weather.location} | {formatDate(weather.retrieved_at)}
          </div>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="rounded-full border border-border px-3 py-1 text-xs text-textMuted transition hover:bg-surfaceSoft disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>
      <div className="rounded-2xl border border-border bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent p-4 text-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-4xl font-bold text-textPrimary">
              {Math.round(weather.temperature)}
              <span className="text-lg align-top">°{weather.units === "imperial" ? "F" : "C"}</span>
            </div>
            <div className="text-sm text-textMuted">{weather.conditions}</div>
          </div>
          <div className="text-right text-[11px] text-textMuted">
            <div>Humidity {weather.humidity}%</div>
            <div>
              Wind {weather.wind_speed.toFixed(1)} {weather.wind_units}
            </div>
          </div>
        </div>
        <div className="mt-3 rounded-xl border border-border bg-surfaceSoft/80 p-3 text-sm leading-relaxed text-textPrimary">
          {weather.insight}
        </div>
        {weather.ai_model && (
          <div className="mt-2 text-[10px] uppercase tracking-wide text-textMuted">
            Insight generated by {weather.ai_model}
          </div>
        )}
      </div>
    </div>
  )
}

function GalleryPreview({ gallery = [] }) {
  const items = gallery.slice(0, 4)
  return (
    <div className="card space-y-3 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wide text-textMuted">Latest Gallery</div>
          <div className="text-sm text-textMuted">
            Recent uploads tailored to this mode.
          </div>
        </div>
      </div>
      {items.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {items.map((item) => (
            <figure
              key={item.id}
              className="group relative overflow-hidden rounded-2xl border border-border"
            >
              <img
                src={item.thumbnail_url || item.image_url}
                alt={item.title}
                className="h-32 w-full object-cover transition group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent px-3 py-2 text-[11px] text-white">
                <div className="font-semibold">{item.title}</div>
                <div className="truncate">{item.uploaded_by}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border px-3 py-6 text-center text-sm text-textMuted">
          No gallery assets yet for this mode.
        </div>
      )}
    </div>
  )
}

function InsightsRail({ insights = [] }) {
  const items = insights.slice(0, 4)
  return (
    <div className="card space-y-3 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wide text-textMuted">AI & Analyst Insights</div>
          <div className="text-sm text-textMuted">
            High-signal notes surfaced for this mode.
          </div>
        </div>
      </div>
      {items.length ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-border bg-surfaceSoft/80 p-3 text-sm"
            >
              <div className="text-xs uppercase tracking-wide text-textMuted">
                {item.source}
              </div>
              <div className="mt-1 text-base font-semibold text-textPrimary">
                {item.title}
              </div>
              <p className="mt-1 text-[13px] text-textMuted">{item.summary}</p>
              <div className="mt-2 flex flex-wrap gap-1 text-[10px] uppercase tracking-wide text-textMuted">
                {item.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border px-2 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border px-3 py-6 text-center text-sm text-textMuted">
          No insight records yet—add them through the `/insights` endpoint.
        </div>
      )}
    </div>
  )
}

function InventoryTable({ inventory = [] }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <div className="text-xs uppercase tracking-wide text-textMuted">Inventory</div>
          <div className="text-sm text-textMuted">
            Materials, equipment, and design assets tied to this mode.
          </div>
        </div>
      </div>
      {inventory.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surfaceSoft text-xs uppercase tracking-wide text-textMuted">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Supplier</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-border/60 text-sm text-textPrimary hover:bg-surfaceSoft/60"
                >
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-textMuted">{item.category}</td>
                  <td className="px-4 py-3 text-textMuted">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="px-4 py-3 text-textMuted">{item.location || "—"}</td>
                  <td className="px-4 py-3 text-textMuted">{item.status}</td>
                  <td className="px-4 py-3 text-textMuted">{item.supplier || "—"}</td>
                  <td className="px-4 py-3 text-textMuted">
                    {item.notes || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-4 py-10 text-center text-sm text-textMuted">
          No inventory records yet for this mode.
        </div>
      )}
    </div>
  )
}

function FinanceTable({ finance = [] }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <div className="text-xs uppercase tracking-wide text-textMuted">Finance</div>
          <div className="text-sm text-textMuted">
            Budget, expenses, invoices, and forecasts.
          </div>
        </div>
      </div>
      {finance.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surfaceSoft text-xs uppercase tracking-wide text-textMuted">
              <tr>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Period</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Due</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {finance.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-border/60 text-sm text-textPrimary hover:bg-surfaceSoft/60"
                >
                  <td className="px-4 py-3 font-medium capitalize">{item.record_type}</td>
                  <td className="px-4 py-3 text-textMuted">{item.category}</td>
                  <td className="px-4 py-3 text-textMuted">
                    {formatCurrency(item.amount, item.currency)}
                  </td>
                  <td className="px-4 py-3 text-textMuted">{item.period || "—"}</td>
                  <td className="px-4 py-3 text-textMuted">{item.status || "—"}</td>
                  <td className="px-4 py-3 text-textMuted">{formatDate(item.due_date)}</td>
                  <td className="px-4 py-3 text-textMuted">
                    {item.notes || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-4 py-10 text-center text-sm text-textMuted">
          No finance records yet for this mode.
        </div>
      )}
    </div>
  )
}

function GalleryGrid({ gallery = [] }) {
  return (
    <div className="card space-y-3 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wide text-textMuted">Gallery</div>
          <div className="text-sm text-textMuted">
            Uploads are stored with MongoDB metadata.
          </div>
        </div>
      </div>
      {gallery.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-border transition hover:border-accent"
            >
              <div className="relative h-48">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
              </div>
              <div className="space-y-1 px-4 py-3 text-sm">
                <div className="font-semibold text-textPrimary">{item.title}</div>
                <div className="text-[12px] text-textMuted">{item.description || "—"}</div>
                <div className="text-[11px] text-textMuted">
                  Uploaded by {item.uploaded_by} | {formatDate(item.uploaded_at)}
                </div>
                <div className="flex flex-wrap gap-1 text-[10px] uppercase tracking-wide text-textMuted">
                  {item.tags?.map((tag) => (
                    <span key={tag} className="rounded-full border border-border px-2 py-0.5">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border px-3 py-6 text-center text-sm text-textMuted">
          No captured imagery or design assets uploaded yet.
        </div>
      )}
    </div>
  )
}

function ChatPanel({ activeMode, standalone = false }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      persona: "architect",
      content:
        "Hi! I'm your Builtattic associate. Ask about design, structural strategies, site logistics or compliance and I'll route it to the right mindset.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (!expanded) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [expanded]);

  const personaLabel = (persona) =>
    persona === "civil engineer" ? "Builtattic Civil Engineer" : "Builtattic Architect";

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;
    const userMessage = { role: "user", content: trimmed };
    const historySnapshot = [...messages, userMessage];
    setMessages(historySnapshot);
    setInput("");
    setIsTyping(true);
    setError("");
    try {
      const response = await fetch("/api/matters/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: activeMode,
          messages: historySnapshot.map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Assistant is unavailable right now.");
      }
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          persona: data.persona || "architect",
          content: data.reply,
        },
      ]);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to reach the assistant.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          persona: "architect",
          content:
            "I could not contact the Gemini assistant. Please try again in a moment or reach out to support.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const panelContent = (
    <div className={`flex flex-1 flex-col bg-surfaceSoft/30 ${expanded ? "min-h-0" : "h-[360px]"}`}>
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {messages.map((entry, index) => {
          const isAssistant = entry.role === "assistant";
          return (
            <div
              key={`${entry.role}-${index}-${entry.content.slice(0, 8)}`}
              className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                isAssistant
                  ? "bg-white/70 backdrop-blur border border-border"
                  : "ml-auto bg-slate-900 text-white"
              }`}
            >
              <div className="text-[11px] font-semibold uppercase tracking-wide opacity-75">
                {isAssistant ? personaLabel(entry.persona) : "You"}
              </div>
              <p className="mt-1 whitespace-pre-wrap leading-relaxed">{entry.content}</p>
            </div>
          );
        })}
        {isTyping && (
          <div className="max-w-[60%] rounded-2xl border border-border bg-white/80 px-4 py-3 text-[12px] text-textMuted shadow-sm">
            Drafting a response...
          </div>
        )}
      </div>
      <div className="border-t border-border bg-white/70 backdrop-blur px-3 py-2">
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about structural loads, material choices, workflows..."
          rows={expanded ? 4 : 2}
          className="w-full resize-none rounded-lg border border-border/70 bg-white/80 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Send
          </button>
          {error && <span className="text-[11px] text-red-600">{error}</span>}
        </div>
      </div>
    </div>
  );

  if (expanded) {
    return (
      <div className="fixed inset-4 z-[70] flex flex-col rounded-3xl border border-border bg-base/90 backdrop-blur-2xl shadow-2xl">
        <div className="flex items-center justify-between border-b border-border/70 px-6 py-4">
          <div>
            <div className="text-xs uppercase tracking-wide text-textMuted">Associate Chat</div>
            <div className="text-sm text-textMuted">
              Gemini-powered guidance for architecture and civil queries.
            </div>
          </div>
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="rounded-md border border-border px-3 py-1 text-xs font-medium text-textMuted hover:bg-surfaceSoft"
          >
            Exit fullscreen
          </button>
        </div>
        {panelContent}
      </div>
    );
  }

  return (
    <div className={`card ${standalone ? "p-0" : "p-0"} overflow-hidden`}>
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <div className="text-xs uppercase tracking-wide text-textMuted">Associate Chat</div>
          <div className="text-sm text-textMuted">
            Gemini-powered guidance for architecture and civil queries.
          </div>
        </div>
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="rounded-md border border-border px-3 py-1 text-xs font-medium text-textMuted hover:bg-surfaceSoft"
        >
          Expand
        </button>
      </div>
      {panelContent}
    </div>
  );
}
function InsightsBoard({ insights = [] }) {
  return (
    <div className="card space-y-3 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wide text-textMuted">Insights</div>
          <div className="text-sm text-textMuted">
            Deeper view of the AI and analyst feed.
          </div>
        </div>
      </div>
      {insights.length ? (
        <div className="space-y-3">
          {insights.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-border bg-surfaceSoft/60 p-4 text-sm"
            >
              <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                <div className="text-xs uppercase tracking-wide text-textMuted">
                  {item.source}
                </div>
                <div className="text-[11px] text-textMuted">
                  Logged {formatDate(item.created_at)}
                </div>
              </div>
              <div className="mt-2 text-lg font-semibold text-textPrimary">
                {item.title}
              </div>
              <p className="mt-2 text-[13px] text-textMuted">{item.summary}</p>
              <div className="mt-3 flex flex-wrap gap-1 text-[10px] uppercase tracking-wide text-textMuted">
                {item.tags?.map((tag) => (
                  <span key={tag} className="rounded-full border border-border px-2 py-0.5">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border px-3 py-6 text-center text-sm text-textMuted">
          No insights captured yet.
        </div>
      )}
    </div>
  )
}

function SettingsPanel() {
  return (
    <div className="card space-y-4 p-4 text-sm text-textMuted">
      <div>
        <div className="text-xs uppercase tracking-wide text-textMuted">Environment Keys</div>
        <p className="mt-2">
          Configure these variables for full functionality:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-textPrimary/80">
          <li>
            <code>OPENWEATHER_API_KEY</code> — live weather feed.
          </li>
          <li>
            <code>GEMINI_API_KEY</code> — Google Gemini insights (model defaults to <code>gemini-1.5-flash</code>).
          </li>
          <li>
            <code>CHAT_EMBED_URL</code> — embed Matrix/Element, Rocket.Chat, or another open-source chat UI.
          </li>
          <li>
            <code>MONGO_URL</code> / <code>MONGO_DB</code> — MongoDB connection details.
          </li>
        </ul>
      </div>
      <div>
        <div className="text-xs uppercase tracking-wide text-textMuted">Mode Extensibility</div>
        <p className="mt-2">
          Add documents to the <code>modes</code> collection to introduce new operational modes. Each mode is referenced across inventory, finance, gallery, and insights without additional schema updates.
        </p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const {
    modes,
    activeMode,
    setActiveMode,
    summary,
    weather,
    inventory,
    finance,
    gallery,
    insights,
    loading,
    refreshAll,
    refreshWeather,
    activeSidebar,
  } = useApi() || {}

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia("(min-width: 1024px)").matches
  })

  useEffect(() => {
    if (typeof window === "undefined") return
    const media = window.matchMedia("(min-width: 1024px)")
    const handler = () => setIsDesktop(media.matches)
    media.addEventListener("change", handler)
    handler()
    return () => media.removeEventListener("change", handler)
  }, [])

  useEffect(() => {
    if (isDesktop) {
      setSidebarMobileOpen(false)
    } else {
      setSidebarCollapsed(false)
    }
  }, [isDesktop])

  const handleSidebarToggle = () => {
    if (isDesktop) {
      setSidebarCollapsed((prev) => !prev)
    } else {
      setSidebarMobileOpen((prev) => !prev)
    }
  }

  const handleModeChange = (modeName) => {
    if (!setActiveMode) return
    setActiveMode(modeName)
  }

  const handleRefreshDashboard = () => {
    refreshAll?.(activeMode)
    refreshWeather?.(activeMode)
  }

  const dashboardContent = (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-textMuted">Active Mode</div>
            <div className="text-xl font-semibold text-textPrimary">
              {modes?.find((mode) => mode.name === activeMode)?.label || "Select a mode"}
            </div>
          </div>
          <button
            onClick={handleRefreshDashboard}
            className="self-start rounded-full border border-border px-3 py-1 text-xs font-medium text-textMuted transition hover:bg-surfaceSoft"
          >
            Refresh data
          </button>
        </div>
        <ModeSelector modes={modes} activeMode={activeMode} onSelect={handleModeChange} />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,340px),minmax(0,1fr)]">
        <div className="space-y-4">
          <SummaryMetrics summary={summary} inventory={inventory} finance={finance} />
          <WeatherCard
            weather={weather}
            onRefresh={() => refreshWeather?.(activeMode)}
            loading={loading?.weather}
          />
          <ChatPanel activeMode={activeMode} />
        </div>
        <div className="space-y-4">
          <GalleryPreview gallery={gallery} />
          <InsightsRail insights={insights} />
        </div>
      </div>
    </div>
  )

  const contentBySidebar = {
    Dashboard: dashboardContent,
    Inventory: <InventoryTable inventory={inventory} />,
    Finance: <FinanceTable finance={finance} />,
    Gallery: <GalleryGrid gallery={gallery} />,
    Chat: <ChatPanel activeMode={activeMode} standalone />,
    Message: <ChatPanel activeMode={activeMode} standalone />,
    Insights: <InsightsBoard insights={insights} />,
    Settings: <SettingsPanel />,
  }

  const mainContent = contentBySidebar[activeSidebar || "Dashboard"] || dashboardContent

  return (
    <div className="min-h-screen overflow-x-hidden bg-base text-textPrimary transition-colors duration-300">
      <Topbar
        onToggleSidebar={handleSidebarToggle}
        sidebarCollapsed={sidebarCollapsed}
        isDesktop={isDesktop}
      />
      {!isDesktop && sidebarMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarMobileOpen(false)}
        />
      )}
      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-4 pb-8 pt-4 sm:px-6 lg:flex-row">
        <Sidebar
          collapsed={isDesktop && sidebarCollapsed}
          mobileOpen={sidebarMobileOpen}
          isDesktop={isDesktop}
          onNavigate={() => setSidebarMobileOpen(false)}
        />
        <main className="flex-1 space-y-4">
          {mainContent}
        </main>
      </div>
    </div>
  )
}




















