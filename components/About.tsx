"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { FIRM, CLIENTS } from "@/lib/content";

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const getAnimProps = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    transition: { duration: 0.6, ease: "easeOut" as const, delay },
  });

  // Split clients into two halves for the two marquee rows
  const mid = Math.ceil(CLIENTS.length / 2);
  const row1 = CLIENTS.slice(0, mid);
  const row2 = CLIENTS.slice(mid);

  return (
    <section id="about" className="bg-[#0a0a0a] py-32" ref={ref}>
      <TracingBeam className="mx-auto max-w-3xl px-6">
        <div className="flex flex-col gap-12">
          {/* Block 1 — Section label */}
          <motion.div {...getAnimProps(0)}>
            <h2 className="border-l-2 border-[#c9a84c] pl-3 text-xs uppercase tracking-widest text-silver-dim">
              About the Firm
            </h2>
          </motion.div>

          {/* Block 2 — Opening statement */}
          <motion.p
            {...getAnimProps(0.15)}
            className="font-serif text-2xl font-normal leading-relaxed text-[#b8b4ae] md:text-3xl"
          >
            For nearly two decades, Sandeep Kaushik &amp; Company has provided
            counsel to corporations, businesses, and individuals navigating the
            courts and regulatory authorities of Haryana and the National Capital
            Region.
          </motion.p>

          {/* Block 3 — Two-column fact grid */}
          <motion.div
            {...getAnimProps(0.2)}
            className="grid grid-cols-2 gap-px bg-[#1e1e1e]"
          >
            <div className="bg-[#0a0a0a] p-6">
              <div className="font-serif text-4xl text-white">20+</div>
              <div className="mt-1 text-sm text-silver-dim">
                Years of Practice
              </div>
            </div>
            <div className="bg-[#0a0a0a] p-6">
              <div className="font-serif text-4xl text-white">6</div>
              <div className="mt-1 text-sm text-silver-dim">
                Enrolled Advocates
              </div>
            </div>
            <div className="bg-[#0a0a0a] p-6">
              <div className="font-serif text-4xl text-white">12</div>
              <div className="mt-1 text-sm text-silver-dim">
                Courts &amp; Tribunals
              </div>
            </div>
            <div className="bg-[#0a0a0a] p-6">
              <div className="font-serif text-4xl text-white">6</div>
              <div className="mt-1 text-sm text-silver-dim">
                Areas of Practice
              </div>
            </div>
          </motion.div>

          {/* Block 4 — Clients marquee */}
          <motion.div {...getAnimProps(0.25)}>
            <div className="border-l-2 border-[#980707] pl-3 mb-4">
              <span className="text-xs uppercase tracking-widest text-silver-dim">
                Some of Our Clients
              </span>
            </div>

            {/* Row 1 — scrolls left */}
            <div className="overflow-hidden mb-3">
              <div className="animate-marquee">
                {[...row1, ...row1].map((client, i) => (
                  <span
                    key={`r1-${i}`}
                    className="border border-[#1C1A1A] px-3 py-1.5 text-xs text-[#6B6865] whitespace-nowrap mx-2 font-serif hover:border-[#980707] hover:text-[#C8C4BC] transition-colors cursor-default"
                  >
                    {client}
                  </span>
                ))}
              </div>
            </div>

            {/* Row 2 — scrolls right */}
            <div className="overflow-hidden">
              <div className="animate-marquee-reverse">
                {[...row2, ...row2].map((client, i) => (
                  <span
                    key={`r2-${i}`}
                    className="border border-[#1C1A1A] px-3 py-1.5 text-xs text-[#6B6865] whitespace-nowrap mx-2 font-serif hover:border-[#980707] hover:text-[#C8C4BC] transition-colors cursor-default"
                  >
                    {client}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Block 5 — Address block */}
          <motion.div
            {...getAnimProps(0.3)}
            className="flex flex-col border border-[#1e1e1e] p-6"
          >
            <div className="mb-3 text-xs uppercase tracking-widest text-silver-dim">
              Office
            </div>
            <div className="font-serif text-sm leading-relaxed text-silver">
              {FIRM.address}
            </div>
            <div className="mt-2 font-mono text-xs text-silver-dim">
              {FIRM.phone}
            </div>
            <a
              href={`mailto:${FIRM.email}`}
              className="mt-1 font-mono text-xs text-silver-dim transition-colors hover:text-silver"
            >
              {FIRM.email}
            </a>
          </motion.div>

          {/* Block 6 — BCI note */}
          <motion.div
            {...getAnimProps(0.35)}
            className="mt-8 border-l border-[#1e1e1e] pl-4"
          >
            <p className="font-serif text-xs italic leading-relaxed text-silver-dim">
              {FIRM.bciDisclaimer}
            </p>
          </motion.div>
        </div>
      </TracingBeam>
    </section>
  );
}
