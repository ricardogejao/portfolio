import { Layers, Sparkles, Network } from "lucide-react";
import { Reveal } from "./motion-primitives";

const principles = [
  {
    icon: Layers,
    title: "Platform Thinking",
    desc: "Design decisions that compound. Systems built to outlast the team that built them.",
  },
  {
    icon: Sparkles,
    title: "AI as Reduction",
    desc: "AI should make things simpler, not more capable of being complex.",
  },
  {
    icon: Network,
    title: "Org as Product",
    desc: "How a team is structured and how it communicates shows up in the product.",
  },
];

export function Approach() {
  return (
    <section id="about" className="bg-[#FAFAFA] text-[#111111] px-6 md:px-12 py-24 md:py-36">
      <div className="grid md:grid-cols-2 gap-16 md:gap-24 max-w-[1300px]">
        <Reveal>
        <div>
          <p
            className="uppercase tracking-[0.22em] text-[#111111]/50 mb-10"
            style={{ fontSize: "12px" }}
          >
            Approach
          </p>
          <p
            className="tracking-[-0.02em] leading-[1.2] max-w-[28ch]"
            style={{ fontSize: "clamp(1.5rem, 2.6vw, 2.25rem)", fontWeight: 500 }}
          >
            I work at the layer below the features. While others design screens, I focus
            on the architecture, alignment, and organizational conditions that make great
            work possible at scale.
          </p>
        </div>
        </Reveal>

        <div className="flex flex-col gap-6">
          {principles.map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title} delay={0.08 + i * 0.1}>
            <div
              className="group p-8 bg-white border border-[#111111]/10 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start gap-5">
                <div className="shrink-0 w-11 h-11 border border-[#111111]/15 flex items-center justify-center text-[#111111]/70 group-hover:text-[#111111] group-hover:border-[#111111]/40 transition-colors">
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="tracking-tight mb-2" style={{ fontSize: "1.125rem", fontWeight: 600 }}>
                    {title}
                  </h4>
                  <p className="text-[#111111]/60 leading-relaxed">{desc}</p>
                </div>
              </div>
            </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
