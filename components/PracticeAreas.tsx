"use client";

import { useRef } from "react";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { PRACTICE_AREAS } from "@/lib/content";
import { motion, useInView } from "framer-motion";

export default function PracticeAreas() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const getAnimProps = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    transition: { duration: 0.6, ease: "easeOut" as const, delay },
  });

  const scrollContent = PRACTICE_AREAS.map((area) => ({
    title: area.title,
    description: area.description,
    content: (
      <div className="flex h-full w-full flex-col items-center justify-center border border-[#1e1e1e] bg-[#111111] p-6 text-center">
        <div className="mb-4 h-[1px] w-12 bg-[#c9a84c]" />
        <h3 className="font-serif text-3xl font-normal text-white">
          {area.title}
        </h3>
        <div className="mt-6 flex flex-wrap justify-center">
          {area.courts.map((court, idx) => (
            <span
              key={idx}
              className="mb-2 mr-2 inline-block border border-[#1e1e1e] px-2 py-0.5 text-xs text-silver-dim"
            >
              {court}
            </span>
          ))}
        </div>
      </div>
    ),
  }));

  return (
    <section id="practice">
      <div
        className="mx-auto max-w-3xl bg-[#0a0a0a] px-6 py-20"
        ref={ref}
      >
        <motion.div {...getAnimProps(0)}>
          <h2 className="border-l-2 border-[#c9a84c] pl-3 text-xs uppercase tracking-widest text-silver-dim">
            Areas of Practice
          </h2>
        </motion.div>
        <motion.div {...getAnimProps(0.15)} className="mt-4">
          <h3 className="font-serif text-4xl font-normal text-white md:text-5xl">
            What we practise.
          </h3>
        </motion.div>
        <motion.div {...getAnimProps(0.25)} className="mt-4">
          <p className="text-sm text-silver-dim">
            Select an area to read more.
          </p>
        </motion.div>
      </div>

      <div className="w-full bg-[#0a0a0a]">
        <StickyScroll
          content={scrollContent}
          contentClassName="bg-[#0a0a0a]"
        />
      </div>

      <div className="w-full border-t border-[#1e1e1e]" />
    </section>
  );
}
