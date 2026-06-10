import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Footer } from "./footer";
import { ScrollProgress } from "./scroll-progress";
import { Reveal, SlideIn, ScaleIn } from "./motion-primitives";

type Props = {
  onBack: () => void;
};

const sectionLabel = "uppercase tracking-[0.22em]";

export function CaseStudy({ onBack }: Props) {
  return (
    <div className="w-full bg-[#FAFAFA]">
      <ScrollProgress />

      {/* STICKY NAV */}
      <header className="sticky top-0 z-40 bg-[#111111]/85 backdrop-blur-md text-white border-b border-white/5">
        <div className="grid grid-cols-3 items-center px-6 md:px-12 py-5">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors justify-self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="tracking-tight">All Work</span>
          </button>
          <button
            onClick={() => window.__navigate?.("home")}
            className="justify-self-center tracking-tight"
          >
            gejão
          </button>
          <div
            className="hidden md:flex items-center gap-6 uppercase tracking-[0.18em] text-white/60 justify-self-end"
            style={{ fontSize: "11px" }}
          >
            <button onClick={() => window.__navigate?.("telus")} className="hover:text-white transition-colors">Work</button>
            <span aria-hidden>·</span>
            <button onClick={() => window.__navigate?.("about")} className="hover:text-white transition-colors">About</button>
            <span aria-hidden>·</span>
            <button onClick={() => window.__navigate?.("resume")} className="hover:text-white transition-colors">Resume</button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative bg-[#111111] text-white min-h-[80vh] flex flex-col">
        <div className="relative px-6 md:px-12 pt-16 md:pt-24 pb-12 md:pb-16 max-w-[1500px]">
          <p
            className={`${sectionLabel} text-white/50 mb-10 md:mb-14`}
            style={{ fontSize: "12px" }}
          >
            Design Leadership · Platform · AI · 2024–2026
          </p>

          <h1
            className="tracking-[-0.03em] leading-[1.0] max-w-[22ch]"
            style={{ fontSize: "clamp(2.75rem, 8vw, 7rem)", fontWeight: 700 }}
          >
            Leading the Transformation of TELUS SmartHome+
          </h1>

          {/* Meta row with thin dividers */}
          <div className="mt-12 md:mt-20 grid grid-cols-2 md:grid-cols-4 border-y border-white/15">
            {[
              ["Role", "Design Lead & Manager"],
              ["Company", "TELUS Digital via Poatek"],
              ["Duration", "2024–2026"],
              ["Team", "8 Designers"],
            ].map(([k, v], i) => (
              <div
                key={k}
                className={`py-6 md:py-7 px-0 md:px-6 ${
                  i > 0 ? "md:border-l border-white/15" : ""
                } ${i % 2 === 1 ? "border-l border-white/15 md:border-l pl-6 md:pl-6" : ""}`}
              >
                <p
                  className={`${sectionLabel} text-white/40 mb-2`}
                  style={{ fontSize: "10px" }}
                >
                  {k}
                </p>
                <p className="text-white/90 leading-snug tracking-tight">{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* App screens placeholder — full width */}
        <div className="relative mt-auto">
          <div className="relative w-full h-[clamp(320px,52vh,640px)] bg-[#161616] overflow-hidden">
            <div className="absolute inset-0 flex items-end justify-center gap-4 md:gap-8 px-6 md:px-12 pb-0">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-[120px] md:w-[200px] aspect-[9/19] bg-[#0A0A0A] border border-white/10 rounded-t-[2rem] p-2.5 shadow-2xl translate-y-6"
                  style={{
                    transform: `translateY(${i % 2 === 0 ? "32px" : "8px"})`,
                  }}
                >
                  <div className="w-full h-full rounded-t-[1.6rem] bg-[#141414] p-4 flex flex-col gap-2">
                    <div className="h-1.5 w-10 bg-white/20 rounded-full" />
                    <div className="h-3 w-24 bg-white/70 rounded-sm mt-1" />
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {[0, 1, 2, 3].map((j) => (
                        <div key={j} className="aspect-square bg-white/[0.05] border border-white/10 rounded-lg" />
                      ))}
                    </div>
                    <div className="mt-auto h-10 bg-white/[0.05] border border-white/10 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>

            <span
              className={`${sectionLabel} absolute bottom-4 left-6 md:left-12 text-white/35`}
              style={{ fontSize: "10px" }}
            >
              App screens placeholder
            </span>
          </div>
        </div>
      </section>

      {/* PULL QUOTE */}
      <section className="relative bg-[#111111] text-white px-6 md:px-12 py-28 md:py-44">
        <blockquote
          className="max-w-[28ch] mx-auto text-center italic text-white tracking-[-0.015em] leading-[1.2]"
          style={{ fontSize: "clamp(1.75rem, 4.2vw, 3.25rem)", fontWeight: 400 }}
        >
          "TELUS had a platform that worked — and a platform that couldn't scale.
          My job was to change the layer underneath the features."
        </blockquote>
      </section>

      {/* 01 CONTEXT */}
      <section className="bg-[#FAFAFA] text-[#111111] px-6 md:px-12 py-24 md:py-36">
        <p className={`${sectionLabel} text-[#111111]/50 mb-12`} style={{ fontSize: "12px" }}>
          01 · The Product
        </p>
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <p className="text-[#111111]/80 leading-relaxed max-w-[52ch]" style={{ fontSize: "clamp(1rem, 1.3vw, 1.15rem)" }}>
              TELUS SmartHome+ is a home automation, monitoring, and security platform
              used by thousands of households across Canada. It connects smart locks,
              cameras, sensors, lighting, thermostats, and internet services into a
              single mobile app — with automations, routines, and an AI assistant
              layered on top.
              <br /><br />
              SmartHome+ is a strategic product: it generates recurring subscription
              revenue, increases customer retention, and differentiates TELUS in a
              competitive market against Google Home, Amazon Alexa, Ring, and Samsung
              SmartThings.
            </p>
          </div>
          <div className="relative aspect-[4/5] bg-white border border-[#111111]/10 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center p-10">
              <div className="w-full max-w-[260px] aspect-[9/19] bg-[#FAFAFA] border border-[#111111]/15 rounded-[2rem] p-3 shadow-xl">
                <div className="w-full h-full rounded-[1.6rem] bg-white p-4 flex flex-col gap-2.5">
                  <div className="h-2 w-16 bg-[#111111]/15 rounded-full" />
                  <div className="h-4 w-32 bg-[#111111] rounded-sm" />
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {[0, 1, 2, 3].map((j) => (
                      <div key={j} className="aspect-square bg-[#111111]/[0.04] border border-[#111111]/10 rounded-lg" />
                    ))}
                  </div>
                  <div className="mt-auto h-10 bg-[#111111]/[0.04] border border-[#111111]/10 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02 PROBLEM */}
      <section className="relative bg-[#111111] text-white px-6 md:px-12 pt-24 md:pt-36 pb-40 md:pb-56">
        <p className={`${sectionLabel} text-white/50 mb-16 md:mb-20`} style={{ fontSize: "12px" }}>
          02 · The Problem
        </p>

        <h2
          className="tracking-[-0.025em] leading-[1.04] max-w-[22ch] mb-20 md:mb-28"
          style={{ fontSize: "clamp(2rem, 5.5vw, 4.25rem)", fontWeight: 700 }}
        >
          The problem was not a missing feature. It was a fragmented system that had
          grown beyond what its architecture could support.
        </h2>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {[
            {
              t: "Fragmentation",
              d: "Each device category operated differently. A user managing a lock, a light, and a sensor encountered three separate mental models inside a single app.",
            },
            {
              t: "Poor Scalability",
              d: "Every new device required a custom build. Engineers started from scratch per launch. The cost of inconsistency compounded over time.",
            },
            {
              t: "Automation Complexity",
              d: "Automations were the platform's highest-value feature — and its highest-friction experience. Most users never finished setup.",
            },
          ].map((c, i) => (
            <div
              key={c.t}
              className="p-10 md:p-14 bg-[#111111] border border-[#2A2A2A] transition-colors hover:border-white/30"
            >
              <p
                className={`${sectionLabel} text-white/35 mb-6`}
                style={{ fontSize: "11px" }}
              >
                {String(i + 1).padStart(2, "0")}
              </p>
              <h4
                className="tracking-tight mb-5"
                style={{ fontSize: "clamp(1.375rem, 2vw, 1.75rem)", fontWeight: 700 }}
              >
                {c.t}
              </h4>
              <p className="text-white/65 leading-relaxed max-w-[44ch]" style={{ fontSize: "clamp(1rem, 1.2vw, 1.0625rem)" }}>
                {c.d}
              </p>
            </div>
          ))}

          {/* Full-width strategic card */}
          <div className="md:col-span-2 relative p-10 md:p-16 bg-[#111111] border border-white/40">
            <div
              aria-hidden
              className="absolute top-0 left-0 w-1 h-full bg-white/80"
            />
            <div className="flex flex-wrap items-baseline justify-between gap-4 mb-6">
              <p
                className={`${sectionLabel} text-white/40`}
                style={{ fontSize: "11px" }}
              >
                04 · Strategic Pressure
              </p>
              <p
                className={`${sectionLabel} text-white/40`}
                style={{ fontSize: "11px" }}
              >
                Highest stakes
              </p>
            </div>
            <h4
              className="tracking-[-0.01em] mb-5 max-w-[24ch]"
              style={{ fontSize: "clamp(1.625rem, 2.6vw, 2.25rem)", fontWeight: 700 }}
            >
              Security at a Crossroads
            </h4>
            <p
              className="text-white/70 leading-relaxed max-w-[72ch]"
              style={{ fontSize: "clamp(1rem, 1.3vw, 1.15rem)" }}
            >
              TELUS needed to deliver a compelling self-monitored security product before
              professional monitoring was ready. The gap between ambition and available
              infrastructure was significant.
            </p>
          </div>
        </div>

      </section>

      {/* 03 MY ROLE */}
      <section className="bg-[#FAFAFA] text-[#111111] px-6 md:px-12 py-24 md:py-36">
        <p className={`${sectionLabel} text-[#111111]/50 mb-12`} style={{ fontSize: "12px" }}>
          03 · My Role
        </p>
        <div className="max-w-[900px]">
          <p
            className="tracking-[-0.01em] leading-[1.35] mb-16"
            style={{ fontSize: "clamp(1.25rem, 2.2vw, 1.75rem)", fontWeight: 500 }}
          >
            I served as Design Manager and product design leader across the full TELUS
            SmartHome+ program, embedded as a Poatek UX Lead within the TELUS design
            organization.
          </p>

          <div className="grid md:grid-cols-2 gap-12 md:gap-16 border-t border-[#111111]/10 pt-12">
            <div>
              <h4 className="mb-5 tracking-tight" style={{ fontSize: "1.125rem", fontWeight: 700 }}>
                What was mine
              </h4>
              <ul className="space-y-3 text-[#111111]/70">
                {["Product strategy", "Design direction", "Stakeholder alignment", "Team coordination", "Delivery framing"].map((i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[#111111] rounded-full" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-5 tracking-tight" style={{ fontSize: "1.125rem", fontWeight: 700 }}>
                What was the team's
              </h4>
              <ul className="space-y-3 text-[#111111]/70">
                {["Execution", "Exploration", "Craft"].map((i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[#111111] rounded-full" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 04 SOLUTION — A. SDUI (light) */}
      <section className="relative bg-[#FAFAFA] text-[#111111] px-6 md:px-12 pt-24 md:pt-36 pb-32 md:pb-44 overflow-hidden">
        <p className={`${sectionLabel} text-[#111111]/50 mb-10`} style={{ fontSize: "12px" }}>
          04 · How We Got to the Solution
        </p>
        <h3
          className="tracking-[-0.02em] leading-[1.05] mb-12 max-w-[24ch]"
          style={{ fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)", fontWeight: 700 }}
        >
          A. SDUI — The Architecture Decision
        </h3>

        <p
          className="text-[#111111]/80 leading-relaxed max-w-[64ch] mb-20 md:mb-24"
          style={{ fontSize: "clamp(1.0625rem, 1.5vw, 1.25rem)" }}
        >
          The most consequential exploration was Server Driven UI. The bet: define a
          shared component vocabulary — State, Controls, Properties, Actions, Content —
          and let the backend drive device screens dynamically.
        </p>

        {/* Before / After panels */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-16 md:mb-20">
          {/* BEFORE */}
          <SlideIn from="left">
          <div className="relative p-8 md:p-12 bg-[#1A1A1A] text-white overflow-hidden min-h-[460px] flex flex-col">
            <div className="flex items-center gap-3 mb-10">
              <span className="w-2 h-2 rounded-full bg-[#E5484D]" />
              <span
                className={`${sectionLabel} text-[#E5484D]`}
                style={{ fontSize: "11px" }}
              >
                Before SDUI
              </span>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              {[
                { t: "Lock Screen", d: "Custom implementation", rotate: "-1.5deg", x: "0px" },
                { t: "Light Screen", d: "Custom implementation", rotate: "1.2deg", x: "14px" },
                { t: "Sensor Screen", d: "Custom implementation", rotate: "-0.8deg", x: "-6px" },
              ].map((b) => (
                <div
                  key={b.t}
                  className="p-5 bg-[#0F0F0F] border border-white/10"
                  style={{ transform: `rotate(${b.rotate}) translateX(${b.x})` }}
                >
                  <p className="tracking-tight mb-1" style={{ fontSize: "0.95rem", fontWeight: 600 }}>
                    {b.t}
                  </p>
                  <p className="text-white/50" style={{ fontSize: "0.8125rem" }}>
                    {b.d}
                  </p>
                </div>
              ))}
            </div>

            <p
              className="mt-10 text-white/65 leading-relaxed border-t border-white/10 pt-6"
              style={{ fontSize: "0.9375rem" }}
            >
              Every new device = new screen, new engineering sprint, new inconsistency.
            </p>
          </div>
          </SlideIn>

          {/* AFTER */}
          <SlideIn from="right" delay={0.1}>
          <div className="relative p-8 md:p-12 bg-[#222222] text-white overflow-hidden min-h-[460px] flex flex-col">
            <div className="flex items-center gap-3 mb-10">
              <span className="w-2 h-2 rounded-full bg-[#30A46C]" />
              <span
                className={`${sectionLabel} text-[#30A46C]`}
                style={{ fontSize: "11px" }}
              >
                After SDUI
              </span>
            </div>

            <div className="flex-1 relative flex items-center justify-center">
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 400 320"
                preserveAspectRatio="none"
                aria-hidden
              >
                {[
                  [200, 160, 80, 50],
                  [200, 160, 320, 50],
                  [200, 160, 50, 160],
                  [200, 160, 350, 160],
                  [200, 160, 200, 290],
                ].map(([x1, y1, x2, y2], i) => (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth="1"
                  />
                ))}
              </svg>

              <div className="relative z-10 grid grid-cols-3 gap-3 items-center w-full max-w-[380px]">
                <div className="text-center">
                  <div className="px-3 py-2 bg-[#0F0F0F] border border-white/15 tracking-tight" style={{ fontSize: "0.75rem" }}>
                    State
                  </div>
                </div>
                <div className="row-span-3 flex items-center justify-center">
                  <div className="px-4 py-6 bg-white text-[#111111] text-center border border-white shadow-2xl">
                    <p className="tracking-tight" style={{ fontSize: "0.8125rem", fontWeight: 700 }}>
                      Shared
                      <br />
                      Component
                      <br />
                      Layer
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="px-3 py-2 bg-[#0F0F0F] border border-white/15 tracking-tight" style={{ fontSize: "0.75rem" }}>
                    Controls
                  </div>
                </div>

                <div className="text-center">
                  <div className="px-3 py-2 bg-[#0F0F0F] border border-white/15 tracking-tight" style={{ fontSize: "0.75rem" }}>
                    Properties
                  </div>
                </div>
                <div className="text-center">
                  <div className="px-3 py-2 bg-[#0F0F0F] border border-white/15 tracking-tight" style={{ fontSize: "0.75rem" }}>
                    Actions
                  </div>
                </div>

                <div className="col-start-2 text-center">
                  <div className="px-3 py-2 bg-[#0F0F0F] border border-white/15 tracking-tight" style={{ fontSize: "0.75rem" }}>
                    Content
                  </div>
                </div>
              </div>
            </div>

            <p
              className="mt-10 text-white/75 leading-relaxed border-t border-white/10 pt-6"
              style={{ fontSize: "0.9375rem" }}
            >
              Any device. Backend config. No custom front-end engineering.
            </p>
          </div>
          </SlideIn>
        </div>

        {/* Leadership decision callout */}
        <div className="relative p-10 md:p-16 bg-[#111111] text-white border border-white/30">
          <p
            className={`${sectionLabel} text-white/40 mb-6`}
            style={{ fontSize: "11px" }}
          >
            Leadership Decision
          </p>
          <p
            className="tracking-[-0.015em] leading-[1.25] max-w-[60ch]"
            style={{ fontSize: "clamp(1.25rem, 2.2vw, 1.875rem)", fontWeight: 500 }}
          >
            The key call: protect the SDUI workstream from being disrupted by urgent
            security requests mid-stream. Disrupting a foundational build to fix an
            urgent problem almost always costs more than it saves.
          </p>
        </div>

      </section>

      {/* 04 SOLUTION — B & C (dark) */}
      <section className="bg-[#111111] text-white px-6 md:px-12 py-24 md:py-36">
        {/* B — DIY Security */}
        <div className="mb-24 md:mb-32">
          <h3
            className="tracking-[-0.02em] leading-[1.05] mb-12 max-w-[24ch]"
            style={{ fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)", fontWeight: 700 }}
          >
            B. DIY Security — From Ambiguity to Strategy
          </h3>

          <p
            className="text-white/85 leading-[1.4] max-w-[52ch] mb-20 md:mb-24 tracking-[-0.005em]"
            style={{ fontSize: "clamp(1.125rem, 1.7vw, 1.5rem)", fontWeight: 500 }}
          >
            When professional monitoring was delayed, DIY Security became a strategic
            pivot. The scope was genuinely unclear.
          </p>

          <div className="grid md:grid-cols-2 gap-10 md:gap-16">
            {/* The Challenge */}
            <div>
              <p
                className={`${sectionLabel} text-white/50 mb-8`}
                style={{ fontSize: "12px" }}
              >
                The Challenge
              </p>
              <ul className="space-y-5">
                {[
                  "What belongs in MVP vs. later?",
                  "How should home states drive security behavior?",
                  "Which notifications are critical vs. informational?",
                  "Which devices and hubs are in scope?",
                  "How does multi-user permissioning work?",
                ].map((q) => (
                  <li
                    key={q}
                    className="grid grid-cols-[24px_1fr] gap-4 items-start text-white/80 border-b border-white/10 pb-5"
                  >
                    <span
                      className="text-white/40 tracking-tight"
                      style={{ fontSize: "1rem" }}
                    >
                      ?
                    </span>
                    <span className="leading-snug" style={{ fontSize: "clamp(1rem, 1.2vw, 1.0625rem)" }}>
                      {q}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* The Approach */}
            <div>
              <p
                className={`${sectionLabel} text-white/50 mb-8`}
                style={{ fontSize: "12px" }}
              >
                The Approach
              </p>
              <p
                className="text-white/85 leading-relaxed mb-10 max-w-[42ch] tracking-[-0.005em]"
                style={{ fontSize: "clamp(1rem, 1.3vw, 1.15rem)" }}
              >
                Treat this as an enablement phase, not UI production. Establish
                strategic foundations before executing screens.
              </p>

              <div className="space-y-3">
                {[
                  "Home/Away as the organizing model",
                  "Critical vs. informational notification tiers",
                  "Jarvis-assisted setup for advanced automation",
                ].map((o) => (
                  <div
                    key={o}
                    className="grid grid-cols-[28px_1fr] gap-3 items-center p-5 bg-[#1A1A1A] border border-white/10"
                  >
                    <span className="text-white/50">→</span>
                    <span className="text-white/85 tracking-tight" style={{ fontSize: "1rem" }}>
                      {o}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Milestone callout */}
          <div className="relative mt-16 md:mt-20 p-10 md:p-14 bg-[#111111] border border-white/40">
            <div
              aria-hidden
              className="absolute top-0 left-0 w-1 h-full bg-white/80"
            />
            <div className="flex items-baseline justify-between gap-4 mb-6 flex-wrap">
              <p
                className={`${sectionLabel} text-white/40`}
                style={{ fontSize: "11px" }}
              >
                📍 Milestone
              </p>
              <p
                className={`${sectionLabel} text-white/40`}
                style={{ fontSize: "11px" }}
              >
                Sept 2025
              </p>
            </div>
            <p
              className="tracking-[-0.015em] leading-[1.25] max-w-[60ch]"
              style={{ fontSize: "clamp(1.25rem, 2.2vw, 1.875rem)", fontWeight: 500 }}
            >
              September 2025 MVP reached. TELUS brought self-monitored security to market
              before professional monitoring was commercially available.
            </p>
          </div>
        </div>

      </section>

      {/* 04 SOLUTION — C. Jarvis 2.0 (light) */}
      <section className="relative bg-[#FAFAFA] text-[#111111] px-6 md:px-12 py-24 md:py-36 overflow-hidden">
        <h3
          className="tracking-[-0.02em] leading-[1.05] mb-16 md:mb-20 max-w-[24ch]"
          style={{ fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)", fontWeight: 700 }}
        >
          C. Jarvis 2.0 — Designing an Operating Layer
        </h3>

        {/* Direction cards */}
        <div className="grid sm:grid-cols-2 gap-5 md:gap-6 mb-24 md:mb-32">
          {[
            {
              t: "AI as Search",
              d: "Users ask, Jarvis answers.",
              tag: "Information without action",
              tagTone: "muted",
              icon: "🔍",
            },
            {
              t: "AI as Navigator",
              d: "Jarvis helps users find screens.",
              tag: "Still requires traditional workflows",
              tagTone: "muted",
              icon: "🧭",
            },
            {
              t: "AI as Assistant",
              d: "Jarvis executes tasks.",
              tag: "Higher value, but reactive",
              tagTone: "yellow",
              icon: "🤝",
            },
            {
              t: "AI as Operating Layer",
              d: "Users describe goals. Jarvis translates intent into actions and workflows.",
              tag: "Transformational",
              tagTone: "green",
              icon: "✨",
              chosen: true,
            },
          ].map((o) => {
            const tagColor =
              o.tagTone === "green"
                ? "text-[#30A46C]"
                : o.tagTone === "yellow"
                  ? "text-[#C99A2E]"
                  : "text-[#E5484D]";
            return (
              <div
                key={o.t}
                className={`relative p-8 md:p-10 transition-transform ${
                  o.chosen
                    ? "bg-[#111111] text-white border border-white shadow-[0_0_0_4px_rgba(17,17,17,0.06),0_24px_60px_-20px_rgba(0,0,0,0.4)] md:-translate-y-1"
                    : "bg-white text-[#111111] border border-[#111111]/12"
                }`}
              >
                <div className="flex items-center justify-between mb-8">
                  <div
                    className={`w-10 h-10 flex items-center justify-center border ${
                      o.chosen ? "border-white/30" : "border-[#111111]/15"
                    }`}
                    style={{ fontSize: "1.125rem" }}
                  >
                    {o.icon}
                  </div>
                  {o.chosen && (
                    <span
                      className={`${sectionLabel} text-white/60`}
                      style={{ fontSize: "10px" }}
                    >
                      We chose this
                    </span>
                  )}
                </div>
                <h5
                  className="tracking-tight mb-3"
                  style={{ fontSize: "clamp(1.25rem, 1.8vw, 1.5rem)", fontWeight: 700 }}
                >
                  {o.t}
                  {o.chosen && <span className="text-white/40"> ←</span>}
                </h5>
                <p
                  className={`leading-relaxed mb-8 max-w-[36ch] ${
                    o.chosen ? "text-white/75" : "text-[#111111]/65"
                  }`}
                >
                  {o.d}
                </p>
                <div
                  className={`pt-5 border-t ${
                    o.chosen ? "border-white/15" : "border-[#111111]/10"
                  }`}
                >
                  <span
                    className={`${sectionLabel} ${
                      o.chosen ? "text-[#30A46C]" : tagColor
                    }`}
                    style={{ fontSize: "11px" }}
                  >
                    {o.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Principle quote */}
        <div className="relative bg-[#111111] text-white py-20 md:py-32 px-6 md:px-12 mb-24 md:mb-32">
          <blockquote
            className="max-w-[28ch] mx-auto text-center italic tracking-[-0.015em] leading-[1.15]"
            style={{ fontSize: "clamp(1.75rem, 4.2vw, 3.25rem)", fontWeight: 400 }}
          >
            "Do first, refine later."
            <span className="block mt-6 text-white/75 not-italic" style={{ fontSize: "clamp(1.125rem, 1.8vw, 1.5rem)", fontWeight: 400 }}>
              When intent is clear, Jarvis acts. The user adjusts if needed.
            </span>
          </blockquote>
        </div>

        {/* Before / After automation */}
        <p
          className={`${sectionLabel} text-[#111111]/50 mb-10`}
          style={{ fontSize: "12px" }}
        >
          What automation creation looked like — before and after Jarvis
        </p>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-16 md:mb-20">
          {/* BEFORE */}
          <SlideIn from="left">
          <div className="p-8 md:p-10 bg-[#1A1A1A] text-white flex flex-col">
            <div className="flex items-center gap-3 mb-10">
              <span className="w-2 h-2 rounded-full bg-[#E5484D]" />
              <span
                className={`${sectionLabel} text-[#E5484D]`}
                style={{ fontSize: "11px" }}
              >
                Before Jarvis · 6 steps
              </span>
            </div>

            <ol className="space-y-3 flex-1">
              {[
                "Navigate to Automations",
                "Select Trigger",
                "Select Conditions",
                "Select Devices",
                "Configure Actions",
                "Save",
              ].map((s, i, arr) => (
                <li key={s}>
                  <div className="flex items-center gap-4 p-4 bg-[#0F0F0F] border border-white/10">
                    <span
                      className="w-7 h-7 flex items-center justify-center border border-white/20 tracking-tight"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-white/85 tracking-tight" style={{ fontSize: "0.95rem" }}>
                      {s}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="flex justify-center my-1.5">
                      <ArrowRight className="w-3 h-3 text-white/25 rotate-90" />
                    </div>
                  )}
                </li>
              ))}
            </ol>

            <p
              className="mt-10 text-white/65 leading-relaxed border-t border-white/10 pt-6"
              style={{ fontSize: "0.9375rem" }}
            >
              Six steps. Each requiring the user to understand a system concept.
            </p>
          </div>
          </SlideIn>

          {/* AFTER */}
          <SlideIn from="right" delay={0.1}>
          <div className="p-8 md:p-10 bg-[#1A1A1A] text-white flex flex-col">
            <div className="flex items-center gap-3 mb-10">
              <span className="w-2 h-2 rounded-full bg-[#30A46C]" />
              <span
                className={`${sectionLabel} text-[#30A46C]`}
                style={{ fontSize: "11px" }}
              >
                With Jarvis · 1 sentence
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-6">
              {/* Speech bubble */}
              <div className="relative p-6 md:p-8 bg-white text-[#111111] rounded-[20px] rounded-bl-sm">
                <p
                  className="italic leading-snug tracking-[-0.01em]"
                  style={{ fontSize: "clamp(1.125rem, 1.7vw, 1.375rem)", fontWeight: 500 }}
                >
                  "I want my porch lights to turn on when I arrive home."
                </p>
              </div>

              <div className="flex justify-center">
                <ArrowRight className="w-5 h-5 text-white/40 rotate-90" />
              </div>

              {/* Result block */}
              <div className="p-6 md:p-8 bg-[#0F0F0F] border border-[#30A46C]/40">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-6 h-6 rounded-full bg-[#30A46C] text-[#111111] flex items-center justify-center" style={{ fontSize: "12px", fontWeight: 700 }}>
                    ✓
                  </span>
                  <span className="tracking-tight" style={{ fontSize: "1.0625rem", fontWeight: 600 }}>
                    Automation created
                  </span>
                </div>
                <p className="text-white/55 leading-relaxed" style={{ fontSize: "0.8125rem" }}>
                  Jarvis identified devices · mapped the trigger · constructed the
                  automation · requested confirmation
                </p>
              </div>
            </div>
          </div>
          </SlideIn>
        </div>

        <p
          className="text-center mx-auto max-w-[28ch] tracking-[-0.015em] leading-[1.2]"
          style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 500 }}
        >
          The user never sees triggers, conditions, or actions as separate concepts.
          They describe a goal.
        </p>
      </section>

      {/* 05 RESULTS */}
      <section className="bg-[#111111] text-white px-6 md:px-12 py-24 md:py-36">
        <p className={`${sectionLabel} text-white/50 mb-16 md:mb-20`} style={{ fontSize: "12px" }}>
          05 · Results
        </p>

        {/* Milestone cards */}
        <div className="space-y-6 md:space-y-8 mb-24 md:mb-32">
          {[
            {
              eyebrow: "SDUI Foundation",
              accent: "#2A9CB5",
              headline: "Platform scalability unlocked",
              body: "A shared component system replaced device-specific implementations. New device launches now require backend configuration — not front-end engineering sprints. Foundation for Jarvis integration established.",
              tag: "Shipped",
            },
            {
              eyebrow: "DIY Security — September 2025",
              accent: "#E8A33D",
              headline: "Self-monitored security brought to market",
              body: "TELUS enabled a viable security offering before professional monitoring was commercially available — protecting business continuity and delivering real customer value during the transition.",
              tag: "MVP Reached · Q1 2026 Rollout",
            },
            {
              eyebrow: "Jarvis 2.0 — Early Market Testing",
              accent: "#30A46C",
              headline: "AI operating layer in customers' hands",
              body: "Conversational automation creation, device control, and context-aware onboarding shipped across all SmartHome+ entry points. GA planned H2 2026.",
              tag: "Early Market Testing",
            },
          ].map((r, i) => (
            <article
              key={r.eyebrow}
              className="relative grid md:grid-cols-[1fr_auto] gap-8 md:gap-12 items-end p-8 md:p-14 bg-[#1A1A1A] border border-white/10 transition-all hover:border-white/25 hover:-translate-y-0.5"
            >
              <div
                aria-hidden
                className="absolute top-0 left-0 w-1 h-full"
                style={{ background: r.accent }}
              />
              <div className="max-w-[68ch]">
                <div className="flex items-center gap-4 mb-6">
                  <span
                    className={`${sectionLabel} text-white/40`}
                    style={{ fontSize: "11px" }}
                  >
                    0{i + 1} · {r.eyebrow}
                  </span>
                </div>
                <h4
                  className="tracking-[-0.02em] leading-[1.1] mb-6 max-w-[22ch]"
                  style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 700 }}
                >
                  {r.headline}
                </h4>
                <p
                  className="text-white/70 leading-relaxed"
                  style={{ fontSize: "clamp(1rem, 1.25vw, 1.125rem)" }}
                >
                  {r.body}
                </p>
              </div>

              <div className="md:text-right md:self-start">
                <span
                  className="inline-flex items-center gap-2 px-4 py-2.5 border tracking-tight"
                  style={{
                    fontSize: "12px",
                    color: r.accent,
                    borderColor: `${r.accent}66`,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: r.accent }}
                  />
                  {r.tag}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Org-level impact */}
        <div className="p-10 md:p-16 bg-[#1F1F1F] border border-white/10 mb-20 md:mb-24">
          <p className={`${sectionLabel} text-white/50 mb-3`} style={{ fontSize: "12px" }}>
            Organizational Impact
          </p>
          <h3
            className="tracking-[-0.02em] leading-[1.1] mb-12 max-w-[22ch]"
            style={{ fontSize: "clamp(1.625rem, 3vw, 2.25rem)", fontWeight: 700 }}
          >
            What changed at the org level
          </h3>

          <div className="grid md:grid-cols-2 gap-y-8 gap-x-12 md:gap-x-20">
            {[
              "Cross-org operating model built between TELUS and external AI partner Area 22",
              "UX governance introduced — design review process established for all Jarvis workstreams",
              "Design elevated from execution partner to strategic voice in platform architecture",
              "8 designers, 3 major parallel workstreams, delivered without team breakdown",
            ].map((it, i) => (
              <div
                key={it}
                className="grid grid-cols-[44px_1fr] gap-5 items-start border-t border-white/10 pt-6"
              >
                <span
                  className="text-white/30 tracking-[-0.04em] leading-none"
                  style={{ fontSize: "1.875rem", fontWeight: 700 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p
                  className="text-white/80 leading-relaxed max-w-[44ch]"
                  style={{ fontSize: "clamp(1rem, 1.2vw, 1.0625rem)" }}
                >
                  {it}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics I would track */}
        <div>
          <p className={`${sectionLabel} text-white/40 mb-6`} style={{ fontSize: "11px" }}>
            What I would measure post-launch
          </p>
          <p
            className="text-white/55 leading-relaxed max-w-[60ch] mb-8"
            style={{ fontSize: "0.9375rem" }}
          >
            Metrics not owned at the time of writing, but the framing I would
            recommend.
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "Automation creation completion rate vs. pre-Jarvis baseline",
              "Onboarding time-to-first-value for new security customers",
              "Support ticket deflection via Jarvis conversational resolution",
              "SDUI coverage % across device types",
              "Feature adoption rate for capabilities surfaced through Jarvis",
            ].map((m) => (
              <span
                key={m}
                className="px-4 py-2.5 border border-white/15 text-white/65 tracking-tight"
                style={{ fontSize: "13px" }}
              >
                · {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 06 LEARNINGS */}
      <section className="bg-[#111111] text-white px-6 md:px-12 pt-24 md:pt-36 pb-12 md:pb-16">
        <p className={`${sectionLabel} text-white/50 mb-12`} style={{ fontSize: "12px" }}>
          06 · Key Learnings
        </p>
      </section>

      {(() => {
        const learnings = [
          {
            t: "Scalability is a design problem, not just an engineering one.",
            d: "The decision to invest in SDUI foundations before adding more device-specific screens was a design strategy call as much as a technical one. Architecture decisions create enormous product leverage — or enormous debt.",
          },
          {
            t: "Alignment is often harder than the design itself.",
            d: "The most difficult work on this program wasn't designing screens or interaction models. It was getting Design, Product, Engineering, Architecture, and external partners to agree on what we were building and why.",
          },
          {
            t: "Treat ambiguity as a design input.",
            d: "When professional monitoring was delayed, DIY Security's scope became genuinely unclear. Rather than waiting for clarity, I reframed the work as an enablement phase — foundations before execution.",
          },
          {
            t: "Protecting team focus is a strategic decision.",
            d: "Resource allocation decisions — who works on what, and who is protected from context-switching — have as much impact on outcomes as design decisions.",
          },
          {
            t: "AI should reduce complexity, not add to it.",
            d: "The Jarvis principle 'do first, refine later' was a response to a real user insight: people want their home to work, not to learn how an AI assistant thinks.",
          },
          {
            t: "Security design is trust design.",
            d: "Every decision about when Jarvis acts immediately vs. asks for confirmation, how error states communicate severity — these are trust decisions as much as UX decisions.",
          },
          {
            t: "The operating model is part of the design.",
            d: "Jarvis 2.0's quality depended as much on establishing a functioning review process between TELUS and Area 22 as it did on the interaction model itself.",
          },
        ];
        return learnings.map((l, i) => {
          const dark = i % 2 === 0;
          return (
            <section
              key={l.t}
              className={`${
                dark ? "bg-[#111111] text-white" : "bg-[#FAFAFA] text-[#111111]"
              } px-6 md:px-12 py-20 md:py-28`}
            >
              <article className="grid md:grid-cols-[1fr_2fr] gap-10 md:gap-20 items-start max-w-[1300px]">
                <div className="flex items-start gap-4">
                  <span
                    className={`tracking-[-0.04em] leading-none ${
                      dark ? "text-white/15" : "text-[#111111]/15"
                    }`}
                    style={{ fontSize: "clamp(5rem, 12vw, 10rem)", fontWeight: 700 }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`${sectionLabel} mt-4 ${
                      dark ? "text-white/40" : "text-[#111111]/40"
                    }`}
                    style={{ fontSize: "11px" }}
                  >
                    Learning
                  </span>
                </div>

                <div className="md:pt-6">
                  <h3
                    className="tracking-[-0.02em] leading-[1.1] mb-6 max-w-[28ch]"
                    style={{
                      fontSize: "clamp(1.5rem, 2.8vw, 2.25rem)",
                      fontWeight: 700,
                    }}
                  >
                    {l.t}
                  </h3>
                  <p
                    className={`leading-[1.55] max-w-[58ch] ${
                      dark ? "text-white/65" : "text-[#111111]/65"
                    }`}
                    style={{ fontSize: "clamp(1rem, 1.3vw, 1.15rem)" }}
                  >
                    {l.d}
                  </p>
                </div>
              </article>
            </section>
          );
        });
      })()}

      {/* Closing statement */}
      <section className="bg-[#111111] text-white px-6 md:px-12 py-32 md:py-48">
        <ScaleIn duration={0.8}>
          <p
            className="max-w-[24ch] mx-auto text-center tracking-[-0.025em] leading-[1.05]"
            style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)", fontWeight: 700 }}
          >
            This work was never about designing screens.
          </p>
        </ScaleIn>
      </section>

      {/* Case study nav */}
      <div className="bg-[#FAFAFA] text-[#111111] px-6 md:px-12 py-16 md:py-20 border-b border-[#111111]/10">
        <div className="flex flex-wrap items-center justify-between gap-8 max-w-[1300px]">
          <button
            onClick={onBack}
            className="group inline-flex items-center gap-3 text-[#111111]/70 hover:text-[#111111] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="tracking-tight" style={{ fontSize: "clamp(1rem, 1.3vw, 1.125rem)" }}>
              Back to All Work
            </span>
          </button>
          <a
            href="mailto:ricardogej@gmail.com"
            className="inline-flex items-center gap-3 border-b border-[#111111]/30 hover:border-[#111111] pb-1 tracking-tight transition-colors"
            style={{ fontSize: "clamp(1.125rem, 1.6vw, 1.375rem)", fontWeight: 500 }}
          >
            Let's connect → ricardogej@gmail.com
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
