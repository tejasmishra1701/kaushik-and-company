"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { cn } from "@/lib/utils";
import { IconLock } from "@tabler/icons-react";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);

  // Ref to store the timeout ID so we can clear it on subsequent scrolls
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHovered = useRef(false);

  const startHideTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      if (!isHovered.current) {
        setVisible(false);
      }
    }, 1000); // 1000ms (1 second) delay. Adjust this value to your liking.
  };

  useMotionValueEvent(scrollYProgress, "change", () => {
    // 1. Show the navbar whenever scrolling occurs
    setVisible(true);

    // 2. Start/reset the hide timeout
    startHideTimeout();
  });

  const handleMouseEnter = () => {
    isHovered.current = true;
    setVisible(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    isHovered.current = false;
    startHideTimeout();
  };

  // Cleanup the timeout when the component unmounts to prevent memory leaks
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit fixed top-10 inset-x-0 mx-auto z-[5000] items-center justify-center",
          className
        )}
      >
        <div className="flex items-center justify-center gap-1 rounded-full border border-[#1e1e1e] bg-[#0a0a0a]/90 px-2 py-1.5 shadow-lg backdrop-blur-md">
          {/* Nav items container */}
          <div className="flex items-center gap-1">
            {navItems.map((navItem, idx: number) => (
              <a
                key={`link-${idx}`}
                href={navItem.link}
                className={cn(
                  "relative flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-silver transition-colors hover:text-white"
                )}
              >
                <span className="block sm:hidden">{navItem.icon}</span>
                <span className="hidden sm:block">{navItem.name}</span>
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="mx-1 h-4 w-px bg-[#2a2a2a]" />

          {/* Portal Login CTA */}
          <a
            href="/portal/login"
            className="flex items-center gap-1.5 rounded-full border border-[#c9a84c]/30 bg-[#c9a84c]/5 px-4 py-2 text-xs font-medium uppercase tracking-widest text-[#c9a84c] transition-all hover:border-[#c9a84c]/60 hover:bg-[#c9a84c]/10 hover:text-[#d4b060]"
          >
            <IconLock size={11} />
            <span className="hidden sm:block">Client Portal</span>
          </a>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};