"use client";

import { useMiffy } from "./MiffyContext";

export default function Header() {
  const { miffyActivated, handleMouseDown, handleTouchStart, handleDoubleClick, initialMiffyRef } = useMiffy();

  return (
    <div className="mb-2 relative">
      <h1 className="text-lg font-medium">
        <span className="shimmer">Isabelle Reksopuro</span>
      </h1>
      <div className="flex gap-4 mt-1 text-xs text-neutral-400">
        <a href="mailto:reksopuro.isabelle@gmail.com" className="hover:text-neutral-600 transition-colors underline decoration-neutral-300">Email</a>
        <a href="https://twitter.com/isareksopuro" className="hover:text-neutral-600 transition-colors underline decoration-neutral-300">X</a>
        <a href="https://isabellereksopuro.substack.com/" className="hover:text-neutral-600 transition-colors underline decoration-neutral-300">Substack</a>
        <a href="https://www.linkedin.com/in/isabellereks/" className="hover:text-neutral-600 transition-colors underline decoration-neutral-300">LinkedIn</a>
      </div>
      {!miffyActivated && (
        <div
          ref={initialMiffyRef}
          className="absolute right-0 top-0 cursor-grab active:cursor-grabbing select-none touch-none group"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onDoubleClick={handleDoubleClick}
        >
          <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#AD606E] text-white text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Isa&apos;s Miffy
          </span>
          <img
            src="/miffy2.png"
            alt="miffy"
            width={50}
            height={50}
            className="miffy-bounce drop-shadow-lg pointer-events-none"
            draggable={false}
          />
        </div>
      )}
    </div>
  );
}
