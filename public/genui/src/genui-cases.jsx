/* SmartHome+ GenUI Use Cases
 *
 * 6 presentation frames demonstrating adaptive home-screen states.
 * Each case = phone (left) + description panel (right) + nav (bottom).
 */
(function () {
  const { useState, useEffect, useCallback } = React;
  const { IOSStatusBar, HomeScreen } = window;

  /* ── 6 case configurations ───────────────────────────────────────── */

  const CASES = [
    /* Intro — GenUI concept overview --------------------------------- */
    {
      id: "·",
      name: "Intro",
      intro: true,
    },

    /* Interactive — phone + clickable 4-moment timeline -------------- */
    {
      id: "◈",
      name: "Interactive",
      interactive: true,
    },

    /* 00 — Kit on the Way (onboarding) ------------------------------- */
    {
      id: "00",
      name: "Kit on the Way",
      scenario: {
        state: "disarmed",
        property: "Riverside home",
        stateIcon:  "objectPackageSolid",
        stateBadge: "KIT ON THE WAY",
        headline:   "Your kit is almost here.",
        subtitle:   "Est. Tue, May 19 · Canada Post",
        onboardingMode: true,
        ai: {
          tag:  "IN TRANSIT · EST. TOMORROW",
          icon: "objectPackageSolid",
          body: "Arriving Tue, May 19 by end of day.",
          bodyMeta: "Canada Post · 7012 4231 8865 4421",
          primary:   "Track delivery",
          secondary: "Not now",
        },
        softLabel: null,
        showChips: false,
        chips: [],
        showFavorites: false,
        showCameras: false,
        showToday: false,
        unread: 1,
      },
      description: {
        signals: [
          "Kit purchased · shipment in transit",
          "No devices installed yet · panel offline",
          "Estimated delivery: Tue, May 19",
          "User onboarding state — first-time setup",
        ],
        adapted: [
          "Home state sections replaced with onboarding content",
          "Delivery card surfaces tracking + carrier info first",
          "Setup progress stepper shows where the user is in the journey",
          "AI surfaces installation help — not security insights",
          "Chips focus on pre-arrival tasks (tracking, prep, kit contents)",
        ],
        principle: {
          name: "Zero to one",
          body: "The UI adapts to a user who has no devices yet, guiding them toward first use without showing empty states.",
        },
      },
    },

    /* 01 — Home & Settled ------------------------------------------- */
    {
      id: "01",
      name: "Home & Settled",
      scenario: {
        state: "disarmed",
        greeting: "Good evening, Alex.",
        property: "Riverside home",
        /* hero card (v9) */
        stateIcon:  "homeSecurityArmSolid",
        stateBadge: "ALL CLEAR",
        headline:   "Home is secure.",
        subtitle:   "2/2 locked · 3 cameras live · No motion · 21°",
        heroAccent: "green",
        ai: false,
        softLabel: "Start a routine",
        chips: [
          { id: "movie", label: "Movie Night", sparkle: true },
          { id: "good",  label: "Good Night",  sparkle: true },
          { id: "away",  label: "Away Mode",   sparkle: true },
        ],
      },
      description: {
        signals: [
          "6:48pm · Tuesday",
          "Lucas home · Alex home",
          "All sensors clear · Panel disarmed",
          "No anomalies detected",
        ],
        adapted: [
          "AI Assistant card is not shown — no proactive insight is relevant right now",
          "Arm buttons are present but visually secondary — nobody is leaving",
          "Routine chips surface the most likely evening choices",
          "The screen defaults to “show your home” mode, not “AI talking” mode",
        ],
        principle: {
          name: "Default → Adaptive",
          body: "This is the baseline. The UI is calm because the context is calm. Adaptation only happens when there is a reason.",
        },
      },
    },

    /* 02 — Departure Detected --------------------------------------- */
    {
      id: "02",
      name: "Departure Detected",
      scenario: {
        state: "disarmed",
        heroTint: "disarmed-deep",
        greeting: "Have a good day, Lucas.",
        property: "Riverside home",
        stateIcon:  "homeAwaySolid",
        stateBadge: "LEAVING SOON",
        headline:   "Ready to arm.",
        subtitle:   "Lucas is leaving · 8:27am · 2/2 locked",
        heroAccent: "green",
        ai: {
          tag:  "for you now",
          body: "Arm before you leave? You usually arm by 8:30am.",
          primary:   "Arm Away",
          secondary: "Not now",
        },
        softLabel: "or start a routine",
        chips: [
          { id: "morning", label: "Morning mode", sparkle: true },
          { id: "leave",   label: "Leave quietly", sparkle: true },
          { id: "stay",    label: "Arm Stay",     sparkle: true },
        ],
      },
      description: {
        signals: [
          "8:27am · Tuesday · Weekday pattern",
          "Lucas location: near front door",
          "Pattern: arms Away at 8:30am, 4 of last 5 weekdays",
          "Sarah still home",
        ],
        adapted: [
          "Hero subtitle shifts to reflect transition context",
          "“Arm Away” button becomes the most visually prominent action",
          "AI Assistant card surfaces a direct, time-sensitive suggestion",
          "Routine chips shift to departure-relevant options",
        ],
        principle: {
          name: "Context-driven",
          body: "The UI didn't wait for Lucas to navigate to security settings. It read the context and brought the right action forward.",
        },
      },
    },

    /* 03 — Armed Away ----------------------------------------------- */
    {
      id: "03",
      name: "Armed Away",
      scenario: {
        state: "armed-away",
        greeting: "Away mode active.",
        property: "Riverside home",
        stateIcon:  "actionLockSolid",
        stateBadge: "ARMED AWAY",
        headline:   "All zones clear.",
        subtitle:   "Armed by Lucas · 3h ago · 3 cameras live",
        heroAccent: "blue",
        heroDisarm: true,
        heroDetails: false,
        ai: {
          tag:  "for you now",
          body: "Garage sensor triggered 3× this month while armed. Bypass that zone next time?",
          primary:   "Set bypass",
          secondary: "Not now",
        },
        softLabel: null,
        showChips: true,
        chips: [
          { id: "view",  label: "View security", sparkle: true },
          { id: "night", label: "Arm Night instead", sparkle: true },
        ],
        showFavorites: false,
        unread: 3,
      },
      description: {
        signals: [
          "11:44am · Nobody home",
          "Panel state: Armed Away since 8:31am",
          "Garage sensor: 3 prior triggers in Armed Away this month",
          "All other zones: clear",
        ],
        adapted: [
          "Hero shifts to navy gradient — security state is the primary context",
          "Lock icon replaces checkmark — state is armed, not just secure",
          "AI surfaces a bypass suggestion based on a recurring pattern",
          "Favorites hidden — no one home to control devices",
          "Cameras elevated — the most useful content when away",
        ],
        principle: {
          name: "AI as a layer",
          body: "The AI is not interrupting — it observed a pattern over time and surfaces a relevant action at exactly the right moment.",
        },
      },
    },

    /* 04 — Arriving Home -------------------------------------------- */
    {
      id: "04",
      name: "Arriving Home",
      scenario: {
        state: "disarmed",
        heroTint: "disarmed-subtle",
        greeting: "Welcome home, Lucas.",
        property: "Riverside home",
        stateIcon:  "homeAtHomeRightSolid",
        stateBadge: "WELCOME BACK",
        headline:   "Good to have you back.",
        subtitle:   "Disarmed · 3:44pm · Lucas home · 21°",
        heroAccent: "green",
        ai: {
          tag:  "for you now",
          body: "Automate “Welcome Home” at 3:45pm every day? You've arrived 5 days in a row.",
          primary:   "Set up",
          secondary: "Not now",
        },
        softLabel: "or start a routine",
        chips: [
          { id: "welcome", label: "Welcome Home", sparkle: true },
          { id: "warm",    label: "Warm it up",   sparkle: true },
          { id: "relax",   label: "Relax mode",   sparkle: true },
        ],
        events: [
          { id: "e1", tone: "success",  text: "Lucas arrived · Front door disarmed", when: "3:44 pm", where: "Front door" },
          { id: "e2", tone: "neutral",  text: "Auto-disarm by geofence",             when: "3:44 pm", where: "Panel" },
          { id: "e3", tone: "neutral",  text: "Thermostat set to 21°",               when: "1 h ago", where: "Hall" },
        ],
      },
      description: {
        signals: [
          "3:44pm · Tuesday",
          "Lucas location: home (arrival detected)",
          "Panel: auto-disarmed",
          "Pattern: 5 consecutive arrivals at the same time",
        ],
        adapted: [
          "Hero greeting shifts to welcome tone",
          "Headline reflects arrival, not security status",
          "Arm buttons removed — arriving, not departing",
          "AI surfaces an automation opportunity based on a detected pattern",
          "Routine chips shift to arrival / evening options",
          "Today at home highlights the arrival event",
        ],
        principle: {
          name: "Show + control",
          body: "The AI noticed a pattern and offers to automate it — but only suggests, never acts without permission.",
        },
      },
    },

    /* 05 — Good Night ----------------------------------------------- */
    {
      id: "05",
      name: "Good Night",
      scenario: {
        state: "disarmed",
        heroTint: "disarmed-night",
        greeting: "10:32pm",
        property: "Riverside home",
        stateIcon:  "timeNightSolid",
        stateBadge: "10:32 PM",
        headline:   "Good night, Lucas.",
        subtitle:   "2/2 locked · Lights off · Last one up",
        heroAccent: "blue",
        ai: {
          tag:  "for you now",
          tone: "night",
          body: "Arm Night mode before bed? You usually do around 10:30pm.",
          primary:   "Arm Night",
          secondary: "Not now",
        },
        softLabel: "or start a routine",
        chips: [
          { id: "good",  label: "Good Night", sparkle: true },
          { id: "night", label: "Arm Night",  sparkle: true },
          { id: "read",  label: "Read mode",  sparkle: true },
        ],
      },
      description: {
        signals: [
          "10:32pm · Tuesday",
          "Lucas awake · Sarah sleeping (inferred from no activity)",
          "Historical pattern: arms Night between 10:15–10:45pm on weekdays",
          "All doors locked",
        ],
        adapted: [
          "Greeting and subtitle shift to nighttime tone",
          "“Night” becomes the primary arm action — “Away” is deprioritized",
          "AI surfaces a bedtime arming suggestion based on a behavioral pattern",
          "Routine chips offer nighttime-relevant options",
        ],
        principle: {
          name: "Default → Adaptive",
          body: "Time of day + behavioral pattern + occupancy signal combine to produce a specific, relevant adaptation. Three context signals converge into one coherent suggestion.",
        },
      },
    },

    /* 06 — Proactive Insight ---------------------------------------- */
    {
      id: "06",
      name: "Proactive Insight",
      scenario: {
        state: "disarmed",
        greeting: "Good morning, Alex.",
        property: "Riverside home",
        stateIcon:  "homeSecurityArmSolid",
        stateBadge: "ALL CLEAR",
        headline:   "Home is secure.",
        subtitle:   "2/2 locked · 3 cameras live · No motion · 21°",
        heroAccent: "green",
        ai: {
          tag:  "for you now",
          tone: "energy",
          body: "Your heater has been on since 7am. Turn it off tonight and save $3.40?",
          primary:   "Turn off at 9pm",
          secondary: "Not now",
        },
        softLabel: "or start a routine",
        chips: [
          { id: "morning", label: "Morning mode",  sparkle: true },
          { id: "wfh",     label: "Work from home",sparkle: true },
          { id: "away",    label: "Away Mode",     sparkle: true },
        ],
      },
      description: {
        signals: [
          "9:15am · Wednesday",
          "Alex home · working-from-home pattern detected",
          "Heater active for 2h 15min continuously",
          "No security events · no departures imminent",
        ],
        adapted: [
          "No security-related adaptation — everything is calm",
          "AI surfaces an energy insight with a concrete, actionable saving",
          "The screen stays in its default visual state — no hero color change",
          "The AI card carries the only adaptation: a background observation made useful",
        ],
        principle: {
          name: "AI as a layer",
          body: "The AI is not a feature you open. It observes continuously and speaks only when it has something genuinely useful to say — even when everything else is normal.",
        },
      },
    },

    /* 07 — Intrusion Alert ------------------------------------------ */
    {
      id: "07",
      name: "Intrusion Alert",
      scenario: {
        state: "disarmed",
        property: "Riverside home",
        stateIcon:  "abstractDangerSolid",
        stateBadge: "ALARM TRIGGERED",
        stateTone:  "alarm",
        headline:   "Intrusion detected.",
        subtitle:   "Front door sensor · Motion · Just now",
        heroAccent: "red",
        alarmMode: true,
        alarmCamera: "assets/cameras/garage-intruder.png",
        alarmCameraName: "Front entrance",
        alarmTime: "2:33 am",
        safeWord: "MAPLE",
        monitoringAgent: "Agent reviewing",
        monitoringTimer: "00:30",
        emergencyCircle: [
          { id: "c1", name: "Maria Rocha", role: "Spouse",   status: "Calling now", tone: "active" },
          { id: "c2", name: "João Rocha",  role: "Brother",  status: "Queued",      tone: "muted"  },
          { id: "c3", name: "Ana Rocha",   role: "Mother",   status: "Queued",      tone: "muted"  },
        ],
        ai: {
          tag:  "for you now",
          tone: "emergency",
          noDismiss: true,
          body: "Motion detected at front door. Nobody authorized is nearby.",
          primary:   "Call 911",
          secondary: "Disarm",
        },
        softLabel: null,
        showChips: false,
        showFavorites: false,
        showCameras: false,
        showToday: false,
        unread: 8,
      },
      description: {
        signals: [
          "Armed Away active · front door motion sensor triggered",
          "2:33 AM · no authorized user detected nearby",
          "TELUS Monitoring engaged · agent on call",
          "Emergency circle: 3 contacts queued",
        ],
        adapted: [
          "Cameras elevated above AI card — see what's happening first",
          "Monitoring timeline surfaces response status · user knows where they are in the process",
          "Safe word + cancel button replace routine chips",
          "Emergency circle shows notification progress per contact",
          "Favorites hidden — device control irrelevant during alarm",
        ],
        principle: {
          name: "Urgency as layout",
          body: "The screen reorganizes entirely around a single priority: help the user understand what is happening and what is being done about it, in the right order.",
        },
      },
    },
  ];

  /* ── Intro slide (Executive) ──────────────────────────────────────
   *   4 tabs scrollable as a single artboard:
   *     1. How it works   2. 4 Moments   3. Home Zones   4. Principles
   */

  const LAYERS = [
    { num: 1, type: "SDUI",       title: "Foundation Structure",   tags: ["Fixed zones", "Design System", "Stable navigation"],
      bg: "var(--background-neutral-subtle, #f4f4f7)", overlineColor: "var(--text-neutral-subtle)",
      border: "var(--border-neutral-subtle, #ECECEC)" },
    { num: 2, type: "INPUT",      title: "Signal Collection",      tags: ["Location", "Time", "Device state", "Activity", "Preferences", "History"],
      bg: "var(--background-primary-subtle, #f8f0ff)", overlineColor: "var(--text-primary)",
      border: "var(--border-primary-subtle, #dfc9f3)" },
    { num: 3, type: "AI",         title: "Orchestration Engine",   tags: ["Analyze", "Predict", "Prioritize", "Guardrails", "Context detection"],
      bg: "var(--background-primary-subtle, #f8f0ff)", overlineColor: "var(--text-primary)",
      border: "var(--border-primary-subtle, #dfc9f3)" },
    { num: 4, type: "COMPONENTS", title: "Component Registry",     tags: ["Hero Card", "Security widget", "Energy insight", "Routine tile", "Device status", "Alert banner"],
      bg: "var(--background-success-subtle, #e3f6d1)", overlineColor: "var(--text-success)",
      border: "var(--border-success-subtle, #bfe797)" },
    { num: 5, type: "RENDERING",  title: "Adaptive Home Screen",   tags: ["Context-filled zones", "User override"],
      bg: "var(--background-success-subtle, #e3f6d1)", overlineColor: "var(--text-success)",
      border: "var(--border-success-subtle, #bfe797)" },
    { num: 6, type: "AI LAYER",   title: "AI Assistant · Midi Bar", tags: ["Persistent on all screens", "Voice + text", "Not a feature — a layer"],
      bg: "var(--background-primary-subtle, #f8f0ff)", overlineColor: "var(--text-primary)",
      border: "var(--border-primary-subtle, #dfc9f3)" },
  ];

  const PIPELINE = [
    { icon: "homeMotionSensorSolid", label: "Input signals",       tags: ["Location", "Time", "Device state", "Activity", "Preferences", "History"] },
    { icon: "objectStarsSolid",      label: "AI processing",       tags: ["Understand", "Decide", "Analyze", "Predict", "Prioritize"] },
    { icon: "objectMobilePhoneSolid",label: "Adaptive experience", tags: ["Context-filled zones", "Proactive suggestions", "User override"] },
  ];

  const MOMENTS = [
    {
      n: "01", emoji: "🌅", title: "Leaving home", caseId: "02",
      subtitle: "Morning · Motion detected · Leaving",
      borderL: "var(--color-global-amber-500, #906308)",
      bg: "var(--color-global-amber-50, #fff4df)",
      dotColor: "var(--color-global-amber-700, #563b03)",
      titleColor: "var(--color-global-amber-800, #372502)",
      from: "User manually opens security and arms",
      to:   "UI detects departure pattern and surfaces arm action",
      bullets: [
        "Hero shows \"Arm Away\"",
        "Subtitle shifts to departure context",
        "Quick actions: Leave home routine",
        "AI: \"You usually arm by 8:30am\"",
      ],
    },
    {
      n: "02", emoji: "🏡", title: "Away from home", caseId: "03",
      subtitle: "Afternoon · Armed Away · Nobody home",
      borderL: "var(--color-primary-pure, #4b286d)",
      bg: "var(--background-primary-subtle, #f8f0ff)",
      dotColor: "var(--text-primary)",
      titleColor: "var(--text-primary)",
      from: "User opens app to check cameras manually",
      to:   "Cameras are already front and center",
      bullets: [
        "Hero: peace of mind card",
        "Cameras elevated",
        "AI: bypass suggestion based on sensor pattern",
        "Quick actions: Disarm · Check camera",
      ],
    },
    {
      n: "03", emoji: "🌙", title: "Night at home", caseId: "05",
      subtitle: "Night · Routines active · Energy saving",
      borderL: "var(--color-success-pure, #00ab0b)",
      bg: "var(--background-success-subtle, #e3f6d1)",
      dotColor: "var(--color-success-dark, #005700)",
      titleColor: "var(--color-success-dark, #005700)",
      from: "User doesn't notice the heater is on",
      to:   "AI surfaces a specific saving opportunity",
      bullets: [
        "Hero shifts to energy insight",
        "AI: \"Turn off heater, save $3.40\"",
        "Routine chips: Good Night · Arm Night",
      ],
    },
    {
      n: "04", emoji: "🚨", title: "Critical alert", caseId: "07",
      subtitle: "Any time · Security event",
      borderL: "var(--color-error-pure, #d80b25)",
      bg: "var(--background-error-subtle, #ffeff1)",
      dotColor: "var(--color-error-dark, #810414)",
      titleColor: "var(--color-error-dark, #810414)",
      from: "User gets a push notification and opens the app",
      to:   "The screen is already in emergency mode",
      bullets: [
        "Cameras full-width",
        "Monitoring timeline visible",
        "Emergency circle notifying",
        "False alarm button prominent",
      ],
    },
  ];

  const METRICS = [
    { num: "60%", desc: "of new subscribers never connect a second device after setup", src: "J.D. Power Smart Home Experience Study" },
    { num: "2×",  desc: "more likely to expand smart home ecosystem with contextual UX", src: "Forrester Research, CX Index 2024" },
    { num: "35%", desc: "fewer support calls when UI surfaces the right action at the right time", src: "Gartner, Digital Experience Platforms 2024" },
  ];

  const ZONES = [
    { name: "Header / Greeting",       desc: "Greeting + time + notifications",                          tag: "FIXED",    tagBg: "var(--background-neutral-subtle, #f4f4f7)", tagFg: "var(--text-neutral)" },
    { name: "Hero Zone",               desc: "The most relevant thing right now. Changes by context.",   tag: "ADAPTIVE", tagBg: "var(--background-primary-subtle, #f8f0ff)", tagFg: "var(--text-primary)" },
    { name: "Quick Actions",           desc: "Most-used routines at the current time",                   tag: "SEMI",     tagBg: "var(--color-global-amber-50, #fff4df)",     tagFg: "var(--color-global-amber-800, #372502)" },
    { name: "Status Grid",             desc: "Relevant or anomalous devices right now",                  tag: "ADAPTIVE", tagBg: "var(--background-primary-subtle, #f8f0ff)", tagFg: "var(--text-primary)" },
    { name: "AI Suggestions",          desc: "Show + Control: suggestions with dismiss/adjust",          tag: "ADAPTIVE", tagBg: "var(--background-primary-subtle, #f8f0ff)", tagFg: "var(--text-primary)" },
    { name: "Nav Bar",                 desc: "Global navigation anchor",                                 tag: "FIXED",    tagBg: "var(--background-neutral-subtle, #f4f4f7)", tagFg: "var(--text-neutral)" },
    { name: "Midi Bar (AI Assistant)", desc: "Voice + text · always accessible · not a screen",          tag: "LAYER",    tagBg: "var(--color-primary-pure, #4b286d)",        tagFg: "#fff", highlight: true },
  ];

  const ZONE_DECISIONS = [
    { dot: "var(--text-primary)",                  name: "Header",         body: "Contextual but structurally fixed. Single access point for notifications.", note: "SDUI defines it, content varies minimally" },
    { dot: "var(--color-error-pure, #d80b25)",     name: "Hero Zone",      body: "The heart of GenUI. The Orchestration Engine decides what goes here — and how much space it takes.", note: "In a critical alert, it occupies 100% of the screen" },
    { dot: "var(--text-info, #003f81)",            name: "Quick Actions",  body: "Fixed structure (N slots). Content adapts by frequency + time of day.", note: "The structure users trust, the content that stays relevant" },
    { dot: "var(--text-success)",                  name: "Status Grid",    body: "Shows only what is relevant or anomalous. Avoids cognitive overload.", note: "Favorite devices + active alerts only" },
    { dot: "var(--color-global-amber-700)",        name: "AI Suggestions", body: "Always with dismiss, snooze, and adjust. Never invasive.", note: "\"Create a routine?\" · \"Save energy tonight\"" },
    { dot: "var(--text-neutral)",                  name: "Nav Bar",        body: "Unchanged. Global anchor of trust.", note: "Always visible" },
    { dot: "var(--text-neutral)",                  name: "Midi Bar",       body: "Not a screen. Not a feature. A persistent AI layer above everything.", note: "Voice, text, tap — always accessible" },
  ];

  const PRINCIPLES = [
    { emoji: "🧱", title: "GenUI builds on SDUI", body: "Zones are defined by SDUI. GenUI decides what fills them — never where they are. Structure is the foundation of trust.", link: "Consistency First" },
    { emoji: "🎭", title: "Modular Roles",        body: "The same component can be a hero or a status item — depending on relevance. The role changes. The block does not.", link: "Your prototype insight" },
    { emoji: "🎮", title: "User in Control",      body: "Every suggestion has dismiss, snooze, and adjust. The AI proposes. The user decides. No exceptions.", link: "Show + Control" },
    { emoji: "🎯", title: "Context-Driven",       body: "4 real moments: leaving, away, night, alert. The screen responds to detected context — not a fixed schedule.", link: "Your 4 prototypes" },
    { emoji: "🌊", title: "AI as a Layer",        body: "The AI assistant is not a button or a tab. It is the Midi Bar: persistent, discreet, present across every screen.", link: "Ahmed + Isa · Midi Bar" },
    { emoji: "🌱", title: "Default → Adaptive",   body: "New users get a clean, clear home screen. Over time, the system learns and adapts. It never starts empty.", link: "Onboarding → recurring use" },
  ];

  const ASKS = [
    { n: "01", title: "Align vision with leadership",     desc: "Confirm GenUI direction aligns with the smart home roadmap and business priorities",      owner: "Product Leadership · Q2 2025" },
    { n: "02", title: "Validate design and tech principles", desc: "Review the 6 GenUI core principles with design system and platform teams",            owner: "Design + Engineering · Q2 2025" },
    { n: "03", title: "Define 2–3 priority use cases",    desc: "Select high-friction moments for the MVP: onboarding, device setup, routine creation",   owner: "Product + UX · Q3 2025" },
    { n: "04", title: "Build and test MVP",               desc: "Prototype the first GenUI-powered experience and run user testing with real customers",  owner: "Engineering + Design · Q3–Q4 2025" },
  ];

  /* ── Reusable section header ────────────────────────────────────── */
  function SectionLead({ heading, sub, anchor }) {
    return (
      <div ref={anchor} style={{ paddingTop: 16 }}>
        <h2 style={{
          margin: 0,
          fontFamily: "var(--typo-heading-large-bold-family)",
          fontSize: 36, fontWeight: 700, letterSpacing: "-0.02em",
          color: "var(--text-neutral-bolder)",
          whiteSpace: "pre-line",
        }}>{heading}</h2>
        {sub && (
          <div style={{
            marginTop: 12,
            fontFamily: "var(--typo-body-large-regular-family)",
            fontSize: 15, lineHeight: 1.6,
            color: "var(--text-neutral)",
            maxWidth: 720,
          }}>{sub}</div>
        )}
      </div>
    );
  }

  function Pill({ children, bg, fg }) {
    return (
      <span style={{
        display: "inline-block",
        padding: "8px 16px",
        background: bg || "var(--background-primary-subtle, #f8f0ff)",
        color: fg || "var(--text-primary)",
        borderRadius: "var(--radius-full)",
        fontFamily: "var(--platform-font-default, var(--platform-font))",
        fontSize: 13, fontWeight: 700,
      }}>{children}</span>
    );
  }

  function IntroSlide() {
    const [activeTab, setActiveTab] = useState("how");
    const tabs = [
      { id: "how",        label: "How it works" },
      { id: "moments",    label: "4 Moments" },
      { id: "timeline",   label: "Day Timeline" },
      { id: "zones",      label: "Home Zones" },
      { id: "principles", label: "Principles" },
    ];
    const refs = {
      how:        React.useRef(null),
      moments:    React.useRef(null),
      timeline:   React.useRef(null),
      zones:      React.useRef(null),
      principles: React.useRef(null),
    };
    function go(id) {
      setActiveTab(id);
      const el = refs[id].current;
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    return (
      <div style={{
        position: "absolute", inset: 0,
        overflowY: "auto",
        background: "var(--background-app, #fff)",
        color: "var(--text-neutral-bolder)",
        boxSizing: "border-box",
      }}>
        {/* Sticky tab bar */}
        <div style={{
          position: "sticky", top: 0, zIndex: 20,
          padding: "20px 56px 16px",
          background: "var(--background-app, #fff)",
          borderBottom: "1px solid var(--border-neutral-subtle, #ECECEC)",
        }}>
          <div style={{ display: "flex", gap: 8 }}>
            {tabs.map((t) => {
              const isActive = activeTab === t.id;
              return (
                <button key={t.id} onClick={() => go(t.id)} style={{
                  padding: "9px 18px",
                  background: isActive ? "var(--color-primary-pure, #4b286d)" : "var(--background-neutral-subtle, #f4f4f7)",
                  color: isActive ? "#fff" : "var(--text-neutral)",
                  border: "none",
                  borderRadius: "var(--radius-full)",
                  fontFamily: "var(--platform-font-default, var(--platform-font))",
                  fontSize: 13, fontWeight: 600,
                  cursor: "pointer",
                }}>{t.label}</button>
              );
            })}
          </div>
        </div>

        <div style={{ padding: "32px 56px 96px", display: "flex", flexDirection: "column", gap: 80 }}>

          {/* ─── TAB 1: How it works ─── */}
          <section ref={refs.how}>
            <div style={{
              fontSize: 11, fontWeight: 800,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "var(--text-neutral-subtle)",
              marginBottom: 8,
            }}>GenUI · Concept</div>
            <h1 style={{
              margin: 0,
              fontFamily: "var(--typo-heading-xlarge-bold-family, var(--typo-heading-large-bold-family))",
              fontSize: 56, fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.05,
              color: "var(--text-neutral-bolder)",
              whiteSpace: "pre-line",
            }}>{"Same app.\nDifferent screen.\nEvery time."}</h1>

            <div style={{
              marginTop: 18,
              fontFamily: "var(--typo-body-large-regular-family)",
              fontSize: 15, lineHeight: 1.6,
              color: "var(--text-neutral, #2b2b2b)",
              maxWidth: 720,
            }}>
              GenUI is not AI that generates UI from scratch. It is the ability to dynamically adapt the interface using structured building blocks — based on context, behavior, and intent — while preserving consistency and control.
            </div>

            <div style={{
              height: 1, margin: "24px 0 16px",
              background: "var(--border-neutral-subtle, #ECECEC)",
            }}/>

            <Pill>Shift from configuration → assistance</Pill>

            {/* FROM → TO compare */}
            <div style={{
              marginTop: 24,
              display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16,
              alignItems: "stretch",
            }}>
              <div style={{
                padding: "20px 22px",
                background: "var(--background-neutral-subtle, #f4f4f7)",
                borderRadius: "var(--radius-large)",
              }}>
                <div style={{
                  fontSize: 10, fontWeight: 800,
                  letterSpacing: "0.16em", textTransform: "uppercase",
                  color: "var(--text-neutral-subtle)",
                }}>Static UI</div>
                <div style={{
                  marginTop: 10,
                  fontSize: 14, lineHeight: 1.5,
                  color: "var(--text-neutral)",
                }}>Same layout for everyone, every time. No awareness of context, behavior, or intent.</div>
              </div>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--text-primary)",
                fontSize: 36, fontWeight: 700,
              }} aria-hidden="true">→</div>
              <div style={{
                padding: "20px 22px",
                background: "var(--background-primary-subtle, #f8f0ff)",
                borderRadius: "var(--radius-large)",
              }}>
                <div style={{
                  fontSize: 10, fontWeight: 800,
                  letterSpacing: "0.16em", textTransform: "uppercase",
                  color: "var(--text-primary)",
                }}>GenUI</div>
                <div style={{
                  marginTop: 10,
                  fontFamily: "var(--typo-body-medium-bold-family)",
                  fontSize: 14, fontWeight: 700, lineHeight: 1.5,
                  color: "var(--text-neutral-bolder)",
                }}>Fixed structure. Dynamic content. The zones define trust. The AI defines relevance.</div>
              </div>
            </div>

            {/* Pipeline */}
            <div style={{ marginTop: 40, display: "flex", alignItems: "stretch", gap: 12 }}>
              {PIPELINE.map((P, i, arr) => (
                <React.Fragment key={i}>
                  <div style={{
                    flex: 1,
                    padding: "20px 18px",
                    background: "var(--background-app, #fff)",
                    border: "1px solid var(--border-neutral-subtle, #ECECEC)",
                    borderRadius: "var(--radius-large)",
                  }}>
                    {window.Icon ? (
                      <window.Icon name={P.icon} size={24} color="var(--icon-primary, #4b286d)"/>
                    ) : null}
                    <div style={{
                      marginTop: 10,
                      fontFamily: "var(--typo-body-medium-bold-family)",
                      fontSize: 15, fontWeight: 700,
                      color: "var(--text-neutral-bolder)",
                    }}>{P.label}</div>
                    <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {P.tags.map((t, j) => (
                        <span key={j} style={{
                          padding: "4px 10px",
                          background: "var(--background-neutral-subtle, #f4f4f7)",
                          color: "var(--text-neutral)",
                          borderRadius: "var(--radius-full)",
                          fontSize: 11, fontWeight: 600,
                        }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{
                      display: "flex", alignItems: "center",
                      color: "var(--text-primary)",
                      fontSize: 24, fontWeight: 700,
                    }} aria-hidden="true">→</div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Layers stack — full width below */}
            <div style={{
              marginTop: 40,
              fontFamily: "var(--platform-font-default, var(--platform-font))",
              fontSize: 11, fontWeight: 800,
              letterSpacing: "0.16em", textTransform: "uppercase",
              color: "var(--text-neutral-subtle)",
              marginBottom: 14,
            }}>System architecture</div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 12,
            }}>
              {LAYERS.map((L) => (
                <div key={L.num} style={{
                  padding: "16px 18px",
                  background: L.bg,
                  border: "1px solid " + L.border,
                  borderRadius: "var(--radius-large)",
                }}>
                  <div style={{
                    fontSize: 10, fontWeight: 800,
                    letterSpacing: "0.16em", textTransform: "uppercase",
                    color: L.overlineColor,
                  }}>Layer {L.num} · {L.type}</div>
                  <div style={{
                    marginTop: 4,
                    fontFamily: "var(--typo-heading-medium-bold-family)",
                    fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em",
                    color: "var(--text-neutral-bolder)",
                  }}>{L.title}</div>
                  <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {L.tags.map((t, j) => (
                      <span key={j} style={{
                        padding: "4px 10px",
                        background: "rgba(255,255,255,0.7)",
                        border: "1px solid rgba(0,0,0,0.06)",
                        borderRadius: "var(--radius-full)",
                        fontSize: 11, fontWeight: 600,
                        color: "var(--text-neutral)",
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ─── TAB 2: 4 Moments ─── */}
          <section ref={refs.moments}>
            <SectionLead
              heading={"The UI doesn't wait to be configured.\nIt reads the room."}
              sub="4 moments where context changes everything. Same home. Same app. Completely different screen."
            />

            <div style={{
              marginTop: 28,
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16,
            }}>
              {MOMENTS.map((M, i) => (
                <div key={i} style={{
                  padding: "20px 22px",
                  background: M.bg,
                  borderRadius: "var(--radius-large)",
                  borderLeft: "4px solid " + M.borderL,
                }}>
                  <div style={{
                    fontSize: 10, fontWeight: 800,
                    letterSpacing: "0.16em", textTransform: "uppercase",
                    color: M.dotColor,
                  }}>Moment {M.n}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 6 }}>
                    <span style={{ fontSize: 22, lineHeight: 1 }}>{M.emoji}</span>
                    <div style={{
                      fontFamily: "var(--typo-heading-medium-bold-family)",
                      fontSize: 20, fontWeight: 700,
                      color: M.titleColor,
                    }}>{M.title}</div>
                  </div>
                  <div style={{
                    marginTop: 2, fontSize: 12,
                    color: "var(--text-neutral-subtle)",
                  }}>{M.subtitle}</div>

                  <div style={{
                    marginTop: 14,
                    padding: "10px 12px",
                    background: "rgba(255,255,255,0.65)",
                    borderRadius: "var(--radius-medium)",
                  }}>
                    <div style={{
                      fontSize: 10, fontWeight: 800,
                      letterSpacing: "0.14em", textTransform: "uppercase",
                      color: "var(--text-neutral-subtle)",
                    }}>Before GenUI</div>
                    <div style={{
                      fontSize: 13, lineHeight: 1.4,
                      color: "var(--text-neutral)",
                      marginTop: 2,
                    }}>{M.from}</div>
                    <div style={{
                      marginTop: 8,
                      fontSize: 10, fontWeight: 800,
                      letterSpacing: "0.14em", textTransform: "uppercase",
                      color: M.titleColor,
                    }}>With GenUI</div>
                    <div style={{
                      fontFamily: "var(--typo-body-medium-bold-family)",
                      fontSize: 14, fontWeight: 700, lineHeight: 1.4,
                      color: M.titleColor,
                      marginTop: 2,
                    }}>{M.to}</div>
                  </div>

                  <ul style={{
                    margin: "14px 0 0", padding: 0, listStyle: "none",
                    display: "flex", flexDirection: "column", gap: 8,
                  }}>
                    {M.bullets.map((b, j) => (
                      <li key={j} style={{
                        display: "flex", alignItems: "flex-start", gap: 10,
                        fontSize: 13, lineHeight: 1.5,
                        color: "var(--text-neutral, #2b2b2b)",
                      }}>
                        <span style={{
                          width: 6, height: 6, borderRadius: "50%",
                          background: M.dotColor,
                          flexShrink: 0, marginTop: 7,
                        }}/>
                        <span style={{ flex: 1 }}>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

          </section>

          {/* ─── TAB: Day Timeline ─── */}
          <section ref={refs.timeline}>
            <SectionLead
              heading={"One day, one home,\nfour adaptive moments."}
              sub="As the day unfolds, the same screen reshapes itself around what matters — from morning departure to a late-night alert."
            />

            <div style={{ marginTop: 32, display: "flex", flexDirection: "column" }}>
              {MOMENTS.map((M, i, arr) => {
                const isLast = i === arr.length - 1;
                return (
                  <div key={i} style={{
                    display: "grid",
                    gridTemplateColumns: "150px 28px minmax(0, 1fr)",
                    gap: 20,
                    alignItems: "stretch",
                  }}>
                    {/* Left — moment identity */}
                    <div style={{ paddingBottom: isLast ? 0 : 36, textAlign: "right", paddingTop: 2 }}>
                      <div style={{ fontSize: 26, lineHeight: 1, marginBottom: 8 }}>{M.emoji}</div>
                      <div style={{
                        fontSize: 10, fontWeight: 800,
                        letterSpacing: "0.16em", textTransform: "uppercase",
                        color: M.dotColor,
                      }}>Moment {M.n}</div>
                      <div style={{
                        marginTop: 4,
                        fontFamily: "var(--typo-heading-medium-bold-family)",
                        fontSize: 19, fontWeight: 700, letterSpacing: "-0.01em",
                        color: M.titleColor,
                      }}>{M.title}</div>
                      <div style={{
                        marginTop: 4, fontSize: 12, lineHeight: 1.4,
                        color: "var(--text-neutral-subtle)",
                      }}>{M.subtitle}</div>
                    </div>

                    {/* Middle — timeline rail */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <span style={{
                        width: 18, height: 18, borderRadius: "50%",
                        background: M.borderL,
                        boxShadow: `0 0 0 4px ${M.bg}`,
                        flexShrink: 0, marginTop: 4,
                      }}/>
                      {!isLast && (
                        <span style={{
                          flex: 1, width: 2,
                          background: "var(--border-neutral-subtle, #ECECEC)",
                          marginTop: 4,
                        }}/>
                      )}
                    </div>

                    {/* Right — adaptation detail card */}
                    <div style={{ paddingBottom: isLast ? 0 : 36 }}>
                      <div style={{
                        padding: "18px 20px",
                        background: M.bg,
                        borderRadius: "var(--radius-large)",
                        borderLeft: `4px solid ${M.borderL}`,
                      }}>
                        {/* FROM → TO */}
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
                          <span style={{
                            fontSize: 13, lineHeight: 1.4,
                            color: "var(--text-neutral)",
                          }}>{M.from}</span>
                          <span style={{ color: M.titleColor, fontWeight: 700, fontSize: 14 }} aria-hidden="true">→</span>
                          <span style={{
                            fontFamily: "var(--typo-body-medium-bold-family)",
                            fontSize: 13, fontWeight: 700, lineHeight: 1.4,
                            color: M.titleColor,
                          }}>{M.to}</span>
                        </div>

                        {/* bullets */}
                        <ul style={{
                          margin: "12px 0 0", padding: 0, listStyle: "none",
                          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 18px",
                        }}>
                          {M.bullets.map((b, j) => (
                            <li key={j} style={{
                              display: "flex", alignItems: "flex-start", gap: 8,
                              fontSize: 12.5, lineHeight: 1.45,
                              color: "var(--text-neutral, #2b2b2b)",
                            }}>
                              <span style={{
                                width: 5, height: 5, borderRadius: "50%",
                                background: M.dotColor,
                                flexShrink: 0, marginTop: 6,
                              }}/>
                              <span style={{ flex: 1 }}>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ─── TAB 3: Home Zones ─── */}
          <section ref={refs.zones}>
            <SectionLead
              heading={"Without structure,\nadaptation becomes chaos."}
              sub="GenUI builds on top of SDUI — not replaces it. The zones are always in the same place. What goes inside them changes."
            />

            <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.2fr)", gap: 32 }}>
              {/* Zone list */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {ZONES.map((z, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 14px",
                    background: z.highlight ? z.tagBg : "transparent",
                    borderRadius: "var(--radius-medium)",
                    border: z.highlight ? "none" : "1px solid var(--border-neutral-subtle, #ECECEC)",
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: "var(--typo-body-medium-bold-family)",
                        fontSize: 14, fontWeight: 700,
                        color: z.highlight ? "#fff" : "var(--text-neutral-bolder)",
                      }}>{z.name}</div>
                      <div style={{
                        fontSize: 12, marginTop: 2,
                        color: z.highlight ? "rgba(255,255,255,0.78)" : "var(--text-neutral-subtle)",
                      }}>{z.desc}</div>
                    </div>
                    <span style={{
                      padding: "3px 9px",
                      background: z.highlight ? "rgba(255,255,255,0.18)" : z.tagBg,
                      color: z.highlight ? "#fff" : z.tagFg,
                      borderRadius: "var(--radius-full)",
                      fontSize: 10, fontWeight: 800,
                      letterSpacing: "0.10em", textTransform: "uppercase",
                      flexShrink: 0,
                    }}>{z.tag}</span>
                  </div>
                ))}
              </div>
              {/* Decisions */}
              <div>
                <div style={{
                  fontFamily: "var(--typo-body-medium-bold-family)",
                  fontSize: 14, fontWeight: 700,
                  color: "var(--text-neutral-bolder)",
                  marginBottom: 12,
                }}>Design decisions by zone</div>
                <ol style={{
                  listStyle: "none", margin: 0, padding: 0,
                  display: "flex", flexDirection: "column", gap: 14,
                }}>
                  {ZONE_DECISIONS.map((d, i) => (
                    <li key={i} style={{
                      display: "flex", alignItems: "flex-start", gap: 12,
                      fontSize: 13, lineHeight: 1.5,
                      color: "var(--text-neutral, #2b2b2b)",
                    }}>
                      <span style={{
                        width: 12, height: 12, borderRadius: "50%",
                        background: d.dot,
                        marginTop: 5, flexShrink: 0,
                      }}/>
                      <div style={{ flex: 1 }}>
                        <strong style={{ color: "var(--text-neutral-bolder)" }}>{d.name}:</strong>{" "}
                        {d.body}{" "}
                        <span style={{ color: "var(--text-neutral-subtle)" }}>→ {d.note}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div style={{ marginTop: 28 }}>
              <Pill>The component doesn't move. Its role does.</Pill>
            </div>
          </section>

          {/* ─── TAB 4: Principles ─── */}
          <section ref={refs.principles}>
            <SectionLead
              heading={"AI assists.\nUsers decide.\nAlways."}
              sub="GenUI is not a black box. These six principles define how adaptation happens — and where it stops."
            />

            <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {PRINCIPLES.map((P, i) => (
                <div key={i} style={{
                  padding: "20px 20px",
                  background: "var(--background-app, #fff)",
                  border: "1px solid var(--border-neutral-subtle, #ECECEC)",
                  borderRadius: "var(--radius-large)",
                  display: "flex", flexDirection: "column",
                }}>
                  <div style={{ fontSize: 24, lineHeight: 1, marginBottom: 10 }}>{P.emoji}</div>
                  <div style={{
                    fontFamily: "var(--typo-heading-medium-bold-family)",
                    fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em",
                    color: "var(--text-primary)",
                  }}>{P.title}</div>
                  <div style={{
                    marginTop: 8, fontSize: 13, lineHeight: 1.5,
                    color: "var(--text-neutral, #2b2b2b)",
                    flex: 1,
                  }}>{P.body}</div>
                  <div style={{
                    marginTop: 12, fontSize: 11, fontWeight: 700,
                    color: "var(--text-primary)",
                  }}>→ {P.link}</div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    );
  }

  /* ── Interactive Moments (phone + clickable timeline) ───────────── */

  function InteractiveMoments() {
    const [activeMoment, setActiveMoment] = useState(0);
    const moment = MOMENTS[activeMoment];
    const sc = (CASES.find((c) => c.id === moment.caseId) || {}).scenario || {};

    return (
      <div style={{ position: "absolute", inset: 0, display: "flex" }}>
        {/* Left — phone */}
        <div style={{
          flex: "0 0 52%",
          position: "relative",
          background:
            "radial-gradient(60% 50% at 30% 20%, var(--color-primary-lighter, #efe6f6) 0%, transparent 60%)," +
            "var(--background-neutral-subtle, #f4f4f6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "60px 48px 132px",
          boxSizing: "border-box",
        }}>
          <div style={{
            transform: "scale(0.80)", transformOrigin: "center center",
            transition: "opacity 320ms ease",
          }}>
            <Phone key={moment.caseId} scenario={sc} label={`${moment.n} ${moment.title}`}/>
          </div>
        </div>

        {/* Right — clickable timeline */}
        <div style={{
          flex: "1 1 auto",
          position: "relative",
          paddingBottom: 72,
          display: "flex", flexDirection: "column",
          borderLeft: "1px solid var(--border-neutral-subtle, #ECECEC)",
          overflowY: "auto",
        }}>
          <div style={{ padding: "56px 48px 32px" }}>
            <div style={{
              fontSize: 11, fontWeight: 800,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "var(--text-neutral-subtle)",
            }}>GenUI · Interactive</div>
            <h1 style={{
              margin: "8px 0 0",
              fontFamily: "var(--typo-heading-large-bold-family)",
              fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1,
              color: "var(--text-neutral-bolder)",
            }}>A day in four moments</h1>
            <div style={{
              marginTop: 10,
              fontFamily: "var(--typo-body-large-regular-family)",
              fontSize: 14, lineHeight: 1.55,
              color: "var(--text-neutral)",
              maxWidth: 540,
            }}>Tap a moment to see the home screen adapt to that context.</div>

            {/* Timeline */}
            <div style={{ marginTop: 28, display: "flex", flexDirection: "column" }}>
              {MOMENTS.map((M, i, arr) => {
                const isLast = i === arr.length - 1;
                const isActive = i === activeMoment;
                return (
                  <div key={i} style={{
                    display: "grid",
                    gridTemplateColumns: "24px minmax(0, 1fr)",
                    gap: 16,
                    alignItems: "stretch",
                  }}>
                    {/* rail */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <span style={{
                        width: isActive ? 18 : 14,
                        height: isActive ? 18 : 14,
                        borderRadius: "50%",
                        background: isActive ? M.borderL : "var(--background-app, #fff)",
                        border: isActive ? "none" : `2px solid var(--border-neutral, #c9c9cf)`,
                        boxShadow: isActive ? `0 0 0 4px ${M.bg}` : "none",
                        flexShrink: 0, marginTop: 6,
                        transition: "all 220ms ease",
                      }}/>
                      {!isLast && (
                        <span style={{
                          flex: 1, width: 2,
                          background: "var(--border-neutral-subtle, #ECECEC)",
                          marginTop: 4,
                        }}/>
                      )}
                    </div>

                    {/* clickable card */}
                    <button
                      onClick={() => setActiveMoment(i)}
                      style={{
                        textAlign: "left",
                        marginBottom: isLast ? 0 : 14,
                        padding: isActive ? "16px 18px" : "12px 18px",
                        background: isActive ? M.bg : "transparent",
                        borderRadius: "var(--radius-large)",
                        borderLeft: isActive ? `4px solid ${M.borderL}` : "4px solid transparent",
                        border: isActive ? `1px solid ${M.borderL}33` : "1px solid var(--border-neutral-subtle, #ECECEC)",
                        cursor: "pointer",
                        transition: "all 240ms cubic-bezier(0.2,0.8,0.2,1)",
                        width: "100%",
                        opacity: isActive ? 1 : 0.78,
                      }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 20, lineHeight: 1 }}>{M.emoji}</span>
                        <div style={{ minWidth: 0 }}>
                          <div style={{
                            fontSize: 10, fontWeight: 800,
                            letterSpacing: "0.14em", textTransform: "uppercase",
                            color: isActive ? M.dotColor : "var(--text-neutral-subtle)",
                          }}>Moment {M.n}</div>
                          <div style={{
                            fontFamily: "var(--typo-heading-medium-bold-family)",
                            fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em",
                            color: isActive ? M.titleColor : "var(--text-neutral-bolder)",
                          }}>{M.title}</div>
                        </div>
                      </div>

                      {/* expanded detail only when active */}
                      {isActive && (
                        <div style={{ marginTop: 12 }}>
                          <div style={{ fontSize: 12, color: "var(--text-neutral-subtle)", marginBottom: 10 }}>{M.subtitle}</div>
                          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 12.5, lineHeight: 1.4, color: "var(--text-neutral)" }}>{M.from}</span>
                            <span style={{ color: M.titleColor, fontWeight: 700, fontSize: 13 }} aria-hidden="true">→</span>
                            <span style={{
                              fontFamily: "var(--typo-body-medium-bold-family)",
                              fontSize: 12.5, fontWeight: 700, lineHeight: 1.4,
                              color: M.titleColor,
                            }}>{M.to}</span>
                          </div>
                          <ul style={{
                            margin: "12px 0 0", padding: 0, listStyle: "none",
                            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 18px",
                          }}>
                            {M.bullets.map((b, j) => (
                              <li key={j} style={{
                                display: "flex", alignItems: "flex-start", gap: 8,
                                fontSize: 12, lineHeight: 1.45,
                                color: "var(--text-neutral, #2b2b2b)",
                              }}>
                                <span style={{
                                  width: 5, height: 5, borderRadius: "50%",
                                  background: M.dotColor, flexShrink: 0, marginTop: 6,
                                }}/>
                                <span style={{ flex: 1 }}>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Phone shell ─────────────────────────────────────────────────── */

  function Phone({ scenario, label }) {
    return (
      <div
        data-screen-label={label}
        style={{
          width: 390, height: 844,
          borderRadius: 54,
          position: "relative",
          overflow: "hidden",
          isolation: "isolate", /* force new stacking context so overflow:hidden clips absolute children at the rounded corners */
          background: "var(--background-app)",
          boxShadow: "0 40px 90px rgba(0,0,0,0.18), 0 0 0 8px #0a0a0a, 0 0 0 9px rgba(255,255,255,0.04)",
          fontFamily: "var(--platform-font-default, var(--platform-font))",
          WebkitFontSmoothing: "antialiased",
          WebkitMaskImage: "-webkit-radial-gradient(white, black)", /* webkit clip fallback */
        }}
      >
        <div style={{
          position: "absolute", top: 11, left: "50%", transform: "translateX(-50%)",
          width: 122, height: 36, borderRadius: 22, background: "#000", zIndex: 50,
        }}/>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }}>
          <IOSStatusBar dark={false}/>
        </div>
        <HomeScreen tweaks={{ brand: "telus", platform: "ios" }} scenario={scenario}/>
      </div>
    );
  }

  /* ── Description panel ───────────────────────────────────────────── */

  function DescriptionPanel({ caseData, indexLabel }) {
    const d = caseData.description;
    return (
      <div style={{
        flex: 1,
        padding: "60px 56px 40px",
        display: "flex", flexDirection: "column",
        background: "var(--background-app, #fff)",
        color: "var(--text-neutral-bolder)",
        overflow: "hidden",
      }}>
        {/* case name */}
        <h1 style={{
          margin: 0,
          fontFamily: "var(--typo-heading-large-bold-family)",
          fontSize: 40, fontWeight: 700, lineHeight: 1.1,
          letterSpacing: "-0.02em",
          color: "var(--text-neutral-bolder)",
        }}>{caseData.name}</h1>

        {/* divider */}
        <hr style={{
          margin: "26px 0 22px",
          border: 0, height: 1,
          background: "var(--border-neutral-subtle, #ECECEC)",
        }}/>

        {/* sections */}
        <DescSection label="Context signals" items={d.signals}/>
        <DescSection label="What adapted"    items={d.adapted}/>
        <DescSection label="GenUI principle" principle={d.principle}/>
      </div>
    );
  }

  function DescSection({ label, items, principle }) {
    return (
      <div style={{ marginBottom: 22 }}>
        <div style={{
          fontFamily: "var(--platform-font-default, var(--platform-font))",
          fontSize: 11, fontWeight: 700,
          letterSpacing: "0.14em", textTransform: "uppercase",
          color: "var(--text-primary, #4b286d)",
          marginBottom: 10,
        }}>{label}</div>
        {items && (
          <ul style={{
            margin: 0, padding: 0, listStyle: "none",
            display: "flex", flexDirection: "column", gap: 6,
          }}>
            {items.map((t, i) => (
              <li key={i} style={{
                display: "flex", alignItems: "baseline", gap: 10,
                fontFamily: "var(--typo-body-medium-regular-family)",
                fontSize: 14, lineHeight: 1.5,
                color: "var(--text-neutral, #2b2b2b)",
              }}>
                <span style={{
                  width: 4, height: 4, borderRadius: "50%",
                  background: "var(--text-neutral-subtle)",
                  flexShrink: 0, transform: "translateY(-3px)",
                }}/>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        )}
        {principle && (
          <div>
            <div style={{
              fontFamily: "var(--typo-body-medium-bold-family)",
              fontSize: 14, fontWeight: 700,
              color: "var(--text-neutral-bolder)",
              marginBottom: 4,
            }}>{principle.name}</div>
            <div style={{
              fontFamily: "var(--typo-body-medium-regular-family)",
              fontSize: 14, lineHeight: 1.55,
              color: "var(--text-neutral, #2b2b2b)",
            }}>{principle.body}</div>
          </div>
        )}
      </div>
    );
  }

  /* ── Navigation bar ──────────────────────────────────────────────── */

  function NavBar({ activeIndex, onChange }) {
    return (
      <div style={{
        position: "absolute",
        left: 0, right: 0, bottom: 0,
        height: 72,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        padding: "0 32px",
        background: "var(--background-app)",
        borderTop: "1px solid var(--border-neutral-subtle, #ECECEC)",
        zIndex: 30,
      }}>
        <button onClick={() => onChange(Math.max(0, activeIndex - 1))} disabled={activeIndex === 0} style={navArrowStyle(activeIndex === 0)}>
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M10 12 6 8l4-4"/></svg>
        </button>

        {CASES.map((c, i) => (
          <NavIndicator key={c.id} caseData={c} active={i === activeIndex} onClick={() => onChange(i)}/>
        ))}

        <button onClick={() => onChange(Math.min(CASES.length - 1, activeIndex + 1))} disabled={activeIndex === CASES.length - 1} style={navArrowStyle(activeIndex === CASES.length - 1)}>
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4l4 4-4 4"/></svg>
        </button>

        <div style={{
          fontFamily: "var(--platform-font-default, var(--platform-font))",
          fontSize: 12, color: "var(--text-neutral-subtle)",
          marginLeft: "auto",
        }}>{String(activeIndex + 1).padStart(2, "0")} / {String(CASES.length).padStart(2, "0")}</div>
      </div>
    );
  }

  function navArrowStyle(disabled) {
    return {
      width: 32, height: 32, padding: 0,
      background: "var(--background-neutral-subtle)",
      border: "1px solid var(--border-neutral-subtle, #ECECEC)",
      borderRadius: "var(--radius-full)",
      color: "var(--text-neutral-bold)",
      cursor: disabled ? "default" : "pointer",
      opacity: disabled ? 0.35 : 1,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
    };
  }

  function NavIndicator({ caseData, active, onClick }) {
    return (
      <button onClick={onClick} style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "8px 14px",
        height: 36,
        background: active ? "var(--background-primary, #4b286d)" : "var(--background-neutral-subtle)",
        border: active ? "1px solid var(--background-primary, #4b286d)" : "1px solid var(--border-neutral-subtle, #ECECEC)",
        borderRadius: "var(--radius-full)",
        color: active ? "var(--text-primary-inverse, #fff)" : "var(--text-neutral-bold)",
        fontFamily: "var(--platform-font-default, var(--platform-font))",
        fontSize: 12, fontWeight: 600,
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "all 180ms ease",
      }}>
        <span style={{
          fontWeight: 800, letterSpacing: "0.06em", fontSize: 11,
          opacity: active ? 0.92 : 0.6,
        }}>{caseData.id}</span>
        <span style={{ fontWeight: active ? 700 : 600 }}>{caseData.name}</span>
      </button>
    );
  }

  /* ── Root component ──────────────────────────────────────────────── */

  function GenUICases() {
    const [activeIndex, setActiveIndex] = useState(0);
    const current = CASES[activeIndex];

    // Force fresh HomeScreen state each case (e.g., AI card dismissal)
    const phoneKey = current.id;

    useEffect(() => {
      function onKey(e) {
        if (e.key === "ArrowRight") setActiveIndex((i) => Math.min(CASES.length - 1, i + 1));
        if (e.key === "ArrowLeft")  setActiveIndex((i) => Math.max(0, i - 1));
        const n = parseInt(e.key, 10);
        if (!Number.isNaN(n) && n >= 1 && n <= CASES.length) setActiveIndex(n - 1);
      }
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, []);

    return (
      <div
        data-screen-label={current.intro ? "Intro" : current.interactive ? "Interactive" : `${current.id} ${current.name}`}
        style={{ position: "absolute", inset: 0, display: "flex" }}
      >
        {current.intro ? (
          <div style={{ position: "relative", flex: "1 1 auto", paddingBottom: 72 }}>
            <IntroSlide/>
          </div>
        ) : current.interactive ? (
          <div style={{ position: "relative", flex: "1 1 auto" }}>
            <InteractiveMoments/>
          </div>
        ) : (
          <>
            {/* Left — phone */}
            <div style={{
              flex: "0 0 56%",
              position: "relative",
              background:
                "radial-gradient(60% 50% at 30% 20%, var(--color-primary-lighter, #efe6f6) 0%, transparent 60%)," +
                "var(--background-neutral-subtle, #f4f4f6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "60px 56px 132px", /* room around phone + 72px nav clearance */
              boxSizing: "border-box",
            }}>
              <div style={{ transform: "scale(0.80)", transformOrigin: "center center" }}>
                <Phone key={phoneKey} scenario={current.scenario} label={`${current.id} ${current.name}`}/>
              </div>
            </div>

            {/* Right — description */}
            <div style={{
              flex: "1 1 auto",
              position: "relative",
              paddingBottom: 72,
              display: "flex", flexDirection: "column",
              borderLeft: "1px solid var(--border-neutral-subtle, #ECECEC)",
            }}>
              <DescriptionPanel caseData={current} indexLabel={`Case ${current.id} / ${String(CASES.length - 1).padStart(2, "0")}`}/>
            </div>
          </>
        )}

        {/* Nav bar */}
        <NavBar activeIndex={activeIndex} onChange={setActiveIndex}/>
      </div>
    );
  }

  Object.assign(window, { GenUICases, InteractiveMoments, GENUI_CASES: CASES });
})();
