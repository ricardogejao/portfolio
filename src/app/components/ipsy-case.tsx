import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Footer } from "./footer";
import { ScrollProgress } from "./scroll-progress";
import logoGejao from "../../imports/image-2.png";

// BANDD Case 02 assets
import headerMainVideo  from "../../imports/ipsy/woman_applying_makeup.mp4";
import headerMainImg    from "../../imports/ipsy/bandd/header_main.png";
import ipsyFullPage     from "../../imports/ipsy/bandd/ipsy_full_page.png";
import imgIPhone15Pro   from "../../imports/ipsy/bandd/iphone_frame.png";
import imgIPhone15Pro1  from "../../imports/ipsy/bandd/iphone_shadow.png";
import imgConversionFunnel from "../../imports/ipsy/bandd/conversion_funnel.png";
import imgSolutionFunnel   from "../../imports/ipsy/bandd/solution_funnel.png";
import imgDesktopMockup    from "../../imports/ipsy/bandd/desktop_mockup.png";
import imgValidatedControl from "../../imports/ipsy/bandd/validated_control.png";
import imgValidatedVariant from "../../imports/ipsy/bandd/validated_variant.png";

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

type Props = { onBack: () => void };

export function IpsyCase({ onBack }: Props) {
  return (
    <div className="font-sans text-gray-900 bg-white" style={{ ["--selection-bg" as string]: "#eecfd2" }}>
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

      {/* ── SECTION 1 — HERO ───────────────────────────────────── */}
      <section className="relative min-h-screen w-full flex items-center justify-center bg-white overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 z-0"
          style={{ background: "linear-gradient(135deg, #fddde0 0%, #fff5f6 50%, #fddde0 100%)" }}
        />

        <div className="relative z-10 w-full max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24 pt-32 md:pt-40 pb-12 md:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-32 items-end">

            {/* Left column */}
            <div className="lg:col-span-6 flex flex-col gap-10 -translate-y-[140px]">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex items-center gap-3 text-black font-bold tracking-[0.25em] uppercase"
                style={{ fontSize: "10px" }}
              >
                <span>SUBSCRIPTION</span>
                <span className="w-1 h-1 rounded-full bg-[#eecfd2]" />
                <span>ACQUISITION</span>
                <span className="w-1 h-1 rounded-full bg-[#eecfd2]" />
                <span>A/B TESTING</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="font-bold tracking-tighter leading-[0.95] text-black max-w-lg"
                style={{ fontSize: "clamp(2.75rem, 5vw, 4.5rem)" }}
              >
                Re-architecting acquisition at scale
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-col gap-6"
              >
                <p className="text-base md:text-lg text-gray-600 font-light leading-relaxed max-w-lg">
                  IPSY's sign-up flow forced users to earn the checkout. We moved personalization to where it belongs — after the sale.
                </p>

                <div className="flex items-center gap-8 pt-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-[#FF1DC7]" style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}>+14.7%</span>
                    <span className="text-xs tracking-wider uppercase text-gray-500">Subscription conversion</span>
                  </div>
                  <div className="w-px h-12 bg-gray-200" />
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-[#FF1DC7]" style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}>−30</span>
                    <span className="text-xs tracking-wider uppercase text-gray-500">Fewer interactions to checkout</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right column — iPhone mockup */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              {/* Radial glow */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.4 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-[400px] h-[400px] md:w-[500px] md:h-[500px] rounded-full"
                  style={{ background: "radial-gradient(circle, rgba(238,207,210,0.15) 0%, rgba(238,207,210,0) 70%)" }}
                />
              </motion.div>

              {/* Main product video */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="relative z-20 w-full max-w-[940px] aspect-[16/9] -translate-x-[80px] -translate-y-[140px] rounded-2xl overflow-hidden drop-shadow-2xl"
              >
                <video
                  src={headerMainVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Floating iPhone */}
              <motion.div
                initial={{ opacity: 0, y: 60, x: -40 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 1.2, delay: 0.9 }}
                className="absolute bottom-[38px] -left-[126px] lg:-left-[190px] z-30 w-[180px] md:w-[220px] -translate-y-[80px]"
                style={{ aspectRatio: "419/861" }}
              >
                <div className="relative w-full h-full drop-shadow-2xl">
                  <div className="absolute inset-0 z-30 pointer-events-none">
                    <img src={imgIPhone15Pro} className="absolute inset-0 w-full h-full object-contain" alt="iPhone Frame" />
                    <img src={imgIPhone15Pro1} className="absolute inset-0 w-full h-full object-contain mix-blend-multiply opacity-40" alt="iPhone Shadows" />
                  </div>
                  <div className="absolute bg-black rounded-[20px] md:rounded-[28px] overflow-hidden z-10"
                    style={{ top: "2.1%", left: "4.8%", right: "4.8%", bottom: "2.1%" }}
                  >
                    <div className="relative w-full h-full bg-white">
                      <motion.div
                        animate={{ y: ["0%", "0%", "-60%", "-60%", "0%"] }}
                        transition={{ duration: 16, times: [0, 0.12, 0.62, 0.75, 1], repeat: Infinity, ease: "easeInOut" }}
                        className="w-full"
                      >
                        <img src={ipsyFullPage} className="w-full h-auto object-cover" alt="IPSY Mobile Interface" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 1.2, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 right-0 h-px origin-center"
          style={{ background: "linear-gradient(to right, transparent, #eecfd2, transparent)" }}
        />
      </section>

      {/* ── SECTION 2 — STRUCTURAL FRICTION ───────────────────── */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-white border-t border-gray-50">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
          <FadeIn className="w-full flex justify-end mt-12 md:mt-20">
            <div className="flex flex-col gap-12 relative pl-8 max-w-4xl">
              <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-[#FF1DC7]" />

              <div className="flex flex-col gap-6 max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight">The quiz wasn't the problem. The timing was.</h2>
                <p className="text-lg text-gray-600 font-light leading-relaxed">
                  Before seeing a single plan or price, new users had to answer 20+ beauty questions. Every step was a chance to leave — and most did. The data made the diagnosis clear.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full">
                {[
                  { v: "67%", l: "left during the quiz — before reaching checkout." },
                  { v: "78%", l: "of those who reached checkout still abandoned." },
                  { v: "3.1%", l: "overall conversion. Industry average is 5–8%." },
                ].map(({ v, l }) => (
                  <div key={v} className="flex flex-col gap-2">
                    <span className="font-bold text-[#FF1DC7] tracking-tight" style={{ fontSize: "clamp(2.5rem, 4vw, 3rem)" }}>{v}</span>
                    <span className="text-lg text-gray-800 font-medium">{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} className="w-full bg-white overflow-hidden relative rounded-xl">
            <img src={imgConversionFunnel} alt="Conversion Funnel Analysis" className="w-full h-auto object-cover" />
          </FadeIn>
        </div>
      </section>

      {/* ── SECTION 3 — STRATEGIC REFRAMING ───────────────────── */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-[#F9F9F9]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          <FadeIn className="lg:col-span-5 flex flex-col gap-8 relative pl-8">
            <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-[#FF1DC7]" />
            <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight">The hypothesis: subscribers don't need to personalize to subscribe.</h2>
            <div className="flex flex-col gap-6 text-lg text-gray-600 font-light leading-relaxed">
              <p>
                The quiz was designed to make the bag feel personal — but it was placed before users had any reason to commit. We reframed the job: <strong className="text-black font-medium">show the value, close the sale, then personalize</strong>.
              </p>
              <p>
                Moving the quiz to post-purchase eliminated 30–35 interactions before checkout, while keeping the personalization data IPSY needed to curate each box.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Before */}
            <div className="flex flex-col gap-8 p-10 bg-white/50 border border-gray-200 rounded-sm">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400">Before — quiz gates everything</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>
              <div className="flex flex-col gap-0 relative flex-1">
                {["Beauty Quiz (20+ steps)", "Choose Plan", "Checkout"].map((step, i, arr) => (
                  <div key={step}>
                    <div className="flex items-center gap-4 text-gray-400 opacity-60">
                      <div className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full text-sm font-mono">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <span className="text-lg font-medium">{step}</span>
                    </div>
                    {i < arr.length - 1 && <div className="h-10 w-px bg-gray-200 ml-5 my-1" />}
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                  35+ interactions before reaching checkout
                </p>
              </div>
            </div>

            {/* After */}
            <div className="flex flex-col gap-8 p-10 bg-white border border-gray-100 shadow-xl shadow-gray-100/50 rounded-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#FF1DC7]" />
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#FF1DC7]">After — value leads</span>
                <div className="h-px flex-1 bg-gray-100" />
              </div>
              <div className="flex flex-col gap-0 flex-1">
                {[
                  { label: "Choose Plan", accent: false },
                  { label: "Checkout", accent: false },
                  { label: "Beauty Quiz", sublabel: "Post-purchase · optional", accent: true },
                ].map(({ label, sublabel, accent }, i, arr) => (
                  <div key={label}>
                    <div className="flex items-center gap-4 text-black">
                      <div
                        className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold ${
                          accent
                            ? "border-2 border-[#FF1DC7] bg-white text-[#FF1DC7] shadow-lg shadow-[#FF1DC7]/20"
                            : "bg-black text-white shadow-lg shadow-[#FF1DC7]/20"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-xl font-bold tracking-tight ${accent ? "text-[#FF1DC7]" : ""}`}>{label}</span>
                        {sublabel && (
                          <span className="font-bold text-black/40 uppercase tracking-widest mt-0.5" style={{ fontSize: "10px" }}>{sublabel}</span>
                        )}
                      </div>
                    </div>
                    {i < arr.length - 1 && <div className="h-10 w-px bg-black ml-5 my-1" />}
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-sm font-medium text-black flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF1DC7] shrink-0" />
                  5 interactions to checkout — down from 35+
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── SECTION 3.5 — SOLUTION FUNNEL ─────────────────────── */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-white border-t border-gray-50">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-12">
          <FadeIn className="flex flex-col gap-8 relative pl-8 max-w-4xl">
            <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-[#FF1DC7]" />
            <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight">A flow that respects user intent.</h2>
            <p className="text-lg text-gray-600 font-light leading-relaxed">
              Pricing and plan options surface immediately. Checkout is clear and transparent. The beauty quiz — now positioned as a benefit, not a barrier — moves to after the first purchase, where completion rates are naturally higher and the data is more reliable.
            </p>
          </FadeIn>

          <FadeIn delay={0.1} className="w-full bg-white rounded-xl overflow-hidden">
            <img src={imgSolutionFunnel} alt="New Solution Funnel Architecture" className="w-full h-auto" />
          </FadeIn>
        </div>
      </section>

      {/* ── SECTION 3.6 — RESPONSIVE PREVIEW ──────────────────── */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-[#fff0f3] overflow-hidden">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-16">
          <FadeIn className="flex flex-col gap-6 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight">Built for where subscribers actually shop.</h2>
            <p className="text-lg text-gray-600 font-light leading-relaxed">
              Over 70% of IPSY's traffic came from mobile — often impulse-driven, in short sessions. The redesign was mobile-first by design, with a desktop experience that matched the same clarity and speed.
            </p>
          </FadeIn>

          <div className="relative w-full min-h-[600px] md:min-h-[800px] flex items-center justify-center">
            {/* Desktop (back) */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute top-0 left-0 md:left-[10%] w-full md:w-[75%] rounded-xl shadow-2xl overflow-hidden border border-gray-200 bg-white z-10"
            >
              <div className="bg-gray-100 h-8 w-full border-b border-gray-200 flex items-center gap-2 px-4">
                <div className="w-3 h-3 rounded-full bg-red-400/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/50" />
                <div className="w-3 h-3 rounded-full bg-green-400/50" />
              </div>
              <img src={imgDesktopMockup} alt="Desktop Experience" className="w-full h-auto" />
            </motion.div>

            {/* Mobile (front) */}
            <motion.div
              initial={{ opacity: 0, y: 80, x: 20 }}
              whileInView={{ opacity: 1, y: 40, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="absolute top-[10%] md:top-[15%] right-[5%] md:right-[10%] w-[45%] md:w-[25%] rounded-[2rem] md:rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden border-[6px] md:border-[10px] border-white z-20 bg-white ring-1 ring-gray-900/5"
            >
              <img src={ipsyFullPage} alt="Mobile Experience" className="w-full h-auto" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4 — VALIDATED IN 4 WEEKS ──────────────────── */}
      <section className="pt-32 pb-24 md:pt-52 md:pb-32 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Visuals — overlapping phones */}
          <FadeIn className="relative h-[600px] w-full flex items-center justify-center">
            <motion.div
              whileInView={{ x: -20, y: -20, rotate: -3 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="absolute w-[60%] aspect-[9/16] bg-gray-100 shadow-2xl border border-gray-100 rounded-xl overflow-hidden z-10"
            >
              <img src={imgValidatedControl} className="w-full h-full object-cover object-top" alt="Original Flow" />
            </motion.div>
            <motion.div
              whileInView={{ x: 20, y: 20, rotate: 3 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="absolute w-[60%] aspect-[9/16] bg-gray-100 shadow-2xl border border-gray-100 rounded-xl overflow-hidden z-20"
            >
              <img src={imgValidatedVariant} className="w-full h-full object-cover" alt="New Validated Flow" />
            </motion.div>
          </FadeIn>

          {/* Metrics */}
          <FadeIn delay={0.1} className="flex flex-col gap-12">
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl md:text-4xl font-bold text-black">One sequence change. Four weeks. Clear winner.</h2>
              <p className="text-lg text-gray-600 font-light leading-relaxed max-w-lg">
                Validated in two layers: a live production A/B split and a moderated usability test with 6 never-subscribers. Control: the existing quiz-first flow. Variant: checkout-first with post-purchase quiz. The variant won on every metric.
              </p>
            </div>

            <div className="flex flex-col gap-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                {[
                  { v: "+14.7%", l: "Subscription conversion rate" },
                  { v: "−12.1%", l: "Sign-up abandonment" },
                  { v: "−34.4%", l: "Quiz drop-off (post-purchase)" },
                ].map(({ v, l }) => (
                  <div key={l} className="flex flex-col gap-2">
                    <span className="text-4xl md:text-5xl font-bold text-black border-b-4 border-[#eecfd2] w-fit pb-2">{v}</span>
                    <span className="text-sm font-medium uppercase tracking-widest text-gray-500 mt-2">{l}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-4 pt-6 border-t border-gray-100">
                <span className="text-3xl font-bold text-black">5 / 6</span>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-800">Participants explicitly preferred the new flow</span>
                  <span className="text-xs text-gray-400 uppercase tracking-widest">Moderated usability test · 6 never-subscribers</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── SECTION 5 — CTA ────────────────────────────────────── */}
      <section className="py-32 px-6 md:px-12 lg:px-24 bg-white flex flex-col items-center text-center gap-12 border-t border-gray-100">
        <h2 className="text-3xl md:text-4xl font-medium text-black max-w-2xl leading-tight">
          Sometimes the biggest conversion win is a sequence change.
        </h2>
        <p className="text-lg text-gray-500 font-light max-w-md -mt-4">
          This was one of several acquisition experiments run at IPSY. The pattern — remove friction before commitment, add depth after — translated across other flows too.
        </p>
        <a
          href="mailto:josericardo.dourado@poatek.com"
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-[#eecfd2] text-black text-sm font-medium tracking-widest uppercase transition-all duration-300 hover:bg-[#eecfd2]/20"
        >
          <span>Get in touch</span>
          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
        </a>
      </section>

      <Footer />
    </div>
  );
}
