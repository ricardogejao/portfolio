/* CDS Toggle Button — SDUI action control for immediate binary actions.
 *
 * Distinct from Toggle (persistent switch). Power-button-style control with a
 * contextual icon and device-state visuals. Supports loading / error /
 * irresponsive states that a plain Toggle cannot express.
 *
 * Props
 *   icon            string             — Chameleon icon name, required unless state === "error"
 *   state           "on" | "off" | "loading" | "error" | "irresponsive"
 *   style           "high" | "medOutline" | "medBorderless" | "lowGhost"
 *                                       — mirrors Button emphasis. Off-state treatment
 *                                         varies by style; on-state always filled brand.
 *   size            "default" | "large"
 *   layout          "vertical" | "horizontal"
 *   leadingLabel    string             — label above (vertical) / before (horizontal)
 *   bottomLabel     string             — label below (vertical) / after (horizontal)
 *   trailingLabel   string             — horizontal-only, after the button
 *   onToggle        (nextState) => void
 *   platform        "ios" | "android"  — affects spinner only
 *   focus           boolean            — force focus ring for spec pages
 *   ariaLabel       string
 *
 * Geometry (matches Figma)
 *   default    48 × 48 button · icon 20 · label interface.label.small
 *   large      84 × 84 button · icon 36 · label interface.label.small
 *
 * Tokens
 *   radius          → var(--radius-full)            (pill / circle)
 *   focus ring      → var(--border-width-heavy)     4px
 *   error border    → var(--border-width-thick)     2px
 *   irresponsive    → var(--border-width-thin)      1px dashed
 */

(function () {
const { useState } = React;
/* Icon / IOSpinner / AndroidSpinner are read lazily inside the component
   (window.X), so this file is robust to load order — icon-renderer.jsx and
   button.jsx may load after this file. A console.warn fires on first render
   if a required dep is still missing. */
let _depsWarned = false;
function checkDeps() {
  if (_depsWarned) return;
  const missing = [];
  if (!window.Icon) missing.push("Icon (icon-renderer.jsx)");
  if (!window.IOSpinner || !window.AndroidSpinner) missing.push("IOSpinner/AndroidSpinner (button.jsx)");
  if (missing.length) {
    console.warn("CDS ToggleButton: missing dependencies — " + missing.join(", ") +
      ". Load these scripts before toggle-button.jsx.");
    _depsWarned = true;
  }
}

const SIZE = {
  default: { btn: 48, icon: 20, gap: 8 },
  large:   { btn: 84, icon: 36, gap: 10 },
};

/* ─────────────────────────────────────────────────────────────
 * Style × state colour matrix
 * ─────────────────────────────────────────────────────────────
 * Each style defines how the button looks in each device state.
 * On-state is always filled brand (the control must read "active").
 * Off-state is where the style declares itself.
 *
 * borderWidth values reference token variables so scale changes
 * propagate through the system.
 */
function styleStateColours(styleName, state) {
  const ON = {
    bg:     "var(--background-primary)",
    fg:     "var(--text-primary-inverse)",
    border: "transparent",
    borderWidth: "var(--border-width-none)",
    glow:   "none",
    captionColor: "var(--text-neutral-bolder)",
    interactive: true,
  };

  // LOADING — pulses the on-state but blocks input.
  const LOADING = {
    ...ON,
    glow: "none",
    interactive: false,
    loading: true,
  };

  // ERROR — semantic; uses --border-width-thick token.
  const ERROR = {
    bg:     "var(--background-error-subtle)",
    fg:     "var(--text-error)",
    border: "var(--text-error)",
    borderWidth: "var(--border-width-thick)",
    glow:   "none",
    captionColor: "var(--text-error)",
    interactive: true,
  };

  // IRRESPONSIVE — always dashed hairline regardless of style.
  const IRRESPONSIVE = {
    bg:     "var(--background-disabled)",
    fg:     "var(--text-disabled)",
    border: "var(--border-neutral-bold)",
    borderWidth: "var(--border-width-thin)",
    dashed: true,
    glow:   "none",
    captionColor: "var(--text-disabled)",
    interactive: false,
  };

  if (state === "loading")      return LOADING;
  if (state === "error")        return ERROR;
  if (state === "irresponsive") return IRRESPONSIVE;
  if (state === "on")           return ON;

  // state === "off" — diverges per style
  switch (styleName) {
    case "medOutline":
      return {
        bg:     "transparent",
        fg:     "var(--text-primary)",
        border: "var(--border-primary-bold)",
        borderWidth: "var(--border-width-thick)",
        glow:   "none",
        captionColor: "var(--text-neutral)",
        interactive: true,
      };
    case "medBorderless":
      return {
        bg:     "var(--background-primary-subtle)",
        fg:     "var(--text-primary)",
        border: "transparent",
        borderWidth: "var(--border-width-none)",
        glow:   "none",
        captionColor: "var(--text-neutral)",
        interactive: true,
      };
    case "lowGhost":
      return {
        bg:     "transparent",
        fg:     "var(--text-primary)",
        border: "transparent",
        borderWidth: "var(--border-width-none)",
        glow:   "none",
        captionColor: "var(--text-neutral)",
        interactive: true,
      };
    case "high":
    default:
      // default "high" off — neutral fill (current behaviour)
      return {
        bg:     "var(--background-neutral-subtle)",
        fg:     "var(--text-neutral)",
        border: "transparent",
        borderWidth: "var(--border-width-none)",
        glow:   "none",
        captionColor: "var(--text-neutral)",
        interactive: true,
      };
  }
}

function Spinner({ platform, size, colour }) {
  const IOS = window.IOSpinner;
  const AND = window.AndroidSpinner;
  if (!IOS && !AND) return null;
  return platform !== "ios"
    ? (AND ? <AND size={size} colour={colour}/> : <IOS size={size} colour={colour}/>)
    : (IOS ? <IOS size={size} colour={colour}/> : <AND size={size} colour={colour}/>);
}

function ToggleButton({
  icon,
  state = "off",
  styleName = "high",      // "high" | "medOutline" | "medBorderless" | "lowGhost"
  size = "default",
  layout = "vertical",
  leadingLabel,
  bottomLabel,
  trailingLabel,
  onToggle,
  platform = "ios",
  focus = false,
  ariaLabel,
  styleOverride,
}) {
  const S = SIZE[size] || SIZE.default;
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);

  /* Read deps lazily so load order doesn't permanently break this file. */
  checkDeps();
  const Icon = window.Icon || (() => null);

  const c = styleStateColours(styleName, state);
  const tappable = c.interactive;

  const scale = tappable && active ? 0.96 : 1;
  const opacity = tappable && hover ? 0.95 : 1;

  const iconNode = c.loading
    ? <Spinner platform={platform} size={S.icon} colour={c.fg}/>
    : state === "error"
      ? <Icon name="abstractWarningSolid" size={S.icon}/>
      : icon
        ? <Icon name={icon} size={S.icon}/>
        : null;

  const buttonNode = (
    <button
      type="button"
      className={`cds-tb ${focus ? "cds-tb-focus" : ""} ${c.loading ? "cds-tb-loading" : ""}`}
      aria-label={ariaLabel || "Toggle"}
      aria-pressed={state === "on"}
      aria-disabled={!tappable || undefined}
      disabled={!tappable}
      onClick={tappable ? () => onToggle?.(state === "on" ? "off" : "on") : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        width: S.btn,
        height: S.btn,
        borderRadius: "var(--radius-full)",
        background: c.bg,
        color: c.fg,
        border: c.dashed
          ? `var(--border-width-thin) dashed ${c.border}`
          : c.border === "transparent"
            ? "none"
            : `${c.borderWidth} solid ${c.border}`,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: tappable ? "pointer" : "not-allowed",
        transform: `scale(${scale})`,
        opacity,
        transition: "transform 120ms ease, background 160ms ease, color 160ms ease, box-shadow 240ms ease, border-color 160ms ease",
        boxShadow: c.glow,
        padding: 0,
        outline: "none",
        flex: "none",
        ...styleOverride,
      }}
    >
      {iconNode}
    </button>
  );

  const isLargeVertical = size === "large" && layout === "vertical";

  const captionStyle = isLargeVertical ? {
    fontFamily: "var(--typo-display-medium-family, var(--brand-font, system-ui))",
    fontSize: "var(--typo-display-medium-size, 40px)",
    lineHeight: "var(--typo-display-medium-line-height, 48px)",
    fontWeight: "var(--typo-display-medium-weight, 400)",
    letterSpacing: "var(--typo-display-medium-letter-spacing, -0.4px)",
    color: c.captionColor,
  } : {
    fontFamily: "var(--typo-interface-label-small-family, var(--platform-font-default, system-ui))",
    fontSize: "var(--typo-interface-label-small-size, 11px)",
    lineHeight: "var(--typo-interface-label-small-line-height, 13px)",
    fontWeight: "var(--typo-interface-label-small-weight, 600)",
    letterSpacing: "var(--typo-interface-label-small-letter-spacing, 0)",
    color: c.captionColor,
  };
  const mutedCaptionStyle = {
    ...captionStyle,
    fontWeight: 400,
    color: c.captionColor === "var(--text-neutral-bolder)" ? "var(--text-neutral)" : c.captionColor,
    opacity: 0.85,
  };

  if (layout === "horizontal") {
    return (
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: S.gap + 4,
      }}>
        {leadingLabel && (
          <div style={{ ...captionStyle, textAlign: "right", maxWidth: 140 }}>{leadingLabel}</div>
        )}
        {buttonNode}
        {(bottomLabel || trailingLabel) && (
          <div style={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 180 }}>
            {bottomLabel && <div style={captionStyle}>{bottomLabel}</div>}
            {trailingLabel && <div style={mutedCaptionStyle}>{trailingLabel}</div>}
          </div>
        )}
      </div>
    );
  }

  // vertical (default)
  return (
    <div style={{
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      gap: S.gap,
      width: "max-content",
    }}>
      {leadingLabel && <div style={captionStyle}>{leadingLabel}</div>}
      {buttonNode}
      {bottomLabel && <div style={{ ...captionStyle, textAlign: "center", width: "100%", maxWidth: isLargeVertical ? 180 : 120 }}>{bottomLabel}</div>}
    </div>
  );
}

// Focus ring — heavy border token; keyboard-focus or forced via prop.
if (!document.getElementById("cds-tb-style")) {
  const st = document.createElement("style");
  st.id = "cds-tb-style";
  st.textContent = `
    .cds-tb { -webkit-appearance: none; appearance: none; position: relative; }
    .cds-tb:focus-visible,
    .cds-tb-focus {
      box-shadow:
        0 0 0 var(--border-width-thin) var(--background-app, #fff),
        0 0 0 calc(var(--border-width-thin) + var(--border-width-heavy)) var(--border-info, #0780ff) !important;
    }
    .cds-tb-loading { animation: cds-tb-pulse 1.4s ease-in-out infinite; }
    @keyframes cds-tb-pulse {
      0%, 100% { opacity: 0.85; }
      50%      { opacity: 1; }
    }
  `;
  document.head.appendChild(st);
}

Object.assign(window, { ToggleButton });
})();
