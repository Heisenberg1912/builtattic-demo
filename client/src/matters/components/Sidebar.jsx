import { useMemo } from "react";
import {
  Boxes,
  Image as ImageIcon,
  LayoutDashboard,
  MessageCircle,
  Settings2,
  Shield,
  Wallet,
} from "lucide-react";
import { useApi } from "../lib/ctx";

const NAV_ITEMS = [
  { key: "Dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { key: "Inventory", label: "Inventory", Icon: Boxes },
  { key: "Finance", label: "Finance", Icon: Wallet },
  { key: "Gallery", label: "Gallery", Icon: ImageIcon },
  { key: "Chat", label: "Message", Icon: MessageCircle },
  { key: "Insights", label: "Insights", Icon: Shield },
  { key: "Settings", label: "Settings", Icon: Settings2 },
];

export default function Sidebar({
  collapsed = false,
  mobileOpen = false,
  isDesktop = false,
  onNavigate,
}) {
  const {
    activeSidebar,
    setActiveSidebar,
    modes,
    activeMode,
    setActiveMode,
    summary,
  } = useApi() || {};

  const containerClasses = useMemo(() => {
    const classes = [
      "z-40 flex flex-col gap-4 rounded-2xl border border-border bg-surface text-sm text-textPrimary shadow-card transition-all duration-300",
      collapsed ? "lg:w-[96px] lg:items-center lg:p-3" : "lg:w-[240px] lg:p-4",
      "p-4",
    ];
    if (isDesktop) {
      classes.push("hidden lg:flex");
    } else if (mobileOpen) {
      classes.push("fixed top-20 left-4 right-4 flex max-h-[calc(100vh-104px)] overflow-y-auto");
    } else {
      classes.push("hidden");
    }
    return classes.join(" ");
  }, [collapsed, isDesktop, mobileOpen]);

  const handleNav = (key) => {
    setActiveSidebar?.(key);
    if (!isDesktop) {
      onNavigate?.();
    }
  };

  const handleMode = (name) => {
    if (name === activeMode) return;
    setActiveMode?.(name);
    setActiveSidebar?.("Dashboard");
    if (!isDesktop) {
      onNavigate?.();
    }
  };

  const modeCards = (modes || []).map((mode) => {
    const isActive = mode.name === activeMode;
    return (
      <button
        key={mode.name}
        onClick={() => handleMode(mode.name)}
        className={`flex w-full flex-col rounded-2xl border px-3 py-2 text-left transition ${
          isActive
            ? "border-accent bg-accent/10 text-accent"
            : "border-border bg-surfaceSoft text-textMuted hover:border-accent"
        }`}
      >
        <span className="text-sm font-semibold">{mode.label}</span>
        <span className="text-[10px] leading-tight">{mode.description}</span>
      </button>
    );
  });

  const inventorySummary = summary?.metrics?.inventorySummary || {};

  return (
    <aside className={containerClasses}>
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = activeSidebar === item.key;
          const Icon = item.Icon;
          return (
            <button
              key={item.key}
              onClick={() => handleNav(item.key)}
              className={`flex h-10 w-full items-center gap-2 rounded-xl border border-transparent px-3 py-2 text-left transition-colors duration-200 ${
                isActive
                  ? "bg-accent/10 text-accent"
                  : "text-textMuted hover:bg-surfaceSoft"
              } ${collapsed ? "justify-center px-0" : ""}`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>
      <div className="space-y-3">
        <div className="text-xs uppercase tracking-wide text-textMuted">Modes</div>
        <div className={`grid gap-2 ${collapsed ? "grid-cols-1" : "grid-cols-1"}`}>
          {modeCards.length ? (
            modeCards
          ) : (
            <div className="rounded-xl border border-dashed border-border px-3 py-4 text-center text-xs text-textMuted">
              Seed modes via the backend to enable quick switching.
            </div>
          )}
        </div>
      </div>
      <div className="space-y-2 rounded-2xl border border-border bg-surfaceSoft p-3 text-xs text-textMuted">
        <div className="text-[10px] uppercase tracking-wide text-textMuted">
          Inventory Snapshot
        </div>
        {Object.keys(inventorySummary).length ? (
          <ul className="space-y-1">
            {Object.entries(inventorySummary).map(([status, stats]) => (
              <li
                key={status}
                className="flex items-center justify-between text-textPrimary"
              >
                <span className="capitalize text-textMuted">{status}</span>
                <span className="font-semibold">{stats.items} items</span>
              </li>
            ))}
          </ul>
        ) : (
          <div>No inventory yet.</div>
        )}
      </div>
    </aside>
  );
}
