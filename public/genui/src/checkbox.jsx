/* -- CDS Checkbox component
 *
 * Spec from Figma: Checkbox-READY / Parts
 *
 * Anatomy:
 *   Control:  28×28px square  - --radius-xsmall (4px)
 *   Gap:      12px between control and label  - --space-medium
 *   Label:    --typo-interface-label-large (platform font, never brand)
 *   Min touch target: 44pt iOS / 48dp Android
 *
 * Typography Tokens:
 *   label      --typo-interface-label-large  (14px - medium 500)  - --text-neutral-bolder / --text-disabled
 *
 * Behaviors × States:
 *   checked      + enabled  → --background-primary fill + white checkmark (24px)
 *   unchecked    + enabled  → 2px --border-primary-bold outline, transparent fill
 *   mixed        + enabled  → --background-primary fill + white minus (28px)
 *   checked      + disabled → --checkbox-background-disabled-selected fill + white checkmark
 *   unchecked    + disabled → 2px --border-disabled-bold outline, transparent fill
 *   mixed        + disabled → --checkbox-background-disabled-selected fill + white minus
 *
 * Label color:
 *   enabled  → --text-neutral-bolder
 *   disabled → --text-disabled
 *
 * Props:
 *   checked    boolean | "mixed"   default false
 *   disabled   boolean             default false
 *   label      string              optional text label (right of control)
 *   onChange   function            called with next checked value on tap
 */
(function () {

/* -- SVG icons (inline, currentColor) -- */
var CHECKMARK = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ position:"absolute", left:2, top:2, width:24, height:24, pointerEvents:"none" }}>
    <path d="M5 12.5L9.5 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

var MINUS = (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ position:"absolute", left:0, top:0, width:28, height:28, pointerEvents:"none" }}>
    <path d="M8 14H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

/* -- CheckboxControl (the square) -- */
function CheckboxControl({ checked, disabled }) {
  var isMixed   = checked === "mixed";
  var isChecked = checked === true || checked === "mixed";

  var bg, border;
  if (disabled && isChecked) {
    bg     = "var(--checkbox-background-disabled-selected)";
    border = "none";
  } else if (disabled && !isChecked) {
    bg     = "transparent";
    border = "2px solid var(--border-disabled-bold)";
  } else if (!disabled && isChecked) {
    bg     = "var(--background-primary)";
    border = "none";
  } else {
    bg     = "transparent";
    border = "2px solid var(--border-primary-bold)";
  }

  return (
    <span style={{
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 28,
      height: 28,
      borderRadius: "var(--radius-xsmall, 4px)",
      background: bg,
      border: border,
      flexShrink: 0,
      boxSizing: "border-box",
      color: "var(--background-primary-inverse, #fff)",
      transition: "background 150ms ease, border-color 150ms ease",
      outline: "none",
    }}
      onFocus={e => e.currentTarget.style.boxShadow = "0 0 0 3px var(--border-info)"}
      onBlur={e => e.currentTarget.style.boxShadow = "none"}
      tabIndex={disabled ? -1 : 0}
    >
      {checked === true  && CHECKMARK}
      {isMixed           && MINUS}
    </span>
  );
}

/* -- Checkbox -- */
function Checkbox({ checked, disabled, label, onChange }) {
  checked  = checked  === undefined ? false : checked;
  disabled = !!disabled;

  function handleClick() {
    if (disabled || !onChange) return;
    // cycle: false → true → false (mixed is set programmatically)
    onChange(checked === "mixed" ? false : !checked);
  }

  return (
    <label style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-medium, 12px)",
      cursor: disabled ? "not-allowed" : "pointer",
      userSelect: "none",
      minHeight: 44,
    }}
      onClick={handleClick}
    >
      <span style={{ display: "inline-flex", alignItems: "center" }}>
        <CheckboxControl checked={checked} disabled={disabled} />
      </span>
      {label && (
        <span style={{
          fontFamily:    "var(--typo-interface-label-large-family)",
          fontSize:      "var(--typo-interface-label-large-size)",
          fontWeight:    "var(--typo-interface-label-large-weight)",
          lineHeight:    "var(--typo-interface-label-large-line-height)",
          letterSpacing: "var(--typo-interface-label-large-letter-spacing)",
          color: disabled
            ? "var(--text-disabled)"
            : "var(--text-neutral-bolder)",
          transition: "color 150ms ease",
        }}>
          {label}
        </span>
      )}
    </label>
  );
}

Object.assign(window, { Checkbox, CheckboxControl });
})();
