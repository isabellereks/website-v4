"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
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
        if (keysHeld.has('ArrowUp') || keysHeld.has('w')) y -= step;
        if (keysHeld.has('ArrowDown') || keysHeld.has('s')) y += step;
        if (keysHeld.has('ArrowLeft') || keysHeld.has('a')) x -= step;
        if (keysHeld.has('ArrowRight') || keysHeld.has('d')) x += step;
        const maxX = window.innerWidth - MIFFY_SIZE;
        const maxY = window.innerHeight - MIFFY_SIZE;
        if (x <= 0) triggerBounce('left');
        if (x >= maxX) triggerBounce('right');
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

  // ── Word ripple ──
  const wordCacheRef = useRef<{ el: HTMLElement; x: number; y: number; isStardust: boolean; active: boolean; origColor: string; origRGB: number[]; lastHitTime: number; skipColor: boolean; isStrike: boolean }[]>([]);
  const cacheReady = useRef(false);
  const ripplesRef = useRef<{ x: number; y: number; born: number; amp: number }[]>([]);
  const prevMiffyRef = useRef({ x: 0, y: 0 });
  const spawnAccum = useRef(0);
  const mainContentRef = useRef<HTMLDivElement>(null);

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
        const strike = isInsideStrike(node);
        const frag = document.createDocumentFragment();
        const parts = text.split(/( +)/);
        for (const part of parts) {
          if (!part) continue;
          if (/^ +$/.test(part)) { frag.appendChild(document.createTextNode(part)); continue; }
          const span = document.createElement('span');
          span.className = 'w-word';
          span.style.display = 'inline-block';
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

    const MIFFY_HALF = 35;
    const RIPPLE_LIFETIME = 1600;
    const RIPPLE_SPEED = 200;
    const WAVELENGTH = 40;
    const MAX_AMP = 12;
    const INFLUENCE = 400;
    const SPAWN_INTERVAL = 18;
    const BASE_RGB = [30, 30, 30];
    const RIPPLE_RGB = [180, 180, 180];

    try {
      const text = container.textContent || '';
      const p = prepareWithSegments(text, '14px serif');
      layoutNextLine(p, { segmentIndex: 0, graphemeIndex: 0 }, container.getBoundingClientRect().width);
    } catch { /* non-critical */ }

    function buildCache() {
      const els = container.querySelectorAll('.w-word');
      const cache: typeof wordCacheRef.current = [];
      els.forEach((el) => {
        const h = el as HTMLElement;
        h.style.transform = ''; h.style.color = ''; h.style.textShadow = '';
        const computed = window.getComputedStyle(h).color;
        const r = h.getBoundingClientRect();
        const parentText = h.parentElement?.textContent || '';
        const rgb = computed.match(/\d+/g)?.map(Number) || [30, 30, 30];
        const isDefaultColor = Math.abs(rgb[0] - rgb[1]) < 15 && Math.abs(rgb[1] - rgb[2]) < 15 && rgb[0] < 80;
        let isStrike = false;
        let check = h.parentElement;
        while (check && check !== container) {
          if (check.tagName === 'S' || check.tagName === 'DEL') { isStrike = true; break; }
          check = check.parentElement;
        }
        cache.push({ el: h, x: r.left + r.width / 2, y: r.top + r.height / 2, isStardust: parentText.includes('stardust'), active: false, origColor: computed, origRGB: rgb, lastHitTime: 0, skipColor: !isDefaultColor && !isStrike, isStrike });
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
      const now = performance.now();
      const pos = miffyPosRef.current;
      const mx = pos.x + MIFFY_HALF;
      const my = pos.y + MIFFY_HALF;
      const pdx = mx - prevMiffyRef.current.x;
      const pdy = my - prevMiffyRef.current.y;
      const moveDist = Math.sqrt(pdx * pdx + pdy * pdy);
      spawnAccum.current += moveDist;
      if (spawnAccum.current > SPAWN_INTERVAL) {
        ripplesRef.current.push({ x: mx, y: my, born: now, amp: MAX_AMP });
        spawnAccum.current = 0;
      }
      prevMiffyRef.current = { x: mx, y: my };
      ripplesRef.current = ripplesRef.current.filter((r) => now - r.born < RIPPLE_LIFETIME);
      const ripples = ripplesRef.current;
      const cache = wordCacheRef.current;

      for (let i = 0; i < cache.length; i++) {
        const w = cache[i];
        let totalTx = 0, totalTy = 0, maxBlend = 0, hit = false;
        for (let j = 0; j < ripples.length; j++) {
          const rip = ripples[j];
          const rdx = w.x - rip.x, rdy = w.y - rip.y;
          const dist = Math.sqrt(rdx * rdx + rdy * rdy);
          if (dist > INFLUENCE) continue;
          const age = (now - rip.born) / 1000;
          const radius = age * RIPPLE_SPEED;
          const decay = Math.max(0, 1 - (now - rip.born) / RIPPLE_LIFETIME);
          const ringDist = dist - radius;
          const normDist = Math.min(dist / INFLUENCE, 1);
          const falloff = Math.pow(1 - normDist, 1.2);
          const wave = Math.sin(ringDist / WAVELENGTH * Math.PI * 2);
          const strength = wave * rip.amp * decay * falloff;
          const angle = dist > 0 ? Math.atan2(rdy, rdx) : 0;
          totalTx += Math.cos(angle) * strength;
          totalTy += Math.sin(angle) * strength * 0.4;
          const blend = decay * falloff;
          if (blend > maxBlend) maxBlend = blend;
          hit = true;
        }
        if (hit) {
          w.lastHitTime = now;
          w.el.style.transform = `translate(${totalTx.toFixed(1)}px,${totalTy.toFixed(1)}px)`;
          if (!w.skipColor) {
            const blend = Math.min(maxBlend * 0.8, 0.85);
            if (w.isStrike) {
              const flash = Math.round(w.origRGB[0] + (220 - w.origRGB[0]) * blend * 0.4);
              w.el.style.color = `rgb(${flash},${flash},${flash})`;
            } else {
              const grey = Math.round(BASE_RGB[0] + (RIPPLE_RGB[0] - BASE_RGB[0]) * blend);
              w.el.style.color = `rgb(${grey},${grey},${grey})`;
            }
          }
          w.el.style.textShadow = '';
          w.active = true;
        } else if (w.active) {
          w.el.style.transform = ''; w.el.style.color = ''; w.el.style.textShadow = '';
          w.active = false;
        }
      }
      rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(rafId); clearTimeout(timer); window.removeEventListener('scroll', scheduleRebuild); window.removeEventListener('resize', scheduleRebuild); ripplesRef.current = []; wordCacheRef.current.forEach((w) => { w.el.style.transform = ''; w.el.style.color = ''; w.el.style.textShadow = ''; }); };
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
            alt="miffy" width={50} height={50}
            className={`drop-shadow-lg pointer-events-none shrink-0 ${isBouncing ? `miffy-wall-bounce-${isBouncing}` : 'miffy-wobble'}`}
            draggable={false}
          />
        </div>
      )}

      <main className="max-w-lg mx-auto px-6 py-16 font-[family-name:var(--font-inter)] text-neutral-800">
        {/* Header */}
        <div className="mb-6 relative">
          <h1 className="text-lg font-medium">
            <span className="shimmer">Isabelle Reksopuro</span>
          </h1>
          <div className="flex gap-4 mt-1 text-xs text-neutral-400">
            <a href="mailto:reksopuro.isabelle@gmail.com" className="hover:text-neutral-600 transition-colors">Email</a>
            <a href="https://twitter.com/isareksopuro" className="hover:text-neutral-600 transition-colors">X</a>
            <a href="https://isabellereksopuro.substack.com/" className="hover:text-neutral-600 transition-colors">Substack</a>
            <a href="https://www.linkedin.com/in/isabellereks/" className="hover:text-neutral-600 transition-colors">LinkedIn</a>
          </div>
          {!miffyActivated && (
            <div ref={initialMiffyRef} className="absolute right-0 top-0 cursor-grab active:cursor-grabbing select-none touch-none group"
              onMouseDown={handleMouseDown} onTouchStart={handleTouchStart} onDoubleClick={handleDoubleClick}>
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#AD606E] text-white text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Isa&apos;s Miffy
              </span>
              <img src="/miffy2.png" alt="miffy" width={50} height={50} className="miffy-bounce drop-shadow-lg pointer-events-none" draggable={false} />
            </div>
          )}
        </div>

        <div ref={mainContentRef} className="space-y-4 text-sm leading-relaxed">
          {/* About */}
          <div id="about" className="space-y-4">
            <p>
              Hi! I&apos;m Isabelle, an Indonesian-American <span className="inline-block animate-pulse">🇮🇩🇺🇸</span> @{" "}
              <Link href="https://www.washington.edu/">University of Washington</Link>{" "}
              exploring the intersection of tech & public policy.
            </p>
            <p>
              I think it&apos;s terrible our <span className="highlighter-hover">politicians don&apos;t know how wifi works</span>,
              and the ones that do are misusing taxpayer funds to develop weapons with artificial intelligence.
              I&apos;ve made it my personal mission to work on projects dealing with tech and improving how it intersects in our lives.
            </p>
            <p>
              On the side, I plan on traveling the world and eating through all the cuisines it has to offer.
              If you&apos;re curious about tech or want to get a matcha,{" "}
              <Link href="https://cal.com/isabellereks">let&apos;s chat</Link>.
            </p>
          </div>

          {/* Currently */}
          <div id="currently" className="space-y-4">
            <p className="pt-4 text-sm font-medium text-neutral-400">Currently</p>
            <p>
              Right now, I&apos;m{" "}
              <s className="text-neutral-400 hover:text-[#AD606E] hover:animate-pulse transition-colors cursor-default">in class</s>{" "}
              building side projects on Twitter and running the{" "}
              <Link href="https://www.instagram.com/seattlejunkjournalclub/">Seattle Junk Journal Club</Link>.
              I&apos;m also getting back into writing on <Link href="https://isabellereksopuro.substack.com/">Substack</Link>.
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

          {/* Work */}
          <div id="work" className="mt-2">
            <p className="pt-4 text-sm font-medium text-neutral-400 mb-1">Work</p>
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
          </div>

          {/* Writing */}
          <div id="writing" className="mt-2">
            <p className="pt-4 text-sm font-medium text-neutral-400 mb-1">Writing</p>
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
            </div>
            <a href="https://isabellereksopuro.substack.com/" style={linkStyle} className="inline-block text-xs text-neutral-400 hover:text-neutral-600 transition-colors mt-2">
              Read more on Substack &rarr;
            </a>
          </div>

          {/* Projects */}
          <div id="projects" className="mt-2">
            <p className="pt-4 text-sm font-medium text-neutral-400 mb-1">Projects</p>
            <div>
              {projects.map((project, i) => (
                <div key={project.name} className={`py-3 ${i !== 0 ? "border-t border-neutral-100" : ""}`}>
                  {project.url ? (
                    <a href={project.url} style={linkStyle} className="text-sm hover:text-neutral-500 transition-colors">{project.name}</a>
                  ) : (
                    <p className="text-sm">{project.name}</p>
                  )}
                  <p className="text-xs text-neutral-400 mt-0.5">{project.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Misc */}
          <div className="mt-2">
            <p className="pt-4 text-sm font-medium text-neutral-400 mb-1">Misc</p>
            <p>I like binging K-dramas (ask me what I&apos;m watching!), downing gallons of matcha, baking blueberry scones, and reading at 1,200+ WPM (unofficially benchmarked).</p>
          </div>

          {/* Footer */}
          <p className="pt-10 text-neutral-300 text-xs">Made with stardust ★ by Isabelle</p>
        </div>
      </main>
    </>
  );
}
