/* -- CDS AI Assistant Button ------------------------------------------
 *
 * Circular AI voice entry point for TELUS SmartHome+.
 * Also known as: Jarvis button, AI button, voice button.
 *
 * Visual layers (bottom → top, inside 58×58 circle):
 *  1. Radial gradient   #FFD4F7 (top-right pink) → #ADEDFF (bottom-left blue)
 *  2. Three wave paths, each at merged fillOpacity (~0.85)
 *       Wave A  #7A0BD2  (3.8 s - subtle outer)
 *       Wave B  #6E0BD2  (2.8 s - dominant centre)
 *       Wave C  #3F0BD2  (3.3 s - counter-phase base)
 *  3. 1 px white border ring (--border-width-thin)
 *  4. Radial glow via ::before pseudo-element (opacity-animated, GPU)
 *
 * States:  default - listening
 * Sizes:   default (60 px) only
 *
 * Typography Tokens: none - label-free by design.
 *
 * Props:
 *   state      "default"|"listening"   default "default"
 *   onClick    function
 *   ariaLabel  string                             default "AI Assistant"
 * -------------------------------------------------------------------- */

(function () {
const { useRef } = React;

/* -- SVG Wave Paths (58×58 coordinate space from Figma AiAssistant-1) -- */
const AI_PATHS = {
  waveA: "M13.7539 19.6255C19.6097 15.8569 27.2312 16.3102 32.5996 20.7456L40.2988 27.107C47.6389 33.1712 58.2839 33.0526 65.4873 26.8267C69.0456 23.7511 74.2709 23.5829 78.0195 26.4234L101.76 44.4116L51.3057 112.478L-21.7002 42.4429L13.7539 19.6255Z",
  waveB: "M6.74707 24.8076C10.6383 23.844 14.7569 24.6474 18 27.0039L22.0166 29.9228C29.6661 35.4811 40.1363 35.0388 47.29 28.8555C51.0014 25.6478 56.4506 25.4729 60.3604 28.4355L83.8242 46.2148L33.3701 114.28L-21.3359 31.7617L6.74707 24.8076Z",
  waveC: "M-21.3457 23.9004C-16.2733 23.2317 -11.1243 24.3057 -6.74219 26.9463L1.46387 31.8916C10.912 37.5852 22.7788 37.3984 32.043 31.4102C36.8443 28.3065 43.0075 28.2583 47.8564 31.2871L81.3389 52.2012L20.8916 117.589L-57.6426 28.6856L-21.3457 23.9004Z",
};

/* -- Inject styles once -- */
if (!document.getElementById("cds-ai-styles")) {
  const st = document.createElement("style");
  st.id = "cds-ai-styles";
  st.textContent = `
    @keyframes cds-ai-waveA {
      0%, 100% { transform: translate3d( 0px,  0px, 0); }
      50%       { transform: translate3d(-5px,  3px, 0); }
    }
    @keyframes cds-ai-waveB {
      0%, 100% { transform: translate3d( 0px,  0px, 0); }
      50%       { transform: translate3d(-8px, -9px, 0); }
    }
    @keyframes cds-ai-waveC {
      0%, 100% { transform: translate3d( 0px,  0px, 0); }
      50%       { transform: translate3d(-6px, -4px, 0); }
    }
    @keyframes cds-ai-breathe {
      0%, 100% { transform: scale(1);    }
      50%       { transform: scale(1.05); }
    }
    @keyframes cds-ai-pulse {
      from { box-shadow: 0 0 0 0 rgba(140, 90, 255, 0.45); }
      to   { box-shadow: 0 0 0 28px rgba(140, 90, 255, 0); }
    }

    /* Always present - play-state controls activity */
    .cds-ai-waveA { will-change: transform;
      animation: cds-ai-waveA 3.8s ease-in-out infinite;
      animation-play-state: paused; }
    .cds-ai-waveB { will-change: transform;
      animation: cds-ai-waveB 2.8s ease-in-out 0.7s infinite;
      animation-play-state: paused; }
    .cds-ai-waveC { will-change: transform;
      animation: cds-ai-waveC 3.3s ease-in-out 1.4s infinite;
      animation-play-state: paused; }

    .cds-ai-btn {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      padding: 0;
      cursor: pointer;
      border-radius: var(--radius-full);
      outline: none;
      flex-shrink: 0;
      -webkit-tap-highlight-color: transparent;
      transition: transform 150ms ease, opacity 150ms ease;
      will-change: transform;
      isolation: isolate;
    }
    /* Glow on wrapper - opacity only (GPU composited), fixed inset */
    .cds-ai-wrap {
      position: relative;
      display: inline-flex;
      border-radius: var(--radius-full);
    }
    .cds-ai-wrap::before {
      content: '';
      position: absolute;
      inset: -20px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(120,80,240,0.55) 0%, rgba(120,80,240,0) 60%);
      pointer-events: none;
      z-index: -1;
      opacity: 0.5;
      transition: opacity 300ms ease;
      will-change: opacity;
    }
    .cds-ai-wrap.cds-ai-listening::before { opacity: 1; }

    .cds-ai-btn:focus-visible {
      outline: var(--border-width-heavy, 4px) solid var(--border-info);
      outline-offset: 3px;
    }
    .cds-ai-btn:active { transform: scale(0.94); }
    /* Breathe on wrapper so press transform never conflicts */
    .cds-ai-wrap.cds-ai-listening {
      animation: cds-ai-breathe 1.8s ease-in-out 150ms both infinite;
    }

    /* Pulse rings - box-shadow (clipped by overflow:hidden parents) */
    .cds-ai-pulse {
      position: absolute;
      inset: 0;
      border-radius: var(--radius-full);
      background: transparent;
      animation: cds-ai-pulse 1.8s ease-out infinite;
      pointer-events: none;
      z-index: -1;
    }
    .cds-ai-pulse::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: var(--radius-full);
      animation: cds-ai-pulse 1.8s ease-out 0.6s infinite;
    }
  `;
  document.head.appendChild(st);
}

let _uid = 0;

/* -- SVG circle (single clipPath, single draw per wave) -- */
function AiGradientCircle({ uid, size, isListening }) {
  const clipId = uid + "-cl";
  const gradId = uid + "-gr";

  return (
    <svg
      width={size} height={size}
      viewBox="0 0 58 58"
      fill="none"
      aria-hidden="true"
      style={{ display: "block", transform: "translateZ(0)" }}
    >
      <defs>
        <radialGradient id={gradId} cx="0" cy="0" r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(51.1765 5.68628) rotate(133.497) scale(57.6423)">
          <stop stopColor="#FFD4F7" />
          <stop offset="1" stopColor="#ADEDFF" />
        </radialGradient>
        {/* Single circle clip - covers both gradient rect and wave group */}
        <clipPath id={clipId}>
          <circle cx="29" cy="29" r="29" />
        </clipPath>
      </defs>

      <g clipPath={"url(#" + clipId + ")"}>
        {/* Gradient background */}
        <rect width="58" height="58" fill={"url(#" + gradId + ")"} />

        {/* Wave bands - play-state controlled, always at 0,0 when paused */}
        <g className="cds-ai-waveA" style={{ animationPlayState: isListening ? "running" : "paused" }}>
          <path d={AI_PATHS.waveA} fill="#7A0BD2" fillOpacity="0.85" />
        </g>
        <g className="cds-ai-waveB" style={{ animationPlayState: isListening ? "running" : "paused" }}>
          <path d={AI_PATHS.waveB} fill="#6E0BD2" fillOpacity="0.85" />
        </g>
        <g className="cds-ai-waveC" style={{ animationPlayState: isListening ? "running" : "paused" }}>
          <path d={AI_PATHS.waveC} fill="#3F0BD2" fillOpacity="0.86" />
        </g>
      </g>

      {/* Border ring - outside clip for crisp edge */}
      <rect x="0.5" y="0.5" width="57" height="57" rx="28.5"
        fill="none"
        stroke="var(--color-base-white, #ffffff)"
        strokeWidth="var(--border-width-thin, 1)"
      />
    </svg>
  );
}

/* -- AiAssistantButton -- */
function AiAssistantButton({
  state     = "default",
  onClick,
  ariaLabel = "AI Assistant",
  style: externalStyle,
}) {
  const uid         = useRef("ai-" + (++_uid)).current;
  const isListening = state === "listening";
  const circleSize = 60;

  const wrapCls = ["cds-ai-wrap", isListening && "cds-ai-listening"].filter(Boolean).join(" ");
  const cls = "cds-ai-btn";
  const liveLabel = isListening ? ariaLabel + ", listening" : ariaLabel;

  return (
    <div className={wrapCls} style={{ width: circleSize, height: circleSize, display: "inline-flex", ...externalStyle }}>
      <button
        type="button"
        className={cls}
      onClick={onClick}
        aria-label={liveLabel}
        aria-pressed={isListening}
        style={{ width: circleSize, height: circleSize }}
      >
        {isListening && <span className="cds-ai-pulse" aria-hidden="true" />}
        <AiGradientCircle uid={uid} size={circleSize} isListening={isListening} />
      </button>
    </div>
  );
}

Object.assign(window, { AiAssistantButton });
})();
