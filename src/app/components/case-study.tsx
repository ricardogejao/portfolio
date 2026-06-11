import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { GenUIEmbed } from "./genui-embed";
import { useRef, useState, useCallback, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "motion/react";
import { Footer } from "./footer";
import { ScrollProgress } from "./scroll-progress";
import { Reveal, SlideIn, ScaleIn } from "./motion-primitives";
import caseHeroVideo from "../../imports/case-study-hero.mp4";
import logoGejao from "../../imports/image-2.png";
import productMockup from "../../imports/product-mockup.mov";
import teamPhoto from "../../imports/team-photo.jpg";
import screenHome from "../../imports/device_home.png";
import screenList from "../../imports/device_list.png";
import screenControl from "../../imports/device_control.png";
import screenColor from "../../imports/device_color_picker.png";
import sduiBeforeLight from "../../imports/sdui_before_light.png";
import sduiBeforeThermostat from "../../imports/sdui_before_thermostat.png";
import sduiAfterLight from "../../imports/sdui_after_light.png";
import sduiAfterThermostat from "../../imports/sdui_after_thermostat.png";
import sduiBeforeScreens from "../../imports/sdui_before_screens.png";
import sduiAfterScreens from "../../imports/sdui_after_screens.png";
import homeAway01 from "../../imports/home_away_01.png";
import homeAway02 from "../../imports/home_away_02.png";
import homeAway03 from "../../imports/home_away_03.png";
import homeAway04 from "../../imports/home_away_04.png";
import notifCritSmoke from "../../imports/notif_crit_smoke.png";
import notifCritCo from "../../imports/notif_crit_co.png";
import notifInfoMotion from "../../imports/notif_info_motion.png";
import notifInfoWindow from "../../imports/notif_info_window.png";
import notifInfoLeak from "../../imports/notif_info_leak.png";
import notifScreenCritical from "../../imports/notif_screen_critical.png";
import notifCoScreen from "../../imports/notif_critical_02.png";
import jarvis01 from "../../imports/jarvis_01.png";
import jarvis02 from "../../imports/jarvis_02.png";
import jarvis03 from "../../imports/jarvis_03.png";
import jarvis04 from "../../imports/jarvis_04.png";
import jarvis05 from "../../imports/jarvis_05.png";
import jarvis06 from "../../imports/jarvis_06.png";

function ComparisonSlider({
  before, after, beforeLabel = "Before", afterLabel = "After",
}: {
  before: string; after: string; beforeLabel?: string; afterLabel?: string;
}) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const animated = useRef(false);
  const inView = useInView(containerRef, { once: true, amount: 0.5 });

  // Intro animation: fires once when slider scrolls into view
  useEffect(() => {
    if (!inView || animated.current) return;
    animated.current = true;

    const keyframes = [50, 82, 18, 50];
    const durations = [700, 900, 600];

    let rafId: number;
    let phase = 0;
    let phaseStart: number | null = null;

    const ease = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const tick = (now: number) => {
      if (phaseStart === null) phaseStart = now;
      const t = Math.min((now - phaseStart) / durations[phase], 1);
      setPos(keyframes[phase] + (keyframes[phase + 1] - keyframes[phase]) * ease(t));
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else if (phase < durations.length - 1) {
        phase++;
        phaseStart = null;
        rafId = requestAnimationFrame(tick);
      }
    };

    const timeout = setTimeout(() => { rafId = requestAnimationFrame(tick); }, 300);
    return () => { clearTimeout(timeout); cancelAnimationFrame(rafId); };
  }, [inView]);

  const move = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - left) / width) * 100)));
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative select-none overflow-hidden cursor-ew-resize"
      onMouseDown={(e) => { dragging.current = true; move(e.clientX); }}
      onMouseMove={(e) => dragging.current && move(e.clientX)}
      onMouseUp={() => { dragging.current = false; }}
      onMouseLeave={() => { dragging.current = false; }}
      onTouchStart={(e) => move(e.touches[0].clientX)}
      onTouchMove={(e) => move(e.touches[0].clientX)}
    >
      {/* Before */}
      <img src={before} alt={beforeLabel} className="w-full block" draggable={false} />

      {/* After (revealed left-to-right) */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img src={after} alt={afterLabel} className="w-full block" draggable={false} />
      </div>

      {/* Divider line */}
      <div className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_8px_rgba(0,0,0,0.3)] pointer-events-none" style={{ left: `${pos}%` }} />

      {/* Handle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-[0_2px_16px_rgba(0,0,0,0.25)] flex items-center justify-center pointer-events-none"
        style={{ left: `${pos}%` }}
      >
        <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
          <path d="M5 5H1M1 5L4 2M1 5L4 8" stroke="#333" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13 5H17M17 5L14 2M17 5L14 8" stroke="#333" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 pointer-events-none">
        <span className="px-2.5 py-1 bg-[#E5484D] text-white rounded-full tracking-wide" style={{ fontSize: "10px", fontWeight: 600 }}>
          {beforeLabel}
        </span>
      </div>
      <div className="absolute top-4 right-4 pointer-events-none" style={{ opacity: pos > 15 ? 1 : 0, transition: "opacity 0.2s" }}>
        <span className="px-2.5 py-1 bg-[#30A46C] text-white rounded-full tracking-wide" style={{ fontSize: "10px", fontWeight: 600 }}>
          {afterLabel}
        </span>
      </div>
    </div>
  );
}

const EASE = [0.2, 0, 0, 1] as const;

function PhoneFrame({ children, glow = false }: { children: ReactNode; glow?: boolean }) {
  return (
    <div className="relative w-full max-w-[210px] aspect-[9/19] mx-auto">
      <div className={`absolute inset-0 rounded-[2.5rem] bg-[#1c1c1e] border-2 ${glow ? "border-[#E5484D]/50 shadow-[0_0_40px_rgba(229,72,77,0.25),0_20px_60px_rgba(0,0,0,0.7)]" : "border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"}`} />
      <div className="absolute -left-[3px] top-[20%] w-[3px] h-5 bg-white/20 rounded-l-sm" />
      <div className="absolute -left-[3px] top-[28%] w-[3px] h-8 bg-white/20 rounded-l-sm" />
      <div className="absolute -right-[3px] top-[24%] w-[3px] h-7 bg-white/20 rounded-r-sm" />
      <div className="absolute inset-[4px] rounded-[2.1rem] overflow-hidden">{children}</div>
      <div className="absolute top-[4px] left-1/2 -translate-x-1/2 w-[28%] h-[3.2%] bg-[#1c1c1e] rounded-b-2xl z-10" />
    </div>
  );
}

function NotificationTiers() {
  const sequence = [
    { src: notifInfoMotion, alt: "Hallway sensor detected motion", critical: false },
    { src: notifInfoWindow, alt: "Bedroom window closed",          critical: false },
    { src: notifCritSmoke,  alt: "Smoke Detected",                 critical: true  },
    { src: notifInfoLeak,   alt: "Bathroom sensor detected leak",  critical: false },
    { src: notifInfoMotion, alt: "Hallway sensor detected motion", critical: false },
    { src: notifCritCo,     alt: "Carbon Monoxide Detected!",      critical: true  },
  ];

  type Item = { id: number; src: string; alt: string; critical: boolean };
  const [stack, setStack]         = useState<Item[]>([]);
  const [showPhone, setShowPhone] = useState(false);
  const idRef       = useRef(0);
  const seqRef      = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef  = useRef<ReturnType<typeof setTimeout>  | null>(null);
  const started     = useRef(false);
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const inView      = useInView(wrapperRef, { once: true, amount: 0.4 });

  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ["start end", "end start"] });
  const notifY = useTransform(scrollYProgress, [0, 1], [0, -65]);
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, -30]);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    const add = () => {
      if (seqRef.current >= sequence.length) return;
      const notif = sequence[seqRef.current];
      seqRef.current++;
      const isFinal = seqRef.current >= sequence.length;
      setStack(prev => [{ ...notif, id: idRef.current++ }, ...prev].slice(0, 4));
      if (isFinal) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (timeoutRef.current)  clearTimeout(timeoutRef.current);
        // Mockup starts appearing first, then others fade out as it reveals
        setTimeout(() => setShowPhone(true), 600);
        setTimeout(() => setStack(prev => prev.slice(0, 1)), 1800);
      }
    };

    timeoutRef.current  = setTimeout(add, 400);
    intervalRef.current = setInterval(add, 2400);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current)  clearTimeout(timeoutRef.current);
    };
  }, [inView]);

  return (
    <div ref={wrapperRef}>
      {/* Stack + phone */}
      <div className="relative flex justify-center overflow-visible" style={{ height: "170px" }}>

        {/* Phone mockup */}
        <AnimatePresence>
          {showPhone && (
            <motion.div
              className="absolute hidden md:block"
              style={{ left: "calc(50% + 190px)", top: "-60px", zIndex: 0, y: phoneY }}
              initial={{ x: 56, opacity: 0, scale: 0.9, filter: "blur(12px)" }}
              animate={{ x: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.4, ease: EASE }}
            >
              <div className="relative w-[240px] aspect-[9/19]">
                {/* Pulsing red radial gradient background */}
                <motion.div
                  className="absolute pointer-events-none"
                  style={{
                    inset: "-100px",
                    background: "radial-gradient(ellipse at center, rgba(229,72,77,0.55) 0%, rgba(229,72,77,0.15) 50%, transparent 72%)",
                    zIndex: -1,
                  }}
                  animate={{ opacity: [0.25, 1, 0.25] }}
                  transition={{ duration: 3.5, ease: "easeInOut", repeat: Infinity }}
                />
                <div className="absolute inset-0 rounded-[2.8rem] bg-[#1c1c1e] border-2 border-[#E5484D]/45 shadow-[0_0_48px_rgba(229,72,77,0.22),0_24px_64px_rgba(0,0,0,0.75)]" />
                <div className="absolute -left-[3px] top-[20%] w-[3px] h-6 bg-white/20 rounded-l-sm" />
                <div className="absolute -left-[3px] top-[28%] w-[3px] h-10 bg-white/20 rounded-l-sm" />
                <div className="absolute -right-[3px] top-[24%] w-[3px] h-8 bg-white/20 rounded-r-sm" />
                <div className="absolute inset-[4px] rounded-[2.5rem] overflow-hidden">
                  <img src={notifCoScreen} alt="Carbon monoxide detected screen" className="w-full h-full object-cover object-top" />
                </div>
                <div className="absolute top-[4px] left-1/2 -translate-x-1/2 w-[28%] h-[3%] bg-[#1c1c1e] rounded-b-2xl z-10" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notifications — outer wrapper carries parallax, inner handles stacking */}
        <motion.div
          className="absolute inset-0 flex justify-center"
          style={{ y: notifY }}
        >
          <AnimatePresence>
          {stack.map((item, i) => (
            <motion.div
              key={item.id}
              className="absolute w-full max-w-[480px] px-6 md:px-0"
              style={{ zIndex: 10 - i }}
              initial={{ y: -64, opacity: 0, scale: 0.93 }}
              animate={{
                y: i * 11,
                scale: 1 - i * 0.042,
                opacity: Math.max(0, 1 - i * 0.24),
              }}
              exit={{ opacity: 0, scale: 0.97, transition: { duration: 1.6, ease: EASE } }}
              transition={{ duration: 0.48, ease: EASE }}
            >
              <div className="relative" style={{ isolation: "isolate" }}>
                {item.critical && stack.length === 1 && (
                  <motion.div
                    className="absolute pointer-events-none"
                    style={{
                      top: "-30px", left: "-30px", right: "-30px", bottom: "-30px",
                      borderRadius: "28px",
                      zIndex: 0,
                      background: "radial-gradient(ellipse at center, rgba(229,72,77,0.6) 0%, transparent 68%)",
                    }}
                    animate={{ opacity: [0.2, 0.9, 0.2] }}
                    transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
                  />
                )}
                <img
                  style={{ position: "relative", zIndex: 1 }}
                  src={item.src}
                  alt={item.alt}
                  draggable={false}
                  className={`w-full rounded-[18px] ${
                    item.critical && stack.length === 1
                      ? "shadow-[0_32px_80px_rgba(0,0,0,0.85),0_6px_32px_rgba(229,72,77,0.55)] ring-1 ring-[#E5484D]/60"
                      : item.critical
                      ? "shadow-[0_4px_28px_rgba(229,72,77,0.45)] ring-1 ring-[#E5484D]/50"
                      : "shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
                  }`}
                />
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
        </motion.div>

      </div>

      {/* Copy + Legend */}
      <div className="mt-0 w-full max-w-[480px] mx-auto px-6 md:px-0 flex flex-col gap-20">
        {/* Copy */}
        <p className="text-white/60 leading-snug max-w-[320px]" style={{ fontSize: "1.0625rem" }}>
          Not every alert deserves the same urgency. Informational events are silenced when you're home.{" "}
          <span className="text-[#E5484D]/80">Critical alerts</span> break through regardless of mode.
        </p>

        <div className="flex flex-col gap-1.5">
          <span className="flex items-center gap-2 text-white/35" style={{ fontSize: "0.75rem" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#2A9CB5] flex-shrink-0" />
            Informational · muted when home
          </span>
          <span className="flex items-center gap-2 text-white/35" style={{ fontSize: "0.75rem" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5484D] flex-shrink-0" />
            Critical · always on
          </span>
        </div>
      </div>
    </div>
  );
}

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
            className="justify-self-center"
            aria-label="Home"
          >
            <img src={logoGejao} alt="gejão" className="h-8 w-auto object-contain" />
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
      <section className="bg-[#111111] text-white">
        {/* Video with label + heading overlaid */}
        <div className="relative">
          <video
            aria-hidden
            src={caseHeroVideo}
            autoPlay
            muted
            loop
            playsInline
            className="w-full block opacity-80 pointer-events-none"
          />
          <div aria-hidden className="absolute inset-0 bg-[#111111]/25 pointer-events-none" />
          {/* Cover Veo watermarks */}
          <div aria-hidden className="absolute pointer-events-none" style={{ right: "5%", bottom: "10%", width: "12%", height: "20%", background: "radial-gradient(ellipse at center, #1d1e22 30%, transparent 75%)" }} />
          <div aria-hidden className="absolute pointer-events-none" style={{ right: "0", bottom: "0", width: "8%", height: "6%", background: "linear-gradient(135deg, transparent 30%, #1d1e22 60%)" }} />
          <div className="absolute inset-0 z-10 flex flex-col justify-start px-6 md:px-12 pt-20 md:pt-28 pb-8 md:pb-10 max-w-[1500px]">
            <p
              className={`${sectionLabel} text-white/50`}
              style={{ fontSize: "12px" }}
            >
              Design Leadership · Platform · AI · 2024–2026
            </p>
            <div className="mt-10 md:mt-14">
              <h1
                className="tracking-[-0.03em] leading-[1.0] max-w-[22ch] mb-8 md:mb-10"
                style={{ fontSize: "clamp(2.75rem, 8vw, 7rem)", fontWeight: 700 }}
              >
                Leading the Transformation of TELUS SmartHome+
              </h1>
              <div className="grid grid-cols-2 md:grid-cols-4 border-y border-white/15">
                {[
                  ["Role", "Design Lead & Manager"],
                  ["Company", "TELUS Digital via Poatek"],
                  ["Duration", "2024–2026"],
                  ["Team", "8 Designers"],
                ].map(([k, v], i) => (
                  <div
                    key={k}
                    className={`py-5 md:py-6 ${
                      i > 0 ? "md:border-l border-white/15 md:pl-6" : ""
                    } ${i % 2 === 1 ? "border-l border-white/15 pl-6" : ""}`}
                  >
                    <p className={`${sectionLabel} text-white/40 mb-2`} style={{ fontSize: "10px" }}>{k}</p>
                    <p className="text-white/90 leading-snug tracking-tight">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* App screens — full width */}
        <div className="relative">
          <div className="relative w-full h-[clamp(380px,58vh,700px)] bg-[#1c1c1e] overflow-hidden">
            {/* Radial purple sunset glow */}
            <div aria-hidden className="absolute inset-0 pointer-events-none z-0" style={{ background: "radial-gradient(ellipse 90% 70% at 50% 100%, rgba(78,22,128,0.35) 0%, rgba(50,10,90,0.15) 40%, transparent 70%)" }} />
            {/* subtle gradient fade at bottom */}
            <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-[#1c1c1e]/60 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-0 flex items-end justify-center gap-3 md:gap-6 pb-0" style={{ paddingLeft: "5%", paddingRight: "5%" }}>

              {[
                { src: screenHome,    alt: "Home screen",    offset: 80 },
                { src: screenList,    alt: "Device list",    offset: 20 },
                { src: screenControl, alt: "Device control", offset: 60 },
                { src: screenColor,   alt: "Colour picker",  offset: 10 },
              ].map(({ src, alt, offset }) => (
                <div
                  key={alt}
                  className="flex-1 max-w-[180px] md:max-w-[220px] aspect-[9/19] flex-shrink-0 relative"
                  style={{ transform: `translateY(${offset}px)` }}
                >
                  {/* Phone outer shell */}
                  <div className="absolute inset-0 rounded-t-[2.2rem] bg-[#2c2c2e] border-2 border-white/35 shadow-[0_32px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.08)]" />
                  {/* Side buttons */}
                  <div className="absolute -left-[3px] top-[20%] w-[3px] h-6 bg-white/30 rounded-l-sm" />
                  <div className="absolute -left-[3px] top-[30%] w-[3px] h-10 bg-white/30 rounded-l-sm" />
                  <div className="absolute -right-[3px] top-[25%] w-[3px] h-8 bg-white/30 rounded-r-sm" />
                  {/* Screen */}
                  <div className="absolute inset-[4px] rounded-t-[1.9rem] overflow-hidden bg-black">
                    <img src={src} alt={alt} className="w-full h-full object-cover object-top" />
                    {/* notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[30%] h-[3.5%] bg-[#1a1a1a] rounded-b-2xl" />
                  </div>
                </div>
              ))}

            </div>
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
          <div className="flex items-center justify-center">
            <div className="w-[46%] overflow-hidden pb-6">
              <video
                src={productMockup}
                autoPlay
                muted
                loop
                playsInline
                className="block w-full scale-[1.1]"
              />
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

        <div className="grid md:grid-cols-2 gap-px bg-[#2A2A2A]">
          {[
            {
              n: "01",
              t: "Fragmentation",
              d: "Each device category operated differently. A user managing a lock, a light, and a sensor encountered three separate mental models inside a single app.",
            },
            {
              n: "02",
              t: "Poor Scalability",
              d: "Every new device required a custom build. Engineers started from scratch per launch. The cost of inconsistency compounded over time.",
            },
            {
              n: "03",
              t: "Automation Complexity",
              d: "Automations were the platform's highest-value feature — and its highest-friction experience. Most users never finished setup.",
            },
            {
              n: "04",
              t: "Security at a Crossroads",
              d: "TELUS needed to deliver a compelling self-monitored security product before professional monitoring was ready. The gap between ambition and infrastructure was significant.",
              highlight: true,
            },
          ].map((c) => (
            <div
              key={c.t}
              className={`relative group p-10 md:p-14 bg-[#111111] transition-colors duration-300 hover:bg-[#161616] ${c.highlight ? "border-l-2 border-l-white/60" : ""}`}
            >
              <p
                className={`${sectionLabel} mb-8 ${c.highlight ? "text-white/50" : "text-white/25"}`}
                style={{ fontSize: "11px" }}
              >
                {c.n}
              </p>
              <h4
                className="tracking-tight mb-5 leading-[1.1]"
                style={{ fontSize: "clamp(1.25rem, 1.8vw, 1.625rem)", fontWeight: 700 }}
              >
                {c.t}
              </h4>
              <p
                className="text-white/55 leading-relaxed"
                style={{ fontSize: "clamp(0.9375rem, 1.1vw, 1rem)" }}
              >
                {c.d}
              </p>
              {/* subtle bottom line reveal on hover */}
              <div className="absolute bottom-0 left-10 md:left-14 right-10 md:right-14 h-px bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          ))}
        </div>

      </section>

      {/* 03 MY ROLE */}
      <section className="bg-[#FAFAFA] text-[#111111] px-6 md:px-12 pt-24 md:pt-36 pb-24 md:pb-36">
        <p className={`${sectionLabel} text-[#111111]/50 mb-12`} style={{ fontSize: "12px" }}>
          03 · My Role
        </p>

        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">
          {/* Left — text */}
          <div>
            <p
              className="tracking-[-0.01em] leading-[1.35] mb-16"
              style={{ fontSize: "clamp(1.25rem, 2.2vw, 1.75rem)", fontWeight: 500 }}
            >
              I served as Design Manager and product design leader across the full TELUS
              SmartHome+ program, embedded as a Poatek UX Lead within the TELUS design
              organization.
            </p>

            <div className="grid grid-cols-2 gap-10 border-t border-[#111111]/10 pt-10">
              <div>
                <h4 className="mb-5 tracking-tight" style={{ fontSize: "1rem", fontWeight: 700 }}>
                  What was mine
                </h4>
                <ul className="space-y-3 text-[#111111]/60">
                  {["Product strategy", "Design direction", "Stakeholder alignment", "Team coordination", "Delivery framing"].map((item) => (
                    <li key={item} className="flex items-center gap-2.5" style={{ fontSize: "0.9375rem" }}>
                      <span className="w-1 h-1 bg-[#111111]/40 rounded-full flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-5 tracking-tight" style={{ fontSize: "1rem", fontWeight: 700 }}>
                  What was the team's
                </h4>
                <ul className="space-y-3 text-[#111111]/60">
                  {["Execution", "Exploration", "Craft"].map((item) => (
                    <li key={item} className="flex items-center gap-2.5" style={{ fontSize: "0.9375rem" }}>
                      <span className="w-1 h-1 bg-[#111111]/40 rounded-full flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right — team photo */}
          <div className="flex flex-col gap-3">
            <div className="overflow-hidden">
              <img
                src={teamPhoto}
                alt="TELUS SmartHome+ design team"
                className="w-full object-cover grayscale contrast-[1.05]"
                style={{ aspectRatio: "4/3" }}
              />
            </div>
            <p className={`${sectionLabel} text-[#111111]/35`} style={{ fontSize: "10px" }}>
              TELUS SmartHome+ design team — Vancouver, 2025
            </p>
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
          A. SDUI — From Device-Centric to Capability-Centric
        </h3>

        <p
          className="text-[#111111]/80 leading-relaxed max-w-[64ch] mb-20 md:mb-24"
          style={{ fontSize: "clamp(1.0625rem, 1.5vw, 1.25rem)" }}
        >
          The foundational bet was Server Driven UI. Instead of building a screen per
          device, we shifted the model: each device declares its{" "}
          <em>capabilities</em> — what it can do — and the frontend renders
          automatically from a shared component library. The backend drives the UI.
          No custom engineering per device launch.
        </p>

        {/* Before / After panels */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-16 md:mb-20">

          {/* BEFORE */}
          <SlideIn from="left">
          <div className="relative bg-[#1A1A1A] text-white flex flex-col overflow-hidden">
            <div className="flex items-center gap-3 px-8 pt-8 pb-6">
              <span className="w-2 h-2 rounded-full bg-[#E5484D]" />
              <span className={`${sectionLabel} text-[#E5484D]`} style={{ fontSize: "11px" }}>
                Before · Device-Centric
              </span>
            </div>
            <div className="flex justify-center px-12 py-8 h-[460px]">
              <img src={sduiBeforeLight} alt="Light bulb before SDUI" className="h-full object-contain" />
            </div>
            <p className="px-8 py-6 text-white/55 leading-relaxed border-t border-white/10" style={{ fontSize: "0.875rem" }}>
              Each device had its own custom UI. No shared model, no reuse.
            </p>
          </div>
          </SlideIn>

          {/* AFTER */}
          <SlideIn from="right" delay={0.1}>
          <div className="relative bg-[#1A1A1A] text-white flex flex-col overflow-hidden">
            <div className="flex items-center gap-3 px-8 pt-8 pb-6">
              <span className="w-2 h-2 rounded-full bg-[#30A46C]" />
              <span className={`${sectionLabel} text-[#30A46C]`} style={{ fontSize: "11px" }}>
                After · Capability-Centric (SDUI)
              </span>
            </div>
            <div className="flex justify-center px-12 py-8 h-[460px]">
              <img src={sduiAfterLight} alt="Light bulb after SDUI" className="h-full object-contain" />
            </div>
            <p className="px-8 py-6 text-white/75 leading-relaxed border-t border-white/10" style={{ fontSize: "0.875rem" }}>
              Capabilities drive the UI — any device, same framework.
            </p>
          </div>
          </SlideIn>
        </div>

        {/* Before / After — comparison slider (white bg) */}
        <ScaleIn className="mb-16 md:mb-20">
          <div className="bg-white border border-[#111111]/08 overflow-hidden">
            <div className="flex items-center justify-between px-8 pt-7 pb-5 border-b border-[#111111]/06">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E5484D]" />
                  <span className={`${sectionLabel} text-[#E5484D]`} style={{ fontSize: "11px" }}>Before · Device-Centric</span>
                </span>
                <span className="text-[#111111]/20" aria-hidden>→</span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#30A46C]" />
                  <span className={`${sectionLabel} text-[#30A46C]`} style={{ fontSize: "11px" }}>After · Capability-Centric (SDUI)</span>
                </span>
              </div>
              <span className="hidden md:block text-[#111111]/30 tracking-tight" style={{ fontSize: "11px" }}>← drag to compare →</span>
            </div>
            <div className="bg-[#F7F7F7] px-12 md:px-24 py-12">
              <ComparisonSlider
                before={sduiBeforeScreens}
                after={sduiAfterScreens}
                beforeLabel="Before"
                afterLabel="After"
              />
            </div>
            <p className="px-8 py-5 text-[#111111]/45 leading-relaxed border-t border-[#111111]/06" style={{ fontSize: "0.8125rem" }}>
              Drag the slider to compare device-centric vs. capability-centric UI across the same 4 screens.
            </p>
          </div>
        </ScaleIn>

        {/* Leadership decision callout */}
        <div className="relative p-10 md:p-16 bg-[#111111] text-white border border-white/30">
          <p className={`${sectionLabel} text-white/40 mb-6`} style={{ fontSize: "11px" }}>
            Leadership Decision
          </p>
          <p
            className="tracking-[-0.015em] leading-[1.25] max-w-[60ch]"
            style={{ fontSize: "clamp(1.25rem, 2.2vw, 1.875rem)", fontWeight: 500 }}
          >
            The key call: protect the SDUI workstream from urgent security requests
            mid-stream. Disrupting a foundational build to fix an urgent problem
            almost always costs more than it saves.
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

          {/* Home/Away screen showcase */}
          <div className="mt-16 md:mt-20">
            <p className={`${sectionLabel} text-white/40 mb-10`} style={{ fontSize: "11px" }}>
              The Home/Away model in product
            </p>
            {(() => {
              const screens = [
                { src: homeAway01, label: "Away state", sub: "Home screen adapts — cameras + sensors surfaced" },
                { src: homeAway02, label: "Smart notifications", sub: "Away active, Home quieter — critical always on" },
                { src: homeAway03, label: "Home occupancy", sub: "One tap to switch — simple mental model" },
                { src: homeAway04, label: "State confirmed", sub: "Contextual toast — zero friction feedback" },
              ];
              return (
                <>
                  {/* Images + arrows row */}
                  <div className="flex items-center">
                    {screens.map(({ src, label }, i) => (
                      <>
                        <Reveal key={label} delay={i * 0.08} y={20} className="flex-1 min-w-0">
                          <div className="w-full aspect-[9/19] overflow-hidden">
                            <img src={src} alt={label} className="w-full h-full object-contain" />
                          </div>
                        </Reveal>
                        {i < screens.length - 1 && (
                          <div key={`arrow-${i}`} className="flex-shrink-0 px-2 md:px-3">
                            <ArrowRight className="w-4 h-4 text-white/25" />
                          </div>
                        )}
                      </>
                    ))}
                  </div>
                  {/* Labels row */}
                  <div className="grid grid-cols-4 mt-4">
                    {screens.map(({ label, sub }) => (
                      <div key={label} className="text-center px-1">
                        <p className="text-white/80 tracking-tight leading-snug" style={{ fontSize: "0.8125rem", fontWeight: 600 }}>{label}</p>
                        <p className="text-white/40 leading-snug mt-1" style={{ fontSize: "0.75rem" }}>{sub}</p>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>

          {/* Critical vs Informational notification tiers */}
          <div className="mt-28 md:mt-36">
            <p className="uppercase tracking-[0.22em] text-white/40 mb-16 text-center" style={{ fontSize: "11px" }}>
              Critical vs. informational notification tiers
            </p>
            <div className="pt-16 pb-8 overflow-visible">
              <NotificationTiers />
            </div>
          </div>

          {/* Jarvis-assisted setup */}
          <div className="mt-32 md:mt-40">
            <p className={`${sectionLabel} text-white/40 mb-10 text-center`} style={{ fontSize: "11px" }}>
              Jarvis-assisted setup for advanced automation
            </p>

            {/* Flow 1 — 4 screens */}
            <div className="mb-24 md:mb-32">
              <p className="uppercase tracking-[0.16em] text-white/25 mb-10 text-center" style={{ fontSize: "11px" }}>
                Creating an automation in one sentence
              </p>
              {(() => {
                const flow1 = [
                  { src: jarvis01, label: "Jarvis home", sub: "Starting point — quick action suggestions" },
                  { src: jarvis02, label: "Intent understood", sub: "Natural language parsed into a routine" },
                  { src: jarvis03, label: "Routine proposed", sub: "Full preview before saving" },
                  { src: jarvis04, label: "Confirmed", sub: "One tap to confirm — done" },
                ];
                return (
                  <>
                    <div className="flex items-center">
                      {flow1.map(({ src, label }, i) => (
                        <>
                          <Reveal key={label} delay={i * 0.08} y={20} className="flex-1 min-w-0">
                            <div className="w-full aspect-[9/19] overflow-hidden">
                              <img src={src} alt={label} className="w-full h-full object-contain" />
                            </div>
                          </Reveal>
                          {i < flow1.length - 1 && (
                            <div key={`arrow-${i}`} className="flex-shrink-0 px-2 md:px-3">
                              <ArrowRight className="w-4 h-4 text-white/25" />
                            </div>
                          )}
                        </>
                      ))}
                    </div>
                    <div className="grid grid-cols-4 mt-4">
                      {flow1.map(({ label, sub }) => (
                        <div key={label} className="text-center px-1">
                          <p className="text-white/80 tracking-tight leading-snug" style={{ fontSize: "0.8125rem", fontWeight: 600 }}>{label}</p>
                          <p className="text-white/40 leading-snug mt-1" style={{ fontSize: "0.75rem" }}>{sub}</p>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Flow 2 — 3 screens, same item width as flow 1 (w-3/4 container + flex-1) */}
            <div>
              <p className="uppercase tracking-[0.16em] text-white/25 mb-10 text-center" style={{ fontSize: "11px" }}>
                Controlling a device conversationally
              </p>
              {(() => {
                const flow2 = [
                  { src: jarvis01, label: "Jarvis home", sub: "Starting point — quick action suggestions" },
                  { src: jarvis05, label: "Intent understood", sub: "Device and action identified instantly" },
                  { src: jarvis06, label: "Device adjusted", sub: "Confirmation with current state" },
                ];
                return (
                  <>
                    <div className="w-3/4 flex items-center mx-auto">
                      {flow2.map(({ src, label }, i) => (
                        <>
                          <Reveal key={label} delay={i * 0.08} y={20} className="flex-1 min-w-0">
                            <div className="w-full aspect-[9/19] overflow-hidden">
                              <img src={src} alt={label} className="w-full h-full object-contain" />
                            </div>
                          </Reveal>
                          {i < flow2.length - 1 && (
                            <div key={`arrow-${i}`} className="flex-shrink-0 px-2 md:px-3">
                              <ArrowRight className="w-4 h-4 text-white/25" />
                            </div>
                          )}
                        </>
                      ))}
                    </div>
                    <div className="w-3/4 grid grid-cols-3 mt-4 mx-auto">
                      {flow2.map(({ label, sub }) => (
                        <div key={label} className="text-center px-1">
                          <p className="text-white/80 tracking-tight leading-snug" style={{ fontSize: "0.8125rem", fontWeight: 600 }}>{label}</p>
                          <p className="text-white/40 leading-snug mt-1" style={{ fontSize: "0.75rem" }}>{sub}</p>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Milestone callout */}
          <div className="relative mt-32 md:mt-40 p-10 md:p-14 bg-[#111111] border border-white/40">
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

      {/* 04 SOLUTION — C. Generative UI (light) */}
      <section className="relative bg-[#FAFAFA] text-[#111111] px-6 md:px-12 pt-24 md:pt-36 pb-0 overflow-hidden">
        <h3
          className="tracking-[-0.02em] leading-[1.05] mb-16 md:mb-20 max-w-[24ch]"
          style={{ fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)", fontWeight: 700 }}
        >
          C. Generative UI — From Static Interface to Adaptive Experience
        </h3>

        {/* Direction cards */}
        <div className="grid sm:grid-cols-2 gap-5 md:gap-6 mb-24 md:mb-32">
          {[
            {
              t: "Static UI",
              d: "Same experience for every user, every time. No awareness of context, behavior, or intent.",
              tag: "The problem we were solving",
              tagTone: "muted",
              icon: "⬜",
            },
            {
              t: "Reactive UI",
              d: "The interface responds to explicit user requests. Still requires users to configure everything.",
              tag: "Higher effort, lower return",
              tagTone: "muted",
              icon: "↩️",
            },
            {
              t: "Contextual UI",
              d: "The interface adapts to some signals — time, location, device state — but within fixed layouts.",
              tag: "Partial — no intent layer",
              tagTone: "yellow",
              icon: "📡",
            },
            {
              t: "Generative UI",
              d: "Structured, signal-driven adaptation. The interface evolves with the user while preserving consistency and control.",
              tag: "Transformational",
              tagTone: "green",
              icon: "✦",
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

        {/* Principle quote — floating */}
        <div className="py-24 md:py-32 mb-8 md:mb-12 text-center">
          <blockquote className="mx-auto" style={{ maxWidth: "860px" }}>
            <p
              className="leading-[1.1] text-[#111111]"
              style={{
                fontSize: "clamp(1.75rem, 3.6vw, 3rem)",
                fontWeight: 700,
                fontStyle: "italic",
                letterSpacing: "-0.025em",
              }}
            >
              "The interface should adapt to the user.{" "}
              <span style={{ color: "#111111", opacity: 0.3 }}>
                Not the other way around."
              </span>
            </p>
            <p
              className="mt-7 mx-auto text-[#111111]/45 leading-relaxed"
              style={{
                fontSize: "clamp(0.875rem, 1.2vw, 1rem)",
                fontWeight: 400,
                maxWidth: "48ch",
                letterSpacing: "0.01em",
              }}
            >
              GenUI is not UI generation. It's structured adaptation —
              built on guardrails, driven by signals.
            </p>
          </blockquote>
        </div>

        {/* Interactive Moments — GenUI prototype (native, no iframe) */}
        <div className="-mx-6 md:-mx-12 pb-0 mb-0" style={{ background: "#ffffff" }}>
          <div className="px-6 md:px-12 pt-16 md:pt-20 pb-6">
            <p className={`${sectionLabel} text-[#111111]/40`} style={{ fontSize: "11px" }}>
              Interactive prototype — GenUI adaptive moments
            </p>
          </div>
          <GenUIEmbed />
        </div>

      </section>

      {/* 05 RESULTS */}
      <section className="bg-[#111111] text-white px-6 md:px-12 py-24 md:py-36" style={{ marginTop: 0 }}>
        <p className={`${sectionLabel} text-white/50 mb-16 md:mb-20`} style={{ fontSize: "12px" }}>
          05 · Results
        </p>

        {/* Milestone cards — 2 × 2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-24 md:mb-32">
          {[
            {
              eyebrow: "SDUI Foundation",
              accent: "#2A9CB5",
              headline: "Platform scalability unlocked",
              body: "A shared component system replaced device-specific implementations. New device launches now require backend configuration — not front-end engineering sprints.",
              tag: "Shipped",
            },
            {
              eyebrow: "DIY Security — September 2025",
              accent: "#E8A33D",
              headline: "Self-monitored security brought to market",
              body: "TELUS enabled a viable security offering before professional monitoring was commercially available — protecting business continuity and delivering real customer value.",
              tag: "MVP Reached · Q1 2026 Rollout",
            },
            {
              eyebrow: "Jarvis 2.0 — Early Market Testing",
              accent: "#30A46C",
              headline: "AI operating layer in customers' hands",
              body: "Conversational automation creation, device control, and context-aware onboarding shipped across all SmartHome+ entry points. GA planned H2 2026.",
              tag: "Early Market Testing",
            },
            {
              eyebrow: "Generative UI — In Progress",
              accent: "#9B8EF8",
              headline: "Signal-driven adaptation ready for pilot",
              body: "GenUI framework validated through internal testing. Adaptive surface logic, intent signals, and guardrail system handed off for platform integration.",
              tag: "In Development",
            },
          ].map((r, i) => (
            <article
              key={r.eyebrow}
              className="relative flex flex-col justify-between gap-10 p-8 md:p-12 bg-[#1A1A1A] border border-white/10 transition-all hover:border-white/25 hover:-translate-y-0.5"
            >
              <div
                aria-hidden
                className="absolute top-0 left-0 w-1 h-full"
                style={{ background: r.accent }}
              />
              <div>
                <span
                  className={`${sectionLabel} text-white/40 block mb-6`}
                  style={{ fontSize: "11px" }}
                >
                  0{i + 1} · {r.eyebrow}
                </span>
                <h4
                  className="tracking-[-0.02em] leading-[1.1] mb-5"
                  style={{ fontSize: "clamp(1.375rem, 2.4vw, 1.875rem)", fontWeight: 700 }}
                >
                  {r.headline}
                </h4>
                <p
                  className="text-white/60 leading-relaxed"
                  style={{ fontSize: "clamp(0.9375rem, 1.1vw, 1rem)" }}
                >
                  {r.body}
                </p>
              </div>
              <div>
                <span
                  className="inline-flex items-center gap-2 px-4 py-2.5 border tracking-tight"
                  style={{
                    fontSize: "12px",
                    color: r.accent,
                    borderColor: `${r.accent}55`,
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
      <section className="bg-[#111111] text-white px-6 md:px-12 pt-24 md:pt-36 pb-24 md:pb-36">
        <p className={`${sectionLabel} text-white/50 mb-16 md:mb-20`} style={{ fontSize: "12px" }}>
          06 · Key Learnings
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {[
            {
              t: "Scalability is a design problem, not just an engineering one.",
              d: "The decision to invest in SDUI foundations before adding more device-specific screens was a design strategy call as much as a technical one. Architecture decisions create enormous product leverage — or enormous debt.",
            },
            {
              t: "Alignment is often harder than the design itself.",
              d: "The most difficult work wasn't designing screens or interaction models. It was getting Design, Product, Engineering, Architecture, and external partners to agree on what we were building and why.",
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
          ].map((l, i) => (
            <article
              key={l.t}
              className="flex flex-col gap-6 p-8 md:p-12 bg-[#1A1A1A] border border-white/10 transition-all hover:border-white/25 hover:-translate-y-0.5"
            >
              <span
                className="text-white/15 tracking-[-0.04em] leading-none"
                style={{ fontSize: "clamp(3rem, 6vw, 5rem)", fontWeight: 700 }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3
                  className="tracking-[-0.02em] leading-[1.1] mb-4"
                  style={{ fontSize: "clamp(1.125rem, 1.8vw, 1.375rem)", fontWeight: 700 }}
                >
                  {l.t}
                </h3>
                <p
                  className="text-white/60 leading-relaxed"
                  style={{ fontSize: "clamp(0.9375rem, 1.1vw, 1rem)" }}
                >
                  {l.d}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

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
