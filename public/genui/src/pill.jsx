/* -- CDS Pill component
 *
 * Spec: Figma → Pill-READY / components
 *
 * The Pill represents a selectable option in a group. Always used
 * within a group (PillGroup), never standalone.
 *
 * Anatomy:
 *   Leading icon (optional) - Label - Trailing icon (optional)
 *   Height: 48px - --radius-medium (12px)
 *   Padding: --space-small (8px) --space-large (16px)
 *   Gap: --space-small (8px)
 *
 * States × tokens:
 *   unselected        bg --background-neutral-subtle - no border   - text --text-neutral-bold
 *   selected          bg --background-primary-subtle - --border-width-thick --border-primary - text --text-primary
 *   selected-high     bg --background-primary        - no border   - text --background-primary-inverse
 *
 * Typography Tokens:
 *   label  --typo-interface-label-large  (14px - medium 500)  - --text-neutral-bold / --text-primary / inverse
 *          Note: Figma spec marks this 700; token resolves to platform-font-weight-medium (500).
 *          Raise as a token gap if bold is required.
 *
 * Props (Pill):
 *   label         string             pill label text
 *   state         "unselected"|"selected"|"selected-high"  default "unselected"
 *   leadingIcon   ReactNode          optional leading icon (24×24)
 *   trailingIcon  ReactNode          optional trailing icon (24×24)
 *   onClick       function           called on press
 *   disabled      boolean            default false
 *
 * Props (PillGroup):
 *   options       [{value, label, leadingIcon, trailingIcon}]
 *   value         string | string[]  selected value(s)
 *   onChange      function           called with new value/values
 *   multiSelect   boolean            default false
 *   emphasis      "default"|"high"   default "default"
 */
(function () {

/* Inject focus ring CSS once */
if (!document.getElementById("pill-focus-style")) {
  var s = document.createElement("style");
  s.id = "pill-focus-style";
  s.textContent = [
    "button.cds-pill:focus { outline: none; }",
    "button.cds-pill:focus-visible { outline: 3px solid var(--border-info); outline-offset: 2px; }",
  ].join("\n");
  document.head.appendChild(s);
}

function Pill({ label, state, leadingIcon, trailingIcon, onClick, disabled }) {
  state    = state    || "unselected";
  disabled = !!disabled;

  var isSelected     = state === "selected" || state === "selected-high";
  var isHighEmphasis = state === "selected-high";

  /* Colors */
  var bg, border, textColor;
  if (isHighEmphasis) {
    bg        = "var(--background-primary)";
    border    = "none";
    textColor = "var(--background-primary-inverse, #fff)";
  } else if (isSelected) {
    bg        = "var(--background-primary-subtle)";
    border    = "var(--border-width-thick, 2px) solid var(--border-primary)";
    textColor = "var(--text-primary)";
  } else {
    bg        = "var(--background-neutral-subtle)";
    border    = "none";
    textColor = "var(--text-neutral-bold)";
  }

  if (disabled) {
    bg        = "var(--background-disabled)";
    border    = "none";
    textColor = "var(--text-disabled)";
  }

  return (
    <button
      className="cds-pill"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        display:         "inline-flex",
        flexDirection:   "row",
        alignItems:      "center",
        justifyContent:  "center",
        gap:             "var(--space-small, 8px)",
        height:          "48px",
        padding:         "var(--space-small, 8px) var(--space-large, 16px)",
        borderRadius:    "var(--radius-medium, 12px)",
        background:      bg,
        border:          border,
        cursor:          disabled ? "not-allowed" : "pointer",
        boxSizing:       "border-box",
        whiteSpace:      "nowrap",
        transition:      "background 150ms ease, border-color 150ms ease",
        outline:         "none",
        userSelect:      "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {leadingIcon && (
        <span style={{ display: "inline-flex", alignItems: "center", color: textColor, flexShrink: 0, width: 24, height: 24 }}>
          {leadingIcon}
        </span>
      )}
      <span style={{
        fontFamily:    "var(--typo-interface-label-large-family)",
        fontSize:      "var(--typo-interface-label-large-size)",
        fontWeight:    "var(--typo-interface-label-large-weight)",
        lineHeight:    "var(--typo-interface-label-large-line-height)",
        letterSpacing: "var(--typo-interface-label-large-letter-spacing)",
        color:         textColor,
      }}>{label}</span>
      {trailingIcon && (
        <span style={{ display: "inline-flex", alignItems: "center", color: textColor, flexShrink: 0, width: 24, height: 24 }}>
          {trailingIcon}
        </span>
      )}
    </button>
  );
}

function PillGroup({ options, value, onChange, multiSelect, emphasis }) {
  multiSelect = !!multiSelect;
  emphasis    = emphasis || "default";

  function getState(optValue) {
    var isSelected = multiSelect
      ? (Array.isArray(value) ? value.includes(optValue) : false)
      : value === optValue;
    if (!isSelected) return "unselected";
    return emphasis === "high" ? "selected-high" : "selected";
  }

  function handleClick(optValue) {
    if (!onChange) return;
    if (multiSelect) {
      var current = Array.isArray(value) ? value : [];
      if (current.includes(optValue)) {
        onChange(current.filter(function(v) { return v !== optValue; }));
      } else {
        onChange(current.concat(optValue));
      }
    } else {
      onChange(value === optValue ? null : optValue);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "var(--space-medium, 12px)" }}>
      {(options || []).map(function(opt) {
        return (
          <Pill
            key={opt.value}
            label={opt.label}
            state={getState(opt.value)}
            leadingIcon={opt.leadingIcon}
            trailingIcon={opt.trailingIcon}
            disabled={opt.disabled}
            onClick={function() { handleClick(opt.value); }}
          />
        );
      })}
    </div>
  );
}

Object.assign(window, { Pill, PillGroup });
})();
