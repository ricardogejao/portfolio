/**
 * GenUIEmbed — loads the Interactive Moments prototype natively
 * into the React tree (no iframe).
 */
import { useState, useEffect, useRef, Component, type ReactNode } from "react";
import React from "react";
import ReactDOM from "react-dom";

declare global {
  interface Window {
    React: typeof React;
    ReactDOM: typeof ReactDOM;
    Babel: { transform: (code: string, opts: object) => { code: string } };
    GenUICases: React.ComponentType;
    InteractiveMoments: React.ComponentType;
    swapTokens: (brand: string, platform: string) => void;
  }
}

const BASE = "/portfolio/genui";

const PLAIN_JS = [
  `${BASE}/src/tokens/loader.js`,   // loads global/semantic/typography/components CSS + exposes window.swapTokens
  `${BASE}/src/tokens.js`,
  `${BASE}/src/icon-data.js`,
  `${BASE}/src/icons.js`,
  `${BASE}/src/icon-meta.js`,
];

const JSX_FILES = [
  `${BASE}/src/icon-renderer.jsx`,
  `${BASE}/src/listening-wave.jsx`,
  `${BASE}/src/feedback-caption.jsx`,
  `${BASE}/src/text-input-field.jsx`,
  `${BASE}/src/checkbox.jsx`,
  `${BASE}/src/banner.jsx`,
  `${BASE}/src/button.jsx`,
  `${BASE}/src/toggle-button.jsx`,
  `${BASE}/src/device-tile.jsx`,
  `${BASE}/src/pill.jsx`,
  `${BASE}/src/tag.jsx`,
  `${BASE}/src/snackbar.jsx`,
  `${BASE}/src/ai-assistant.jsx`,
  `${BASE}/src/app-nav.jsx`,
  `${BASE}/frames/ios-frame.jsx`,
  `${BASE}/src/home-screen.jsx`,
  `${BASE}/src/genui-cases.jsx`,
];

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-genui-src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.dataset.genuiSrc = src;
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load: ${src}`));
    document.head.appendChild(s);
  });
}

async function loadJSX(src: string): Promise<void> {
  const key = `${src}@${EMBED_VERSION}`;
  if (document.querySelector(`script[data-genui-jsx="${key}"]`)) return;
  const res = await fetch(src);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${src}`);
  // Fix relative asset paths to be absolute within the portfolio
  let code = await res.text();
  code = code.replace(/"assets\//g, '"/portfolio/genui/assets/');
  let transformed: string;
  try {
    transformed = window.Babel.transform(code, {
      presets: ["react"],
      filename: src,
    }).code;
  } catch (e) {
    throw new Error(`Babel error in ${src}: ${e}`);
  }
  // Namespace SVG clipPath IDs per file to prevent cross-instance ID conflicts
  const fileKey = src.split("/").pop()?.replace(/\W/g, "_") ?? "genui";
  transformed = transformed.replace(/\bclip(\d+_\d+_\d+)\b/g, `clip_${fileKey}_$1`);
  const s = document.createElement("script");
  s.dataset.genuiJsx = key;
  s.textContent = transformed;
  try {
    document.head.appendChild(s);
  } catch (e) {
    throw new Error(`Runtime error in ${src}: ${e}`);
  }
}

function loadCSS(href: string) {
  if (document.querySelector(`link[data-genui-css="${href}"]`)) return;
  const l = document.createElement("link");
  l.rel = "stylesheet";
  l.href = href;
  l.dataset.genuiCss = href;
  document.head.appendChild(l);
}

/* ── Cache buster — bump this when you change loadJSX patching logic ── */
const EMBED_VERSION = "v4";

/* ── Singleton loader ─────────────────────────────────────────────── */
let _promise: Promise<React.ComponentType> | null = null;

function ensureLoaded(): Promise<React.ComponentType> {
  if (_promise) return _promise;
  _promise = (async () => {
    // Remove stale versioned script tags from previous embed loads
    document
      .querySelectorAll("script[data-genui-jsx]")
      .forEach((el) => {
        const key = (el as HTMLElement).dataset.genuiJsx ?? "";
        if (!key.endsWith(`@${EMBED_VERSION}`)) el.remove();
      });

    // Expose React + ReactDOM as globals — IIFEs expect both on window
    window.React = React;
    window.ReactDOM = ReactDOM;

    // Babel for JSX transform
    await loadScript(
      "https://unpkg.com/@babel/standalone@7.29.0/babel.min.js"
    );

    // Plain JS (loader.js will inject global/semantic/typography/components CSS)
    for (const src of PLAIN_JS) {
      await loadScript(src);
    }

    // Activate TELUS brand + iOS platform tokens
    // This loads brand-telus.css and platform-ios.css and sets data-brand/data-platform on <html>
    if (typeof (window as any).swapTokens === "function") {
      (window as any).swapTokens("telus", "ios");
    } else {
      // Fallback: set attributes and load CSS manually
      document.documentElement.setAttribute("data-brand", "telus");
      document.documentElement.setAttribute("data-platform", "ios");
      loadCSS(`${BASE}/src/tokens/brand-telus.css`);
      loadCSS(`${BASE}/src/tokens/platform-ios.css`);
    }

    // JSX components in dependency order
    for (const src of JSX_FILES) {
      await loadJSX(src);
    }

    const comp = window.InteractiveMoments;
    if (!comp) throw new Error("window.InteractiveMoments not found after loading");
    return comp;
  })();

  // Reset on failure so the next render can retry
  _promise.catch(() => { _promise = null; });

  return _promise;
}

/* ── Error boundary ───────────────────────────────────────────────── */
interface EBState { error: Error | null }

class EmbedErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  state: EBState = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: "40px 32px",
            background: "#FFF5F5",
            color: "#C0392B",
            fontFamily: "monospace",
            fontSize: 13,
            lineHeight: 1.6,
            borderRadius: 8,
          }}
        >
          <strong>Prototype render error:</strong>
          <pre style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>
            {this.state.error.message}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ── Scaled frame ─────────────────────────────────────────────────── */
function ScaledFrame({ GenUICases }: { GenUICases: React.ComponentType }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / 1440);
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const frameH = Math.round(900 * scale);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: frameH,
        overflow: "hidden",
        position: "relative",
        background: "#fff",
      }}
    >
      <div
        style={{
          width: 1440,
          height: 900,
          transformOrigin: "top left",
          transform: `scale(${scale})`,
          position: "absolute",
          top: 0,
          left: 0,
          background: "#fff",
        }}
      >
        <EmbedErrorBoundary>
          <GenUICases />
        </EmbedErrorBoundary>
      </div>
    </div>
  );
}

/* ── Public component ─────────────────────────────────────────────── */
export function GenUIEmbed() {
  const [GenUICases, setGenUICases] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ensureLoaded()
      .then((comp) => setGenUICases(() => comp))
      .catch((e: Error) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div
        style={{
          padding: "40px 32px",
          background: "#FFF5F5",
          color: "#C0392B",
          fontFamily: "monospace",
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        <strong>Load error:</strong>
        <pre style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>{error}</pre>
      </div>
    );
  }

  if (!GenUICases) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 300,
          background: "#fafafa",
          color: "#aaa",
          fontSize: 13,
        }}
      >
        Loading prototype…
      </div>
    );
  }

  return <ScaledFrame GenUICases={GenUICases} />;
}
