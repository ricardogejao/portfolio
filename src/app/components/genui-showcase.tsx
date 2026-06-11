/**
 * GenUI Showcase — native React component replacing the iframe
 * Works on all screen sizes. Tab-based case navigator.
 */
import { useState, useRef, useEffect } from "react";

/* ── Case data (extracted from genui-cases.jsx) ──────────────────── */
const CASES = [
  {
    id: "00",
    name: "Kit on the Way",
    badge: "KIT ON THE WAY",
    headline: "Your kit is almost here.",
    state: "onboarding",
    stateColor: "#2A9CB5",
    ai: { body: "Arriving Tue, May 19 by end of day.", primary: "Track delivery" },
    chips: [],
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
  {
    id: "01",
    name: "Home & Settled",
    badge: "ALL CLEAR",
    headline: "Home is secure.",
    state: "disarmed",
    stateColor: "#30A46C",
    ai: null,
    chips: ["Movie Night ✦", "Good Night ✦", "Away Mode ✦"],
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
      "The screen defaults to \"show your home\" mode, not \"AI talking\" mode",
    ],
    principle: {
      name: "Default → Adaptive",
      body: "This is the baseline. The UI is calm because the context is calm. Adaptation only happens when there is a reason.",
    },
  },
  {
    id: "02",
    name: "Departure Detected",
    badge: "LEAVING SOON",
    headline: "Ready to arm.",
    state: "departure",
    stateColor: "#E8A33D",
    ai: { body: "Arm before you leave? You usually arm by 8:30am.", primary: "Arm Away" },
    chips: ["Morning mode ✦", "Leave quietly ✦", "Arm Stay ✦"],
    signals: [
      "8:27am · Tuesday · Weekday pattern",
      "Lucas location: near front door",
      "Pattern: arms Away at 8:30am, 4 of last 5 weekdays",
      "Sarah still home",
    ],
    adapted: [
      "Hero subtitle shifts to reflect transition context",
      "\"Arm Away\" button becomes the most visually prominent action",
      "AI Assistant card surfaces a direct, time-sensitive suggestion",
      "Routine chips shift to departure-relevant options",
    ],
    principle: {
      name: "Context-driven",
      body: "The UI didn't wait for Lucas to navigate to security settings. It read the context and brought the right action forward.",
    },
  },
  {
    id: "03",
    name: "Armed Away",
    badge: "ARMED AWAY",
    headline: "All zones clear.",
    state: "armed",
    stateColor: "#4A90D9",
    ai: { body: "Garage sensor triggered 3× this month while armed. Bypass that zone next time?", primary: "Set bypass" },
    chips: ["View security ✦", "Arm Night instead ✦"],
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
  {
    id: "04",
    name: "Arriving Home",
    badge: "WELCOME BACK",
    headline: "Good to have you back.",
    state: "arrival",
    stateColor: "#30A46C",
    ai: { body: "Automate \"Welcome Home\" at 3:45pm every day? You've arrived 5 days in a row.", primary: "Set up" },
    chips: ["Welcome Home ✦", "Warm it up ✦", "Relax mode ✦"],
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
  {
    id: "05",
    name: "Good Night",
    badge: "10:32 PM",
    headline: "Good night, Lucas.",
    state: "night",
    stateColor: "#7B6EE8",
    ai: { body: "Arm Night mode before bed? You usually do around 10:30pm.", primary: "Arm Night" },
    chips: ["Good Night ✦", "Arm Night ✦", "Read mode ✦"],
    signals: [
      "10:32pm · Tuesday",
      "Lucas awake · Sarah sleeping (inferred from no activity)",
      "Historical pattern: arms Night between 10:15–10:45pm on weekdays",
      "All doors locked",
    ],
    adapted: [
      "Greeting and subtitle shift to nighttime tone",
      "\"Night\" becomes the primary arm action — \"Away\" is deprioritized",
      "AI surfaces a bedtime arming suggestion based on a behavioral pattern",
      "Routine chips offer nighttime-relevant options",
    ],
    principle: {
      name: "Default → Adaptive",
      body: "Time of day + behavioral pattern + occupancy signal combine to produce a specific, relevant adaptation. Three context signals converge into one coherent suggestion.",
    },
  },
  {
    id: "06",
    name: "Proactive Insight",
    badge: "ALL CLEAR",
    headline: "Home is secure.",
    state: "insight",
    stateColor: "#30A46C",
    ai: { body: "Your heater has been on since 7am. Turn it off tonight and save $3.40?", primary: "Turn off at 9pm" },
    chips: ["Morning mode ✦", "Work from home ✦", "Away Mode ✦"],
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
  {
    id: "07",
    name: "Intrusion Alert",
    badge: "ALARM TRIGGERED",
    headline: "Intrusion detected.",
    state: "alarm",
    stateColor: "#E5484D",
    ai: { body: "Motion detected at front door. Nobody authorized is nearby.", primary: "Call 911" },
    chips: [],
    signals: [
      "Armed Away active · front door motion sensor triggered",
      "2:33 AM · no authorized user detected nearby",
      "TELUS Monitoring engaged · agent on call",
      "Emergency circle: 3 contacts queued",
    ],
    adapted: [
      "Cameras elevated above AI card — see what's happening first",
      "Monitoring timeline surfaces response status",
      "Safe word + cancel button replace routine chips",
      "Emergency circle shows notification progress per contact",
      "Favorites hidden — device control irrelevant during alarm",
    ],
    principle: {
      name: "Urgency as layout",
      body: "The screen reorganizes entirely around a single priority: help the user understand what is happening and what is being done about it, in the right order.",
    },
  },
];

/* ── Hero gradients by state ─────────────────────────────────────── */
const HERO_GRADIENT: Record<string, string> = {
  onboarding: "linear-gradient(170deg, #1A6B80 0%, #0E4A5C 60%, #081E26 100%)",
  disarmed:   "linear-gradient(170deg, #4B286D 0%, #3A1A5C 55%, #2A0F46 100%)",
  departure:  "linear-gradient(170deg, #5C3A1A 0%, #4A2A0A 55%, #2E1800 100%)",
  armed:      "linear-gradient(170deg, #0D2A4A 0%, #081C35 55%, #040E1E 100%)",
  arrival:    "linear-gradient(170deg, #1A4A3A 0%, #0E3028 55%, #061810 100%)",
  night:      "linear-gradient(170deg, #1A1340 0%, #0E0B2E 60%, #040318 100%)",
  insight:    "linear-gradient(170deg, #4B286D 0%, #3A1A5C 55%, #2A0F46 100%)",
  alarm:      "linear-gradient(170deg, #5C1A1A 0%, #420A0A 60%, #1E0000 100%)",
};

/* ── Phone mockup component ──────────────────────────────────────── */
function PhoneMockup({ c }: { c: typeof CASES[0] }) {
  const gradient = HERO_GRADIENT[c.state] ?? HERO_GRADIENT.disarmed;
  const isAlarm = c.state === "alarm";

  return (
    <div
      className="relative mx-auto overflow-hidden"
      style={{
        width: 200,
        height: 400,
        borderRadius: 28,
        background: "#0A0A0A",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.10), 0 24px 48px rgba(0,0,0,0.6)",
        flexShrink: 0,
      }}
    >
      {/* status bar */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1" style={{ fontSize: 9, color: "rgba(255,255,255,0.6)" }}>
        <span>9:41</span>
        <div className="flex gap-1 items-center">
          <span>●●●</span>
          <span>WiFi</span>
          <span>100%</span>
        </div>
      </div>

      {/* hero gradient */}
      <div className="px-4 pt-2 pb-4" style={{ background: gradient }}>
        <div className="text-white/50 mb-1" style={{ fontSize: 8, letterSpacing: "0.12em", fontWeight: 600 }}>
          RIVERSIDE HOME
        </div>
        <div
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full mb-2"
          style={{
            background: `${c.stateColor}22`,
            border: `1px solid ${c.stateColor}66`,
            fontSize: 7,
            color: c.stateColor,
            fontWeight: 700,
            letterSpacing: "0.08em",
          }}
        >
          <span
            className="rounded-full"
            style={{ width: 4, height: 4, background: c.stateColor, display: "inline-block" }}
          />
          {c.badge}
        </div>
        <div className="text-white font-bold leading-tight mb-1" style={{ fontSize: 14, fontWeight: 700 }}>
          {c.headline}
        </div>

        {/* AI card */}
        {c.ai && (
          <div
            className="mt-2 rounded-xl p-2"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <div className="text-white/60 mb-1" style={{ fontSize: 7 }}>{c.ai.body}</div>
            <div
              className="rounded-lg text-center py-1"
              style={{
                background: isAlarm ? c.stateColor : "rgba(255,255,255,0.15)",
                fontSize: 8,
                color: "white",
                fontWeight: 600,
              }}
            >
              {c.ai.primary}
            </div>
          </div>
        )}
      </div>

      {/* chips */}
      {c.chips.length > 0 && (
        <div className="flex flex-wrap gap-1 px-3 py-2">
          {c.chips.slice(0, 3).map((chip) => (
            <span
              key={chip}
              className="px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                fontSize: 7,
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {chip}
            </span>
          ))}
        </div>
      )}

      {/* bottom nav */}
      <div
        className="absolute bottom-0 inset-x-0 flex items-center justify-around py-2 px-3"
        style={{
          background: "rgba(10,10,10,0.85)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(10px)",
        }}
      >
        {["Home", "Services", "Manage", "Settings"].map((tab) => (
          <div key={tab} className="flex flex-col items-center gap-0.5">
            <div
              className="rounded"
              style={{
                width: 14, height: 14,
                background: tab === "Home" ? c.stateColor : "rgba(255,255,255,0.2)",
                opacity: tab === "Home" ? 1 : 0.5,
              }}
            />
            <span style={{ fontSize: 6, color: tab === "Home" ? c.stateColor : "rgba(255,255,255,0.35)", fontWeight: tab === "Home" ? 700 : 400 }}>
              {tab}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main showcase component ─────────────────────────────────────── */
export function GenUIShowcase() {
  const [active, setActive] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);
  const c = CASES[active];

  // scroll active tab into view
  useEffect(() => {
    const container = tabsRef.current;
    if (!container) return;
    const btn = container.children[active] as HTMLElement;
    if (btn) btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [active]);

  return (
    <div style={{ background: "#0F0F0F", borderRadius: 16, overflow: "hidden" }}>
      {/* Tab bar */}
      <div
        ref={tabsRef}
        className="flex overflow-x-auto"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {CASES.map((cs, i) => (
          <button
            key={cs.id}
            onClick={() => setActive(i)}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-3 transition-colors"
            style={{
              background: active === i ? "rgba(255,255,255,0.05)" : "transparent",
              borderBottom: active === i ? `2px solid ${cs.stateColor}` : "2px solid transparent",
              color: active === i ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)",
              fontSize: 11,
              fontWeight: active === i ? 600 : 400,
              letterSpacing: "0.01em",
              cursor: "pointer",
              border: "none",
              outline: "none",
              whiteSpace: "nowrap",
              paddingBottom: active === i ? "calc(0.75rem - 2px)" : "0.75rem",
              borderBottomStyle: "solid",
              borderBottomWidth: 2,
              borderBottomColor: active === i ? cs.stateColor : "transparent",
            }}
          >
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 10,
                color: active === i ? cs.stateColor : "rgba(255,255,255,0.25)",
                fontWeight: 700,
              }}
            >
              {cs.id}
            </span>
            {cs.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 p-6 md:p-10">
        {/* Phone mockup — hidden on very small screens, shown on sm+ */}
        <div className="hidden sm:flex items-start justify-center pt-1" style={{ flexShrink: 0 }}>
          <PhoneMockup c={c} />
        </div>

        {/* Description panel */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span
                className="text-xs font-mono font-bold"
                style={{ color: c.stateColor }}
              >
                {c.id}
              </span>
              <span className="text-white font-bold" style={{ fontSize: "clamp(1.125rem, 2vw, 1.375rem)", letterSpacing: "-0.02em" }}>
                {c.name}
              </span>
            </div>
            <p className="text-white/40" style={{ fontSize: 12, letterSpacing: "0.08em", fontWeight: 600 }}>
              {c.badge}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Signals */}
            <div>
              <p className="text-white/30 mb-3" style={{ fontSize: 10, letterSpacing: "0.12em", fontWeight: 700, textTransform: "uppercase" }}>
                Context signals
              </p>
              <ul className="space-y-2">
                {c.signals.map((s) => (
                  <li key={s} className="flex items-start gap-2">
                    <span style={{ color: c.stateColor, fontSize: 10, marginTop: 4, flexShrink: 0 }}>◆</span>
                    <span className="text-white/65 leading-snug" style={{ fontSize: "0.8125rem" }}>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Adapted */}
            <div>
              <p className="text-white/30 mb-3" style={{ fontSize: 10, letterSpacing: "0.12em", fontWeight: 700, textTransform: "uppercase" }}>
                UI adapted
              </p>
              <ul className="space-y-2">
                {c.adapted.map((a) => (
                  <li key={a} className="flex items-start gap-2">
                    <span className="text-white/25" style={{ fontSize: 10, marginTop: 4, flexShrink: 0 }}>→</span>
                    <span className="text-white/65 leading-snug" style={{ fontSize: "0.8125rem" }}>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Principle */}
          <div
            className="p-5 mt-auto"
            style={{
              background: `${c.stateColor}0F`,
              border: `1px solid ${c.stateColor}33`,
              borderRadius: 10,
            }}
          >
            <p style={{ fontSize: 10, letterSpacing: "0.12em", fontWeight: 700, color: c.stateColor, marginBottom: 6, textTransform: "uppercase" }}>
              Principle · {c.principle.name}
            </p>
            <p className="text-white/70 leading-relaxed" style={{ fontSize: "0.875rem" }}>
              {c.principle.body}
            </p>
          </div>
        </div>
      </div>

      {/* Case navigation dots */}
      <div className="flex items-center justify-center gap-2 pb-5">
        {CASES.map((cs, i) => (
          <button
            key={cs.id}
            onClick={() => setActive(i)}
            style={{
              width: active === i ? 20 : 6,
              height: 6,
              borderRadius: 3,
              background: active === i ? cs.stateColor : "rgba(255,255,255,0.15)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
