import React, { useEffect, useRef } from "react";
import MattersApp from "../matters/App";
import { ApiProvider, useApi } from "../matters/lib/ctx";
import "../matters/theme.css";

const MattersViewport = () => {
  const containerRef = useRef(null);
  const { theme } = useApi() || { theme: "dark" };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.dataset.theme = theme;
    if (theme === "light") {
      el.classList.add("light");
      el.classList.remove("dark");
    } else {
      el.classList.add("dark");
      el.classList.remove("light");
    }
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className="matters-root relative min-h-screen pt-20 pb-16"
    >
      <MattersApp />
    </div>
  );
};

const MattersPage = () => (
  <ApiProvider>
    <MattersViewport />
  </ApiProvider>
);

export default MattersPage;

