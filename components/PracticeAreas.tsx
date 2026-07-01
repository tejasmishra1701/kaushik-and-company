"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";
import { PRACTICE_AREAS } from "@/lib/content";

// Slight scattered positions so the cards feel like they're on a desk
const CARD_OFFSETS = [
  { rotate: "-3deg",  translateX: "-5%",  translateY: "0%" },
  { rotate: "2deg",   translateX: "5%",   translateY: "-3%" },
  { rotate: "-1.5deg",translateX: "-8%",  translateY: "4%" },
  { rotate: "3.5deg", translateX: "6%",   translateY: "2%" },
  { rotate: "-2deg",  translateX: "-4%",  translateY: "-2%" },
  { rotate: "1deg",   translateX: "3%",   translateY: "5%" },
];

// Gold-adjacent accent colours per card so no two look identical
const ACCENT_COLORS = [
  "#c9a84c", // gold
  "#980707", // maroon
  "#c9a84c",
  "#4a7c6f", // muted teal
  "#980707",
  "#c9a84c",
];

export default function PracticeAreas() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [resetTrigger, setResetTrigger] = useState(0);

  const getAnimProps = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { duration: 0.6, ease: "easeOut" as const, delay },
  });

  return (
    <section id="practice" className="bg-[#0a0a0a]" ref={ref}>
      {/* Section header */}
      <div className="mx-auto max-w-3xl px-6 py-20">
        <motion.div {...getAnimProps(0)}>
          <h2 className="border-l-2 border-[#c9a84c] pl-3 text-xs uppercase tracking-widest text-silver-dim">
            Areas of Practice
          </h2>
        </motion.div>
        <motion.div {...getAnimProps(0.12)} className="mt-4">
          <h3 className="font-serif text-4xl font-normal text-white md:text-5xl">
            What we practise.
          </h3>
        </motion.div>
        <motion.div {...getAnimProps(0.22)} className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-silver-dim max-w-xl">
            Drag the cards to explore. Each area represents a dedicated practice
            before the courts and regulatory authorities of Haryana and the NCR.
          </p>
          <button
            onClick={() => setResetTrigger((prev) => prev + 1)}
            className="self-start sm:self-auto border border-[#1e1e1e] bg-[#111111] px-4 py-2 text-xs uppercase tracking-widest text-silver transition-colors hover:border-[#c9a84c] hover:text-white"
          >
            Reset Cards
          </button>
        </motion.div>
      </div>

      {/* Draggable card grid */}
      <div className="w-full border-t border-[#1e1e1e] bg-[#0a0a0a] px-6 py-16">
        <DraggableCardContainer className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PRACTICE_AREAS.map((area, idx) => {
              const offset = CARD_OFFSETS[idx % CARD_OFFSETS.length];
              const accent = ACCENT_COLORS[idx % ACCENT_COLORS.length];
              return (
                <motion.div
                  key={area.id}
                  {...getAnimProps(0.08 * idx)}
                  style={{
                    rotate: offset.rotate,
                  }}
                >
                  <DraggableCardBody
                    resetTrigger={resetTrigger}
                    className="!w-full !min-h-0 !rounded-none !bg-[#0d0d0d] !shadow-none border border-[#1e1e1e] p-7 cursor-grab group"
                  >
                    {/* Accent line */}
                    <div
                      className="mb-5 h-[2px] w-10 transition-all duration-300 group-hover:w-16"
                      style={{ backgroundColor: accent }}
                    />

                    {/* Title */}
                    <h3 className="font-serif text-xl font-normal text-white leading-snug mb-3">
                      {area.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-silver-dim leading-relaxed mb-6">
                      {area.description}
                    </p>

                    {/* Court tags */}
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {area.courts.map((court, cIdx) => (
                        <span
                          key={cIdx}
                          className="border border-[#1e1e1e] px-2 py-0.5 text-[10px] uppercase tracking-wider text-silver-dim"
                        >
                          {court}
                        </span>
                      ))}
                    </div>
                  </DraggableCardBody>
                </motion.div>
              );
            })}
          </div>
        </DraggableCardContainer>
      </div>

      <div className="w-full border-t border-[#1e1e1e]" />
    </section>
  );
}
