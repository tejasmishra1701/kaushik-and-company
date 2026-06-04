"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { NAV_LINKS, FIRM } from "@/lib/content";

export default function Navbar() {
  const { scrollY } = useScroll();

  // Fade out top bar as scrollY goes from 0 to 80px
  const topBarOpacity = useTransform(scrollY, [0, 80], [1, 0]);

  const navItems = NAV_LINKS.map((link) => ({
    name: link.label,
    link: link.href,
  }));

  return (
    <>
      <motion.div
        style={{ opacity: topBarOpacity }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 pointer-events-none"
      >
        <div className="font-serif text-silver [font-variant-caps:small-caps] text-lg tracking-wide">
          {FIRM.name}
        </div>
        <div className="font-mono text-sm text-silver-dim">
          {FIRM.phone}
        </div>
      </motion.div>

      <div className="pointer-events-auto">
        <FloatingNav navItems={navItems} />
      </div>
    </>
  );
}
