"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";
import { TEAM, TeamMember } from "@/lib/content";

function AdvocateCard({ member }: { member: TeamMember }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex min-h-[420px] cursor-default flex-col justify-end overflow-hidden bg-[#0a0a0a] p-8"
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 h-full w-full"
          >
            <CanvasRevealEffect
              animationSpeed={3}
              colors={[
                [180, 180, 180],
                [100, 100, 100],
              ]}
              dotSize={2}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay gradient so text remains highly legible against the canvas burst if needed */}
      <div className="absolute inset-0 bg-black/10 transition-opacity duration-300 group-hover:bg-black/40" />

      <div className="relative z-10">
        <div className="mb-3 text-xs uppercase tracking-widest text-silver-dim">
          {member.designation}
        </div>
        <h3 className="font-serif text-3xl font-normal text-silver transition-colors duration-300 group-hover:text-white">
          {member.name}
        </h3>
        <div className="my-4 h-[1px] w-8 bg-gold-line" />
        <p className="text-sm leading-relaxed text-silver">
          {member.bio}
        </p>
        <div className="mt-4 font-mono text-xs text-silver-dim">
          {member.enrolment}
        </div>
        <div className="mt-2 flex flex-wrap">
          {member.courts.map((court, idx) => (
            <span
              key={idx}
              className="mb-1 mr-1 inline-block border border-[#2a2a2a] px-2 py-0.5 text-xs text-[#6b6965]"
            >
              {court}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Team() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const getAnimProps = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    transition: { duration: 0.6, ease: "easeOut", delay },
  });

  return (
    <section id="team">
      <div className="mx-auto max-w-5xl bg-[#0a0a0a] px-6 py-20" ref={ref}>
        <motion.div {...getAnimProps(0)}>
          <h2 className="border-l-2 border-[#c9a84c] pl-3 text-xs uppercase tracking-widest text-silver-dim">
            The Advocates
          </h2>
        </motion.div>
        <motion.div {...getAnimProps(0.15)} className="mt-4">
          <h3 className="font-serif text-4xl font-normal text-white md:text-5xl">
            Who will represent you.
          </h3>
        </motion.div>
      </div>

      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-px bg-[#1e1e1e] md:grid-cols-2">
          {TEAM.map((member, idx) => (
            <AdvocateCard key={idx} member={member} />
          ))}
        </div>
      </div>

      <div className="w-full border-t border-[#1e1e1e]" />
    </section>
  );
}
