"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Timeline } from "@/components/ui/timeline";
import { CREDENTIALS, COURTS } from "@/lib/content";

export default function Credentials() {
  const timelineRef = useRef(null);
  const courtsRef = useRef(null);

  const isTimelineInView = useInView(timelineRef, {
    once: true,
    margin: "-80px",
  });
  const isCourtsInView = useInView(courtsRef, {
    once: true,
    margin: "-80px",
  });

  const getTimelineAnimProps = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: isTimelineInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    transition: { duration: 0.6, ease: "easeOut" as const, delay },
  });

  const getCourtsAnimProps = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: isCourtsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    transition: { duration: 0.6, ease: "easeOut" as const, delay },
  });

  const timelineData = CREDENTIALS.map((cred) => ({
    title: cred.year.toString(),
    content: (
      <div>
        <h4 className="font-serif text-xl font-normal text-white">
          {cred.title}
        </h4>
        <div className="mt-3 border-l border-[#c9a84c] pl-3">
          <p className="text-sm leading-relaxed text-silver">
            {cred.description}
          </p>
        </div>
      </div>
    ),
  }));

  return (
    <section id="courts">
      {/* Part 1: Timeline */}
      <div className="bg-[#0a0a0a]">
        <div className="mx-auto max-w-5xl px-6 py-20" ref={timelineRef}>
          <motion.div {...getTimelineAnimProps(0)}>
            <h2 className="border-l-2 border-[#c9a84c] pl-3 text-xs uppercase tracking-widest text-silver-dim">
              History & Credentials
            </h2>
          </motion.div>
          <motion.div {...getTimelineAnimProps(0.15)} className="mt-4">
            <h3 className="font-serif text-4xl font-normal text-white md:text-5xl">
              Two decades of practice.
            </h3>
          </motion.div>
        </div>
        <Timeline data={timelineData} />
      </div>

      {/* Part 2: Courts grid */}
      <div className="mx-auto max-w-5xl px-6 py-20" ref={courtsRef}>
        <motion.div {...getCourtsAnimProps(0)}>
          <h2 className="border-l-2 border-[#c9a84c] pl-3 text-xs uppercase tracking-widest text-silver-dim">
            Jurisdiction
          </h2>
        </motion.div>
        <motion.div {...getCourtsAnimProps(0.15)} className="mt-4">
          <h3 className="font-serif text-4xl font-normal text-white">
            Where we appear.
          </h3>
        </motion.div>

        <motion.div
          {...getCourtsAnimProps(0.2)}
          className="mt-12 grid grid-cols-1 gap-px bg-[#1e1e1e] sm:grid-cols-2 md:grid-cols-3"
        >
          {COURTS.map((court, idx) => (
            <div key={idx} className="bg-[#0a0a0a] p-6">
              <div className="mb-4 h-1.5 w-1.5 rounded-full bg-[#c9a84c]" />
              <div className="font-serif text-sm text-silver">{court}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="w-full border-t border-[#1e1e1e]" />
    </section>
  );
}
