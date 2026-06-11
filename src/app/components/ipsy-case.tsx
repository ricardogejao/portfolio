import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Footer } from "./footer";
import { ScrollProgress } from "./scroll-progress";
import logoGejao from "../../imports/image-2.png";

// Acquisition screens
import ipsyAcqLandingBefore from "../../imports/ipsy/ipsy_acq_landing_before.png";
import ipsyAcqLandingAfter  from "../../imports/ipsy/ipsy_acq_landing_after.png";
import ipsyAcqCheckoutBefore from "../../imports/ipsy/ipsy_acq_checkout_before.png";
import ipsyAcqCheckoutAfter  from "../../imports/ipsy/ipsy_acq_checkout_after.png";
import ipsyAcqQuizBefore from "../../imports/ipsy/ipsy_acq_quiz_before.png";
import ipsyAcqQuizAfter  from "../../imports/ipsy/ipsy_acq_quiz_after.png";
import ipsyAcqConfirmBefore from "../../imports/ipsy/ipsy_acq_confirm_before.png";
import ipsyAcqConfirmAfter  from "../../imports/ipsy/ipsy_acq_confirm_after.png";
import ipsyAcqHandoff from "../../imports/ipsy/ipsy_acq_handoff.png";

// Homepage personalization screens
import ipsyHpVisual1 from "../../imports/ipsy/ipsy_hp_visual1.png";
import ipsyHpVisual2 from "../../imports/ipsy/ipsy_hp_visual2.png";
import ipsyHpVisual3 from "../../imports/ipsy/ipsy_hp_visual3.png";
import ipsyHpVisual4 from "../../imports/ipsy/ipsy_hp_visual4.png";
import ipsyHpDesktop from "../../imports/ipsy/ipsy_hp_desktop.png";
import ipsyHpWireframes from "../../imports/ipsy/ipsy_hp_wireframes.png";

/* ── Small fade-in wrapper ─────────────────────────────────────── */
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.2, 0, 0, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ── Phone screen thumbnail ────────────────────────────────────── */
function PhoneThumb({ src, label, alt, accent = false }: { src: string; label?: string; alt: string; accent?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3 flex-1 min-w-0">
      <div className="w-full aspect-[9/18] relative rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.10)]"
        style={{ border: accent ? "2px solid #E91E8C" : "2px solid #E5E5EA" }}
      >
        <img src={src} alt={alt} className="w-full h-full object-cover object-top" />
      </div>
      {label && (
        <span className="text-center text-[#111111]/50 leading-tight" style={{ fontSize: "11px" }}>{label}</span>
      )}
    </div>
  );
}

const PINK = "#E91E8C";

type Props = { onBack: () => void };

export function IpsyCase({ onBack }: Props) {
  return (
    <div className="w-full" style={{ background: "#FFFFFF", color: "#111111" }}>
      <ScrollProgress />

      {/* ── STICKY NAV ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#111111]/85 backdrop-blur-md text-white border-b border-white/5">
        <div className="grid grid-cols-3 items-center px-6 md:px-12 py-5">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors justify-self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="tracking-tight">All Work</span>
          </button>
          <button onClick={() => window.__navigate?.("home")} className="justify-self-center" aria-label="Home">
            <img src={logoGejao} alt="gejão" className="h-8 w-auto object-contain" />
          </button>
          <div className="hidden md:flex items-center gap-6 uppercase tracking-[0.18em] text-white/60 justify-self-end" style={{ fontSize: "11px" }}>
            <button onClick={() => window.__navigate?.("telus")} className="hover:text-white transition-colors">Work</button>
            <span>·</span>
            <button onClick={() => window.__navigate?.("about")} className="hover:text-white transition-colors">About</button>
            <span>·</span>
            <button onClick={() => window.__navigate?.("resume")} className="hover:text-white transition-colors">Resume</button>
          </div>
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="px-6 md:px-16 lg:px-24 pt-20 md:pt-28 pb-0">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left */}
          <FadeIn>
            <p className="uppercase tracking-[0.2em] text-[#111111]/40 mb-8" style={{ fontSize: "11px" }}>
              Product Design · UX Research · 2023–2024
            </p>
            <h1
              className="tracking-[-0.03em] leading-[1.0] mb-10"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)", fontWeight: 800 }}
            >
              Re-architecting acquisition at scale
            </h1>
            {/* Key metrics row */}
            <div className="flex gap-10 mb-10">
              <div>
                <p className="font-bold leading-none mb-1" style={{ fontSize: "2rem", color: PINK }}>+14.7%</p>
                <p className="text-[#111111]/50" style={{ fontSize: "12px" }}>Conversion rate</p>
              </div>
              <div>
                <p className="font-bold leading-none mb-1" style={{ fontSize: "2rem", color: PINK }}>-34.4%</p>
                <p className="text-[#111111]/50" style={{ fontSize: "12px" }}>Quiz drop-off</p>
              </div>
              <div>
                <p className="font-bold leading-none mb-1" style={{ fontSize: "2rem", color: PINK }}>-12.1%</p>
                <p className="text-[#111111]/50" style={{ fontSize: "12px" }}>Sign-up abandonment</p>
              </div>
            </div>
            {/* Meta row */}
            <div className="flex gap-8 pt-6 border-t border-[#111111]/8">
              {[
                ["Role", "Product Designer & UX Researcher"],
                ["Timeline", "4 weeks"],
                ["Team", "1 Researcher · 1 PM"],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="uppercase tracking-[0.15em] text-[#111111]/40 mb-1" style={{ fontSize: "10px" }}>{k}</p>
                  <p className="text-[#111111]/80 leading-snug" style={{ fontSize: "13px" }}>{v}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Right — hero phone */}
          <FadeIn delay={0.1}>
            <div className="relative flex justify-center md:justify-end">
              {/* Pink glow */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: "radial-gradient(ellipse 80% 80% at 60% 40%, rgba(233,30,140,0.12) 0%, transparent 70%)"
              }} />
              <div className="w-[55%] md:w-[60%] aspect-[9/18] relative rounded-[2rem] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.15)]"
                style={{ border: "2px solid #E5E5EA" }}
              >
                <img src={ipsyAcqLandingAfter} alt="IPSY new landing page" className="w-full h-full object-cover object-top" />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── STRUCTURAL FRICTION ────────────────────────────────── */}
      <section className="px-6 md:px-16 lg:px-24 py-24 md:py-36">
        <FadeIn>
          <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">
            {/* Left — funnel */}
            <div>
              <p className="uppercase tracking-[0.2em] text-[#111111]/40 mb-8" style={{ fontSize: "11px" }}>The Problem</p>
              <h2 className="tracking-[-0.025em] leading-[1.05] mb-8" style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)", fontWeight: 800 }}>
                Structural Friction
              </h2>
              <p className="text-[#111111]/60 leading-relaxed mb-12 max-w-[42ch]" style={{ fontSize: "clamp(1rem, 1.2vw, 1.1rem)" }}>
                Pre-existing architecture for learning, selling, and building members was framing experiences
                the wrong way around — quiz before value.
              </p>

              {/* Funnel visualization */}
              <div className="relative">
                {[
                  { pct: "100%", w: "100%", label: "Arrived", n: "100%" },
                  { pct: "50.3%", w: "78%", label: "Started quiz", n: "50.3%" },
                  { pct: "32.8%", w: "60%", label: "Completed quiz", n: "32.8%" },
                  { pct: "17.4%", w: "44%", label: "Reached checkout", n: "17.4%" },
                  { pct: "12.1%", w: "30%", label: "Entered payment", n: "12.1%" },
                  { pct: "3.1%",  w: "16%", label: "Subscribed",      n: "3.1%", accent: true },
                ].map(({ w, label, n, accent }) => (
                  <div key={label} className="flex items-center gap-4 mb-2">
                    <div
                      className="h-7 rounded-sm flex items-center px-3 transition-all"
                      style={{
                        width: w,
                        background: accent ? PINK : "#F0F0F3",
                      }}
                    >
                      <span className="font-semibold" style={{ fontSize: "12px", color: accent ? "#fff" : "#111111" }}>{n}</span>
                    </div>
                    <span className="text-[#111111]/40 whitespace-nowrap" style={{ fontSize: "11px" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — big metrics */}
            <div>
              <p className="uppercase tracking-[0.2em] text-[#111111]/40 mb-10" style={{ fontSize: "11px" }}>Key drop-off points</p>
              <div className="flex flex-col gap-10">
                {[
                  { value: "67%", label: "drop during the quiz steps" },
                  { value: "78%", label: "abandonment at checkout" },
                  { value: "3.1%", label: "conversion rate" },
                ].map(({ value, label }) => (
                  <div key={label} className="pb-8 border-b border-[#F0F0F3] last:border-0 last:pb-0">
                    <p className="font-bold tracking-tight leading-none mb-2" style={{ fontSize: "clamp(3rem, 6vw, 5rem)", color: PINK }}>{value}</p>
                    <p className="text-[#111111]/50" style={{ fontSize: "14px" }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>

        {/* User quote */}
        <FadeIn delay={0.1}>
          <div className="mt-20 md:mt-28 max-w-[52ch]">
            <div className="w-8 h-px mb-6" style={{ background: PINK }} />
            <blockquote className="text-[#111111]/80 leading-relaxed mb-4" style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.25rem)", fontStyle: "italic" }}>
              "From rethinking the experience for subscriber rate"
            </blockquote>
            <cite className="not-italic text-[#111111]/40 uppercase tracking-[0.15em]" style={{ fontSize: "11px" }}>
              Brittany — never-subscriber, usability study
            </cite>
          </div>
        </FadeIn>
      </section>

      {/* ── STRATEGIC REFRAMING ────────────────────────────────── */}
      <section style={{ background: "#FAFAFA" }} className="px-6 md:px-16 lg:px-24 py-24 md:py-36">
        <FadeIn>
          <p className="uppercase tracking-[0.2em] text-[#111111]/40 mb-8" style={{ fontSize: "11px" }}>Strategic Reframing</p>
          <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">
            <div>
              <h2 className="tracking-[-0.025em] leading-[1.05] mb-6" style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)", fontWeight: 800 }}>
                Move the quiz.<br />Surface the value.
              </h2>
              <p className="text-[#111111]/60 leading-relaxed max-w-[42ch]" style={{ fontSize: "clamp(1rem, 1.2vw, 1.1rem)" }}>
                The redesign resequences the sign-up flow — showing subscription details and pricing
                upfront, so users can make an informed decision before personalizing their bag.
              </p>
            </div>

            {/* Flow diagrams */}
            <div className="flex flex-col gap-8">
              {/* Before */}
              <div className="p-6 rounded-2xl" style={{ background: "#F0F0F3" }}>
                <p className="uppercase tracking-[0.15em] text-[#111111]/40 mb-4" style={{ fontSize: "10px" }}>Before</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {["Landing Page", "Beauty Quiz", "Choose Plan", "Checkout", "Confirmation"].map((step, i, arr) => (
                    <div key={step} className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-full text-[#111111]/70 font-medium"
                        style={{ fontSize: "12px", background: "#E5E5EA" }}
                      >{step}</span>
                      {i < arr.length - 1 && <span className="text-[#111111]/30" style={{ fontSize: "12px" }}>→</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* After */}
              <div className="p-6 rounded-2xl" style={{ background: "#FFF0F7", border: `1px solid ${PINK}22` }}>
                <p className="uppercase tracking-[0.15em] mb-4" style={{ fontSize: "10px", color: PINK }}>After</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {["Landing Page", "Choose Plan", "Checkout", "Confirmation", "Beauty Quiz"].map((step, i, arr) => (
                    <div key={step} className="flex items-center gap-2">
                      <span
                        className="px-3 py-1.5 rounded-full font-medium"
                        style={{
                          fontSize: "12px",
                          background: step === "Beauty Quiz" ? PINK : "#FFD6ED",
                          color: step === "Beauty Quiz" ? "#fff" : PINK,
                        }}
                      >{step}</span>
                      {i < arr.length - 1 && <span style={{ fontSize: "12px", color: PINK + "60" }}>→</span>}
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[#111111]/50" style={{ fontSize: "12px" }}>
                  Personalization after purchase — value first, 30–35 fewer interactions
                </p>
              </div>

              {/* Research pillars */}
              <div className="grid grid-cols-3 gap-3 mt-2">
                {[
                  { n: "01", t: "Excessive Quiz Steps" },
                  { n: "02", t: "Unclear Membership Details" },
                  { n: "03", t: "Lack of Order Transparency" },
                ].map(({ n, t }) => (
                  <div key={n} className="p-4 rounded-xl" style={{ background: "#F0F0F3" }}>
                    <p className="font-bold mb-1" style={{ fontSize: "10px", color: "#111111/30" }}>{n}</p>
                    <p className="text-[#111111]/70 leading-snug font-medium" style={{ fontSize: "12px" }}>{t}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── THE REDESIGNED EXPERIENCE ──────────────────────────── */}
      <section className="px-6 md:px-16 lg:px-24 py-24 md:py-36">
        <FadeIn>
          <p className="uppercase tracking-[0.2em] text-[#111111]/40 mb-4" style={{ fontSize: "11px" }}>The Redesigned Experience</p>
          <h2 className="tracking-[-0.025em] leading-[1.05] mb-4" style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)", fontWeight: 800 }}>
            A streamlined flow that prioritizes<br className="hidden md:block" /> conversion and user quality.
          </h2>
          <p className="text-[#111111]/50 mb-16" style={{ fontSize: "14px" }}>Drag to explore each step →</p>
        </FadeIn>

        {/* Scrollable screen row */}
        <FadeIn delay={0.1}>
          <div className="overflow-x-auto pb-4 -mx-6 px-6 md:-mx-16 md:px-16">
            <div className="flex gap-4 md:gap-6" style={{ minWidth: "max-content" }}>
              {[
                { src: ipsyAcqLandingBefore,  label: "Landing page", sublabel: "Before", accent: false },
                { src: ipsyAcqLandingAfter,   label: "Landing page", sublabel: "After",  accent: true  },
                { src: ipsyAcqCheckoutBefore, label: "Checkout",     sublabel: "Before", accent: false },
                { src: ipsyAcqCheckoutAfter,  label: "Checkout",     sublabel: "After",  accent: true  },
                { src: ipsyAcqConfirmBefore,  label: "Confirmation", sublabel: "Before", accent: false },
                { src: ipsyAcqConfirmAfter,   label: "Confirmation", sublabel: "After",  accent: true  },
                { src: ipsyAcqQuizBefore,     label: "Beauty Quiz",  sublabel: "Before", accent: false },
                { src: ipsyAcqQuizAfter,      label: "Beauty Quiz",  sublabel: "After — relocated", accent: true  },
              ].map(({ src, label, sublabel, accent }, i) => (
                <div key={i} className="flex flex-col gap-2" style={{ width: "clamp(120px, 18vw, 160px)" }}>
                  <div
                    className="w-full aspect-[9/18] rounded-2xl overflow-hidden"
                    style={{
                      border: accent ? `2px solid ${PINK}` : "2px solid #E5E5EA",
                      boxShadow: accent ? `0 4px 24px ${PINK}22` : "0 4px 16px rgba(0,0,0,0.06)",
                    }}
                  >
                    <img src={src} alt={label} className="w-full h-full object-cover object-top" />
                  </div>
                  <p className="font-semibold text-[#111111]" style={{ fontSize: "11px" }}>{label}</p>
                  <p style={{ fontSize: "10px", color: accent ? PINK : "#111111/40" }}>{sublabel}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Handoff */}
        <FadeIn delay={0.1}>
          <div className="mt-20 overflow-hidden rounded-2xl" style={{ border: "1px solid #F0F0F3" }}>
            <img src={ipsyAcqHandoff} alt="Visual design handoff" className="w-full" />
          </div>
        </FadeIn>
      </section>

      {/* ── VALIDATED IN 4 WEEKS ───────────────────────────────── */}
      <section style={{ background: "#FFF5FA" }} className="px-6 md:px-16 lg:px-24 py-24 md:py-36">
        <FadeIn>
          <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
            {/* Left — phone */}
            <div className="flex justify-center">
              <div className="w-[55%] md:w-[65%] aspect-[9/18] rounded-[2rem] overflow-hidden shadow-[0_24px_80px_rgba(233,30,140,0.15)]"
                style={{ border: `2px solid ${PINK}44` }}
              >
                <img src={ipsyAcqQuizAfter} alt="Quiz after checkout" className="w-full h-full object-cover object-top" />
              </div>
            </div>

            {/* Right — results */}
            <div>
              <p className="uppercase tracking-[0.2em] text-[#111111]/40 mb-6" style={{ fontSize: "11px" }}>Validated in 4 Weeks</p>
              <h2 className="tracking-[-0.025em] leading-[1.0] mb-10" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 800 }}>
                Quiz after checkout won on every metric.
              </h2>
              <div className="grid grid-cols-2 gap-8 mb-8">
                {[
                  { value: "+14.7%", label: "Conversion rate" },
                  { value: "-12.1%", label: "Sign-up drop-off" },
                  { value: "-34.4%", label: "Beauty quiz drop-off" },
                  { value: "5/6", label: "Prospects preferred it" },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <p className="font-bold leading-none mb-2" style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", color: PINK }}>{value}</p>
                    <p className="text-[#111111]/50" style={{ fontSize: "13px" }}>{label}</p>
                  </div>
                ))}
              </div>
              <p className="text-[#111111]/60 leading-relaxed max-w-[38ch]" style={{ fontSize: "14px" }}>
                Moderated A/B test with 6 prospects. The quiz-after-checkout variant enabled better
                plan comparisons with 30–35 fewer interactions.
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── CHAPTER II DIVIDER ─────────────────────────────────── */}
      <section className="px-6 md:px-16 lg:px-24 py-24 md:py-36">
        <FadeIn>
          <p className="uppercase tracking-[0.2em] text-[#111111]/40 mb-6" style={{ fontSize: "11px" }}>Chapter II · 10 weeks · Lead Designer + 3 PDs</p>
          <h2 className="tracking-[-0.03em] leading-[1.0] max-w-[18ch]" style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)", fontWeight: 800 }}>
            Keeping members as hard as acquiring them.
          </h2>
          <p className="mt-8 text-[#111111]/55 leading-relaxed max-w-[48ch]" style={{ fontSize: "clamp(1rem, 1.2vw, 1.1rem)" }}>
            After fixing acquisition, the next problem surfaced: a generic homepage showing the same
            content to every member — new subscribers, power users, and lapsed members alike.
            31% scroll rate. Users emailing support to find basic event info.
          </p>
        </FadeIn>
      </section>

      {/* ── LIFECYCLE SEGMENTS ─────────────────────────────────── */}
      <section style={{ background: "#FAFAFA" }} className="px-6 md:px-16 lg:px-24 py-24 md:py-36">
        <FadeIn>
          <p className="uppercase tracking-[0.2em] text-[#111111]/40 mb-8" style={{ fontSize: "11px" }}>Homepage Personalization</p>
          <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start mb-16 md:mb-24">
            <div>
              <h2 className="tracking-[-0.025em] leading-[1.05] mb-6" style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)", fontWeight: 800 }}>
                A homepage that knows where you are.
              </h2>
              <p className="text-[#111111]/60 leading-relaxed max-w-[42ch]" style={{ fontSize: "clamp(1rem, 1.2vw, 1.1rem)" }}>
                Card-sorting and user interviews with 15 members across 4 lifecycle stages defined
                a content hierarchy unique to each segment — so the homepage feels personal, not generic.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { segment: "M0–M2", name: "New Members", desc: "Help them receive & love their first bag", color: "#FFD6ED" },
                { segment: "M3–M6", name: "Growing Members", desc: "Commerce events & shop offers", color: "#FFB3D9" },
                { segment: "M9+", name: "Power Users", desc: "Discovery — new brands & products", color: "#FF80C0" },
                { segment: "Pink", name: "Lapsed Members", desc: "Re-engagement — what's new", color: PINK, textLight: true },
              ].map(({ segment, name, desc, color, textLight }) => (
                <div key={segment} className="p-5 rounded-2xl" style={{ background: color }}>
                  <p className="font-bold mb-1 leading-none" style={{ fontSize: "10px", color: textLight ? "#fff" : PINK, opacity: textLight ? 0.8 : 1, textTransform: "uppercase", letterSpacing: "0.15em" }}>{segment}</p>
                  <p className="font-semibold mb-1 leading-snug" style={{ fontSize: "14px", color: textLight ? "#fff" : "#111111" }}>{name}</p>
                  <p className="leading-snug" style={{ fontSize: "12px", color: textLight ? "rgba(255,255,255,0.75)" : "#111111/60" }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Wireframes */}
        <FadeIn delay={0.1}>
          <div className="overflow-hidden rounded-2xl" style={{ border: "1px solid #F0F0F3" }}>
            <img src={ipsyHpWireframes} alt="Homepage wireframes by lifecycle segment" className="w-full" />
          </div>
          <p className="mt-4 text-center text-[#111111]/35 uppercase tracking-[0.15em]" style={{ fontSize: "10px" }}>
            Persona-driven wireframes — four lifecycle segments
          </p>
        </FadeIn>
      </section>

      {/* ── VISUAL DESIGN ──────────────────────────────────────── */}
      <section className="py-24 md:py-36">
        <FadeIn>
          <div className="px-6 md:px-16 lg:px-24 mb-12">
            <p className="uppercase tracking-[0.2em] text-[#111111]/40 mb-4" style={{ fontSize: "11px" }}>Visual Design</p>
            <h2 className="tracking-[-0.025em] leading-[1.05]" style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)", fontWeight: 800 }}>
              Seamless across devices.
            </h2>
          </div>
        </FadeIn>

        {/* 4 phones full-bleed */}
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-4 gap-0">
            {[ipsyHpVisual1, ipsyHpVisual2, ipsyHpVisual3, ipsyHpVisual4].map((src, i) => (
              <div key={i} className="aspect-[9/16] overflow-hidden">
                <img src={src} alt={`IPSY homepage design ${i + 1}`} className="w-full h-full object-cover object-top" />
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Desktop */}
        <FadeIn delay={0.1}>
          <div className="overflow-hidden">
            <img src={ipsyHpDesktop} alt="IPSY desktop layout" className="w-full" />
          </div>
        </FadeIn>
      </section>

      {/* ── KEY LEARNINGS ──────────────────────────────────────── */}
      <section style={{ background: "#FAFAFA" }} className="px-6 md:px-16 lg:px-24 py-24 md:py-36">
        <FadeIn>
          <p className="uppercase tracking-[0.2em] text-[#111111]/40 mb-12" style={{ fontSize: "11px" }}>Key Learnings</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: "#E5E5EA" }}>
            {[
              { n: "01", title: "Sequence is a design decision", body: "Moving the quiz from before checkout to after wasn't a small UI tweak — it was a fundamental reframing of the value proposition. Always ask whether the order of steps is serving the user or the business." },
              { n: "02", title: "Fast research beats slow assumptions", body: "In 4 weeks, 6 moderated sessions produced more actionable insight than months of analytics alone. Qualitative testing revealed the 'why' behind the funnel numbers." },
              { n: "03", title: "Personalization requires a lifecycle model", body: "Designing one homepage for all members is designing for no one. The M0→M9+ framework forced the team to think in terms of the full member relationship." },
              { n: "04", title: "Handoff quality is a leadership responsibility", body: "Leading 3 designers meant setting a standard for component fidelity. Spec quality directly determines how faithfully engineering ships the vision." },
            ].map(({ n, title, body }) => (
              <FadeIn key={n}>
                <div className="p-10 md:p-12" style={{ background: "#FFFFFF" }}>
                  <p className="font-bold mb-4 leading-none" style={{ fontSize: "3rem", color: "#F0F0F3" }}>{n}</p>
                  <h3 className="font-semibold mb-3 leading-snug" style={{ fontSize: "1.0625rem" }}>{title}</h3>
                  <p className="text-[#111111]/55 leading-relaxed" style={{ fontSize: "0.9375rem" }}>{body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="px-6 md:px-16 lg:px-24 py-24 md:py-32 text-center">
        <FadeIn>
          <p className="text-[#111111]/60 mb-6" style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)" }}>
            Let's re-architect your growth engine.
          </p>
          <a
            href="mailto:josericardo.dourado@poatek.com"
            className="inline-flex items-center gap-2 font-semibold border-b-2 pb-1 transition-colors hover:opacity-70"
            style={{ fontSize: "14px", color: PINK, borderColor: PINK }}
          >
            Start a conversation
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </FadeIn>
      </section>

      <Footer />
    </div>
  );
}
