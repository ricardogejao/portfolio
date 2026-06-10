import logoGejao from "../../imports/image-2.png";

type NavProps = {
  variant?: "dark" | "light";
};

function go(route: "home" | "telus" | "about" | "resume") {
  if (typeof window !== "undefined" && window.__navigate) {
    window.__navigate(route);
  }
}

export function Nav({ variant = "dark" }: NavProps) {
  const text = variant === "dark" ? "text-white" : "text-[#111111]";
  const muted = variant === "dark" ? "text-white/70" : "text-[#111111]/70";
  return (
    <nav className={`flex items-center justify-between px-6 md:px-12 py-6 ${text}`}>
      <button onClick={() => go("home")} aria-label="Home" className="inline-flex items-center">
        <img
          src={logoGejao}
          alt="gejão"
          className={`h-7 w-auto object-contain ${variant === "dark" ? "" : "invert"}`}
        />
      </button>
      <div className={`flex items-center gap-6 uppercase tracking-[0.18em] ${muted}`} style={{ fontSize: "11px" }}>
        <button onClick={() => go("telus")} className="hover:text-current transition-colors">
          Work
        </button>
        <span aria-hidden>·</span>
        <button onClick={() => go("about")} className="hover:text-current transition-colors">
          About
        </button>
        <span aria-hidden>·</span>
        <button onClick={() => go("resume")} className="hover:text-current transition-colors">
          Resume
        </button>
      </div>
    </nav>
  );
}
