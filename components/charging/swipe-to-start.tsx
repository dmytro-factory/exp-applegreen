"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { ChevronsRight } from "lucide-react";
import { useRef, useState } from "react";

const KNOB = 56;

export function SwipeToStart({ label = "Swipe to start charging", onComplete }: { label?: string; onComplete: () => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [done, setDone] = useState(false);
  const opacity = useTransform(x, [0, 80], [1, 0]);

  const start = () => {
    if (done) {
      return;
    }
    const track = trackRef.current;
    const max = track ? track.offsetWidth - KNOB - 8 : 0;
    setDone(true);
    animate(x, max, { type: "spring", stiffness: 400, damping: 40 });
    onComplete();
  };

  const handleEnd = () => {
    const track = trackRef.current;
    if (!track || done) {
      return;
    }
    const max = track.offsetWidth - KNOB - 8;
    if (x.get() >= max * 0.6) {
      start();
    } else {
      animate(x, 0, { type: "spring", stiffness: 500, damping: 40 });
    }
  };

  return (
    <div
      ref={trackRef}
      className="relative flex h-16 w-full items-center overflow-hidden rounded-full p-1"
      style={{ backgroundColor: "var(--brand-primary)" }}
    >
      <motion.span
        style={{ opacity }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm font-semibold text-white"
      >
        {done ? "Starting…" : label}
      </motion.span>
      <motion.button
        type="button"
        drag="x"
        dragConstraints={trackRef}
        dragElastic={0}
        dragMomentum={false}
        style={{ x, width: KNOB, height: KNOB }}
        onDragEnd={handleEnd}
        onClick={start}
        aria-label={label}
        className="z-10 flex items-center justify-center rounded-full bg-white shadow"
      >
        <ChevronsRight className="h-6 w-6" style={{ color: "var(--brand-primary)" }} />
      </motion.button>
    </div>
  );
}
