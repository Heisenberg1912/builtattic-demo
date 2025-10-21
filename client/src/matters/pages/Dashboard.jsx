import { useEffect, useMemo, useRef, useState } from "react";
import {
  Camera,
  ClipboardList,
  Image as ImageIcon,
  LayoutGrid,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  PackageSearch,
  RefreshCcw,
  Sparkles,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Milestones, { computeStageScore } from "../components/Milestones";
import { useApi } from "../lib/ctx";

const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80";
const FALLBACK_THUMB =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80";

const formatCurrency = (amount, currency = "USD") => {
  if (amount === undefined || amount === null) return "--";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${Number(amount).toLocaleString()}`;
  }
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const summarizeBudget = (summary = {}) => {
  const budget = summary?.budget || summary?.financials || summary?.metrics?.budget || {};
  const total = Number(budget.total ?? budget.capex ?? budget.overall ?? 0);
  const used = Number(budget.used ?? budget.spent ?? budget.drawn ?? 0);
  const variance = Number(budget.variance ?? budget.remaining ?? total - used);
  return { total, used, variance };
};

const heroImageFromGallery = (gallery = [], activeMode) => {
  if (!Array.isArray(gallery) || gallery.length === 0) return null;
  const preferred = gallery.find((item) => item.mode === activeMode) || gallery[0];
  return {
    title: preferred.title || preferred.name || "Mode gallery",
    subtitle: preferred.category || preferred.mode || "Latest capture",
    image:
      preferred.hero_image ||
      preferred.image_url ||
      preferred.thumbnail_url ||
      preferred.preview_url ||
      preferred.url ||
      FALLBACK_HERO,
    author: preferred.uploaded_by || preferred.author || "",
  };
};

const resolveImage = (source, index = 0) =>
  source?.preview_url ||
  source?.thumbnail_url ||
  source?.image_url ||
  source?.hero_image ||
  source?.url ||
  `${FALLBACK_THUMB}&sig=${index}`;

function HeroPanel({ hero, modeLabel, windowLabel, summary, overallProgress }) {
  const { total, used, variance } = summarizeBudget(summary);
  const image = hero?.image || FALLBACK_HERO;
  return (
    <section className="relative overflow-hidden rounded-[2.75rem] border border-border/60 shadow-card">
      <img src={image} alt={hero?.title || "Mode hero"} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-tr from-black/75 via-black/25 to-transparent" />
      <div className="relative flex flex-col gap-6 p-8 text-white">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70">
              {hero?.subtitle || "Featured mode"}
            </p>
            <h1 className="text-3xl font-semibold leading-tight">{modeLabel}</h1>
          </div>
          <div className="rounded-full border border-white/30 px-4 py-1 text-[11px] font-medium uppercase tracking-wide text-white/80">
            {windowLabel}
          </div>
        </div>
        <div className="grid gap-4 text-sm md:grid-cols-3">
          <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
            <p className="text-[11px] uppercase tracking-wide text-white/60">Total budget</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {total ? formatCurrency(total, summary?.currency || "USD") : "--"}
            </p>
            <p className="mt-2 text-xs text-white/70">
              {used ? `${formatCurrency(used, summary?.currency || "USD")} committed` : "Awaiting commitments"}
            </p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
            <p className="text-[11px] uppercase tracking-wide text-white/60">Remaining</p>
            <p className="mt-2 text-xl font-semibold text-white">
              {variance ? formatCurrency(variance, summary?.currency || "USD") : "--"}
            </p>
            <p className="mt-2 text-xs text-white/70">{hero?.author ? `Captured by ${hero.author}` : windowLabel}</p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
            <p className="text-[11px] uppercase tracking-wide text-white/60">Momentum</p>
            <p className="mt-2 text-2xl font-semibold text-white">{overallProgress}%</p>
            <p className="mt-2 text-xs text-white/70">Combined readiness across milestones.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function GalleryStrip({ gallery = [] }) {
  const items = Array.isArray(gallery) ? gallery.slice(0, 8) : [];
  if (!items.length) {
    return (
      <section className="card flex items-center justify-center rounded-[2.25rem] border border-dashed border-border/60 p-12 text-sm text-textMuted">
        Upload media to see the live gallery.
      </section>
    );
  }
  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between text-xs uppercase tracking-wide text-textMuted">
        <span className="inline-flex items-center gap-2">
          <ImageIcon className="h-4 w-4" /> Site gallery
        </span>
        <span className="rounded-full border border-border/60 px-3 py-1 text-[11px] text-textMuted">
          {items.length} captures
        </span>
      </header>
      <div className="hide-scrollbar grid grid-flow-col auto-cols-[minmax(220px,1fr)] gap-4 overflow-x-auto rounded-[2.25rem] border border-border/60 bg-surface p-4 shadow-inner">
        {items.map((item, index) => (
          <figure key={item.id || item.slug || index} className="group relative flex h-56 flex-col justify-end overflow-hidden rounded-[1.75rem] shadow-md">
            <img src={resolveImage(item, index)} alt={item.title || item.name || "Gallery item"} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            <figcaption className="relative bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 text-white">
              <p className="text-sm font-semibold">{item.title || item.name || "Gallery item"}</p>
              <p className="text-[11px] text-white/70">{item.category || item.mode || "Captured on site"}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function ImageStack({ gallery = [] }) {
  const items = Array.isArray(gallery) ? gallery.slice(0, 3) : [];
  return (
    <section className="card space-y-3 p-5">
      <header className="flex items-center gap-2 text-xs uppercase tracking-wide text-textMuted">
        <Camera className="h-4 w-4" /> Mood board
      </header>
      <div className="grid gap-3">
        {items.map((item, index) => (
          <figure key={item.id || item.slug || index} className="relative h-40 overflow-hidden rounded-[1.5rem]">
            <img src={resolveImage(item, index + 20)} alt={item.title || "Mood"} className="absolute inset-0 h-full w-full object-cover" />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent p-3 text-xs text-white">
              {item.title || item.category || "Untitled"}
            </figcaption>
          </figure>
        ))}
        {!items.length && (
          <div className="h-40 rounded-[1.5rem] border border-dashed border-border/60 bg-surface-soft" />
        )}
      </div>
    </section>
  );
}

function WeatherInsightCard({ weather, onRefresh, loading }) {
  if (!weather) {
    return (
      <section className="card flex flex-col gap-3 p-5">
        <header className="text-xs uppercase tracking-wide text-textMuted">Weather insight</header>
        <p className="text-sm text-textMuted">Connect OpenWeather to activate live context.</p>
        <button
          type="button"
          onClick={onRefresh}
          className="self-start rounded-full border border-border/70 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-textPrimary"
        >
          Connect feed
        </button>
      </section>
    );
  }
  const unitLabel = weather.units === "imperial" ? "°F" : "°C";
  return (
    <section className="card flex flex-col gap-4 p-5">
      <header className="flex items-center justify-between text-xs uppercase tracking-wide text-textMuted">
        <span>{weather.location}</span>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="rounded-full border border-border/70 px-3 py-1 text-[11px] font-medium text-textMuted hover:text-textPrimary disabled:cursor-not-allowed"
        >
          {loading ? "Updating" : "Refresh"}
        </button>
      </header>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-4xl font-semibold text-textPrimary">
            {Math.round(weather.temperature)}
            <span className="ml-1 text-lg align-top">{unitLabel}</span>
          </p>
          <p className="text-sm text-textMuted">{weather.conditions}</p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-surface-soft px-4 py-3 text-right text-xs text-textMuted">
          <p>Humidity {weather.humidity}%</p>
          <p>Wind {weather.wind_speed.toFixed(1)} {weather.wind_units}</p>
          <p className="mt-1">Updated {formatDate(weather.retrieved_at)}</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-textMuted">{weather.insight}</p>
    </section>
  );
}

function ModeSnapshotCard({ systems = [], incidents = [] }) {
  const topSystems = Array.isArray(systems) ? systems.slice(0, 4) : [];
  const openIncidents = incidents.filter((incident) => !incident.resolved_at);
  return (
    <section className="card space-y-4 p-5">
      <header className="flex items-center justify-between text-xs uppercase tracking-wide text-textMuted">
        <span>Active systems</span>
        <span className="rounded-full border border-border/60 px-3 py-1 text-[11px] text-textMuted">
          {topSystems.length} live • {openIncidents.length} alerts
        </span>
      </header>
      <div className="space-y-2">
        {topSystems.map((system) => (
          <div
            key={system.id || system.name}
            className="flex items-center justify-between rounded-2xl border border-border/60 bg-surface-soft px-3 py-2 text-sm"
          >
            <span className="font-medium text-textPrimary">{system.name || system.id}</span>
            <span className="text-[11px] uppercase tracking-wide text-textMuted">{system.status || "Monitoring"}</span>
          </div>
        ))}
        {!topSystems.length && (
          <div className="rounded-2xl border border-dashed border-border/60 px-3 py-6 text-center text-sm text-textMuted">
            Systems will appear as soon as telemetry syncs.
          </div>
        )}
      </div>
    </section>
  );
}

function FinanceSnapshot({ finance = [], currency = "USD" }) {
  const items = Array.isArray(finance) ? finance.slice(0, 5) : [];
  return (
    <section className="card space-y-4 p-5">
      <header className="flex items-center justify-between text-xs uppercase tracking-wide text-textMuted">
        <span>Finance snapshot</span>
        <span className="rounded-full border border-border/60 px-3 py-1 text-[11px] text-textMuted">Top approvals</span>
      </header>
      {items.length ? (
        <ul className="space-y-2 text-sm">
          {items.map((item, index) => (
            <li
              key={item.id || item.reference || index}
              className="flex items-center justify-between rounded-2xl border border-border/60 bg-surface-soft px-3 py-2"
            >
              <span className="truncate text-textPrimary">{item.title || item.vendor || "Transaction"}</span>
              <span className="font-semibold text-textPrimary">
                {formatCurrency(Number(item.amount) || 0, item.currency || currency)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-dashed border-border/60 px-3 py-6 text-center text-sm text-textMuted">
          Finance entries will populate once approvals sync.
        </div>
      )}
    </section>
  );
}

function AnalystBoard({ insights = [] }) {
  const items = Array.isArray(insights) ? insights.slice(0, 3) : [];
  return (
    <section className="card space-y-3 p-5">
      <header className="text-xs uppercase tracking-wide text-textMuted">Analyst insights</header>
      {items.length ? (
        <ul className="space-y-2 text-sm text-textPrimary">
          {items.map((item) => (
            <li key={item.id || item.title} className="rounded-2xl border border-border/60 bg-surface-soft px-3 py-2">
              <p className="font-medium">{item.title || item.summary || "Insight"}</p>
              <p className="text-xs text-textMuted">{item.tags?.join(" • ") || ""}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-dashed border-border/60 px-3 py-6 text-center text-sm text-textMuted">
          Insights will appear as teams add notes.
        </div>
      )}
    </section>
  );
}

function ChatCard({ activeMode }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      persona: "architect",
      content: "Hi! I'm your Builtattic associate. Ask about design or logistics and I'll route it correctly.",
    },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, pending]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || pending) return;
    const history = [...messages, { role: "user", content: trimmed }];
    setMessages(history);
    setInput("");
    setPending(true);
    try {
      const response = await fetch("/api/matters/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: activeMode,
          messages: history.map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Assistant unavailable");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          persona: data.persona || "architect",
          content: data.reply,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          persona: "architect",
          content: err.message || "I couldn't reach the assistant right now.",
        },
      ]);
    } finally {
      setPending(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <section className="card flex h-full flex-col overflow-hidden p-0">
      <header className="flex items-center justify-between border-b border-border/60 px-5 py-4 text-xs uppercase tracking-wide text-textMuted">
        <span>Associate chat</span>
      </header>
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {messages.map((message, index) => {
          const isAssistant = message.role === "assistant";
          return (
            <div
              key={`${message.role}-${index}`}
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                isAssistant ? "border border-border/60 bg-surface" : "ml-auto bg-textPrimary text-white"
              }`}
            >
              <p className="text-[11px] font-semibold uppercase tracking-wide text-textMuted/70">
                {isAssistant ? message.persona || "Builtattic" : "You"}
              </p>
              <p className="mt-1 whitespace-pre-wrap leading-relaxed text-current">{message.content}</p>
            </div>
          );
        })}
        {pending && (
          <div className="max-w-[60%] rounded-2xl border border-border/60 bg-surface px-4 py-3 text-xs text-textMuted">
            Drafting a response…
          </div>
        )}
      </div>
      <div className="border-t border-border/60 bg-surface-soft px-5 py-4">
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about structure, materials, or logistics…"
          rows={2}
          className="w-full resize-none rounded-xl border border-border/70 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-border"
        />
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || pending}
            className="rounded-full border border-border/70 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-textPrimary hover:text-textMuted disabled:cursor-not-allowed disabled:opacity-60"
          >
            Send
          </button>
        </div>
      </div>
    </section>
  );
}

function InventoryGallery({ inventory = [], gallery = [] }) {
  const images = Array.isArray(gallery) ? gallery : [];
  return (
    <section className="card space-y-4 p-6">
      <header className="flex items-center gap-2 text-xs uppercase tracking-wide text-textMuted">
        <PackageSearch className="h-4 w-4" /> Inventory overview
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(inventory || []).slice(0, 6).map((item, index) => (
          <article key={item.id || index} className="overflow-hidden rounded-[1.75rem] border border-border/60 bg-surface-soft">
            <img src={resolveImage(images[index], index + 40)} alt={item.name || "Inventory"} className="h-32 w-full object-cover" />
            <div className="space-y-1 border-t border-border/60 p-4 text-sm">
              <p className="font-semibold text-textPrimary">{item.name || "Inventory item"}</p>
              <p className="text-xs text-textMuted">{item.location || item.mode || "Active"}</p>
            </div>
          </article>
        ))}
        {!inventory?.length && (
          <div className="col-span-full rounded-[1.75rem] border border-dashed border-border/60 bg-surface-soft p-12 text-center text-sm text-textMuted">
            Inventory will appear once items sync from Matters API.
          </div>
        )}
      </div>
    </section>
  );
}

function ProcurementBoard({ finance = [], currency = "USD" }) {
  const items = Array.isArray(finance) ? finance.slice(0, 6) : [];
  return (
    <section className="card space-y-4 p-6">
      <header className="flex items-center gap-2 text-xs uppercase tracking-wide text-textMuted">
        <ClipboardList className="h-4 w-4" /> Procurement tracker
      </header>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => (
          <article key={item.id || index} className="space-y-2 rounded-[1.5rem] border border-border/60 bg-surface-soft p-4 text-sm">
            <p className="font-semibold text-textPrimary">{item.title || item.vendor || "Approval"}</p>
            <p className="text-xs text-textMuted">{item.category || item.status || "Pending"}</p>
            <p className="text-sm font-semibold text-textPrimary">{formatCurrency(Number(item.amount) || 0, item.currency || currency)}</p>
          </article>
        ))}
        {!items.length && (
          <div className="col-span-full rounded-[1.5rem] border border-dashed border-border/60 bg-surface-soft p-12 text-center text-sm text-textMuted">
            Procurement activity will appear here.
          </div>
        )}
      </div>
    </section>
  );
}

function DesignShowcase({ gallery = [] }) {
  return (
    <section className="card space-y-4 p-6">
      <header className="flex items-center gap-2 text-xs uppercase tracking-wide text-textMuted">
        <LayoutGrid className="h-4 w-4" /> Design showcase
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {(gallery || []).slice(0, 6).map((item, index) => (
          <figure key={item.id || index} className="overflow-hidden rounded-[1.75rem] border border-border/60 bg-surface-soft">
            <img src={resolveImage(item, index + 60)} alt={item.title || "Design"} className="h-40 w-full object-cover" />
            <figcaption className="space-y-1 border-t border-border/60 p-4 text-sm">
              <p className="font-semibold text-textPrimary">{item.title || item.name || "Concept"}</p>
              <p className="text-xs text-textMuted">{item.category || item.mode || "Gallery"}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function HistoryTimeline({ insights = [], incidents = [] }) {
  const combined = [...(insights || []), ...(incidents || [])]
    .slice(0, 6)
    .map((item) => ({
      title: item.title || item.summary || item.description || "Update",
      date: item.created_at || item.timestamp || item.updated_at,
      detail: item.detail || item.notes || item.status,
    }));

  return (
    <section className="card space-y-4 p-6">
      <header className="text-xs uppercase tracking-wide text-textMuted">Timeline</header>
      {combined.length ? (
        <ol className="space-y-3 text-sm text-textPrimary">
          {combined.map((entry, index) => (
            <li key={index} className="rounded-[1.5rem] border border-border/60 bg-surface-soft px-4 py-3">
              <p className="font-semibold">{entry.title}</p>
              <p className="text-xs text-textMuted">{formatDate(entry.date)}</p>
              {entry.detail && <p className="mt-1 text-sm text-textMuted">{entry.detail}</p>}
            </li>
          ))}
        </ol>
      ) : (
        <div className="rounded-[1.5rem] border border-dashed border-border/60 bg-surface-soft p-12 text-center text-sm text-textMuted">
          No timeline entries yet.
        </div>
      )}
    </section>
  );
}

export default function Dashboard() {
  const {
    activeMode,
    summary,
    weather,
    gallery,
    finance,
    inventory,
    systems,
    insights,
    incidents,
    kpis,
    loading,
    refreshAll,
    refreshWeather,
    activeSidebar,
  } = useApi() || {};

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(min-width: 1024px)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(min-width: 1024px)");
    const handler = () => setIsDesktop(media.matches);
    media.addEventListener("change", handler);
    handler();
    return () => media.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (isDesktop) {
      setSidebarMobileOpen(false);
    } else {
      setSidebarCollapsed(false);
    }
  }, [isDesktop]);

  const stageScores = useMemo(() => computeStageScore(kpis, incidents), [kpis, incidents]);
  const stageValues = Object.values(stageScores);
  const overallProgress = stageValues.length
    ? Math.round(stageValues.reduce((total, value) => total + value, 0) / stageValues.length)
    : 0;

  const modeLabel =
    summary?.mode_label || summary?.mode_name || (activeMode ? activeMode.replace(/_/g, " ") : "All systems");
  const windowLabel = summary?.period_label || "Last 90 days";
  const hero = heroImageFromGallery(gallery, activeMode) || { image: FALLBACK_HERO };
  const inventoryList = Array.isArray(summary?.inventory) ? summary.inventory : inventory || [];

  const handleSidebarToggle = () => {
    if (isDesktop) {
      setSidebarCollapsed((prev) => !prev);
    } else {
      setSidebarMobileOpen((prev) => !prev);
    }
  };

  const handleRefreshDashboard = () => {
    refreshAll?.(activeMode);
    refreshWeather?.(activeMode);
  };

  const DashboardView = (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSidebarToggle}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-surface-soft text-textMuted hover:text-textPrimary"
          >
            {isDesktop ? (sidebarCollapsed ? (
              <PanelLeftOpen className="h-5 w-5" aria-hidden="true" />
            ) : (
              <PanelLeftClose className="h-5 w-5" aria-hidden="true" />
            )) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-textMuted">Viewing {modeLabel}</p>
            <p className="text-xs text-textMuted">Window: {windowLabel}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleRefreshDashboard}
          className="inline-flex items-center gap-1 rounded-full border border-border/70 px-3 py-1 text-xs font-medium text-textMuted hover:text-textPrimary"
        >
          <RefreshCcw className="h-4 w-4" aria-hidden="true" />
          Sync
        </button>
      </div>
      <HeroPanel hero={hero} modeLabel={modeLabel} windowLabel={windowLabel} summary={summary} overallProgress={overallProgress} />
      <GalleryStrip gallery={gallery} />
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6">
          <Milestones />
          <WeatherInsightCard
            weather={weather}
            onRefresh={() => refreshWeather?.(activeMode)}
            loading={loading?.weather}
          />
        </div>
        <div className="space-y-6">
          <ModeSnapshotCard systems={systems} incidents={incidents} />
          <FinanceSnapshot finance={finance} currency={summary?.currency || "USD"} />
        </div>
        <div className="space-y-6">
          <ImageStack gallery={gallery} />
          <AnalystBoard insights={insights} />
          <ChatCard activeMode={activeMode} />
        </div>
      </div>
    </div>
  );

  const InventoryView = <InventoryGallery inventory={inventoryList} gallery={gallery} />;
  const ProcurementView = <ProcurementBoard finance={finance} currency={summary?.currency || "USD"} />;
  const DesignView = <DesignShowcase gallery={gallery} />;
  const FinanceView = <FinanceSnapshot finance={finance} currency={summary?.currency || "USD"} />;
  const HistoryView = <HistoryTimeline insights={insights} incidents={incidents} />;
  const InspirationView = <ImageStack gallery={gallery} />;

  const contentBySidebar = {
    Dashboard: DashboardView,
    Inventory: InventoryView,
    OrderMaterial: ProcurementView,
    DesignDetails: DesignView,
    FinanceReport: FinanceView,
    History: HistoryView,
    MyDesign: InspirationView,
  };

  const mainContent = contentBySidebar[activeSidebar || "Dashboard"] || DashboardView;

  return (
    <div className="min-h-screen overflow-x-hidden bg-base text-textPrimary transition-colors duration-300">
      {!isDesktop && sidebarMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarMobileOpen(false)}
        />
      )}

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-4 pb-8 pt-6 sm:px-6 lg:flex-row">
        <Sidebar
          collapsed={sidebarCollapsed}
          mobileOpen={sidebarMobileOpen}
          isDesktop={isDesktop}
          onNavigate={() => setSidebarMobileOpen(false)}
          onToggleCollapse={handleSidebarToggle}
        />

        <main className="flex-1 space-y-6">
          {mainContent}
        </main>
      </div>
    </div>
  );
}
