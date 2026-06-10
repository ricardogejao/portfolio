import { ArrowRight, Download, Mail, Linkedin } from "lucide-react";
import { Nav } from "./nav";
import { Footer } from "./footer";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import profilePhoto from "../../imports/image-1.png";

type Props = {
  onOpenTelus: () => void;
  onBackHome: () => void;
};

const sectionLabel = "uppercase tracking-[0.22em]";

const timeline = [
  { co: "TELUS Digital", role: "Design Lead & Manager", date: "Nov 2024 – Present" },
  { co: "IPSY", role: "Lead Product Designer", date: "Feb 2023 – Nov 2024" },
  { co: "Intuit", role: "Design Manager & Principal Product Designer", date: "Apr 2021 – Jan 2023" },
  { co: "Samsung Electronics", role: "Lead Product Designer → UX Design Coordinator", date: "Feb 2018 – Apr 2021" },
  { co: "CI&T", role: "Senior UX Designer", date: "Jul 2016 – Feb 2018" },
  { co: "Intel Corporation", role: "Senior UX Visual Designer", date: "Jan 2014 – Jul 2016" },
];

const philosophy = [
  {
    t: "Strategy before screens",
    d: "The most impactful design decisions happen before any UI is drawn. I spend more time in product strategy and stakeholder alignment than in Figma.",
  },
  {
    t: "Systems thinking",
    d: "I design for the pattern, not the instance. Platform decisions create leverage. They compound.",
  },
  {
    t: "Leadership as craft",
    d: "Building a team that delivers well under ambiguity is as hard as any design problem. I take it just as seriously.",
  },
];

export function About({ onOpenTelus, onBackHome }: Props) {
  return (
    <div className="w-full bg-[#FAFAFA]">
      {/* HERO */}
      <section className="bg-[#FAFAFA] text-[#111111]">
        <Nav variant="light" />
        <div className="px-6 md:px-12 pt-16 md:pt-24 pb-24 md:pb-36">
          <div className="grid md:grid-cols-[1.4fr_1fr] gap-12 md:gap-20 items-start max-w-[1400px]">
            <div>
              <p className={`${sectionLabel} text-[#111111]/50 mb-8`} style={{ fontSize: "12px" }}>
                About
              </p>
              <h1
                className="tracking-[-0.03em] leading-[1.05] max-w-[20ch] mb-10"
                style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 700 }}
              >
                I lead design at the intersection of Product, Platform, and AI.
              </h1>
              <div className="space-y-6 max-w-[58ch] text-[#111111]/75 leading-relaxed" style={{ fontSize: "clamp(1rem, 1.3vw, 1.15rem)" }}>
                <p>
                  My name is José Ricardo — people call me Gejão. I'm a Brazilian design
                  leader based in São Paulo, working remotely with global teams. I
                  specialize in platform design, AI-powered experiences, and building the
                  organizational conditions for design to operate at scale.
                </p>
                <p>
                  I don't think of design as a delivery function. I think of it as a
                  strategic capability — one that shapes product architecture, team
                  structure, and business outcomes. That's the work I'm drawn to, and the
                  work I do best.
                </p>
              </div>
            </div>

            <div className="flex md:justify-end">
              <div className="relative w-[260px] md:w-[340px] aspect-square rounded-full overflow-hidden border border-[#111111]/10">
                <ImageWithFallback
                  src={profilePhoto}
                  alt="José Ricardo Gejão Dourado"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="bg-[#111111] text-white px-6 md:px-12 py-24 md:py-36">
        <p className={`${sectionLabel} text-white/50 mb-16`} style={{ fontSize: "12px" }}>
          Experience
        </p>

        <ol className="max-w-[1100px] relative">
          {timeline.map((t, i) => (
            <li
              key={t.co}
              className="relative grid grid-cols-[40px_1fr] md:grid-cols-[60px_1.2fr_1fr_auto] gap-4 md:gap-10 items-baseline py-8 md:py-10 border-t border-white/10 last:border-b"
            >
              <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 border border-white/15 text-white/70 tracking-tight" style={{ fontSize: "11px" }}>
                {t.co
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div className="col-span-1 md:col-span-1">
                <h4 className="tracking-tight" style={{ fontSize: "clamp(1.125rem, 1.6vw, 1.375rem)", fontWeight: 700 }}>
                  {t.co}
                </h4>
              </div>
              <p className="text-white/60 leading-snug col-span-2 md:col-span-1">{t.role}</p>
              <p
                className={`${sectionLabel} text-white/40 md:text-right col-span-2 md:col-span-1`}
                style={{ fontSize: "11px" }}
              >
                {t.date}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* PHILOSOPHY */}
      <section className="bg-[#FAFAFA] text-[#111111] px-6 md:px-12 py-24 md:py-36">
        <p className={`${sectionLabel} text-[#111111]/50 mb-12`} style={{ fontSize: "12px" }}>
          Philosophy
        </p>
        <div className="grid md:grid-cols-3 gap-10 md:gap-12">
          {philosophy.map((p, i) => (
            <div key={p.t} className="border-t border-[#111111]/15 pt-8">
              <span
                className="text-[#111111]/30 tracking-tight block mb-6"
                style={{ fontSize: "0.875rem" }}
              >
                0{i + 1}
              </span>
              <h4
                className="tracking-tight mb-4 max-w-[18ch]"
                style={{ fontSize: "clamp(1.25rem, 1.8vw, 1.5rem)", fontWeight: 700 }}
              >
                {p.t}
              </h4>
              <p className="text-[#111111]/65 leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* OUTSIDE OF WORK */}
      <section className="bg-[#111111] text-white px-6 md:px-12 py-24 md:py-36">
        <p className={`${sectionLabel} text-white/50 mb-12`} style={{ fontSize: "12px" }}>
          Outside of Work
        </p>
        <p
          className="max-w-[44ch] tracking-[-0.01em] leading-[1.25]"
          style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 500 }}
        >
          When I'm not thinking about design systems, I'm thinking about music. I've
          been a musician longer than I've been a designer — and I think both are about
          listening carefully and then making something that wasn't there before.
        </p>
        <div className="mt-12 flex flex-wrap gap-3">
          {["Music", "Craft", "Learning"].map((tag) => (
            <span
              key={tag}
              className="px-4 py-2 border border-white/20 text-white/75 tracking-tight"
              style={{ fontSize: "13px" }}
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#FAFAFA] text-[#111111] px-6 md:px-12 py-24 md:py-36">
        <div className="max-w-[1100px]">
          <h2
            className="tracking-[-0.03em] leading-[1.02] mb-12"
            style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)", fontWeight: 700 }}
          >
            Let's work together.
          </h2>

          <div className="flex flex-wrap gap-4 mb-16">
            <button
              onClick={onOpenTelus}
              className="group inline-flex items-center gap-3 px-7 py-4 bg-[#111111] text-white hover:bg-[#111111]/90 transition-all"
            >
              <span className="tracking-tight">View Case Study</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              className="group inline-flex items-center gap-3 px-7 py-4 border border-[#111111]/30 hover:border-[#111111] transition-all"
            >
              <Download className="w-4 h-4" />
              <span className="tracking-tight">Download Resume</span>
            </button>
          </div>

          <div className="border-t border-[#111111]/10 pt-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <a
              href="mailto:ricardogej@gmail.com"
              className="inline-flex items-center gap-3 text-[#111111]/80 hover:text-[#111111] transition-colors"
            >
              <Mail className="w-4 h-4" />
              ricardogej@gmail.com
            </a>
            <a
              href="https://linkedin.com/in/gejao"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 text-[#111111]/80 hover:text-[#111111] transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              linkedin.com/in/gejao
            </a>
            <button
              onClick={onBackHome}
              className={`${sectionLabel} ml-auto text-[#111111]/50 hover:text-[#111111] transition-colors`}
              style={{ fontSize: "11px" }}
            >
              ← Back home
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
