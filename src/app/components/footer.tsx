export function Footer() {
  return (
    <footer id="resume" className="bg-[#111111] text-white px-6 md:px-12 pt-24 pb-10">
      <div className="grid md:grid-cols-3 gap-10 md:gap-6 items-start">
        <div>
          <p className="tracking-tight" style={{ fontSize: "1.5rem", fontWeight: 600 }}>
            gejão
          </p>
        </div>

        <div className="flex md:justify-center gap-6 uppercase tracking-[0.18em] text-white/60" style={{ fontSize: "11px" }}>
          <a href="#work" className="hover:text-white transition-colors">Work</a>
          <span aria-hidden>·</span>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <span aria-hidden>·</span>
          <a href="#resume" className="hover:text-white transition-colors">Resume</a>
        </div>

        <div className="md:text-right text-white/70 leading-relaxed">
          <a href="mailto:ricardogej@gmail.com" className="hover:text-white transition-colors">
            ricardogej@gmail.com
          </a>
          <span className="mx-2 text-white/30">·</span>
          <a
            href="https://linkedin.com/in/gejao"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
          >
            linkedin.com/in/gejao
          </a>
        </div>
      </div>

      <div className="mt-20 pt-8 border-t border-white/10">
        <p className="text-white/40 uppercase tracking-[0.22em]" style={{ fontSize: "11px" }}>
          São Paulo, Brazil · Available for Head of Design opportunities · 2026
        </p>
      </div>
    </footer>
  );
}
