/* -- CDS App Navigation -----------------------------------------------
 *
 * Bottom navigation bar for top-level app sections of TELUS SmartHome+.
 *
 * Variants:
 *   standard - 4 equal tabs   (Home - Services - Manage - Settings)
 *   ai       - 2 + AI + 2     (AI Assistant button floats above center)
 *
 * Platforms:
 *   ios     - frosted-glass translucent bar, 83 px tall (49 + 34 safe area)
 *   android - solid M3 surface, 80 dp, active-indicator pill
 *
 * Tab icons come from window.CDS_ICON_SVGS (via window.Icon).
 * Active tab uses the Solid variant; inactive tabs use the Line variant.
 * Color is driven by --text-primary (active) and --text-neutral (inactive).
 *
 * Props:
 *   variant     "standard" | "ai"                 - default "standard"
 *   platform    "ios" | "android"                  - default "ios"
 *   activeTab   "home" | "services" | "manage" | "settings"
 *   onTabChange (id) => void
 *   onAiClick   () => void                         - only used in ai variant
 *   width       number  - bar width in px (default 390 = iPhone 14)
 *   className   string
 *
 * Depends on: window.Icon (src/icon-renderer.jsx),
 *             window.AiAssistantButton (src/ai-assistant.jsx) for ai variant.
 * -------------------------------------------------------------------- */

(function () {
const { useEffect, useState } = React;

/* -- Inject styles once -- */
if (!document.getElementById("cds-appnav-styles")) {
  const st = document.createElement("style");
  st.id = "cds-appnav-styles";
  st.textContent = `
    .cds-appnav-tab {
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      transition: opacity 120ms ease-out;
    }
    .cds-appnav-tab:active { opacity: 0.6; }
    .cds-appnav-tab:focus-visible {
      outline: 2px solid var(--border-info, #2978b8);
      outline-offset: 2px;
      border-radius: 4px;
    }

    /* iOS bar */
    .cds-appnav-bar--ios {
      position: relative;
      height: 70px;
      background-color: var(--background-neutral-subtle, #F4F4F7);
      box-shadow: 0 -1px 0 rgba(0,0,0,0.06);
      box-sizing: border-box;
      padding: 7px 0 20px;
      display: flex;
      align-items: flex-start;
    }
    .cds-appnav-tab--ios {
      width: 64px;
      gap: 3px;
      padding-top: 6px;
    }
    .cds-appnav-label--ios {
      /* iOS HIG tab bar label: 10pt SF Pro, native to UIKit. Not a CDS
         typography token - sized to match Apple's platform default so the
         bar reads as the OS chrome it pretends to be. Family resolves to
         SF Pro via --platform-font-default when data-platform="ios". */
      font-size: 10px;
      line-height: 1;
      letter-spacing: 0.05px;
      white-space: nowrap;
      font-family: var(--platform-font-default);
    }

    /* Android bar */
    .cds-appnav-bar--android {
      position: relative;
      height: 80px;
      background-color: var(--background-tabbar, var(--background-app, #ffffff));
      box-shadow: 0 -1px 3px rgba(0,0,0,0.08), 0 -4px 8px rgba(0,0,0,0.04);
      box-sizing: border-box;
      display: flex;
      align-items: flex-start;
    }
    .cds-appnav-tab--android {
      flex: 1;
      gap: 4px;
      padding-top: 12px;
    }
    .cds-appnav-pill {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 32px;
      border-radius: var(--radius-full, 9999px);
      transition: background-color 180ms ease-out;
    }
    .cds-appnav-pill--active {
      background-color: var(--background-primary-subtle, #EDE1F5);
    }
    .cds-appnav-label--android {
      /* Material 3 navigation bar label: 12sp Roboto, native to the M3 spec.
         Not a CDS typography token - sized to match Android's platform
         default so the bar reads as system chrome. Family resolves to Roboto
         via --platform-font-default when data-platform="android". */
      font-size: 12px;
      line-height: 1;
      white-space: nowrap;
      font-family: var(--platform-font-default);
    }

    /* AI button float wrapper - same for both platforms */
    .cds-appnav-ai-slot {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: auto;
    }
    .cds-appnav-ai-slot--ios     { top: -22px; }
    .cds-appnav-ai-slot--android { top: -18px; }
  `;
  document.head.appendChild(st);
}

/* -- Tab definitions -- */
const TABS = [
  { id: "home",     label: "Home",     line: "homeHouseLine",         solid: "homeHouseSolid"         },
  { id: "services", label: "Services", line: "abstractActivityLine",  solid: "abstractActivitySolid"  },
  { id: "manage",   label: "Manage",   line: "homeDeviceGroupLine",   solid: "homeDeviceGroupSolid"   },
  { id: "settings", label: "Settings", line: "objectGearLine",        solid: "objectGearSolid"        },
];
const LEFT_TABS  = TABS.slice(0, 2);
const RIGHT_TABS = TABS.slice(2);

const ACTIVE_COLOR   = "var(--text-primary, #4B286D)";
const INACTIVE_COLOR = "var(--text-neutral, #54595F)";

/* -- iOS tab item -- */
function IosTabItem({ tab, isActive, onClick }) {
  const Icon = window.Icon;
  const color = isActive ? ACTIVE_COLOR : INACTIVE_COLOR;
  return (
    <button
      type="button"
      className="cds-appnav-tab cds-appnav-tab--ios"
      style={{ flex: 1 }}
      onClick={onClick}
      aria-label={tab.label}
      aria-current={isActive ? "page" : undefined}
    >
      {Icon && <Icon name={isActive ? tab.solid : tab.line} size={24} color={color} />}
      <span
        className="cds-appnav-label--ios"
        style={{ color, fontWeight: isActive ? 600 : 400 }}
      >
        {tab.label}
      </span>
    </button>
  );
}

/* -- Android tab item -- */
function AndroidTabItem({ tab, isActive, onClick }) {
  const Icon = window.Icon;
  const color = isActive ? ACTIVE_COLOR : INACTIVE_COLOR;
  return (
    <button
      type="button"
      className="cds-appnav-tab cds-appnav-tab--android"
      onClick={onClick}
      aria-label={tab.label}
      aria-current={isActive ? "page" : undefined}
    >
      <span className={"cds-appnav-pill " + (isActive ? "cds-appnav-pill--active" : "")}>
        {Icon && <Icon name={isActive ? tab.solid : tab.line} size={24} color={color} />}
      </span>
      <span
        className="cds-appnav-label--android"
        style={{ color, fontWeight: isActive ? 700 : 400 }}
      >
        {tab.label}
      </span>
    </button>
  );
}

/* -- AI button slot (shared) --
 * Manages its own listening state - tap toggles it on/off. The user's
 * onClick (if any) still fires; consumers who want a controlled state can
 * pass `aiState` directly to AppNav.
 */
function AiSlot({ platform, onClick, controlledState }) {
  const AI = window.AiAssistantButton;
  const [internalListening, setInternalListening] = useState(false);
  const isControlled = controlledState != null;
  const state = isControlled ? controlledState : (internalListening ? "listening" : "default");

  function handleClick(e) {
    if (!isControlled) setInternalListening(v => !v);
    if (onClick) onClick(e);
  }

  return (
    <div className={"cds-appnav-ai-slot cds-appnav-ai-slot--" + platform}>
      {AI ? (
        <AI state={state} onClick={handleClick} ariaLabel="AI Assistant" />
      ) : (
        /* Fallback placeholder if AiAssistantButton is not loaded */
        <div
          style={{
            width: 60, height: 60, borderRadius: "50%",
            background: "var(--background-primary, #4B286D)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: 12,
          }}
          aria-label="AI Assistant"
        >AI</div>
      )}
    </div>
  );
}

/* -- Bar shells -- */
function StandardBar({ platform, activeTab, onTabChange, width }) {
  const Item = platform === "ios" ? IosTabItem : AndroidTabItem;
  return (
    <div
      className={"cds-appnav-bar--" + platform}
      style={{
        width: typeof width === "number" ? width + "px" : width,
        justifyContent: "space-around",
      }}
    >
      {TABS.map(tab => (
        <Item
          key={tab.id}
          tab={tab}
          isActive={activeTab === tab.id}
          onClick={() => onTabChange && onTabChange(tab.id)}
        />
      ))}
    </div>
  );
}

function AiBar({ platform, activeTab, onTabChange, onAiClick, aiState, width }) {
  const Item = platform === "ios" ? IosTabItem : AndroidTabItem;
  /* Center reservation matches the AI button + breathing room. */
  const centerWidth = platform === "ios" ? 100 : 80;
  return (
    <div
      className={"cds-appnav-bar--" + platform}
      style={{
        width: typeof width === "number" ? width + "px" : width,
        paddingLeft: 16,
        paddingRight: 16,
      }}
    >
      <div style={{ display: "flex", flex: 1, justifyContent: "space-around" }}>
        {LEFT_TABS.map(tab => (
          <Item
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.id}
            onClick={() => onTabChange && onTabChange(tab.id)}
          />
        ))}
      </div>

      {/* Reserve center space for the floating AI button so flanking tabs
          don't drift under it. The button itself is position:absolute. */}
      <div style={{ width: centerWidth, flexShrink: 0 }} aria-hidden="true" />

      <AiSlot platform={platform} onClick={onAiClick} controlledState={aiState} />

      <div style={{ display: "flex", flex: 1, justifyContent: "space-around" }}>
        {RIGHT_TABS.map(tab => (
          <Item
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.id}
            onClick={() => onTabChange && onTabChange(tab.id)}
          />
        ))}
      </div>
    </div>
  );
}

/* -- Public component -- */
function AppNav({
  variant     = "standard",
  platform    = "ios",
  activeTab   = "home",
  onTabChange,
  onAiClick,
  aiState,                  /* optional controlled state: "default" | "listening" */
  width       = 390,
  className   = "",
}) {
  /* Warn once on missing deps */
  useEffect(() => {
    if (!window.Icon) {
      console.warn("AppNav: window.Icon is not loaded. Include src/icons.js + src/icon-renderer.jsx before src/app-nav.jsx.");
    }
    if (variant === "ai" && !window.AiAssistantButton) {
      console.warn('AppNav: variant="ai" requires src/ai-assistant.jsx to be loaded.');
    }
  }, [variant]);

  const Bar = variant === "ai" ? AiBar : StandardBar;

  return (
    <div
      className={className}
      style={{
        display:       "inline-flex",
        flexDirection: "column",
        position:      "relative",
        width:         typeof width === "number" ? width + "px" : width,
        overflow:      variant === "ai" ? "visible" : "hidden",
      }}
    >
      <Bar
        platform={platform}
        activeTab={activeTab}
        onTabChange={onTabChange}
        onAiClick={onAiClick}
        aiState={aiState}
        width={width}
      />
    </div>
  );
}

Object.assign(window, { AppNav });
})();
