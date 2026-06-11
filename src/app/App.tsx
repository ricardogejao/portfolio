import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Hero } from "./components/hero";
import { FeaturedWork } from "./components/featured-work";
import { Numbers } from "./components/numbers";
import { Approach } from "./components/approach";
import { Footer } from "./components/footer";
import { CaseStudy } from "./components/case-study";
import { IpsyCase } from "./components/ipsy-case";
import { About } from "./components/about";
import { Resume } from "./components/resume";

type Route = "home" | "telus" | "ipsy" | "about" | "resume";

declare global {
  interface Window {
    __navigate?: (r: Route) => void;
  }
}

const EASE = [0.2, 0, 0, 1] as const;

export default function App() {
  const [route, setRoute] = useState<Route>("home");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    window.__navigate = setRoute;
  }, [route]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={route}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: route === "home" ? 0.3 : 0.3, ease: EASE }}
      >
        {route === "telus" && <CaseStudy onBack={() => setRoute("home")} />}
        {route === "ipsy" && <IpsyCase onBack={() => setRoute("home")} />}
        {route === "about" && (
          <About onOpenTelus={() => setRoute("telus")} onBackHome={() => setRoute("home")} />
        )}
        {route === "resume" && <Resume />}
        {route === "home" && (
          <div className="min-h-screen w-full bg-[#FAFAFA]" style={{ scrollBehavior: "smooth" }}>
            <Hero onOpenAbout={() => setRoute("about")} />
            <FeaturedWork onOpenTelus={() => setRoute("telus")} onOpenIpsy={() => setRoute("ipsy")} />
            <Numbers />
            <Approach />
            <Footer />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
