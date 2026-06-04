"use client";

import { Spotlight } from "@/components/ui/spotlight";
import { EncryptedText } from "@/components/ui/encrypted-text";
import { FIRM } from "@/lib/content";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setMounted(true);
    }, 13400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0a]">
      {/* Layer 1 - Spotlights */}
      <Spotlight
        className="-left-10 -top-40 h-[150%] w-[150%] md:-left-32 md:-top-20"
        fill="#b8b4ae"
      />
      <Spotlight
        className="right-0 top-0 h-[100%] w-[100%] md:-right-10"
        fill="#b8b4ae"
      />

      {/* Layer 2 - Subtle Grid */}
      <div
        className="absolute inset-0 z-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle, #1e1e1e 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Layer 2.5 - Logo Watermark */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg.png"
          alt=""
          fill
          className="pointer-events-none select-none object-contain object-center opacity-[0.6]"
        />
      </div>

      {/* Layer 3 - Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        {/* Label */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, ease: "easeOut" }}
          className="mb-6 text-center text-xs uppercase tracking-widest text-silver-dim"
        >
          Advocates & Legal Consultants &middot; Civil Lines, Gurugram
        </motion.div>

        {/* Firm Name */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, ease: "easeOut" }}
          className="mb-8"
        >
          {!mounted ? (
            <div className="min-h-[80px] w-full md:min-h-[120px]" />
          ) : (
            <EncryptedText
              text={FIRM.name}
              className="text-center font-serif text-6xl font-normal text-white md:text-8xl"
            />
          )}
        </motion.div>

        {/* Horizontal Rule */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 120 }}
          transition={{ delay: 0.9, duration: 0.8, ease: "easeOut" }}
          className="mb-8 h-[1px] bg-gold-line"
        />

        {/* Descriptor Line */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1, ease: "easeOut" }}
          className="mb-12 text-center font-serif text-sm italic text-silver-dim"
        >
          Established 2001 &middot; Gurugram, Haryana
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.4, ease: "easeOut" }}
          className="flex flex-row items-center justify-center gap-4"
        >
          <a
            href="#practice"
            className="rounded-full border border-[#1e1e1e] bg-[#111111] px-6 py-3 text-sm text-silver transition-colors hover:border-gold-line hover:text-white"
          >
            View Practice Areas
          </a>
          <a
            href="#contact"
            className="flex items-center gap-2 rounded-full bg-transparent px-6 py-3 text-sm text-silver-dim transition-colors hover:text-silver"
          >
            Contact the Firm <span>&rarr;</span>
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center"
      >
        <div className="mb-1 h-[4px] w-[4px] rounded-full bg-gold-line" />
        <motion.div
          animate={{
            opacity: [0.2, 1, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="h-10 w-[1px] bg-gold-line"
        />
      </motion.div>
    </div>
  );
}
