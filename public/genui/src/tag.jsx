/* -- CDS Tag component
 *
 * All colours use verified CDS semantic CSS custom properties from src/tokens/semantic.css.
 * No hardcoded hex values - every token name has been confirmed to exist.
 *
 * Token conventions:
 *   --background-{role}          filled bg (pure stop)
 *   --background-{role}-bold     darker/stronger fill
 *   --background-{role}-subtle   tinted light fill
 *   --background-{role}-inverse  white - for text ON a filled bg
 *   --text-{role}                coloured text on light bg
 *   --text-{role}-inverse        white - exists for primary/secondary/neutral only
 *   --border-{role}              outline colour
 *
 * NOTE: --text-alert-inverse / --text-error-inverse / --text-success-inverse
 *       / --text-info-inverse do NOT exist in the token system. For high-emphasis
 *       status tags (text on a bold coloured fill) we use --background-{role}-inverse
 *       which correctly resolves to white (#fff).
 *
 * Typography Tokens:
 *   large label  --typo-interface-label-large  (14px - bold 700)    - role color
 *   small label  --typo-interface-label-small  (11px - semibold 600) - role color
 *
 * Props:
 *   style      "primary" | "secondary" | "neutral" |
 *              "alert" | "error" | "success" | "info"
 *   size       "large" | "small"               default "large"
 *   icon       icon name string (optional leading icon)
 *   children   label text (optional)
 *
 * Anatomy (from Figma Tag-READY):
 *   large  h=24  radius=4  pad=4px/8px  gap=4px  icon=16px  font=--text-size-4 700
 *   small  h=20  radius=4  pad=2px/8px  gap=2px  icon=16px  font=--text-size-1 700
 */
(function () {

/* Icon is read lazily inside the component (window.Icon) so this file is
   robust to load order. A console.warn fires on first render if Icon is
   missing - a tag without an icon still renders fine. */
var _depsWarned = false;
function checkDeps() {
  if (_depsWarned) return;
  if (!window.Icon) {
    console.warn("CDS Tag: window.Icon not available - load src/icon-renderer.jsx before src/tag.jsx for tag icons to render.");
    _depsWarned = true;
  }
}

/* -- Verified semantic token map -- */
const T = {
  /*
   * high - solid filled background, inverse (white) text
   * Uses --background-{role}-inverse as text color since --text-{role}-inverse
   * only exists for primary / secondary / neutral / tertiary.
   */
  high: {
    primary:   { bg: "var(--background-primary)",       text: "var(--text-primary-inverse)",     border: "none" },
    secondary: { bg: "var(--background-secondary-bold)", text: "var(--text-secondary-inverse)",  border: "none" },
    neutral:   { bg: "var(--background-neutral-bold)",  text: "var(--text-neutral-inverse)",     border: "none" },
    alert:     { bg: "var(--background-alert-bold)",    text: "var(--background-alert-inverse)", border: "none" },
    error:     { bg: "var(--background-error-bold)",    text: "var(--background-error-inverse)", border: "none" },
    success:   { bg: "var(--background-success-bold)",  text: "var(--background-success-inverse)", border: "none" },
    info:      { bg: "var(--background-info-bold)",     text: "var(--background-info-inverse)",  border: "none" },
  },
  /*
   * low - subtle tinted background, on-brand coloured text
   * Uses --text-{role} which exists for all roles including status.
   */
  low: {
    primary:   { bg: "var(--background-primary-subtle)",   text: "var(--text-primary)",   border: "none" },
    secondary: { bg: "var(--background-secondary-subtle)", text: "var(--text-secondary)", border: "none" },
    neutral:   { bg: "var(--background-neutral-subtle)",   text: "var(--text-neutral)",   border: "none" },
    alert:     { bg: "var(--background-alert-subtle)",     text: "var(--text-alert-bold)", border: "none" },
    error:     { bg: "var(--background-error-subtle)",     text: "var(--text-error)",     border: "none" },
    success:   { bg: "var(--background-success-subtle)",   text: "var(--text-success-bold)", border: "none" },
    info:      { bg: "var(--background-info-subtle)",      text: "var(--text-info-bold)", border: "none" },
  },
  /*
   * med - transparent background, coloured border + text
   * --border-primary/secondary/neutral/success/alert/error/info all verified present.
   */
  med: {
    primary:   { bg: "transparent", text: "var(--text-primary)",   border: "1px solid var(--border-primary)" },
    secondary: { bg: "transparent", text: "var(--text-secondary)", border: "1px solid var(--border-secondary)" },
    neutral:   { bg: "transparent", text: "var(--text-neutral)",   border: "1px solid var(--border-neutral)" },
    alert:     { bg: "transparent", text: "var(--text-alert-bold)", border: "1px solid var(--border-alert-bold)" },
    error:     { bg: "transparent", text: "var(--text-error)",     border: "1px solid var(--border-error)" },
    success:   { bg: "transparent", text: "var(--text-success-bold)", border: "1px solid var(--border-success)" },
    info:      { bg: "transparent", text: "var(--text-info-bold)", border: "1px solid var(--border-info)" },
  },
};

/* -- Size tokens
   Typography uses platform semantic tokens (interface.label.*) so font family
   stays on the platform face (SF Pro / Roboto) and never shifts with brand.
   Only color changes with brand.
-- */
const SZ = {
  large: {
    height: 24, px: "8px", py: "4px", gap: 4, iconSize: 16,
    fontFamily:    "var(--typo-interface-label-large-family)",
    fontSize:      "var(--typo-interface-label-large-size)",
    fontWeight:    "var(--typo-interface-label-large-weight)",
    lineHeight:    "var(--typo-interface-label-large-line-height)",
    letterSpacing: "var(--typo-interface-label-large-letter-spacing)",
  },
  small: {
    height: 20, px: "8px", py: "2px", gap: 2, iconSize: 16,
    fontFamily:    "var(--typo-interface-label-small-family)",
    fontSize:      "var(--typo-interface-label-small-size)",
    fontWeight:    "var(--typo-interface-label-small-weight)",
    lineHeight:    "var(--typo-interface-label-small-line-height)",
    letterSpacing: "var(--typo-interface-label-small-letter-spacing)",
  },
};

/* -- Tag -- */
function Tag({ emphasis, style: colorStyle, size, icon, children }) {
  emphasis   = emphasis   || "high";
  colorStyle = colorStyle || "primary";
  size       = size       || "large";

  var tokens  = (T[emphasis] || T.high)[colorStyle] || T.high.primary;
  var sz      = SZ[size] || SZ.large;
  checkDeps();
  var IconComp = window.Icon;

  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: sz.gap,
      height: sz.height,
      padding: sz.py + " " + sz.px,
      background: tokens.bg,
      border: tokens.border,
      borderRadius: 4,
      color: tokens.text,
      fontFamily:    sz.fontFamily,
      fontSize:      sz.fontSize,
      fontWeight:    sz.fontWeight,
      lineHeight:    sz.lineHeight,
      letterSpacing: sz.letterSpacing,
      whiteSpace: "nowrap",
      userSelect: "none",
      flexShrink: 0,
      boxSizing: "border-box",
    }}>
      {icon && IconComp && (
        <IconComp name={icon} size={sz.iconSize} color={tokens.text} style={{ flexShrink: 0 }} />
      )}
      {children && <span style={{ lineHeight: sz.lineHeight }}>{children}</span>}
    </span>
  );
}

Object.assign(window, { Tag });
})();
