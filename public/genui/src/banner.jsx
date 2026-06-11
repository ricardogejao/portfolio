/* -- CDS Banner component
 *
 * Spec: Figma → Banner-READY / components
 *
 * Anatomy:
 *   large: 48px side icon (optional) - content (headline + body + action) - dismiss button (optional)
 *   small: 24px inline icon (optional) - content (headline + body + action) - dismiss button (optional)
 *
 * States × tokens:
 *   info     bg --background-app           - border --border-primary      - icon --icon-primary
 *   success  bg --background-success-subtle - border --border-success      - icon --text-success-bold
 *   warning  bg --background-alert-subtle   - border --border-alert-bold   - icon --text-alert-bold
 *   critical bg --background-error-subtle   - border --border-error        - icon --text-error-bold
 *
 * Typography Tokens:
 *   headline   --typo-body-large-bold     (15px - semibold 600) - --text-neutral-bolder
 *   body       --typo-body-large-regular  (15px - regular 400)  - --text-neutral-bolder
 *   action     --typo-body-large-regular  (15px - regular 400)  - --text-primary
 *
 * Layout tokens:
 *   padding    --space-large (16px) --space-medium (12px)
 *   gap        --space-small (8px)
 *   radius     --radius-medium (12px)
 *   border     --border-width-thick (2px)
 *
 * Props:
 *   status      "info"|"success"|"warning"|"critical"  default "info"
 *   type        "large"|"small"                        default "large"
 *   headline    string                                 optional headline
 *   body        string                                 required message body
 *   action      {label, onClick}                       optional action link
 *   onDismiss   function                               shows dismiss button if provided
 *   icon        ReactNode                              optional custom icon; defaults to status icon
 *   showIcon    boolean                                default true
 */
(function () {

/* -- Status icons -- */
function IconInfo({ color }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill={color} />
      <rect x="11" y="11" width="2" height="6" rx="1" fill="white" />
      <circle cx="12" cy="8" r="1.25" fill="white" />
    </svg>
  );
}

function IconSuccess({ color }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill={color} />
      <path d="M7 12.5L10 15.5L17 8.5" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconWarning({ color }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10.268 3.5c.77-1.333 2.694-1.333 3.464 0l8.66 15c.77 1.334-.192 3-1.732 3H3.34c-1.54 0-2.502-1.666-1.732-3l8.66-15Z" fill={color}/>
      <rect x="11" y="9" width="2" height="6" rx="1" fill="white"/>
      <circle cx="12" cy="17" r="1.25" fill="white"/>
    </svg>
  );
}

function IconCritical({ color }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill={color} />
      <path d="M8 8l8 8M16 8l-8 8" stroke="white" strokeWidth="1.75" strokeLinecap="round"/>
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
    </svg>
  );
}

var STATUS_CONFIG = {
  info:     { bg: "var(--background-app, #fff)",            border: "var(--border-primary)",    iconColor: "var(--icon-primary)",      Icon: IconInfo    },
  success:  { bg: "var(--background-success-subtle)",       border: "var(--border-success)",    iconColor: "var(--text-success-bold)", Icon: IconSuccess },
  warning:  { bg: "var(--background-alert-subtle)",         border: "var(--border-alert-bold)", iconColor: "var(--text-alert-bold)",   Icon: IconWarning },
  critical: { bg: "var(--background-error-subtle)",         border: "var(--border-error)",      iconColor: "var(--text-error-bold)",   Icon: IconCritical },
};

function Banner({ status, type, headline, body, action, onDismiss, icon, showIcon }) {
  status   = status   || "info";
  type     = type     || "large";
  showIcon = showIcon === undefined ? true : showIcon;

  var cfg     = STATUS_CONFIG[status] || STATUS_CONFIG.info;
  var isLarge = type === "large";
  var iconSize = isLarge ? 48 : 24;

  var IconComponent = cfg.Icon;
  var renderedIcon = icon || (
    <span style={{ display: "inline-flex", width: iconSize, height: iconSize, flexShrink: 0, color: cfg.iconColor }}>
      <IconComponent color={cfg.iconColor} />
    </span>
  );

  return (
    <div role="region" style={{
      display:       "flex",
      flexDirection: "row",
      alignItems:    "center",
      borderRadius:  "var(--radius-medium, 12px)",
      background:    cfg.bg,
      border:        "var(--border-width-thick, 2px) solid " + cfg.border,
      padding:       "var(--space-large, 16px) var(--space-medium, 12px)",
      gap:           "var(--space-medium, 12px)",
      width:         "100%",
      boxSizing:     "border-box",
    }}>
      {/* Icon */}
      {showIcon && (
        <span style={{ display: "inline-flex", alignItems: isLarge ? "flex-start" : "center", flexShrink: 0, paddingTop: isLarge ? 2 : 0 }}>
          {renderedIcon}
        </span>
      )}

      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-xsmall, 4px)", minWidth: 0 }}>
        {headline && (
          <span style={{
            fontFamily:    "var(--typo-body-large-bold-family)",
            fontSize:      "var(--typo-body-large-bold-size)",
            fontWeight:    "var(--typo-body-large-bold-weight)",
            lineHeight:    "var(--typo-body-large-bold-line-height)",
            letterSpacing: "var(--typo-body-large-bold-letter-spacing)",
            color:         "var(--text-neutral-bolder)",
          }}>{headline}</span>
        )}
        {body && (
          <span style={{
            fontFamily:    "var(--typo-body-large-regular-family)",
            fontSize:      "var(--typo-body-large-regular-size)",
            fontWeight:    "var(--typo-body-large-regular-weight, 400)",
            lineHeight:    "var(--typo-body-large-regular-line-height)",
            letterSpacing: "var(--typo-body-large-regular-letter-spacing)",
            color:         "var(--text-neutral-bolder)",
          }}>{body}</span>
        )}
        {action && (
          <button onClick={action.onClick} style={{
            background:    "none",
            border:        "none",
            padding:       0,
            cursor:        "pointer",
            fontFamily:    "var(--typo-body-large-regular-family)",
            fontSize:      "var(--typo-body-large-regular-size)",
            fontWeight:    "var(--typo-body-large-regular-weight)",
            lineHeight:    "var(--typo-body-large-regular-line-height)",
            letterSpacing: "var(--typo-body-large-regular-letter-spacing)",
            color:         "var(--text-primary)",
            textAlign:     "left",
            textDecoration: "underline",
            textUnderlineOffset: "2px",
            marginTop:     "var(--space-xsmall, 4px)",
          }}>{action.label}</button>
        )}
      </div>

      {/* Dismiss */}
      {onDismiss && (
        <button onClick={onDismiss} style={{
          background:  "none",
          border:      "none",
          cursor:      "pointer",
          color:       "var(--text-neutral-bolder)",
          display:     "inline-flex",
          alignItems:  "center",
          justifyContent: "center",
          width:       48,
          height:      48,
          borderRadius: "var(--radius-small, 8px)",
          flexShrink:  0,
          padding:     0,
        }}
          aria-label="Dismiss"
          onMouseEnter={function(e) { e.currentTarget.style.background = "rgba(0,0,0,0.06)"; }}
          onMouseLeave={function(e) { e.currentTarget.style.background = "none"; }}
        >
          <IconClose />
        </button>
      )}
    </div>
  );
}

Object.assign(window, { Banner });
})();
