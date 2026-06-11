/* -- CDS Snackbar component
 *
 * Anatomy:
 *   [icon (optional)] - message - [separator + action (optional)] - [dismiss (optional)]
 *
 * Sentiment × default icon × background:
 *   neutral   actionInfo/Line          --background-neutral-bold   (default)
 *   info      actionInfo/Solid         --background-info-bold
 *   success   abstractSuccess/Solid    --background-success-bold
 *   warning   abstractWarning/Solid    --background-alert-bold
 *   error     abstractDanger/Solid     --background-error
 *
 * Text color is always --text-neutral-inverse (white).
 *
 * Layout tokens:
 *   padding   --space-medium - --space-large
 *   gap       --space-small
 *   radius    --radius-large
 *   icon size --icon-size-small (16px)
 *
 * Typography:
 *   message   --typo-body-medium-regular  (regular weight, 13px / 18px)
 *   action    --typo-body-medium-bold     (bold, underlined)
 *
 * Props:
 *   sentiment    "neutral"|"info"|"success"|"warning"|"error"   default "neutral"
 *   message      string                                          required
 *   actionLabel  string                                          optional - paired with onAction
 *   onAction     function                                        optional
 *   onDismiss    function                                        optional - renders dismiss button
 *   icon         ReactNode                                       optional - override default sentiment icon
 *   showIcon     boolean                                         default true
 *
 * SnackbarRegion props:
 *   position     "bottom-center"|"bottom-left"|"bottom-right"|"top-center"  default "bottom-center"
 *   children     one or more <Snackbar>
 */
(function () {

  /* -- Sentiment config ------------------------------------------ */
  const SENTIMENT = {
    neutral: { background: "var(--background-neutral-bold)", iconName: "actionInfoLine"      },
    info:    { background: "var(--background-info-bold)",    iconName: "actionInfoSolid"     },
    success: { background: "var(--background-success-bold)", iconName: "abstractSuccessSolid" },
    warning: { background: "var(--background-alert-bold)",   iconName: "abstractWarningSolid" },
    error:   { background: "var(--background-error)",        iconName: "abstractDangerSolid"  },
  };

  /* -- Position config ------------------------------------------- */
  const POSITION = {
    "bottom-center": { bottom: "var(--space-xlarge, 32px)", left: "50%", transform: "translateX(-50%)", alignItems: "center"     },
    "bottom-left":   { bottom: "var(--space-xlarge, 32px)", left: "var(--space-xlarge, 32px)",          alignItems: "flex-start" },
    "bottom-right":  { bottom: "var(--space-xlarge, 32px)", right: "var(--space-xlarge, 32px)",         alignItems: "flex-end"   },
    "top-center":    { top:    "var(--space-xlarge, 32px)", left: "50%", transform: "translateX(-50%)", alignItems: "center"     },
  };

  /* -- Snackbar -------------------------------------------------- */
  function Snackbar({
    sentiment = "neutral",
    message,
    actionLabel,
    onAction,
    onDismiss,
    icon,
    showIcon = true,
  }) {
    const Icon = window.Icon;
    const cfg  = SENTIMENT[sentiment] || SENTIMENT.neutral;
    const showAction = !!(actionLabel && onAction);

    return (
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          display:        "inline-flex",
          alignItems:     "center",
          gap:            "var(--space-small, 8px)",
          padding:        "var(--space-medium, 12px) var(--space-large, 16px)",
          borderRadius:   "var(--radius-large, 16px)",
          background:     cfg.background,
          color:          "var(--text-neutral-inverse, #fff)",
          maxWidth:       480,
          minWidth:       240,
          boxShadow:      "0 4px 16px rgba(0,0,0,0.18), 0 1px 4px rgba(0,0,0,0.12)",
          fontFamily:     "var(--platform-font-default)",
          boxSizing:      "border-box",
        }}
      >
        {/* Leading icon */}
        {showIcon && (
          <span
            aria-hidden="true"
            style={{
              display:    "inline-flex",
              alignItems: "center",
              flexShrink: 0,
              width:      "var(--icon-size-small, 16px)",
              height:     "var(--icon-size-small, 16px)",
              opacity:    0.95,
            }}
          >
            {icon || (Icon && <Icon name={cfg.iconName} size={16} color="currentColor" />)}
          </span>
        )}

        {/* Message */}
        <p style={{
          flex:           1,
          margin:         0,
          fontFamily:     "var(--typo-body-medium-regular-family)",
          fontSize:       "var(--typo-body-medium-regular-size)",
          fontWeight:     "var(--typo-body-medium-regular-weight, 400)",
          lineHeight:     "var(--typo-body-medium-regular-line-height)",
          letterSpacing:  "var(--typo-body-medium-regular-letter-spacing)",
          color:          "inherit",
        }}>
          {message}
        </p>

        {/* Separator + Action */}
        {showAction && (
          <React.Fragment>
            <span aria-hidden="true" style={{
              width:      1,
              height:     16,
              background: "currentColor",
              opacity:    0.25,
              flexShrink: 0,
            }} />
            <SnackbarActionButton label={actionLabel} onClick={onAction} />
          </React.Fragment>
        )}

        {/* Dismiss */}
        {onDismiss && (
          <SnackbarDismissButton onClick={onDismiss} />
        )}
      </div>
    );
  }

  /* -- Action button (with hover) -------------------------------- */
  function SnackbarActionButton({ label, onClick }) {
    const [hover, setHover] = React.useState(false);
    return (
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        style={{
          flexShrink:           0,
          background:           hover ? "rgba(255,255,255,0.15)" : "transparent",
          border:               "none",
          cursor:               "pointer",
          color:                "inherit",
          fontFamily:           "var(--typo-body-medium-bold-family)",
          fontSize:             "var(--typo-body-medium-bold-size)",
          fontWeight:           "var(--typo-body-medium-bold-weight, 700)",
          lineHeight:           "var(--typo-body-medium-bold-line-height)",
          letterSpacing:        "var(--typo-body-medium-bold-letter-spacing)",
          padding:              "var(--space-xsmall, 4px) var(--space-small, 8px)",
          borderRadius:         "var(--radius-xsmall, 4px)",
          textDecoration:       hover ? "none" : "underline",
          textUnderlineOffset:  2,
          whiteSpace:           "nowrap",
          opacity:              hover ? 1 : 0.95,
          transition:           "background 100ms, opacity 100ms",
        }}
      >
        {label}
      </button>
    );
  }

  /* -- Dismiss button (with hover) ------------------------------- */
  function SnackbarDismissButton({ onClick }) {
    const Icon = window.Icon;
    const [hover, setHover] = React.useState(false);
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label="Dismiss"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        style={{
          flexShrink:     0,
          display:        "inline-flex",
          alignItems:     "center",
          justifyContent: "center",
          width:          24,
          height:         24,
          background:     hover ? "rgba(255,255,255,0.15)" : "transparent",
          border:         "none",
          cursor:         "pointer",
          color:          "inherit",
          padding:        0,
          borderRadius:   "var(--radius-xsmall, 4px)",
          opacity:        hover ? 1 : 0.7,
          transition:     "background 100ms, opacity 100ms",
        }}
      >
        {Icon && <Icon name="actionCloseLine" size={16} color="currentColor" />}
      </button>
    );
  }

  /* -- SnackbarRegion -------------------------------------------- */
  function SnackbarRegion({ position = "bottom-center", children }) {
    const cfg = POSITION[position] || POSITION["bottom-center"];
    return (
      <div style={{
        position:       "fixed",
        zIndex:         9990,
        display:        "flex",
        flexDirection:  "column",
        gap:            "var(--space-small, 8px)",
        pointerEvents:  "none",
        ...cfg,
      }}>
        {React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? <div style={{ pointerEvents: "auto" }}>{child}</div>
            : child
        )}
      </div>
    );
  }

  Object.assign(window, { Snackbar, SnackbarRegion });
})();
