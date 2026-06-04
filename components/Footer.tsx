"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FIRM, NAV_LINKS, PRACTICE_AREAS } from "@/lib/content";

export default function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <footer className="border-t border-[#1e1e1e] bg-[#080808]">
      {/* Top section */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto grid max-w-5xl grid-cols-1 gap-12 px-6 py-20 md:grid-cols-3"
      >
        {/* Column 1 — Firm identity */}
        <div>
          <div className="font-serif text-2xl font-normal text-white">
            {FIRM.name}
          </div>
          <div className="mt-1 text-xs uppercase tracking-widest text-silver-dim">
            {FIRM.tagline}
          </div>
          <div className="my-4 h-[1px] w-8 bg-[#c9a84c]" />
          <div className="font-serif text-xs italic text-silver-dim">
            {FIRM.established}
          </div>
          <div className="mt-3 font-serif text-xs leading-relaxed text-silver-dim">
            {FIRM.address}
          </div>
        </div>

        {/* Column 2 — Navigation */}
        <div>
          <div className="mb-4 text-xs uppercase tracking-widest text-silver-dim">
            Navigation
          </div>
          <div className="flex flex-col">
            {NAV_LINKS.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="block py-1 text-sm text-[#6b6965] transition-colors hover:text-silver"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Column 3 — Practice areas */}
        <div>
          <div className="mb-4 text-xs uppercase tracking-widest text-silver-dim">
            Practice Areas
          </div>
          <div className="flex flex-col">
            {PRACTICE_AREAS.map((area, idx) => (
              <p key={idx} className="py-1 font-serif text-sm text-[#6b6965]">
                {area.title}
              </p>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Middle section — BCI Disclaimer */}
      <div className="border-t border-[#1e1e1e] bg-[#060606]">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="mb-3 border-l-2 border-[#c9a84c] pl-3 text-xs uppercase tracking-widest text-silver-dim">
            Disclaimer
          </div>
          <p className="font-serif text-xs italic leading-relaxed text-silver-dim">
            {FIRM.bciDisclaimer}
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1e1e1e] bg-[#050505]">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
          <div className="text-xs text-silver-dim">
            &copy; 2026 Kaushik & Company. All rights reserved.
          </div>
          <a
            href={`mailto:${FIRM.email}`}
            className="text-center font-mono text-xs text-silver-dim transition-colors hover:text-silver"
          >
            {FIRM.email}
          </a>
          <div className="font-mono text-xs text-silver-dim">{FIRM.phone}</div>
        </div>
      </div>
    </footer>
  );
}
