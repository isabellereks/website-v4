"use client";

import { useEffect, useRef } from "react";
import { prepareWithSegments, layoutNextLine } from "@chenglou/pretext";

interface WordCache {
  el: HTMLElement;
  x: number;
  y: number;
  isStardust: boolean;
  active: boolean;
  origColor: string;
  origRGB: number[];
  lastHitTime: number;
  skipColor: boolean;
  isStrike: boolean;
}

export function useWordRipple(
  containerRef: React.RefObject<HTMLDivElement | null>,
  miffyPosRef: React.RefObject<{ x: number; y: number }>,
  miffyActivated: boolean
) {
  const wordCacheRef = useRef<WordCache[]>([]);
  const cacheReady = useRef(false);
  const ripplesRef = useRef<{ x: number; y: number; born: number; amp: number }[]>([]);
  const prevMiffyRef = useRef({ x: 0, y: 0 });
  const spawnAccum = useRef(0);

  // Split text into word-level inline-block spans
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    function isInsideStrike(node: Node): boolean {
      let el = node.parentElement;
      while (el && el !== container) {
        const tag = el.tagName;
        if (tag === "S" || tag === "DEL" || tag === "STRIKE") return true;
        el = el.parentElement;
      }
      return false;
    }

    function splitWords(root: Node) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
      const nodes: Text[] = [];
      while (walker.nextNode()) nodes.push(walker.currentNode as Text);

      for (const node of nodes) {
        const text = node.textContent || "";
        if (!text.trim()) continue;
        if (node.parentElement?.classList.contains("w-word")) continue;
        const strike = isInsideStrike(node);
        const frag = document.createDocumentFragment();
        const parts = text.split(/( +)/);
        for (const part of parts) {
          if (!part) continue;
          if (/^ +$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
            continue;
          }
          const span = document.createElement("span");
          span.className = "w-word";
          span.style.display = "inline-block";
          if (strike) span.style.textDecoration = "line-through";
          span.textContent = part;
          frag.appendChild(span);
        }
        node.parentNode?.replaceChild(frag, node);
      }
    }

    // Wait a frame for all child components to render before splitting
    requestAnimationFrame(() => {
      splitWords(container);
      cacheReady.current = false;
    });

    const obs = new MutationObserver((muts) => {
      for (const m of muts)
        m.addedNodes.forEach((n) => {
          if (n.nodeType === Node.ELEMENT_NODE) {
            splitWords(n);
            cacheReady.current = false;
          }
        });
    });
    obs.observe(container, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, [containerRef]);

  // Animate with persistent ripples
  useEffect(() => {
    if (!miffyActivated || !containerRef.current) return;
    const container = containerRef.current;
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
      const text = container.textContent || "";
      const p = prepareWithSegments(text, "14px serif");
      layoutNextLine(
        p,
        { segmentIndex: 0, graphemeIndex: 0 },
        container.getBoundingClientRect().width
      );
    } catch {
      /* non-critical */
    }

    function buildCache() {
      const els = container.querySelectorAll(".w-word");
      const cache: WordCache[] = [];
      els.forEach((el) => {
        const h = el as HTMLElement;
        h.style.transform = "";
        h.style.color = "";
        h.style.textShadow = "";
        const computed = window.getComputedStyle(h).color;
        const r = h.getBoundingClientRect();
        const parentText = h.parentElement?.textContent || "";
        const rgb = computed.match(/\d+/g)?.map(Number) || [30, 30, 30];
        const isDefaultColor =
          Math.abs(rgb[0] - rgb[1]) < 15 &&
          Math.abs(rgb[1] - rgb[2]) < 15 &&
          rgb[0] < 80;
        let isStrike = false;
        let check = h.parentElement;
        while (check && check !== container) {
          if (check.tagName === "S" || check.tagName === "DEL") {
            isStrike = true;
            break;
          }
          check = check.parentElement;
        }
        cache.push({
          el: h,
          x: r.left + r.width / 2,
          y: r.top + r.height / 2,
          isStardust: parentText.includes("stardust"),
          active: false,
          origColor: computed,
          origRGB: rgb,
          lastHitTime: 0,
          skipColor: !isDefaultColor && !isStrike,
          isStrike,
        });
      });
      wordCacheRef.current = cache;
      cacheReady.current = true;
    }

    buildCache();

    let timer: ReturnType<typeof setTimeout>;
    const scheduleRebuild = () => {
      clearTimeout(timer);
      timer = setTimeout(buildCache, 250);
    };
    window.addEventListener("scroll", scheduleRebuild, { passive: true });
    window.addEventListener("resize", scheduleRebuild);

    function animate() {
      if (!cacheReady.current) {
        rafId = requestAnimationFrame(animate);
        return;
      }
      const now = performance.now();
      const pos = miffyPosRef.current;
      const mx = pos.x + MIFFY_HALF;
      const my = pos.y + MIFFY_HALF;

      const pdx = mx - prevMiffyRef.current.x;
      const pdy = my - prevMiffyRef.current.y;
      const moveDist = Math.sqrt(pdx * pdx + pdy * pdy);
      spawnAccum.current += moveDist;

      if (spawnAccum.current > SPAWN_INTERVAL) {
        const amp = MAX_AMP;
        ripplesRef.current.push({ x: mx, y: my, born: now, amp });
        spawnAccum.current = 0;
      }
      prevMiffyRef.current = { x: mx, y: my };

      ripplesRef.current = ripplesRef.current.filter(
        (r) => now - r.born < RIPPLE_LIFETIME
      );

      const ripples = ripplesRef.current;
      const cache = wordCacheRef.current;

      for (let i = 0; i < cache.length; i++) {
        const w = cache[i];
        let totalTx = 0;
        let totalTy = 0;
        let maxBlend = 0;
        let hit = false;

        for (let j = 0; j < ripples.length; j++) {
          const rip = ripples[j];
          const rdx = w.x - rip.x;
          const rdy = w.y - rip.y;
          const dist = Math.sqrt(rdx * rdx + rdy * rdy);

          if (dist > INFLUENCE) continue;

          const age = (now - rip.born) / 1000;
          const radius = age * RIPPLE_SPEED;
          const decay = Math.max(0, 1 - (now - rip.born) / RIPPLE_LIFETIME);
          const ringDist = dist - radius;
          const normDist = Math.min(dist / INFLUENCE, 1);
          const falloff = Math.pow(1 - normDist, 1.2);
          const wave = Math.sin((ringDist / WAVELENGTH) * Math.PI * 2);
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
              const flash = Math.round(
                w.origRGB[0] + (220 - w.origRGB[0]) * blend * 0.4
              );
              w.el.style.color = `rgb(${flash},${flash},${flash})`;
            } else {
              const grey = Math.round(
                BASE_RGB[0] + (RIPPLE_RGB[0] - BASE_RGB[0]) * blend
              );
              w.el.style.color = `rgb(${grey},${grey},${grey})`;
            }
          }
          w.el.style.textShadow = "";
          w.active = true;
        } else if (w.active) {
          w.el.style.transform = "";
          w.el.style.color = "";
          w.el.style.textShadow = "";
          w.active = false;
        }
      }

      rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
      window.removeEventListener("scroll", scheduleRebuild);
      window.removeEventListener("resize", scheduleRebuild);
      ripplesRef.current = [];
      wordCacheRef.current.forEach((w) => {
        w.el.style.transform = "";
        w.el.style.color = "";
        w.el.style.textShadow = "";
      });
    };
  }, [miffyActivated, containerRef, miffyPosRef]);
}
