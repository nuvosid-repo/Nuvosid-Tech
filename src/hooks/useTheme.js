"use client";

import { useCallback, useSyncExternalStore } from "react";

export const THEME_KEY = "nuvosid-theme";
const DEFAULT_THEME = "dark";

function subscribe(callback) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const getSnapshot = () => document.documentElement.getAttribute("data-theme") || DEFAULT_THEME;
const getServerSnapshot = () => DEFAULT_THEME;

/**
 * Reads the current theme from <html data-theme> (set before paint by the
 * inline script in layout.js) and exposes a toggle that persists to localStorage.
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next) => {
    const root = document.documentElement;
    root.classList.add("theme-transition");
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* storage unavailable */
    }
    window.setTimeout(() => root.classList.remove("theme-transition"), 600);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(getSnapshot() === "dark" ? "light" : "dark");
  }, [setTheme]);

  return { theme, setTheme, toggleTheme, isDark: theme === "dark" };
}

// Inline, render-blocking script: applies the saved theme before first paint
// to avoid a flash of the wrong theme.
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_KEY}');if(t!=='light'&&t!=='dark'){t='${DEFAULT_THEME}';}var r=document.documentElement;r.setAttribute('data-theme',t);r.classList.add('js-ready');}catch(e){document.documentElement.setAttribute('data-theme','${DEFAULT_THEME}');}})();`;
