/* CDS Button - faithful to figma_file "🦎 CDS Native Components" / Button [READY].
 *
 * Typography Tokens:
 *   label    size medium → --typo-component-button-large  (15px - medium 500 - dense tracking)
 *            size small  → --typo-component-button-small  (14px - semibold 600 - dense tracking)
 *
 * Anatomy (medium)
 *   height            56
 *   radius            999 (full)
 *   padding           16 / 24
 *   gap               8
 *   icon              24
 *   label             SF Pro / Roboto 15/20, weight 500, tracking -0.006em
 *
 * Anatomy (small)
 *   height            48
 *   padding           12 / 20
 *   gap               6
 *   icon              20
 *
 * Emphasis × state mapping - colour names are CDS semantic tokens.
 *
 *   high-solid          bg background.primary            label text.primaryInverse
 *   med-outline         border(2) border.primaryBold     label text.primary
 *   med-borderless      bg background.primarySubtle      label text.primary
 *   med-borderlessNeut  bg background.neutralSubtle      label text.primary (brand)
 *   low-ghost           transparent                       label text.primary
 *
 *   pressed             opacity 0.6 (whole button)
 *   disabled            bg background.disabled           label text.disabled (neutral.dark)
 *   destructive         bg background.error              label text.primaryInverse
 *                       (on high-solid; med-outline/ghost swap primary→error)
 *   loading             opacity 0.6 + spinner replaces leading icon, no trailing
 *   focus               3px ring border.info outside button (2px for outline)
 *
 * The component accepts props the Figma variant matrix exposes:
 *   emphasis     "high" | "medOutline" | "medBorderless" | "medBorderlessNeutral" | "lowGhost"
 *   size         "medium" | "small"
 *   layout       "textIcon" | "iconOnly"          (textIcon is default)
 *   fullWidth    boolean
 *   state        "enabled" | "pressed" | "disabled" | "destructive" | "loading"
 *                (live hover/pressed/focus override the static prop)
 *   leadIcon     icon name (only for textIcon)
 *   trailIcon    icon name (only for textIcon)
 *   icon         icon name (iconOnly layout)
 *   children     label text
 *
 * Live interaction: when the user actually hovers/clicks/focuses the button, the
 * component layers hover/pressed/focus styling on top of the static state. This
 * makes the playground feel like a real component while still letting you force
 * a particular state via props (for the spec pages).
 */

(function () {
const { useState, forwardRef } = React;
/* Icon is read lazily inside the component (see body) so this file works
   even if icon-renderer.jsx hasn't loaded yet. A console.warn fires on first
   render if Icon is still missing, so the failure is loud not silent. */
let _depsWarned = false;
function checkDeps() {
  if (_depsWarned) return;
  if (!window.Icon) {
    console.warn("CDS Button: window.Icon not available - load src/icon-renderer.jsx before src/button.jsx for icons to render. Buttons without icons will still work.");
    _depsWarned = true;
  }
}

const kebab = (s) => s.replace(/([A-Z])/g, "-$1").toLowerCase();
const tok = (cat, name) => `var(--${cat}-${kebab(name)})`;

// size tokens - medium canonical: padding 12/24, gap 8 (Figma Auto Layout);
// small follows Figma small variant - all tokenised.
const SIZE = {
  medium: {
    h: 56,
    px: "var(--space-xlarge)",   // 24
    py: "var(--space-medium)",   // 12
    gap: "var(--space-small)",   // 8
    icon: 24,
    // typography semantic - resolves per brand × platform
    typoPrefix: "component-button-large",
    iconOnlyW: 56,
  },
  small: {
    h: 48,
    px: "var(--space-large)",    // 16
    py: "var(--space-small)",    // 8
    gap: "var(--space-small)",   // 8
    icon: 20,
    typoPrefix: "component-button-small",
    iconOnlyW: 48,
  },
};

// pick colour map per emphasis (returns { bg, label, border })
function emphasisColours(emphasis, state) {
  // disabled wins for everything that supports it
  if (state === "disabled" && emphasis !== "lowGhost") {
    return {
      bg:     tok("background", "disabled"),
      label:  tok("text",       "neutral"),
      icon:   tok("text",       "neutral"),
      border: "transparent",
      borderWidth: 0,
    };
  }

  // destructive overrides the brand colour but keeps emphasis shape
  if (state === "destructive") {
    switch (emphasis) {
      case "high":
        return { bg: tok("background","error"), label: tok("text","primaryInverse"), icon: tok("text","primaryInverse"), border: "transparent", borderWidth: 0 };
      case "medOutline":
        return { bg: "transparent", label: tok("text","error"), icon: tok("text","error"), border: tok("border","error"), borderWidth: 2 };
      case "medBorderless":
        return { bg: tok("background","errorSubtle"), label: tok("text","error"), icon: tok("text","error"), border: "transparent", borderWidth: 0 };
      case "medBorderlessNeutral":
        return { bg: tok("background","neutralSubtle"), label: tok("text","error"), icon: tok("text","error"), border: "transparent", borderWidth: 0 };
      case "lowGhost":
        return { bg: "transparent", label: tok("text","error"), icon: tok("text","error"), border: "transparent", borderWidth: 0 };
    }
  }

  switch (emphasis) {
    case "high":
      return { bg: tok("background","primary"), label: tok("text","primaryInverse"), icon: tok("text","primaryInverse"), border: "transparent", borderWidth: 0 };
    case "medOutline":
      return { bg: "transparent", label: tok("text","primary"), icon: tok("text","primary"), border: tok("border","primaryBold"), borderWidth: 2 };
    case "medBorderless":
      return { bg: tok("background","primarySubtle"), label: tok("text","primary"), icon: tok("text","primary"), border: "transparent", borderWidth: 0 };
    case "medBorderlessNeutral":
      return { bg: tok("background","neutralSubtle"), label: tok("text","primary"), icon: tok("text","primary"), border: "transparent", borderWidth: 0 };
    case "lowGhost":
    default:
      return { bg: "transparent", label: tok("text","primary"), icon: tok("text","primary"), border: "transparent", borderWidth: 0 };
  }
}

/* iOS-style spinner - 8 tapered bars ticking around the frame. */
function IOSpinner({ size = 24, colour = "#fff" }) {
  const bars = 8;
  const barW = Math.max(2, Math.round(size * 0.11));
  const barH = Math.round(size * 0.28);
  return (
    <div
      aria-hidden="true"
      style={{
        width: size, height: size, position: "relative",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        animation: "cds-ios-spin 1s steps(8) infinite",
      }}
    >
      {Array.from({ length: bars }).map((_, i) => (
        <span key={i} style={{
          position: "absolute",
          width: barW,
          height: barH,
          borderRadius: barW,
          background: colour,
          top: 0,
          left: (size - barW) / 2,
          transformOrigin: `${barW / 2}px ${size / 2}px`,
          transform: `rotate(${(360 / bars) * i}deg)`,
          // fade bars around the ring so the rotating animation reads clearly
          opacity: 0.15 + (i / bars) * 0.85,
        }} />
      ))}
    </div>
  );
}

/* Android-style spinner - sweeping arc. */
function AndroidSpinner({ size = 24, colour = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      style={{ animation: "cds-android-spin 1.2s linear infinite" }}
      aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none"
        stroke={colour} strokeWidth="2.2" strokeLinecap="round"
        strokeDasharray="40 60"
      />
    </svg>
  );
}

/* Main component. */
function Button(props) {
  const {
    emphasis = "high",
    size = "medium",
    layout = "textIcon",
    fullWidth = false,
    state: staticState = "enabled",
    leadIcon,
    trailIcon,
    icon,
    children,
    onClick,
    ariaLabel,
    platform = "ios",
  } = props;
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);

  /* Read Icon lazily - robust to load order. */
  checkDeps();
  const Icon = window.Icon || (() => null);
  /* Accept either an icon name string OR a JSX node for leadIcon/trailIcon/icon. */
  const renderIcon = (val, sz) => {
    if (val == null || val === false) return null;
    if (React.isValidElement(val)) return val;
    if (typeof val === "string") return <Icon name={val} size={sz} />;
    return null;
  };

  const S = SIZE[size] || SIZE.medium;
  const effectivelyDisabled = staticState === "disabled" || staticState === "loading";

  // derive an "effective" state: static state wins for disabled/loading/destructive;
  // otherwise live pressed > hover > enabled
  let effective = staticState;
  if (!effectivelyDisabled && staticState !== "destructive") {
    if (active) effective = "pressed";
    else if (hover) effective = "hover";
    else effective = "enabled";
  }

  // borrow pressed colour behaviour (opacity 0.6) for hover/active live
  const showOpacity = staticState === "pressed" || staticState === "loading"
    ? 0.6
    : (active ? 0.75 : (hover ? 0.92 : 1));

  // hide disabled for lowGhost per spec
  const resolvedEmphasis = (emphasis === "lowGhost" && staticState === "disabled")
    ? "lowGhost" : emphasis;

  const c = emphasisColours(resolvedEmphasis, staticState);

  const isIconOnly = layout === "iconOnly";
  const content = isIconOnly ? (
    staticState === "loading"
      ? (platform !== "ios" ? <AndroidSpinner size={S.icon} colour={c.icon}/> : <IOSpinner size={S.icon} colour={c.icon}/>)
      : renderIcon(icon, S.icon)
  ) : (
    <>
      {staticState === "loading"
        ? (platform !== "ios"
            ? <AndroidSpinner size={S.icon} colour={c.icon}/>
            : <IOSpinner size={S.icon} colour={c.icon}/>)
        : renderIcon(leadIcon, S.icon)
      }
      <span>{children ?? "Button"}</span>
      {staticState !== "loading" && renderIcon(trailIcon, S.icon)}
    </>
  );

  // sizing
  const height = S.h;
  const widthStyle = fullWidth
    ? { width: "100%" }
    : isIconOnly ? { width: S.iconOnlyW } : {};

  // focus ring width: 3px for all except medOutline (2)
  const ringW = resolvedEmphasis === "medOutline" ? 2 : 3;

  return (
    <button
      type="button"
      className="cds-btn"
      aria-label={ariaLabel || (isIconOnly ? (typeof children === "string" ? children : "Icon button") : undefined)}
      aria-disabled={effectivelyDisabled || undefined}
      disabled={effectivelyDisabled}
      onClick={effectivelyDisabled ? undefined : onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: S.gap,
        height,
        padding: isIconOnly ? 0 : `${S.py} ${S.px}`,
        borderRadius: "var(--radius-full)",
        background: c.bg,
        color: c.label,
        border: c.borderWidth ? `${c.borderWidth}px solid ${c.border}` : "none",
        fontFamily: `var(--typo-${S.typoPrefix}-family)`,
        fontSize: `var(--typo-${S.typoPrefix}-size)`,
        lineHeight: `var(--typo-${S.typoPrefix}-line-height)`,
        fontWeight: `var(--typo-${S.typoPrefix}-weight)`,
        letterSpacing: `var(--typo-${S.typoPrefix}-letter-spacing)`,
        opacity: showOpacity,
        cursor: effectivelyDisabled ? "not-allowed" : "pointer",
        transition: "opacity 120ms ease, transform 120ms ease, box-shadow 120ms ease",
        outline: "none",
        // focus ring via box-shadow: only visible under :focus-visible
        ["--cds-btn-ring-w"]: `${ringW}px`,
        ...widthStyle,
      }}
    >
      {content}
    </button>
  );
}

// tiny global stylesheet for spinner keyframes + focus-visible ring
if (!document.getElementById("cds-btn-kf")) {
  const st = document.createElement("style");
  st.id = "cds-btn-kf";
  st.textContent = `
    @keyframes cds-ios-spin { to { transform: rotate(360deg); } }
    @keyframes cds-android-spin { to { transform: rotate(360deg); } }
    .cds-btn { -webkit-appearance: none; appearance: none; }
    .cds-btn:focus-visible {
      box-shadow:
        0 0 0 2px var(--background-app, #fff),
        0 0 0 calc(2px + var(--cds-btn-ring-w, 3px)) var(--border-info, #0780ff);
    }
  `;
  document.head.appendChild(st);
}

Object.assign(window, { Button, IOSpinner, AndroidSpinner });
})();
