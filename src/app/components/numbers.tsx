import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Counter, Reveal } from "./motion-primitives";

const stats = [
  { value: 15, suffix: "+", label: "Years in product design" },
  { value: 8, suffix: "", label: "Designers managed simultaneously" },
  { value: 6, suffix: "", label: "Countries design teams operated in" },
];

const EASE = [0.2, 0, 0, 1] as const;

export function Numbers() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="bg-[#111111] text-white px-6 md:px-12 py-24 md:py-36">
      <div ref={ref} className="max-w-[1200px] mx-auto">
        <div className="grid md:grid-cols-3 gap-16 md:gap-8 text-center">
          {stats.map((s, i) => (
            <div key={s.label} className="flex flex-col items-center">
              <div
                className="tracking-[-0.04em] leading-none"
                style={{ fontSize: "clamp(4rem, 9vw, 7rem)", fontWeight: 700 }}
              >
                <Counter to={s.value} suffix={s.suffix} delay={i * 0.15} duration={1.2} />
              </div>
              <Reveal delay={1.5 + i * 0.05} y={8} duration={0.4}>
                <p className="mt-6 text-white/60 max-w-[22ch]">{s.label}</p>
              </Reveal>
            </div>
          ))}
        </div>
        <motion.p
          className="mt-20 md:mt-28 text-center text-white/40 uppercase tracking-[0.28em]"
          style={{ fontSize: "12px" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, ease: EASE, delay: 2.0 }}
        >
          TELUS · Intuit · Samsung · IPSY · Intel · CI&amp;T
        </motion.p>
      </div>
    </section>
  );
}
