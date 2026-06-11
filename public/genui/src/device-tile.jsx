/* -- Device Tile - smart home / IoT control card -------------------------
 *
 * Vertical layout (165 × 174px) matches Figma exactly:
 *   Top-left:  status dot (on/off/alert/irresponsive) OR icon (thermostat/critical)
 *   Middle:    Device Name - Status text (with bullet prefix)
 *   Bottom:    action label (left) + ToggleButton or Chevron (right)
 *
 * Sub-components: window.ToggleButton - window.Icon (from icon-renderer.jsx)
 * ------------------------------------------------------------------------ */
(function () {
const { useState, useEffect } = React;

/* -- SVG icon loader - reads from window.CDS_ICON_SVGS (no runtime fetch) -- */
const _cache = new Map();
function useIcon(name) {
  if (!name) return "";
  if (_cache.has(name)) return _cache.get(name);
  const raw = (window.CDS_ICON_SVGS && window.CDS_ICON_SVGS[name]) || "";
  const c = raw
    .replace(/\s(width|height)="[^"]*"/g, "")
    .replace("<svg ", '<svg width="100%" height="100%" ')
    .replace(/<defs>[\s\S]*?<\/defs>/g, "")
    .replace(/\s*clip-path="[^"]*"/g, "");
  _cache.set(name, c);
  return c;
}
function Ico({ name, size = 20, color = "currentColor", style: s }) {
  const svg = useIcon(name);
  const dim = typeof size === "number" ? size : undefined;
  const cssSize = typeof size === "string" ? size : undefined;
  return <span dangerouslySetInnerHTML={{ __html: svg }}
    style={{ display: "inline-flex", width: cssSize || dim, height: cssSize || dim,
      color, flexShrink: 0, ...s }} />;
}

/* -- Chevron -- */
/* Trailing affordance on tappable rows (alert / irresponsive / critical states).
   Renders the arrowChevronRightLine icon at --icon-size-medium (24px) and inherits
   colour from the per-state cfg.chevronColor. */
function Chevron({ color }) {
  return <Ico name="arrowChevronRightLine" size="var(--icon-size-medium, 24px)" color={color} />;
}

/* -- Spinner -- */
function Spinner({ size = 16, color = "var(--icon-neutral)" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      style={{ animation: "cds-dt-spin 1s linear infinite", display: "block" }}>
      <circle cx="12" cy="12" r="9" fill="none" stroke={color} strokeWidth="3"
        strokeDasharray="42 14" strokeLinecap="round" />
      <style>{`@keyframes cds-dt-spin { to { transform: rotate(360deg); transform-origin: 12px 12px; } }`}</style>
    </svg>
  );
}

/* ======================================================================
   STATE CONFIG
====================================================================== */
function getCfg(state, statusText) {
  const base = {
    bg: "var(--background-primary-inverse)",
    border: "2px solid var(--border-primary-subtle)",
    // top-left indicator: "dot" | "icon"
    topType: "dot", dotColor: "var(--icon-primary)", topIcon: null,
    // name + status
    statusLabel: null, statusColor: "var(--text-primary)", statusBullet: true,
    // action label (bottom-left)
    actionLabel: null, actionColor: "var(--text-primary)",
    // bottom-right control
    showToggle: false, toggleState: "off",
    showChevron: false, chevronColor: "var(--icon-neutral)",
    showLoading: false,
    // thermostat temperature
    showTemp: false, tempColor: "var(--text-primary)",
    clickable: false,
  };

  const map = {
    "on": {
      ...base,
      border: "2px solid var(--border-primary-bold)",
      statusLabel: statusText || "Status",
      actionLabel: "On",
      showToggle: true, toggleState: "on",
    },
    "off": {
      ...base,
      statusLabel: statusText || "Status",
      actionLabel: "Off",
      showToggle: true, toggleState: "off",
    },
    "on-loading": {
      ...base,
      bg: "var(--background-disabled)", border: "2px solid var(--border-neutral-subtle)",
      statusLabel: null, actionLabel: null,
      showLoading: true,
    },
    "off-loading": {
      ...base,
      bg: "var(--background-disabled)", border: "2px solid var(--border-neutral-subtle)",
      statusLabel: null, actionLabel: null,
      showLoading: true,
    },
    "on-thermostat": {
      ...base,
      topType: "icon", topIcon: "homeThermostatLine",
      statusLabel: statusText || "[…] to […]",
      showTemp: true, tempColor: "var(--text-primary)",
      showToggle: true, toggleState: "on",
    },
    "off-thermostat": {
      ...base,
      topType: "icon", topIcon: "homeThermostatLine",
      statusLabel: statusText || "[…] to […]",
      showTemp: true, tempColor: "var(--text-neutral)",
      showToggle: true, toggleState: "off",
    },
    "alert": {
      ...base,
      bg: "var(--background-alert-inverse, #fffdf5)",
      border: "2px solid var(--border-alert-bold)",
      dotColor: "var(--icon-alert)",
      statusLabel: statusText || "Status", statusColor: "var(--text-alert)",
      showChevron: true, chevronColor: "var(--icon-alert)",
      clickable: true, statusBullet: false,
    },
    "irresponsive": {
      ...base,
      bg: "var(--background-disabled)", border: "2px solid var(--border-neutral-subtle)",
      dotColor: "var(--icon-neutral)",
      statusLabel: statusText || "Irresponsive", statusColor: "var(--text-neutral)",
      showChevron: true, chevronColor: "var(--icon-neutral)",
      clickable: true, statusBullet: false,
    },
    "critical": {
      ...base,
      bg: "var(--background-error-inverse, #fff5f5)",
      border: "2px solid var(--border-error)",
      topType: "warning",
      dotColor: "var(--icon-error)",
      statusLabel: statusText || "Status", statusColor: "var(--text-error)",
      showChevron: true, chevronColor: "var(--icon-error)",
      clickable: true, statusBullet: false,
    },
  };
  return map[state] || base;
}

/* ======================================================================
   DEVICE TILE
====================================================================== */
function DeviceTile({
  state = "off",
  layout = "vertical",
  name = "Device Name",
  statusText,
  statusIcon,
  deviceIcon = "homePlugLine",
  temperature,
  platform,
  onToggle,
  onPress,
}) {
  const ToggleButton = window.ToggleButton;
  const isVertical = layout === "vertical";
  const cfg = getCfg(state, statusText);

  /* -- Top-left indicator -- */
  const deviceIconEl = cfg.topType === "warning"
    ? <Ico name="abstractWarningSolid" size="var(--icon-size-medium, 24px)" color="var(--icon-error)" />
    : <Ico name={deviceIcon} size="var(--icon-size-medium, 24px)" color={cfg.dotColor || "var(--icon-primary)"} />;

  /* -- Name + status block -- */
  const nameBlock = (
    <div style={{ minWidth: 0, minHeight: 44 }}>
      <div style={{
        font: "var(--typo-body-large-bold, 600 15px/20px var(--platform-font-default, system-ui))",
        color: "var(--text-neutral-bolder)",
        overflow: "hidden", textOverflow: "ellipsis",
        display: "-webkit-box",
        WebkitLineClamp: isVertical ? 2 : 1,
        WebkitBoxOrient: "vertical",
        lineClamp: isVertical ? 2 : 1,
        whiteSpace: isVertical ? "normal" : "nowrap",
      }}>{name}</div>
      <div style={{ minHeight: 20, marginTop: 3 }}>
        {cfg.statusLabel && (
          <div style={{
            font: "var(--typo-body-small-bold, 600 12px/16px var(--platform-font-default, system-ui))",
            color: cfg.statusColor,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            display: "flex", alignItems: "center", gap: 4,
          }}>
            {cfg.statusBullet && (
              statusIcon
                ? <Ico name={statusIcon} size="var(--icon-size-small, 16px)" color={cfg.statusColor} />
                : <span style={{ width: 6, height: 6, borderRadius: "50%",
                    background: cfg.statusColor, flexShrink: 0 }} />
            )}
            {cfg.statusLabel}
          </div>
        )}
      </div>
    </div>
  );

  /* -- Bottom-right control -- */
  const control = (
    <>
      {cfg.showLoading && null /* no control when loading */}
      {cfg.showToggle && ToggleButton && (
        <ToggleButton
          icon="actionPowerLine"
          state={cfg.toggleState}
          styleName="high"
          size="default"
          layout="vertical"
          platform={platform}
          ariaLabel={`Toggle ${name}`}
          onToggle={() => onToggle?.()}
        />
      )}
      {cfg.showChevron && <Chevron color={cfg.chevronColor} />}
    </>
  );

  /* -- VERTICAL (165 × 174px) - top content + bottom action -- */
  if (isVertical) {
    return (
      <div
        onClick={cfg.clickable ? onPress : undefined}
        style={{
          width: 165, height: 174,
          background: cfg.bg, border: cfg.border,
          borderRadius: "var(--radius-large, 16px)",
          padding: 16,
          display: "flex", flexDirection: "column",
          justifyContent: "space-between",
          cursor: cfg.clickable ? "pointer" : "default",
          boxSizing: "border-box",
        }}
      >
        {/* Top section: icon + name + status */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
          {/* Icon */}
          <div>{deviceIconEl}</div>
          {/* Name + status */}
          {nameBlock}
        </div>

        {/* Bottom row: action label / temp / loading text + control - fixed at bottom */}
        <div style={{ display: "flex", alignItems: "flex-end",
          justifyContent: "space-between", flexShrink: 0, minHeight: 32 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {cfg.showLoading && (
              <span style={{ font: "var(--typo-body-small-regular, 400 12px/16px var(--platform-font-default, system-ui))",
                color: "var(--text-neutral)", fontStyle: "italic" }}>
                Almost ready...
              </span>
            )}
            {cfg.actionLabel && !cfg.showLoading && (
              <span style={{ font: "var(--typo-body-small-bold, 600 12px/16px var(--platform-font-default, system-ui))",
                color: cfg.actionColor }}>
                {cfg.actionLabel}
              </span>
            )}
            {cfg.showTemp && !cfg.showLoading && (
              <span style={{
                font: "var(--typo-heading-medium-regular, 500 20px/25px var(--platform-font-default, system-ui))",
                color: cfg.tempColor, lineHeight: 1,
              }}>
                {temperature || "21.5º"}
              </span>
            )}
          </div>
          {control}
        </div>
      </div>
    );
  }

  /* -- HORIZONTAL (full width) -- */
  return (
    <div
      onClick={cfg.clickable ? onPress : undefined}
      style={{
        width: "100%",
        background: cfg.bg, border: cfg.border,
        borderRadius: "var(--radius-large, 16px)",
        padding: "14px 16px",
        display: "flex", alignItems: "center", gap: 12,
        cursor: cfg.clickable ? "pointer" : "default",
        boxSizing: "border-box",
      }}
    >
      {/* Indicator - hidden in loading states */}
      {!cfg.showLoading && <div style={{ flexShrink: 0 }}>{deviceIconEl}</div>}

      {/* Name + status */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          font: "var(--typo-body-large-bold, 600 15px/20px var(--platform-font-default, system-ui))",
          color: "var(--text-neutral-bolder)",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>{name}</div>
        {!cfg.showLoading && cfg.statusLabel && (
          <div style={{
            font: "var(--typo-body-small-bold, 600 12px/16px var(--platform-font-default, system-ui))",
            color: cfg.statusColor,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            display: "flex", alignItems: "center", gap: 4, marginTop: 3,
          }}>
            {cfg.statusBullet && (
              statusIcon
                ? <Ico name={statusIcon} size="var(--icon-size-small, 16px)" color={cfg.statusColor} />
                : <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.statusColor, flexShrink: 0 }} />
            )}
            {cfg.statusLabel}
          </div>
        )}
      </div>

      {/* Control */}
      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}>
        {cfg.showTemp && (
          <span style={{ font: "var(--typo-heading-medium-regular, 500 20px/25px var(--platform-font-default, system-ui))",
            color: cfg.tempColor }}>
            {temperature || "21.5º"}
          </span>
        )}
        {cfg.showLoading && (
          <span style={{ font: "var(--typo-body-small-regular, 400 12px/16px var(--platform-font-default, system-ui))",
            color: "var(--text-neutral)", fontStyle: "italic" }}>
            Almost ready...
          </span>
        )}
        {control}
      </div>
    </div>
  );
}

Object.assign(window, { DeviceTile });
})();
