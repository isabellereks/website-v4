"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { workEntries } from "@/data/work";

function TimelineEntry({
  entry,
  showYear,
}: {
  entry: (typeof workEntries)[number];
  showYear: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left cursor-pointer border-t border-neutral-100 py-3 grid grid-cols-[60px_1fr_auto] gap-3 items-baseline"
    >
      <span className="text-sm text-neutral-300">
        {showYear ? entry.year : ""}
      </span>
      <div>
        <div className="flex items-baseline gap-2">
          <a
            href={entry.orgUrl}
            onClick={(e) => e.stopPropagation()}
            className="text-sm underline underline-offset-2 text-neutral-800 hover:text-neutral-500 transition-colors"
          >
            {entry.org}
          </a>
          <span className="text-neutral-400 text-xs">
            {open ? "−" : "+"}
          </span>
        </div>
        <p className="text-xs text-neutral-400 mt-0.5">{entry.title}</p>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <p className="text-sm text-neutral-500 mt-2 leading-relaxed">
                {entry.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <span className="text-xs text-neutral-300" />
    </button>
  );
}

export default function Timeline() {
  let lastYear = "";

  return (
    <div id="work" className="mt-2 scroll-mt-20">
      <p className="pt-4 text-sm font-medium text-neutral-400 mb-1">
        Work
      </p>

      <div>
        {workEntries.map((entry, i) => {
          const showYear = entry.year !== lastYear;
          lastYear = entry.year;
          return <TimelineEntry key={i} entry={entry} showYear={showYear} />;
        })}
      </div>
    </div>
  );
}
