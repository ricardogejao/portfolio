import { ArrowRight, Lock } from "lucide-react";
import { Reveal } from "./motion-primitives";
const smartHomeBg = "https://github.com/ricardogejao/portfolio/releases/download/v1.0/smart-home-bg.mp4";

type Props = {
  onOpenTelus?: () => void;
};

export function FeaturedWork({ onOpenTelus }: Props) {
  return (
    <section id="work" className="bg-[#FAFAFA] text-[#111111] px-6 md:px-12 py-24 md:py-36">
      <Reveal>
        <p
          className="uppercase tracking-[0.22em] text-[#111111]/50 mb-12"
          style={{ fontSize: "12px" }}
        >
          Selected Work
        </p>
      </Reveal>

      {/* Featured card */}
      <Reveal delay={0.08}>
      <article
        onClick={onOpenTelus}
        className="group relative bg-[#1A1A1A] text-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
      >
        <div className="grid md:grid-cols-2 gap-0">
          <div className="p-8 md:p-16 flex flex-col justify-between min-h-[420px] md:min-h-[560px]">
            <div>
              <span
                className="inline-block uppercase tracking-[0.22em] text-white/50 mb-8"
                style={{ fontSize: "11px" }}
              >
                Featured · 2024–2026
              </span>
              <h3
                className="tracking-[-0.02em] leading-[1.05] mb-6"
                style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", fontWeight: 700 }}
              >
                TELUS SmartHome+
              </h3>
              <p className="text-white/65 max-w-[48ch] leading-relaxed">
                Leading the design transformation of Canada's largest connected-home
                platform — AI operating layer, platform architecture, and self-monitored
                security.
              </p>
            </div>

            <div className="mt-12">
              <div className="flex flex-wrap gap-2 mb-8">
                {["AI", "Platform", "Design Leadership", "Smart Home"].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 border border-white/15 text-white/70 tracking-tight"
                    style={{ fontSize: "12px" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="inline-flex items-center gap-3 border-b border-white/40 pb-1 group-hover:border-white transition-colors">
                Read Case Study
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>

          {/* Device mockup with real screen */}
          <div className="relative min-h-[320px] md:min-h-full overflow-hidden">
            {/* Background video */}
            <video
              aria-hidden
              src={smartHomeBg}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
          </div>
        </div>
      </article>
      </Reveal>

      {/* Smaller cards */}
      <div className="grid md:grid-cols-2 gap-6 md:gap-8 mt-6 md:mt-8">
        {[
          {
            title: "IPSY",
            desc: "Subscription growth and member lifecycle design",
          },
          {
            title: "Intuit QuickBooks",
            desc: "+12pp product usage through platform-level workflow redesign",
          },
        ].map((p, i) => (
          <Reveal key={p.title} delay={0.16 + i * 0.1}>
          <article
            className="group relative bg-white border border-[#111111]/10 p-8 md:p-12 min-h-[280px] flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-not-allowed"
          >
            <div className="absolute top-6 right-6 inline-flex items-center gap-2 px-3 py-1.5 bg-[#111111] text-white uppercase tracking-[0.18em]" style={{ fontSize: "10px" }}>
              <Lock className="w-3 h-3" />
              Coming Soon
            </div>
            <div>
              <h4
                className="tracking-[-0.02em] mb-3"
                style={{ fontSize: "clamp(1.5rem, 2.6vw, 2rem)", fontWeight: 700 }}
              >
                {p.title}
              </h4>
              <p className="text-[#111111]/60 max-w-[36ch] leading-relaxed">{p.desc}</p>
            </div>
            <span
              className="mt-8 uppercase tracking-[0.22em] text-[#111111]/40"
              style={{ fontSize: "11px" }}
            >
              Case study in progress
            </span>
          </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
