/* -- CDS FeedbackCaption component
 *
 * Spec: Figma → Feedback-Caption-READY / components
 *
 * Anatomy:
 *   Icon:   16×16px - optional on info, always shown on success/error
 *   Gap:    4px between icon and text
 *   Text:   --typo-interface-label-small (platform font)
 *
 * Typography Tokens:
 *   text       --typo-interface-label-small  (11px - semibold 600)  - --text-neutral-bolder / --text-success-bold / --text-error
 *
 * Variants:
 *   info    → icon --icon-primary - text --text-neutral-bolder - icon optional
 *   success → icon --text-success-bold - text --text-success-bold
 *   error   → icon --text-error-bold   - text --text-error
 *
 * Props:
 *   status    "info" | "success" | "error"   default "info"
 *   text      string                         caption text
 *   showIcon  boolean                        default true (info only can hide)
 */
(function () {

/* -- Status icons (inline SVG) -- */
function IconInfo({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="8" fill={color} />
      <rect x="7" y="7" width="2" height="5" rx="1" fill="white" />
      <circle cx="8" cy="5" r="1" fill="white" />
    </svg>
  );
}

function IconSuccess({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="8" fill={color} />
      <path d="M4.5 8.5L6.5 10.5L11.5 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconError({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M7.134 1.5a1 1 0 0 1 1.732 0l6.062 10.5A1 1 0 0 1 14.062 13.5H1.938a1 1 0 0 1-.866-1.5L7.134 1.5Z" fill={color} />
      <rect x="7" y="6" width="2" height="4" rx="1" fill="white" />
      <circle cx="8" cy="11" r="1" fill="white" />
    </svg>
  );
}

/* -- FeedbackCaption -- */
function FeedbackCaption({ status, text, showIcon }) {
  status   = status   || "info";
  text     = text     || "";
  showIcon = showIcon === undefined ? true : showIcon;

  var iconColor, textColor, Icon;

  if (status === "success") {
    iconColor = "var(--text-success-bold)";
    textColor = "var(--text-success-bold)";
    Icon      = IconSuccess;
  } else if (status === "error") {
    iconColor = "var(--text-error-bold)";
    textColor = "var(--text-error)";
    Icon      = IconError;
  } else {
    iconColor = "var(--icon-primary)";
    textColor = "var(--text-neutral-bolder)";
    Icon      = IconInfo;
  }

  return (
    <span style={{
      display:    "inline-flex",
      flexDirection: "row",
      alignItems: "center",
      gap:        "var(--space-xsmall)",
    }}>
      {showIcon && (
        <span style={{ display: "inline-flex", alignItems: "center", flexShrink: 0 }}>
          <Icon color={iconColor} />
        </span>
      )}
      <span style={{
        fontFamily:    "var(--typo-interface-label-small-family)",
        fontSize:      "var(--typo-interface-label-small-size)",
        fontWeight:    "var(--typo-interface-label-small-weight)",
        lineHeight:    "var(--typo-interface-label-small-line-height)",
        letterSpacing: "var(--typo-interface-label-small-letter-spacing)",
        color:         textColor,
      }}>
        {text}
      </span>
    </span>
  );
}

Object.assign(window, { FeedbackCaption });
})();
