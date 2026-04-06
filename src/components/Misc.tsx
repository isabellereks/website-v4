"use client";

import { useState } from "react";

export default function Misc() {
  const [showMisc, setShowMisc] = useState(false);

  return (
    <div className="mt-4">
      <button
        onClick={() => setShowMisc(!showMisc)}
        className="text-xs text-neutral-400 hover:text-neutral-600 cursor-pointer transition-colors underline decoration-neutral-300"
      >
        Misc {showMisc ? "−" : "+"}
      </button>

      {showMisc && (
        <div className="text-neutral-500 mt-3">
          <p>
            I like binging K-dramas (ask me what I&apos;m watching!), downing
            gallons of matcha, baking blueberry scones, and reading at 1,200+
            WPM (unofficially benchmarked).
          </p>
        </div>
      )}
    </div>
  );
}
