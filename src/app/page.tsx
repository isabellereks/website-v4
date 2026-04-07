"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, Mail01Icon, Linkedin01Icon, Bookmark01Icon, Github01Icon, TwitterIcon, YelpIcon } from "@hugeicons/core-free-icons";
import { prepareWithSegments, layoutNextLine } from "@chenglou/pretext";
import { workEntries } from "@/data/work";
import { writingEntries } from "@/data/writing";
import { projects } from "@/data/projects";

const linkStyle: React.CSSProperties = {
  textDecoration: "underline",
  textUnderlineOffset: "3px",
  textDecorationColor: "#d4d4d4",
};

function Link({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={href} style={linkStyle} className={`hover:text-neutral-500 transition-colors ${className}`}>
      {children}
    </a>
  );
}

export default function Home() {
  const [showMisc, setShowMisc] = useState(false);
  const [miffyPos, setMiffyPos] = useState({ x: 0, y: 0 });
  const [miffyActivated, setMiffyActivated] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [miffyTongue, setMiffyTongue] = useState(false);
  const [runFrame, setRunFrame] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isBouncing, setIsBouncing] = useState<'left' | 'right' | 'top' | 'bottom' | null>(null);
  const [openWork, setOpenWork] = useState<Record<number, boolean>>({});
  const [activeTab, setActiveTab] = useState<"Work" | "Writing" | "Projects" | "Misc">("Work");
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const initialMiffyRef = useRef<HTMLDivElement>(null);
  const miffyPosRef = useRef(miffyPos);
  miffyPosRef.current = miffyPos;

  useEffect(() => {
    if (!isDragging && !isMoving) return;
    const speed = isRunning ? 50 : 100;
    const interval = setInterval(() => setRunFrame((prev) => (prev === 0 ? 1 : 0)), speed);
    return () => clearInterval(interval);
  }, [isDragging, isMoving, isRunning]);

  useEffect(() => {
    const STEP = 5;
    const RUN_STEP = 12;
    const MIFFY_SIZE = 70;
    const keysHeld = new Set<string>();
    let animationId: number;
    let bounceTimeout: NodeJS.Timeout;
    let shiftHeld = false;
    let lastSpaceTime = 0;
    let currentBounceDir: string | null = null;

    const triggerBounce = (dir: 'left' | 'right' | 'top' | 'bottom') => {
      const bounceBack = shiftHeld ? 30 : 15;
      setMiffyPos((prev) => {
        let { x, y } = prev;
        if (dir === 'left') x += bounceBack;
        if (dir === 'right') x -= bounceBack;
        if (dir === 'top') y += bounceBack;
        if (dir === 'bottom') y -= bounceBack;
        return { x, y };
      });
      if (currentBounceDir !== dir) { currentBounceDir = dir; setIsBouncing(dir); }
      setMiffyTongue(true);
      clearTimeout(bounceTimeout);
      bounceTimeout = setTimeout(() => { setIsBouncing(null); setMiffyTongue(false); currentBounceDir = null; }, 200);
    };

    const tick = () => {
      if (keysHeld.size === 0) { setIsMoving(false); return; }
      setIsMoving(true);
      const step = shiftHeld ? RUN_STEP : STEP;
      setMiffyActivated(true);

      setMiffyPos((prev) => {
        let { x, y } = prev;
        // If position is 0,0 (never set), grab from the static miffy element
        if (x === 0 && y === 0 && initialMiffyRef.current) {
          const rect = initialMiffyRef.current.getBoundingClientRect();
          x = rect.left;
          y = rect.top;
        }
        if (keysHeld.has('ArrowUp') || keysHeld.has('w')) y -= step;
        if (keysHeld.has('ArrowDown') || keysHeld.has('s')) y += step;
        if (keysHeld.has('ArrowLeft') || keysHeld.has('a')) x -= step;
        if (keysHeld.has('ArrowRight') || keysHeld.has('d')) x += step;
        const maxX = window.innerWidth - MIFFY_SIZE;
        const maxY = window.innerHeight - MIFFY_SIZE;
        if (x <= 0) triggerBounce('left');
        if (x >= maxX) triggerBounce('right');
        const SCROLL_ZONE = 60;
        if (y < SCROLL_ZONE) window.scrollBy(0, -(SCROLL_ZONE - y) * 0.3);
        if (y > maxY - SCROLL_ZONE) window.scrollBy(0, (y - (maxY - SCROLL_ZONE)) * 0.3);
        if (y <= 0) triggerBounce('top');
        if (y >= maxY) triggerBounce('bottom');
        return { x: Math.max(0, Math.min(maxX, x)), y: Math.max(0, Math.min(maxY, y)) };
      });
      animationId = requestAnimationFrame(tick);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'Shift') { shiftHeld = true; setIsRunning(true); }
      if (e.key === ' ') { e.preventDefault(); const now = Date.now(); if (now - lastSpaceTime < 300) { setMiffyTongue(true); setTimeout(() => setMiffyTongue(false), 1000); } lastSpaceTime = now; return; }
      const moveKeys = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d','W','A','S','D'];
      if (!moveKeys.includes(e.key)) return;
      e.preventDefault();
      const key = e.key.startsWith('Arrow') ? e.key : e.key.toLowerCase();
      if (!keysHeld.has(key)) { keysHeld.add(key); if (keysHeld.size === 1) animationId = requestAnimationFrame(tick); }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') { shiftHeld = false; setIsRunning(false); }
      const key = e.key.startsWith('Arrow') ? e.key : e.key.toLowerCase();
      keysHeld.delete(key);
      if (keysHeld.size === 0) setIsMoving(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); cancelAnimationFrame(animationId); clearTimeout(bounceTimeout); };
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    e.preventDefault();
    const S = 70;
    setMiffyPos({ x: Math.max(0, Math.min(window.innerWidth - S, e.clientX - dragOffsetRef.current.x)), y: Math.max(0, Math.min(window.innerHeight - S, e.clientY - dragOffsetRef.current.y)) });
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    dragOffsetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    if (!miffyActivated) { setMiffyPos({ x: rect.left, y: rect.top }); setMiffyActivated(true); }
    setIsDragging(true);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove, handleMouseUp, miffyActivated]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    const S = 70; const t = e.touches[0];
    setMiffyPos({ x: Math.max(0, Math.min(window.innerWidth - S, t.clientX - dragOffsetRef.current.x)), y: Math.max(0, Math.min(window.innerHeight - S, t.clientY - dragOffsetRef.current.y)) });
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleTouchEnd);
  }, [handleTouchMove]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const t = e.touches[0]; const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    dragOffsetRef.current = { x: t.clientX - rect.left, y: t.clientY - rect.top };
    if (!miffyActivated) { setMiffyPos({ x: rect.left, y: rect.top }); setMiffyActivated(true); }
    setIsDragging(true);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
  }, [handleTouchMove, handleTouchEnd, miffyActivated]);

  const handleDoubleClick = useCallback(() => { setMiffyTongue(true); setTimeout(() => setMiffyTongue(false), 1000); }, []);

  useEffect(() => {
    return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleMouseUp); window.removeEventListener('touchmove', handleTouchMove); window.removeEventListener('touchend', handleTouchEnd); };
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // ── Miffy push-through effect ──
  const mainContentRef = useRef<HTMLDivElement>(null);
  const wordCacheRef = useRef<{ el: HTMLElement; x: number; y: number; active: boolean }[]>([]);
  const cacheReady = useRef(false);

  useEffect(() => {
    if (!mainContentRef.current) return;
    const container = mainContentRef.current;

    function isInsideStrike(node: Node): boolean {
      let el = node.parentElement;
      while (el && el !== container) {
        const tag = el.tagName;
        if (tag === 'S' || tag === 'DEL' || tag === 'STRIKE') return true;
        el = el.parentElement;
      }
      return false;
    }

    function splitWords(root: Node) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
      const nodes: Text[] = [];
      while (walker.nextNode()) nodes.push(walker.currentNode as Text);
      for (const node of nodes) {
        const text = node.textContent || '';
        if (!text.trim()) continue;
        if (node.parentElement?.classList.contains('w-word')) continue;
        // Skip text inside links and buttons to preserve underlines and layout animations
        let skipNode = false;
        let check: HTMLElement | null = node.parentElement;
        while (check && check !== container) {
          if (check.tagName === 'A' || check.tagName === 'BUTTON') { skipNode = true; break; }
          check = check.parentElement;
        }
        if (skipNode) continue;
        const strike = isInsideStrike(node);
        const frag = document.createDocumentFragment();
        const parts = text.split(/( +)/);
        for (const part of parts) {
          if (!part) continue;
          if (/^ +$/.test(part)) { frag.appendChild(document.createTextNode(part)); continue; }
          const span = document.createElement('span');
          span.className = 'w-word';
          span.style.display = 'inline-block';
          span.style.transition = 'transform 0.3s ease-out';
          if (strike) span.style.textDecoration = 'line-through';
          span.textContent = part;
          frag.appendChild(span);
        }
        node.parentNode?.replaceChild(frag, node);
      }
    }

    splitWords(container);

    const obs = new MutationObserver((muts) => {
      for (const m of muts) m.addedNodes.forEach((n) => {
        if (n.nodeType === Node.ELEMENT_NODE) { splitWords(n); cacheReady.current = false; }
      });
    });
    obs.observe(container, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!miffyActivated || !mainContentRef.current) return;
    const container = mainContentRef.current;
    let rafId: number;
    const MIFFY_HALF = 25;
    const PUSH_RADIUS = 80;
    const PUSH_STRENGTH = 15;

    try {
      const text = container.textContent || '';
      const p = prepareWithSegments(text, '14px sans-serif');
      layoutNextLine(p, { segmentIndex: 0, graphemeIndex: 0 }, container.getBoundingClientRect().width);
    } catch { /* non-critical */ }

    function buildCache() {
      const els = container.querySelectorAll('.w-word');
      const cache: typeof wordCacheRef.current = [];
      els.forEach((el) => {
        const h = el as HTMLElement;
        h.style.transform = '';
        const r = h.getBoundingClientRect();
        cache.push({ el: h, x: r.left + r.width / 2, y: r.top + r.height / 2, active: false });
      });
      wordCacheRef.current = cache;
      cacheReady.current = true;
    }

    buildCache();
    let timer: ReturnType<typeof setTimeout>;
    const scheduleRebuild = () => { clearTimeout(timer); timer = setTimeout(buildCache, 250); };
    window.addEventListener('scroll', scheduleRebuild, { passive: true });
    window.addEventListener('resize', scheduleRebuild);

    function animate() {
      if (!cacheReady.current) { rafId = requestAnimationFrame(animate); return; }
      const pos = miffyPosRef.current;
      const mx = pos.x + MIFFY_HALF;
      const my = pos.y + MIFFY_HALF;
      const cache = wordCacheRef.current;

      for (let i = 0; i < cache.length; i++) {
        const w = cache[i];
        const dx = w.x - mx;
        const dy = w.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < PUSH_RADIUS) {
          const force = (1 - dist / PUSH_RADIUS) * PUSH_STRENGTH;
          const angle = Math.atan2(dy, dx);
          const tx = Math.cos(angle) * force;
          const ty = Math.sin(angle) * force * 0.5;
          w.el.style.transform = `translate(${tx.toFixed(1)}px,${ty.toFixed(1)}px)`;
          w.active = true;
        } else if (w.active) {
          w.el.style.transform = '';
          w.active = false;
        }
      }
      rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(rafId); clearTimeout(timer); window.removeEventListener('scroll', scheduleRebuild); window.removeEventListener('resize', scheduleRebuild); wordCacheRef.current.forEach((w) => { w.el.style.transform = ''; }); };
  }, [miffyActivated]);

  let lastWorkYear = "";
  let lastWritingYear = "";

  return (
    <>
      {miffyActivated && (
        <div
          className="fixed z-50 cursor-grab active:cursor-grabbing select-none touch-none group"
          style={{ transform: `translate3d(${miffyPos.x}px, ${miffyPos.y}px, 0)`, willChange: 'transform' }}
          onMouseDown={handleMouseDown} onTouchStart={handleTouchStart} onDoubleClick={handleDoubleClick}
        >
          {!isDragging && !isMoving && (
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#AD606E] text-white text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Isa&apos;s Miffy
            </span>
          )}
          <img
            src={miffyTongue ? "/miffy-tongue.png" : (isDragging || isMoving) ? (runFrame === 0 ? "/miffy-left.png" : "/miffy-right.png") : "/miffy2.png"}
            alt="miffy" width={70} height={70}
            className={`drop-shadow-lg pointer-events-none shrink-0 ${isBouncing ? `miffy-wall-bounce-${isBouncing}` : 'miffy-wobble'}`}
            draggable={false}
          />
        </div>
      )}

      <main className="max-w-xl mx-auto px-6 py-12 md:py-24 font-[family-name:var(--font-open-runde)] text-neutral-800">
        {/* Header */}
        <div className="mb-6 relative">
          <h1 className="text-2xl md:text-3xl font-semibold">
            <span className="shimmer">Isabelle Reksopuro</span>
          </h1>
          <div className="flex gap-2 mt-1 text-neutral-400">
            <a href="mailto:reksopuro.isabelle@gmail.com" className="hover:text-neutral-600 transition-colors p-1" title="Email">
              <HugeiconsIcon icon={Mail01Icon} size={20} />
            </a>
            <a href="https://twitter.com/isareksopuro" className="hover:text-neutral-600 transition-colors p-1" title="Twitter">
              <HugeiconsIcon icon={TwitterIcon} size={20} />
            </a>
            <a href="https://isaishangry.substack.com/" className="hover:text-neutral-600 transition-colors p-1" title="Substack">
              <HugeiconsIcon icon={Bookmark01Icon} size={20} />
            </a>
            <a href="https://www.linkedin.com/in/isabellereks/" className="hover:text-neutral-600 transition-colors p-1" title="LinkedIn">
              <HugeiconsIcon icon={Linkedin01Icon} size={20} />
            </a>
            <a href="https://github.com/isabellereks" className="hover:text-neutral-600 transition-colors p-1" title="GitHub">
              <HugeiconsIcon icon={Github01Icon} size={20} />
            </a>
            <a href="https://www.yelp.com/user_details?userid=qBYWRSBD84kFRkHu_qFTTg" className="hover:text-neutral-600 transition-colors p-1" title="Yelp">
              <HugeiconsIcon icon={YelpIcon} size={20} />
            </a>
          </div>
          {!miffyActivated && (
            <div ref={initialMiffyRef} className="absolute right-0 top-0 cursor-grab active:cursor-grabbing select-none touch-none group"
              onMouseDown={handleMouseDown} onTouchStart={handleTouchStart} onDoubleClick={handleDoubleClick}>
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#AD606E] text-white text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Isa&apos;s Miffy
              </span>
              <img src="/miffy2.png" alt="miffy" width={70} height={70} className="miffy-bounce drop-shadow-lg pointer-events-none" draggable={false} />
            </div>
          )}
        </div>

        <div ref={mainContentRef} className="text-xs md:text-sm leading-relaxed">
          {/* About */}
          <div id="about" className="space-y-4">
            <p>
              Hi! I&apos;m Isabelle, an Indonesian-American <span className="inline-block animate-pulse">🇮🇩🇺🇸</span> @{" "}
              <Link href="https://www.washington.edu/">University of Washington</Link>{" "}
              exploring the intersection of tech & public policy.
            </p>
            <p>
              I think it&apos;s terrible our <span className="highlighter-hover">politicians don&apos;t know how wifi works</span>,
              and they&apos;re actively pushing against data centers instead of preparing society for AGI.
              I hope to work on projects dealing with AI safety and public policy, helping innovation thrive while protecting everyday people.
            </p>
            <p>
              On the side, I plan on traveling the world and eating through all the cuisines it has to offer.
              If you&apos;re curious about tech or want to get a matcha,{" "}
              <Link href="https://cal.com/isabellereks">let&apos;s chat</Link>.
            </p>
          </div>

          {/* Currently */}
          <div id="currently" className="mt-6">
            <p className="text-sm font-medium text-neutral-400 mb-3">Currently</p>
            <div className="space-y-4">
              <p>
                Right now, I&apos;m{" "}
                <s className="text-neutral-400 hover:text-[#AD606E] hover:animate-pulse transition-colors cursor-default">in class</s>{" "}
                building side projects on Twitter and running the{" "}
                <Link href="https://www.instagram.com/seattlejunkjournalclub/">Seattle Junk Journal Club</Link>.
                I&apos;m also getting back into writing on <Link href="https://isaishangry.substack.com/">Substack</Link>.
              </p>
              <p>
                I&apos;m campaigning for reproductive justice and forming a sexual assault task force with{" "}
                <Link href="https://www.advocatesforyouth.org/">Advocates for Youth</Link> in Washington, D.C. and Seattle, WA.
              </p>
              <p>
                In my spare time, I lead the student ambassador program at the{" "}
                <Link href="https://aaylc.org">Asian American Youth Leadership Conference</Link> for 600+ students.
              </p>
            </div>
          </div>

          {/* Tab bar */}
          <div className="mt-6">
            <div className="relative flex gap-1 p-1 bg-neutral-100/80 backdrop-blur-sm rounded-full w-fit">
              {(["Work", "Writing", "Projects", "Misc"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative z-10 px-4 py-1.5 rounded-full text-xs cursor-pointer transition-colors duration-150 ${
                    activeTab === tab
                      ? "text-neutral-800 font-medium"
                      : "text-neutral-500 hover:text-neutral-700"
                  }`}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="active-tab"
                      className="absolute inset-0 bg-white rounded-full shadow-sm"
                      style={{ zIndex: -1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 35, mass: 0.5 }}
                    />
                  )}
                  {tab}
                </button>
              ))}
            </div>

            <div className="mt-3 text-xs">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
                  transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                >
                  {activeTab === "Work" && (
                    <div>
                      {workEntries.map((entry, i) => {
                        const showYear = entry.year !== lastWorkYear;
                        lastWorkYear = entry.year;
                        return (
                          <button key={i}
                            onClick={() => setOpenWork((prev) => ({ ...prev, [i]: !prev[i] }))}
                            className={`w-full text-left cursor-pointer py-3 grid grid-cols-[60px_1fr_auto] gap-3 items-start ${showYear && i !== 0 ? "border-t border-neutral-100" : ""}`}>
                            <span className="text-sm text-neutral-300">{showYear ? entry.year : ""}</span>
                            <div>
                              <div className="flex items-center gap-1">
                                <a href={entry.orgUrl} onClick={(e) => e.stopPropagation()} style={linkStyle} className="text-sm hover:text-neutral-500 transition-colors">{entry.org}</a>
                                <motion.span className="text-neutral-400 shrink-0 inline-flex" animate={{ rotate: openWork[i] ? 90 : 0 }} transition={{ duration: 0.15 }}>
                                  <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={2} />
                                </motion.span>
                              </div>
                              <p className="text-xs text-neutral-400 mt-0.5">{entry.title}</p>
                              <AnimatePresence>
                                {openWork[i] && (
                                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }} className="overflow-hidden">
                                    <p className="text-sm text-neutral-500 mt-2 leading-relaxed">{entry.description}</p>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                            <span />
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {activeTab === "Writing" && (
                    <div>
                      {writingEntries.map((entry, i) => {
                        const showYear = entry.date !== lastWritingYear;
                        lastWritingYear = entry.date;
                        return (
                          <a key={i} href={entry.url} className={`block py-3 grid grid-cols-[60px_1fr_auto] gap-3 items-baseline group ${i !== 0 ? "border-t border-neutral-100" : ""}`}>
                            <span className="text-sm text-neutral-300">{showYear ? entry.date : ""}</span>
                            <span className="text-sm group-hover:text-neutral-500 transition-colors">{entry.title}</span>
                            <span className="text-xs text-neutral-300">{entry.description}</span>
                          </a>
                        );
                      })}
                      <a href="https://isaishangry.substack.com/" style={linkStyle} className="inline-block text-xs text-neutral-400 hover:text-neutral-600 transition-colors mt-2">
                        Read more on Substack &rarr;
                      </a>
                    </div>
                  )}

                  {activeTab === "Projects" && (
                    <div className="grid grid-cols-2 gap-3">
                      {projects.map((project) => (
                        <a
                          key={project.name}
                          href={project.url || "#"}
                          className="block bg-neutral-50 rounded-xl p-4 hover:bg-neutral-100 transition-colors group"
                        >
                          <p className="text-sm font-medium group-hover:text-neutral-500 transition-colors">{project.name}</p>
                          <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{project.description}</p>
                        </a>
                      ))}
                    </div>
                  )}

                  {activeTab === "Misc" && (
                    <p className="text-sm">I like binging K-dramas (ask me what I&apos;m watching!), downing gallons of matcha, baking blueberry scones, and reading at 1,200+ WPM (unofficially benchmarked).</p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-16 text-center text-neutral-400 text-[10px] font-[family-name:var(--font-geist-mono)]">made with stardust ★ by isabelle</p>
        </div>
      </main>
    </>
  );
}
