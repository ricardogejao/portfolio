import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Nav } from "./nav";
import { FadeIn } from "./motion-primitives";

const heroVideo = "https://github.com/ricardogejao/portfolio/releases/download/v1.0/hero.mp4";

type Props = { onOpenAbout?: () => void };

const EASE = [0.2, 0, 0, 1] as const;

export function Hero({ onOpenAbout }: Props = {}) {
  return (
    <section className="relative bg-[#111111] text-white overflow-hidden">
      <video
        aria-hidden
        src={heroVideo}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
      />
      <div aria-hidden className="absolute inset-0 bg-[#111111]/50 pointer-events-none" />
      <motion.div
        aria-hidden
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'><path d='M64 0H0V64' fill='none' stroke='%23ffffff' stroke-width='1'/></svg>\")",
          backgroundSize: "64px 64px",
        }}
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.07 }}
        transition={{ duration: 1.2, ease: EASE }}
      />

      <div className="relative">
        <FadeIn duration={0.3}>
          <Nav variant="dark" />
        </FadeIn>

        <div className="px-6 md:px-12 pt-16 md:pt-28 pb-24 md:pb-40 max-w-[1400px]">
          <FadeIn duration={0.4}>
            <p
              className="uppercase tracking-[0.22em] text-white/50 mb-8"
              style={{ fontSize: "12px" }}
            >
              Design Leader · São Paulo &amp; Remote
            </p>
          </FadeIn>

          <FadeIn delay={0.1} duration={0.6} y={24}>
            <h1
              className="max-w-[18ch] tracking-[-0.03em] leading-[1.02]"
              style={{ fontSize: "clamp(2.75rem, 7.2vw, 6.5rem)", fontWeight: 700 }}
            >
              Design Leader at the intersection of Product, Platform &amp; AI
            </h1>
          </FadeIn>

          <FadeIn delay={0.3} duration={0.4}>
            <p
              className="mt-8 max-w-[58ch] text-white/60 leading-relaxed"
              style={{ fontSize: "clamp(1rem, 1.4vw, 1.25rem)" }}
            >
              15+ years building products and scaling design teams across fintech, AI,
              consumer technology, and connected-device ecosystems.
            </p>
          </FadeIn>

          <FadeIn delay={0.45} duration={0.3}>
            <div className="mt-12 flex flex-wrap items-center gap-6">
              <a
                href="#work"
                className="group inline-flex items-center gap-3 px-7 py-4 border border-white/30 hover:border-white hover:bg-white hover:text-[#111111] transition-all duration-300 active:scale-[0.97]"
              >
                <span className="tracking-tight">View Case Study</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
              <button
                onClick={onOpenAbout}
                className="text-white/70 hover:text-white border-b border-white/20 hover:border-white pb-1 transition-colors"
              >
                About me
              </button>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
