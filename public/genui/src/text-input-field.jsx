/* -- CDS TextInputField component
 *
 * Spec: Figma → Text-Input-Field-READY / CDS-Component
 *
 * Two variants:
 *   single   - 64px tall input (default)
 *   area     - 80px tall textarea, multiline
 *
 * Anatomy (top to bottom):
 *   label-wrap:  label (left) - required marker - counter (right, optional)
 *   input/area:  --radius-large - 16px left padding - --typo-body-large-regular
 *   hint:        optional hint text below input
 *   caption:     optional FeedbackCaption sub-component
 *
 * States × tokens:
 *   enabled   bg --background-app  - border 1px --border-neutral
 *   active    bg --background-app  - border 2px --border-primary
 *   disabled  bg --background-disabled - no border - cursor not-allowed
 *   read-only bg --background-app  - border 1px --border-neutral - read-only attr
 *
 * Typography:
 *   label         --typo-interface-label-large - --text-neutral-bolder
 *   required      --typo-interface-label-large - --text-neutral-subtle
 *   counter       --typo-interface-label-small - --text-neutral-subtle
 *   placeholder   --typo-body-large-regular - --text-neutral
 *   input value   --typo-body-large-regular - --text-neutral-bolder
 *   disabled text --typo-body-large-regular - --text-disabled
 *   hint          --typo-interface-label-small - --text-neutral-subtle
 *
 * FeedbackCaption:
 *   caption: { status: "info"|"success"|"error", text: string } | null
 *
 * Props:
 *   variant       "single"|"area"       default "single"
 *   state         "enabled"|"active"|"disabled"|"read-only"  default "enabled"
 *   label         string                required field label
 *   required      boolean               shows "(Required)" marker
 *   counter       string                optional counter string e.g. "0/100"
 *   showCounter   boolean               default false
 *   placeholder   string                input placeholder text
 *   value         string                controlled value
 *   onChange      function              called on input change
 *   hint          string                optional hint below input
 *   showHint      boolean               default false
 *   caption       {status,text}|null    optional FeedbackCaption
 *   id            string                for label htmlFor
 */
(function () {
const { useState, useRef, useCallback } = React;

function TextInputField({
  variant, state, label, required: isRequired,
  counter, showCounter,
  placeholder, value, onChange,
  hint, showHint,
  caption, id,
}) {
  variant     = variant     || "single";
  state       = state       || "enabled";
  placeholder = placeholder || "Placeholder";
  id          = id          || ("tf-" + Math.random().toString(36).slice(2));

  var isDisabled = state === "disabled";
  var isReadOnly = state === "read-only";
  var isActive   = state === "active";

  /* Border */
  var border;
  if (isDisabled) {
    border = "none";
  } else if (isActive) {
    border = "var(--border-width-thick) solid var(--border-primary)";
  } else {
    border = "var(--border-width-thin) solid var(--border-neutral)";
  }

  /* Background */
  var bg = isDisabled ? "var(--background-disabled)" : "var(--background-app, #fff)";

  /* Text color for value */
  var textColor = isDisabled ? "var(--text-disabled)" : "var(--text-neutral-bolder)";

  /* Shared input style */
  var inputStyle = {
    width:        "100%",
    boxSizing:    "border-box",
    borderRadius: "var(--radius-large, 16px)",
    border:       border,
    background:   bg,
    padding:      variant === "area" ? "20px 16px" : "0 16px",
    height:       variant === "area" ? "80px" : "64px",
    resize:       "none",
    fontFamily:   "var(--typo-body-large-regular-family)",
    fontSize:     "var(--typo-body-large-regular-size)",
    fontWeight:   "var(--typo-body-large-regular-weight, 400)",
    lineHeight:   "var(--typo-body-large-regular-line-height)",
    letterSpacing:"var(--typo-body-large-regular-letter-spacing)",
    color:        textColor,
    cursor:       isDisabled ? "not-allowed" : "text",
    outline:      "none",
    display:      "block",
    transition:   "border-color 150ms ease",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-small, 8px)", width: "100%" }}>

      {/* Label row */}
      {label && (
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "row", gap: "var(--space-xsmall, 4px)", alignItems: "baseline" }}>
            <label htmlFor={id} style={{
              fontFamily:    "var(--typo-interface-label-large-family)",
              fontSize:      "var(--typo-interface-label-large-size)",
              fontWeight:    "var(--typo-interface-label-large-weight)",
              lineHeight:    "var(--typo-interface-label-large-line-height)",
              letterSpacing: "var(--typo-interface-label-large-letter-spacing)",
              color:         isDisabled ? "var(--text-disabled)" : "var(--text-neutral-bolder)",
              cursor:        isDisabled ? "not-allowed" : "pointer",
            }}>{label}</label>
            {isRequired && (
              <span style={{
                fontFamily:  "var(--typo-interface-label-large-family)",
                fontSize:    "var(--typo-interface-label-large-size)",
                fontWeight:  "var(--typo-interface-label-large-weight)",
                lineHeight:  "var(--typo-interface-label-large-line-height)",
                color:       "var(--text-neutral-subtle)",
              }}>(Required)</span>
            )}
          </div>
          {showCounter && counter && (
            <span style={{
              fontFamily:  "var(--typo-interface-label-small-family)",
              fontSize:    "var(--typo-interface-label-small-size)",
              fontWeight:  "var(--typo-interface-label-small-weight)",
              lineHeight:  "var(--typo-interface-label-small-line-height)",
              color:       "var(--text-neutral-subtle)",
              textAlign:   "right",
            }}>{counter}</span>
          )}
        </div>
      )}

      {/* Input */}
      {variant === "area"
        ? (
          <textarea
            id={id}
            value={value || ""}
            onChange={isDisabled || isReadOnly ? undefined : onChange}
            placeholder={placeholder}
            disabled={isDisabled}
            readOnly={isReadOnly}
            style={Object.assign({}, inputStyle, {
              verticalAlign: "top",
              paddingTop:    "20px",
            })}
          />
        ) : (
          <input
            id={id}
            type="text"
            value={value || ""}
            onChange={isDisabled || isReadOnly ? undefined : onChange}
            placeholder={placeholder}
            disabled={isDisabled}
            readOnly={isReadOnly}
            style={inputStyle}
          />
        )
      }

      {/* Hint */}
      {showHint && hint && (
        <span style={{
          fontFamily:  "var(--typo-interface-label-small-family)",
          fontSize:    "var(--typo-interface-label-small-size)",
          fontWeight:  "var(--typo-interface-label-small-weight)",
          lineHeight:  "var(--typo-interface-label-small-line-height)",
          color:       "var(--text-neutral-subtle)",
        }}>{hint}</span>
      )}

      {/* FeedbackCaption */}
      {caption && window.FeedbackCaption && (
        <window.FeedbackCaption
          status={caption.status || "info"}
          text={caption.text || ""}
          showIcon={true}
        />
      )}
    </div>
  );
}

Object.assign(window, { TextInputField });
})();
