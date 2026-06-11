/* § 09 - Icon system.
   - Shared <Icon> component: fetches SVG text, inlines it, inherits currentColor.
   - IconGallery: grouped by category with headers + counts, search + size + style filters.
*/
(function () {
const { useState, useEffect, useMemo, useRef } = React;
const { createPortal } = ReactDOM;
const { BRAND } = window.CDS;
const ICONS = window.CDS_ICONS;

/* ---------- shared icon loader ----------- */
/* SVGs are inlined in window.CDS_ICON_SVGS (see src/icon-data.js) - no fetch. */
const SVG_DATA = window.CDS_ICON_SVGS || {};
const cleanCache = new Map();
function getSvgMarkup(name) {
  if (cleanCache.has(name)) return cleanCache.get(name);
  const raw = SVG_DATA[name] || "";
  const cleaned = raw.replace(/\swidth="[^"]*"/, "").replace(/\sheight="[^"]*"/, "");
  cleanCache.set(name, cleaned);
  return cleaned;
}

function categoryOf(name) {
  const m = name.match(/^[a-z]+/);
  return m ? m[0] : "other";
}
function pathFor(name) {
  return `assets/icons/${categoryOf(name)}/${name}.svg`;
}

function Icon({ name, size = 24, color, style, title, ...rest }) {
  const markup = getSvgMarkup(name);
  return (
    <span
      aria-label={title || name}
      role="img"
      style={{
        display: "inline-flex",
        width: size, height: size,
        color: color || "currentColor",
        flex: "none",
        ...style,
      }}
      dangerouslySetInnerHTML={{ __html: markup }}
      {...rest}
    />
  );
}

/* ---------- Gallery ----------- */
/* Size stops with labels matching icon.size.* tokens. */
const SIZE_STOPS = [
  { px: 16, label: "small - 16" },
  { px: 24, label: "medium - 24 - default" },
  { px: 48, label: "large - 48" },
  { px: 64, label: "xlarge - 64" },
  { px: 88, label: "xxlarge - 88" },
];

const STYLE_STOPS = ["All", "Line", "Solid"];

/* Category labels shown in the UI (raw key → pretty label). */
const CAT_LABELS = {
  abstract: "Abstract",
  action:   "Action",
  arrow:    "Arrow",
  connect:  "Connectivity",
  home:     "Home & IoT",
  object:   "Object",
  time:     "Time",
};

/* Strip the category prefix off an icon name, leaving camelCase tail. */
function stripPrefix(name, cat) {
  if (!name.startsWith(cat)) return name;
  const tail = name.slice(cat.length);
  return tail.charAt(0).toLowerCase() + tail.slice(1);
}

function matchesStyle(name, style) {
  if (style === "All") return true;
  if (style === "Line")  return name.endsWith("Line");
  if (style === "Solid") return name.endsWith("Solid");
  return true;
}

function IconGallery({ brand }) {
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [size, setSize] = useState(24);
  const [styleMode, setStyleMode] = useState("All");
  const [openIcon, setOpenIcon] = useState(null); // name string, or null

  const cats = Object.keys(ICONS);

  /* Apply filters - returns { [cat]: filtered[] }, preserving empty cats as []. */
  const grouped = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const out = {};
    for (const c of cats) {
      const list = ICONS[c].filter(n =>
        matchesStyle(n, styleMode) &&
        (!needle || n.toLowerCase().includes(needle))
      );
      out[c] = list;
    }
    return out;
  }, [q, styleMode]);

  const totalVisible = cats.reduce((a, c) => a + grouped[c].length, 0);
  const grandTotal   = cats.reduce((a, c) => a + ICONS[c].length, 0);

  const activeCats = cat === "all" ? cats : [cat];

  return (
    <div className="icon-gallery">
      {/* --- top control row: search + size + style --- */}
      <div className="ig-toolbar">
        <div className="ig-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>
          </svg>
          <input
            type="search"
            placeholder="Search icons…"
            value={q}
            onChange={e => setQ(e.target.value)}
          />
        </div>

        <div className="ig-control-group">
          <div className="ig-key">Size</div>
          <div className="ig-pill-group">
            {SIZE_STOPS.map(s => (
              <button
                key={s.px}
                className={size === s.px ? "pill on" : "pill"}
                onClick={() => setSize(s.px)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="ig-control-group">
          <div className="ig-key">Style</div>
          <div className="ig-pill-group">
            {STYLE_STOPS.map(s => (
              <button
                key={s}
                className={styleMode === s ? "pill on" : "pill"}
                onClick={() => setStyleMode(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- category row + total --- */}
      <div className="ig-catnav">
        <div className="ig-cats">
          <button
            className={cat === "all" ? "cat on" : "cat"}
            onClick={() => setCat("all")}
          >All</button>
          {cats.map(c => (
            <button
              key={c}
              className={cat === c ? "cat on" : "cat"}
              onClick={() => setCat(c)}
            >
              {CAT_LABELS[c] || c}
            </button>
          ))}
        </div>
        <div className="ig-total">
          {totalVisible === grandTotal
            ? `${grandTotal} icons`
            : `${totalVisible} of ${grandTotal} icons`}
        </div>
      </div>

      {/* --- grouped sections --- */}
      <div className="ig-sections">
        {activeCats.map(c => {
          const list = grouped[c];
          if (list.length === 0 && cat === "all") return null;
          return (
            <section key={c} className="ig-section">
              <header className="ig-section-head">
                <h3>{CAT_LABELS[c] || c}</h3>
                <span className="ig-section-count">{list.length} icon{list.length === 1 ? "" : "s"}</span>
              </header>
              {list.length === 0 ? (
                <div className="ig-section-empty">No matches in this category.</div>
              ) : (
                <div className="ig-grid">
                  {list.map(name => (
                    <button
                      key={name}
                      className="ig-tile"
                      onClick={() => setOpenIcon(name)}
                      title={`icon.${name} - click for details`}
                    >
                      <div className="ig-icon-wrap">
                        <Icon name={name} size={size} />
                      </div>
                      <div className="ig-tile-name">{stripPrefix(name, c)}</div>
                    </button>
                  ))}
                </div>
              )}
            </section>
          );
        })}
        {totalVisible === 0 && (
          <div className="ig-empty">No icons match "{q}".</div>
        )}
      </div>

      {/* --- spec sheet --- */}
      <div className="ig-spec">
        <div>
          <div className="spec-label">Size tokens</div>
          <div className="spec-rows">
            <div><code>icon.size.small</code> <span>16</span></div>
            <div><code>icon.size.medium</code> <span>24 - default</span></div>
            <div><code>icon.size.large</code> <span>48</span></div>
            <div><code>icon.size.xlarge</code> <span>64</span></div>
            <div><code>icon.size.xxlarge</code> <span>88</span></div>
          </div>
        </div>
        <div>
          <div className="spec-label">Color tokens</div>
          <div className="spec-rows">
            <div><code>icon.primary</code> <span>body copy</span></div>
            <div><code>icon.primaryBold</code> <span>CTA - active</span></div>
            <div><code>icon.secondary</code> <span>de-emphasis</span></div>
            <div><code>icon.info / success / alert / error</code> <span>status</span></div>
            <div><code>icon.inverse</code> <span>on dark surfaces</span></div>
          </div>
        </div>
        <div>
          <div className="spec-label">Platform mapping</div>
          <div className="spec-rows">
            <div><code>CDSIcon.Home.fanSolid</code> <span>iOS / SwiftUI</span></div>
            <div><code>MdsTheme.icons.home.fanSolid</code> <span>Android / Compose</span></div>
            <div><code>homeFanSolid.svg</code> <span>web - Figma</span></div>
          </div>
        </div>
      </div>

      <IconModalHost openIcon={openIcon} size={size} onClose={() => setOpenIcon(null)} />
    </div>
  );
}

function IconSection({ brand }) {
  return <IconGallery brand={brand} />;
}

/* ---------- Icon detail modal ---------- */

/* Given a full icon name like `abstractActivitySolid`, return {baseName, variant}
   for lookup against CDS_ICON_META (which is keyed by base). */
function splitVariant(name) {
  if (name.endsWith("Solid")) return { base: name.slice(0, -5), variant: "Solid" };
  if (name.endsWith("Line"))  return { base: name.slice(0, -4), variant: "Line" };
  return { base: name, variant: null };
}

/* Size px -> token name shown in the modal spec line. */
const SIZE_TOKENS = {
  16: "icon.size.small",
  24: "icon.size.medium",
  48: "icon.size.large",
  64: "icon.size.xlarge",
  88: "icon.size.xxlarge",
};

function IconDetail({ name, size, onClose }) {
  const [copied, setCopied] = useState(false);
  const { base, variant } = splitVariant(name);
  const meta = (window.CDS_ICON_META && window.CDS_ICON_META[base]) || null;
  const token = `icon.${name}`;
  const sizeToken = SIZE_TOKENS[size] || `icon.size.custom`;

  // Close on Esc.
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const copyToken = () => {
    try { navigator.clipboard.writeText(token); } catch (e) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  /* Resolve the icon's on-screen color (from --icon-primary) to a concrete
     value so the downloaded SVG carries the visible brand color even when
     opened outside this page (where currentColor would be black). */
  const resolveIconColor = () => {
    const probe = document.createElement("span");
    probe.style.color = "var(--icon-primary)";
    probe.style.display = "none";
    document.body.appendChild(probe);
    const resolved = getComputedStyle(probe).color || "#151515";
    probe.remove();
    return resolved;
  };

  const downloadSvg = async () => {
    try {
      let text = (window.CDS_ICON_SVGS && window.CDS_ICON_SVGS[name]) || "";
      if (!text) return;
      const color = resolveIconColor();
      // Normalize width/height to the currently-filtered size and replace
      // currentColor with the resolved brand color so the file renders correctly
      // standalone.
      text = text
        .replace(/\s(width|height)="[^"]*"/g, "")
        .replace(/<svg\b/, `<svg width="${size}" height="${size}"`)
        .replace(/currentColor/g, color);
      const blob = new Blob([text], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name}-${size}.svg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      console.warn("Download failed", e);
    }
  };

  return (
    <div className="icon-modal-overlay" onClick={onClose}>
      <div className="icon-modal" onClick={e => e.stopPropagation()} role="dialog" aria-label={`${name} details`}>
        <button className="icon-modal-close" onClick={onClose} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18"/>
          </svg>
        </button>

        <div className="icon-modal-preview">
          <div className="icon-modal-preview-inner">
            <Icon name={name} size={size} />
          </div>
        </div>

        <h3 className="icon-modal-name">{name}</h3>

        <div className="icon-modal-token">{token}</div>

        {meta?.usage ? (
          <div className="icon-modal-desc">{meta.usage}.</div>
        ) : (
          <div className="icon-modal-desc muted">No description in the library reference yet.</div>
        )}

        {meta?.keywords?.length > 0 && (
          <div className="icon-modal-keywords">
            <span className="k-label">Keywords:</span> {meta.keywords.join(", ")}
          </div>
        )}

        <div className="icon-modal-spec">
          {sizeToken} - {size}×{size}px{variant ? ` - ${variant}` : ""} - icon.primary
        </div>

        <div className="icon-modal-actions">
          <button className="icon-modal-btn primary" onClick={downloadSvg}>Download SVG</button>
          <button className="icon-modal-btn secondary" onClick={copyToken}>
            {copied ? "Copied" : "Copy token name"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* Modal host - renders via a portal directly on document.body so that
   position:fixed is always relative to the viewport, not any transformed
   ancestor (e.g. the ds-content animation container). */
function IconModalHost({ openIcon, size, onClose }) {
  if (!openIcon) return null;
  return createPortal(
    <IconDetail name={openIcon} size={size} onClose={onClose} />,
    document.body
  );
}

Object.assign(window, { Icon, IconSection });
})();
