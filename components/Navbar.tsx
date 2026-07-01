"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { NAV_LINKS, FIRM } from "@/lib/content";
import { IconLock } from "@tabler/icons-react";

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
        <div className="font-serif text-silver [font-variant-caps:small-caps] text-lg tracking-wide pointer-events-auto select-none">
          {FIRM.name}
        </div>
        <div className="pointer-events-auto">
          <a
            href="/portal/login"
            className="flex items-center gap-1.5 rounded-full border border-[#c9a84c]/30 bg-[#c9a84c]/5 px-4 py-2 text-xs font-medium uppercase tracking-widest text-[#c9a84c] transition-all hover:border-[#c9a84c]/60 hover:bg-[#c9a84c]/10 hover:text-[#d4b060]"
          >
            <IconLock size={11} />
            <span>Client Portal</span>
          </a>
        </div>
      </motion.div>

      <div className="pointer-events-auto">
        <FloatingNav navItems={navItems} />
      </div>
    </>
  );
}
