import { useMemo } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  PenTool,
  LineChart,
  History,
  Sparkles,
  SunMedium,
  MoonStar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useApi } from "../lib/ctx";

const NAV_ITEMS = [
  { key: "Dashboard", label: "Overview", Icon: LayoutDashboard },
  { key: "Inventory", label: "Inventory", Icon: Package },
  { key: "OrderMaterial", label: "Procurement", Icon: ShoppingBag },
  { key: "DesignDetails", label: "Design Studio", Icon: PenTool },
  { key: "FinanceReport", label: "Finance", Icon: LineChart },
  { key: "History", label: "Timeline", Icon: History },
  { key: "MyDesign", label: "Inspiration", Icon: Sparkles },
];

export default function Sidebar({
  collapsed = false,
  mobileOpen = false,
  isDesktop = false,
  onNavigate,
  onToggleCollapse,
}) {
  const {
    activeSidebar,
    setActiveSidebar,
    modes,
    activeMode,
    setActiveMode,
    theme,
    setTheme,
  } = useApi() || {};

  const effectiveCollapsed = isDesktop ? collapsed : false;

  const containerClasses = useMemo(() => {
    const classes = [
      "z-40 flex flex-col gap-5 rounded-3xl border border-border/70 bg-surface text-sm text-textPrimary shadow-card transition-all duration-300",
      effectiveCollapsed ? "lg:w-[86px] lg:items-center lg:p-4" : "lg:w-[248px] lg:p-5",
      "p-4",
    ];
    if (isDesktop) {
      classes.push("hidden lg:flex");
    } else if (mobileOpen) {
      classes.push("fixed top-20 left-4 right-4 flex max-h-[calc(100vh-120px)] overflow-y-auto backdrop-blur");
    } else {
      classes.push("hidden");
    }
    return classes.join(" ");
  }, [effectiveCollapsed, isDesktop, mobileOpen]);

  const handleNav = (item) => {
    if (item?.action) {
      item.action();
      return;
    }
    setActiveSidebar?.(item.key);
    if (!isDesktop) {
      onNavigate?.();
    }
  };

  const darkModeItem = useMemo(
    () => ({
      key: "DarkMode",
      label: "Dark Mode",
      Icon: theme === "dark" ? SunMedium : MoonStar,
      action: () => {
        const next = theme === "dark" ? "light" : "dark";
        setTheme?.(next);
      },
    }),
    [setTheme, theme],
  );

  const itemsWithDarkMode = [...NAV_ITEMS, darkModeItem];

  const handleModeSelect = (modeName) => {
    if (!modeName || modeName === activeMode) return;
    setActiveMode?.(modeName);
    setActiveSidebar?.("Dashboard");
    if (!isDesktop) {
      onNavigate?.();
    }
  };

  const modeButtons = (modes || []).map((mode) => {
    const isActive = mode.name === activeMode;
    return (
      <button
        key={mode.name}
        onClick={() => handleModeSelect(mode.name)}
        className={`flex w-full flex-col items-start rounded-2xl border px-3 py-2 text-left transition-all duration-200 ${
          isActive
            ? "border-textPrimary/40 bg-textPrimary/5 text-textPrimary shadow-sm"
            : "border-border/70 bg-surface-soft text-textMuted hover:border-textPrimary/20 hover:text-textPrimary"
        }`}
      >
        <span className="text-sm font-semibold leading-tight">{mode.label}</span>
        {mode.description && (
          <span className="mt-1 text-[11px] leading-snug text-textMuted">
            {mode.description}
          </span>
        )}
      </button>
    );
  });

  return (
    <aside className={containerClasses}>
      <header className={`flex w-full items-center ${effectiveCollapsed ? "justify-center" : "justify-between"}`}>
        {!effectiveCollapsed && (
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-textMuted">
            Matters
          </span>
        )}
        <button
          type="button"
          onClick={() => onToggleCollapse?.()}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/70 text-textMuted hover:text-textPrimary"
        >
          {effectiveCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </header>

      <nav className="flex flex-col gap-1">
        {itemsWithDarkMode.map((item) => {
          const isActive = item.key && item.key !== "DarkMode" && activeSidebar === item.key;
          const Icon = item.Icon;
          return (
            <button
              key={item.key}
              onClick={() => handleNav(item)}
              className={`group flex h-10 w-full items-center gap-2 rounded-xl px-3 py-2 text-left transition-all duration-200 ${
                isActive
                  ? "bg-textPrimary/5 text-textPrimary shadow-sm"
                  : "text-textMuted hover:bg-surface-soft hover:text-textPrimary"
              } ${effectiveCollapsed ? "justify-center px-0" : ""}`}
            >
              <Icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
              {!effectiveCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {modeButtons.length > 0 && (
        <div className={`space-y-3 rounded-2xl border border-border/70 bg-surface-soft p-3 ${effectiveCollapsed ? "hidden" : ""}`}>
          <div className="text-[11px] uppercase tracking-wide text-textMuted">
            Modes
          </div>
          <div className="space-y-2">
            {modeButtons}
          </div>
        </div>
      )}
    </aside>
  );
}
