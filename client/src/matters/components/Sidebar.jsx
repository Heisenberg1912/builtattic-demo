import { useMemo } from "react";
import {
  Boxes,
  ClipboardList,
  DraftingCompass,
  History as HistoryIcon,
  LayoutDashboard,
  Moon,
  Palette,
  Sun,
  Wallet,
} from "lucide-react";
import { useApi } from "../lib/ctx";

const NAV_ITEMS = [
  { key: "Dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { key: "Inventory", label: "Inventory", Icon: Boxes },
  { key: "OrderMaterial", label: "Order Material", Icon: ClipboardList },
  { key: "DesignDetails", label: "Design Details", Icon: DraftingCompass },
  { key: "FinanceReport", label: "Finance Report", Icon: Wallet },
  { key: "History", label: "History", Icon: HistoryIcon },
  { key: "MyDesign", label: "My Design", Icon: Palette },
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
    theme,
    setTheme,
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
      Icon: theme === "dark" ? Sun : Moon,
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
        className={`flex w-full flex-col items-start rounded-2xl border px-3 py-2 text-left transition ${
          isActive
            ? "border-accent bg-accent/10 text-accent"
            : "border-border bg-surfaceSoft text-textMuted hover:border-accent hover:text-textPrimary"
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
      <nav className="flex flex-col gap-1">
        {itemsWithDarkMode.map((item) => {
          const isActive = item.key && item.key !== "DarkMode" && activeSidebar === item.key;
          const Icon = item.Icon;
          return (
            <button
              key={item.key}
              onClick={() => handleNav(item)}
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
      {modeButtons.length > 0 && (
        <div className="space-y-3 rounded-2xl border border-border bg-surfaceSoft/60 p-3">
          <div className="text-[11px] uppercase tracking-wide text-textMuted">
            Modes
          </div>
          <div className="grid gap-2">
            {modeButtons}
          </div>
        </div>
      )}
    </aside>
  );
}
