import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import {
  APPEARANCE_STORAGE_KEY,
  CONTRAST_STORAGE_KEY,
  DENSITY_STORAGE_KEY,
  browserCapabilities,
  readAppearance,
  readContrast,
  readDensity,
  resolveContrast,
  resolveDensity,
  resolveTheme,
  type Appearance,
  type Contrast,
  type Density,
} from "../displayPreferences";
import { StatusAnnouncer } from "./StatusAnnouncer";

export interface ShellItem {
  label: string;
  value: string;
  title?: string;
}

export interface ShellContext {
  stage: string;
  composition: "page" | "workbench";
  contextItems: ShellItem[];
  statusItems: ShellItem[];
}

interface SiteShellProps {
  children: ReactNode;
  context: ShellContext;
}

function systemPrefersDark(): boolean {
  return typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
    ? false
    : window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function systemPrefersMoreContrast(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-contrast: more)").matches
  );
}

function handleResultsMethodologyNavigation(
  event: MouseEvent<HTMLDivElement>,
  stage: string,
): void {
  if (stage !== "results") return;

  const target = event.target;
  if (!(target instanceof Element)) return;

  const link = target.closest<HTMLAnchorElement>('a[href*="view=methodology"]');
  if (!link) return;

  event.preventDefault();
  const url = new URL(link.href, window.location.href);
  window.history.pushState({}, "", `${url.pathname}${url.search}${url.hash}`);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function SiteShell({ children, context }: SiteShellProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const [appearance, setAppearance] = useState<Appearance>(() =>
    readAppearance(window.localStorage),
  );
  const [systemDark, setSystemDark] = useState(systemPrefersDark);
  const [density, setDensity] = useState<Density>(() =>
    readDensity(window.localStorage),
  );
  const [contrast, setContrast] = useState<Contrast>(() =>
    readContrast(window.localStorage),
  );
  const [systemMoreContrast, setSystemMoreContrast] = useState(
    systemPrefersMoreContrast,
  );
  const [shellWidth, setShellWidth] = useState(() =>
    typeof window === "undefined" ? 1024 : window.innerWidth,
  );
  const [, setCapabilityRevision] = useState(0);
  const theme = resolveTheme(appearance, systemDark);
  const capabilities = browserCapabilities(shellWidth);
  const resolvedDensity = resolveDensity(density, capabilities);
  const resolvedContrast = resolveContrast(contrast, systemMoreContrast);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    )
      return;
    const colorMedia = window.matchMedia("(prefers-color-scheme: dark)");
    const contrastMedia = window.matchMedia("(prefers-contrast: more)");
    const update = () => {
      setSystemDark(colorMedia.matches);
      setSystemMoreContrast(contrastMedia.matches);
    };
    update();
    const mediaQueries = [colorMedia, contrastMedia];
    mediaQueries.forEach((media) => {
      if (media.addEventListener) media.addEventListener("change", update);
      else media.addListener?.(update);
    });
    return () =>
      mediaQueries.forEach((media) => {
        if (media.removeEventListener)
          media.removeEventListener("change", update);
        else media.removeListener?.(update);
      });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQueries =
      typeof window.matchMedia === "function"
        ? [
            window.matchMedia("(any-pointer: fine)"),
            window.matchMedia("(any-hover: hover)"),
            window.matchMedia("(pointer: coarse)"),
            window.matchMedia("(hover: none)"),
          ]
        : [];
    const updateWidth = () => {
      const measured = shellRef.current?.getBoundingClientRect().width ?? 0;
      setShellWidth(measured > 0 ? measured : window.innerWidth);
    };
    const updateCapabilities = () => {
      updateWidth();
      setCapabilityRevision((current) => current + 1);
    };
    updateWidth();
    const resizeObserver =
      typeof ResizeObserver === "function" && shellRef.current
        ? new ResizeObserver(updateWidth)
        : null;
    if (shellRef.current) resizeObserver?.observe(shellRef.current);
    if (!resizeObserver) window.addEventListener("resize", updateWidth);
    mediaQueries.forEach((media) => {
      if (media.addEventListener)
        media.addEventListener("change", updateCapabilities);
      else media.addListener?.(updateCapabilities);
    });
    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateWidth);
      mediaQueries.forEach((media) => {
        if (media.removeEventListener)
          media.removeEventListener("change", updateCapabilities);
        else media.removeListener?.(updateCapabilities);
      });
    };
  }, []);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.appearance = appearance;
    root.dataset.theme = theme;
    root.dataset.densityPreference = density;
    root.dataset.density = resolvedDensity;
    root.dataset.contrastPreference = contrast;
    root.dataset.contrast = resolvedContrast;
  }, [appearance, contrast, density, resolvedContrast, resolvedDensity, theme]);

  useEffect(() => {
    try {
      window.localStorage.setItem(APPEARANCE_STORAGE_KEY, appearance);
    } catch {
      // The visual preference still applies when storage is unavailable.
    }
  }, [appearance]);

  useEffect(() => {
    try {
      window.localStorage.setItem(DENSITY_STORAGE_KEY, density);
    } catch {
      // The visual preference still applies when storage is unavailable.
    }
  }, [density]);

  useEffect(() => {
    try {
      window.localStorage.setItem(CONTRAST_STORAGE_KEY, contrast);
    } catch {
      // The visual preference still applies when storage is unavailable.
    }
  }, [contrast]);

  return (
    <div
      ref={shellRef}
      className="site-shell"
      data-theme={theme}
      data-stage={context.stage}
      data-composition={context.composition}
      onClick={(event) =>
        handleResultsMethodologyNavigation(event, context.stage)
      }
    >
      <header className="site-masthead">
        <div className="site-brand">
          <p className="site-kicker">
            EDRIFFLES COMPUTER WEB / POLITICAL JUDGMENT LAB
          </p>
          <a className="site-title" href={import.meta.env.BASE_URL}>
            Political Judgment Lab
          </a>
          <p className="site-tagline">
            A layered profile of values, beliefs, and strategy.
          </p>
        </div>
        <div className="site-utility">
          <div className="site-meta" aria-label="Application information">
            <span>INSTRUMENT</span>
            <strong>PJD</strong>
            <span>SESSION</span>
            <strong>LOCAL</strong>
          </div>
          <nav className="site-actions" aria-label="Site navigation">
            <a
              className="site-home-link"
              href={import.meta.env.BASE_URL}
              aria-current={context.stage === "intro" ? "page" : undefined}
            >
              <span aria-hidden="true">[ </span>HOME
              <span aria-hidden="true"> ]</span>
            </a>
            <a
              className="site-methodology-link"
              href={`${import.meta.env.BASE_URL}?view=methodology`}
              aria-current={
                context.stage === "methodology" ? "page" : undefined
              }
            >
              <span aria-hidden="true">[ </span>METHODOLOGY
              <span aria-hidden="true"> ]</span>
            </a>
            <details
              className="display-control"
              onKeyDown={(event) => {
                if (event.key !== "Escape") return;
                event.preventDefault();
                event.currentTarget.removeAttribute("open");
                event.currentTarget.querySelector("summary")?.focus();
              }}
            >
              <summary>
                <span aria-hidden="true">[ </span>DISPLAY
                <span aria-hidden="true"> ]</span>
              </summary>
              <div className="display-popover">
                <fieldset>
                  <legend>Appearance</legend>
                  <label className="display-option">
                    <input
                      type="radio"
                      name="appearance"
                      value="system"
                      checked={appearance === "system"}
                      onChange={() => setAppearance("system")}
                    />
                    <span>System</span>
                  </label>
                  <label className="display-option">
                    <input
                      type="radio"
                      name="appearance"
                      value="light"
                      checked={appearance === "light"}
                      onChange={() => setAppearance("light")}
                    />
                    <span>Light</span>
                  </label>
                  <label className="display-option">
                    <input
                      type="radio"
                      name="appearance"
                      value="dark"
                      checked={appearance === "dark"}
                      onChange={() => setAppearance("dark")}
                    />
                    <span>Dark</span>
                  </label>
                  {appearance === "system" && (
                    <p className="display-status">currently {theme}</p>
                  )}
                </fieldset>

                <fieldset>
                  <legend>Density</legend>
                  <label className="display-option">
                    <input
                      type="radio"
                      name="density"
                      value="automatic"
                      checked={density === "automatic"}
                      onChange={() => setDensity("automatic")}
                    />
                    <span>Automatic</span>
                  </label>
                  <label className="display-option">
                    <input
                      type="radio"
                      name="density"
                      value="compact"
                      checked={density === "compact"}
                      onChange={() => setDensity("compact")}
                    />
                    <span>Compact</span>
                  </label>
                  <label className="display-option">
                    <input
                      type="radio"
                      name="density"
                      value="comfortable"
                      checked={density === "comfortable"}
                      onChange={() => setDensity("comfortable")}
                    />
                    <span>Comfortable</span>
                  </label>
                  {density === "automatic" && (
                    <p className="display-status">
                      currently {resolvedDensity}
                    </p>
                  )}
                </fieldset>

                <fieldset>
                  <legend>Contrast</legend>
                  <label className="display-option">
                    <input
                      type="radio"
                      name="contrast"
                      value="automatic"
                      checked={contrast === "automatic"}
                      onChange={() => setContrast("automatic")}
                    />
                    <span>Automatic</span>
                  </label>
                  <label className="display-option">
                    <input
                      type="radio"
                      name="contrast"
                      value="standard"
                      checked={contrast === "standard"}
                      onChange={() => setContrast("standard")}
                    />
                    <span>Standard</span>
                  </label>
                  <label className="display-option">
                    <input
                      type="radio"
                      name="contrast"
                      value="more"
                      checked={contrast === "more"}
                      onChange={() => setContrast("more")}
                    />
                    <span>More</span>
                  </label>
                  {contrast === "automatic" && (
                    <p className="display-status">
                      currently {resolvedContrast}
                    </p>
                  )}
                </fieldset>

                <button
                  type="button"
                  className="display-reset"
                  onClick={() => {
                    setAppearance("system");
                    setDensity("automatic");
                    setContrast("automatic");
                  }}
                >
                  Restore display defaults
                </button>
              </div>
            </details>
          </nav>
        </div>
      </header>

      <aside className="app-context" aria-label="Application context">
        {context.contextItems.map((item) => (
          <div className="context-item" key={item.label}>
            <span className="context-label">{item.label}</span>{" "}
            <strong title={item.title}>{item.value}</strong>
          </div>
        ))}
      </aside>

      <div className="app-status-bar" aria-label="Application status">
        {context.statusItems.map((item) => (
          <span key={item.label} title={item.title}>
            <strong>{item.label}</strong> {item.value}
          </span>
        ))}
      </div>

      <main id="app-content" className="app-workspace" tabIndex={-1}>
        {children}
      </main>

      <footer className="site-footer">
        <span>Political Judgment Decomposition</span>
        <span>No account required · local browser storage</span>
      </footer>
      <StatusAnnouncer />
    </div>
  );
}
