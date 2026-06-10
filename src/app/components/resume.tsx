import { Download, Mail, Linkedin, MapPin } from "lucide-react";
import { Nav } from "./nav";
import { Footer } from "./footer";

const sectionLabel = "uppercase tracking-[0.22em]";

const experience = [
  {
    co: "TELUS Digital (via Poatek)",
    role: "Design Lead & Manager — SmartHome+",
    date: "Nov 2024 – Present",
    bullets: [
      "Lead design across Security, Automation, AI, Device Management, and Platform workstreams; manage a team of 8 designers.",
      "Drove the SDUI architecture decision that turned new device launches from custom front-end builds into backend configuration.",
      "Shipped the September 2025 DIY Security MVP and led Jarvis 2.0, an AI operating layer for the SmartHome+ platform.",
    ],
  },
  {
    co: "IPSY",
    role: "Lead Product Designer",
    date: "Feb 2023 – Nov 2024",
    bullets: [
      "Owned design for subscription growth, member lifecycle, and onboarding across web and mobile.",
      "Partnered with product and growth to align acquisition, conversion, and retention surfaces under a shared design system.",
    ],
  },
  {
    co: "Intuit",
    role: "Design Manager & Principal Product Designer — QuickBooks",
    date: "Apr 2021 – Jan 2023",
    bullets: [
      "Led a platform-level workflow redesign that increased product usage by +12 percentage points.",
      "Managed senior designers across multiple QuickBooks workstreams and partnered with engineering on platform foundations.",
    ],
  },
  {
    co: "Samsung Electronics",
    role: "Lead Product Designer → UX Design Coordinator",
    date: "Feb 2018 – Apr 2021",
    bullets: [
      "Led UX design for consumer products across multiple Samsung verticals, growing into a coordination role over multiple squads.",
      "Established design rituals and review practices that scaled across distributed teams.",
    ],
  },
  {
    co: "CI&T",
    role: "Senior UX Designer",
    date: "Jul 2016 – Feb 2018",
    bullets: [
      "Delivered enterprise and consumer experiences for clients across fintech, retail, and telecom.",
      "Built reusable patterns and design foundations that accelerated client engagements.",
    ],
  },
  {
    co: "Intel Corporation",
    role: "Senior UX Visual Designer",
    date: "Jan 2014 – Jul 2016",
    bullets: [
      "Designed visual systems and product interfaces for internal platforms and consumer-facing initiatives.",
      "Partnered with engineering to bring early concept work into production-grade experiences.",
    ],
  },
];

const expertise = [
  "Design Leadership",
  "Platform Strategy",
  "Design Systems",
  "AI-Powered Experiences",
  "Product Strategy",
  "Cross-Functional Leadership",
  "Design Operations",
  "Fintech",
  "Smart Home",
  "SaaS",
  "Consumer Products",
];

export function Resume() {
  return (
    <div className="w-full bg-white text-[#111111]">
      <Nav variant="light" />

      {/* Sticky download */}
      <div className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-[#111111]/10">
        <div className="px-6 md:px-12 py-4 flex items-center justify-between max-w-[1100px] mx-auto">
          <span className={`${sectionLabel} text-[#111111]/50`} style={{ fontSize: "11px" }}>
            Resume · 2026
          </span>
          <button
            onClick={() => window.print()}
            className="group inline-flex items-center gap-2 px-4 py-2 bg-[#111111] text-white hover:bg-[#111111]/90 transition-colors"
            style={{ fontSize: "13px" }}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="tracking-tight">Download PDF Resume</span>
          </button>
        </div>
      </div>

      <main className="px-6 md:px-12 py-16 md:py-24 max-w-[1100px] mx-auto">
        {/* HEADER */}
        <header className="pb-12 border-b border-[#111111]/15">
          <h1
            className="tracking-[-0.03em] leading-[1.02] mb-4"
            style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)", fontWeight: 700 }}
          >
            José Ricardo Gejão Dourado
          </h1>
          <p
            className="text-[#111111]/70 tracking-tight mb-8"
            style={{ fontSize: "clamp(1.125rem, 1.6vw, 1.375rem)" }}
          >
            Design Leader · Platform, AI &amp; Product Strategy
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[#111111]/70">
            <a href="mailto:ricardogej@gmail.com" className="inline-flex items-center gap-2 hover:text-[#111111]">
              <Mail className="w-4 h-4" />
              ricardogej@gmail.com
            </a>
            <a
              href="https://linkedin.com/in/gejao"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 hover:text-[#111111]"
            >
              <Linkedin className="w-4 h-4" />
              linkedin.com/in/gejao
            </a>
            <span className="inline-flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              São Paulo, Brazil
            </span>
          </div>
        </header>

        {/* SUMMARY */}
        <section className="py-12 md:py-16 border-b border-[#111111]/15">
          <div className="grid md:grid-cols-[200px_1fr] gap-8 md:gap-12">
            <p className={`${sectionLabel} text-[#111111]/50`} style={{ fontSize: "12px" }}>
              Summary
            </p>
            <p className="text-[#111111]/85 leading-relaxed max-w-[68ch]" style={{ fontSize: "clamp(1rem, 1.3vw, 1.125rem)" }}>
              Design leader operating at the intersection of Product, Platform, AI, and
              Organizational Scale. 15+ years building products and leading teams across
              fintech, AI, consumer technology, and connected-device ecosystems.
              Currently managing 8 designers at TELUS SmartHome+ across Security,
              Automation, AI, Device Management, and Platform workstreams.
            </p>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section className="py-12 md:py-16 border-b border-[#111111]/15">
          <div className="grid md:grid-cols-[200px_1fr] gap-8 md:gap-12">
            <p className={`${sectionLabel} text-[#111111]/50`} style={{ fontSize: "12px" }}>
              Experience
            </p>
            <div className="space-y-12">
              {experience.map((e) => (
                <article key={e.co}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 mb-2">
                    <h3 className="tracking-tight" style={{ fontSize: "clamp(1.125rem, 1.6vw, 1.375rem)", fontWeight: 700 }}>
                      {e.co}
                    </h3>
                    <span
                      className={`${sectionLabel} text-[#111111]/50`}
                      style={{ fontSize: "11px" }}
                    >
                      {e.date}
                    </span>
                  </div>
                  <p className="text-[#111111]/60 mb-4">{e.role}</p>
                  <ul className="space-y-2 text-[#111111]/80 leading-relaxed">
                    {e.bullets.map((b) => (
                      <li key={b} className="grid grid-cols-[14px_1fr] gap-3">
                        <span className="mt-2 w-1.5 h-1.5 bg-[#111111] rounded-full" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* EXPERTISE */}
        <section className="py-12 md:py-16 border-b border-[#111111]/15">
          <div className="grid md:grid-cols-[200px_1fr] gap-8 md:gap-12">
            <p className={`${sectionLabel} text-[#111111]/50`} style={{ fontSize: "12px" }}>
              Expertise
            </p>
            <div className="flex flex-wrap gap-2">
              {expertise.map((tag) => (
                <span
                  key={tag}
                  className="px-3.5 py-2 border border-[#111111]/15 text-[#111111]/80 tracking-tight"
                  style={{ fontSize: "13px" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* EDUCATION */}
        <section className="py-12 md:py-16 border-b border-[#111111]/15">
          <div className="grid md:grid-cols-[200px_1fr] gap-8 md:gap-12">
            <p className={`${sectionLabel} text-[#111111]/50`} style={{ fontSize: "12px" }}>
              Education
            </p>
            <div>
              <h3 className="tracking-tight mb-1" style={{ fontSize: "1.125rem", fontWeight: 700 }}>
                Bachelor's Degree in Advertising &amp; Communication
              </h3>
              <p className="text-[#111111]/60">UNISAGRADO</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 md:py-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <button
                onClick={() => window.print()}
                className="group inline-flex items-center gap-3 px-7 py-4 bg-[#111111] text-white hover:bg-[#111111]/90 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="tracking-tight">Download PDF Resume</span>
              </button>
              <p
                className={`${sectionLabel} text-[#111111]/40 mt-4`}
                style={{ fontSize: "11px" }}
              >
                Last updated June 2026
              </p>
            </div>
            <a
              href="mailto:ricardogej@gmail.com"
              className="inline-flex items-center gap-3 border-b border-[#111111]/30 hover:border-[#111111] pb-1 tracking-tight transition-colors"
              style={{ fontSize: "clamp(1.125rem, 1.6vw, 1.25rem)", fontWeight: 500 }}
            >
              ricardogej@gmail.com
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
