"use client";

import { useState, useEffect } from "react";

const sections = [
  { id: "about", label: "About" },
  { id: "currently", label: "Now" },
  { id: "work", label: "Work" },
  { id: "writing", label: "Writing" },
  { id: "projects", label: "Projects" },
];

export default function NavBar() {
  const [active, setActive] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );

    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-40">
      <div className="flex items-center gap-1 px-2 py-1.5 rounded-full bg-white/60 backdrop-blur-xl border border-white/30 shadow-lg shadow-black/5">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className={`px-3 py-1 rounded-full text-[11px] transition-all cursor-pointer ${
              active === s.id
                ? "bg-[#AD606E] text-white shadow-sm"
                : "text-neutral-500 hover:text-neutral-800 hover:bg-black/5"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
