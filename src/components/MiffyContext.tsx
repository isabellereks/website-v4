"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";

interface MiffyContextValue {
  miffyPos: { x: number; y: number };
  miffyActivated: boolean;
  miffyPosRef: React.RefObject<{ x: number; y: number }>;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleDoubleClick: () => void;
  initialMiffyRef: React.RefObject<HTMLDivElement | null>;
}

const MiffyCtx = createContext<MiffyContextValue | null>(null);

export function useMiffy() {
  const ctx = useContext(MiffyCtx);
  if (!ctx) throw new Error("useMiffy must be inside MiffyProvider");
  return ctx;
}

export function MiffyProvider({ children }: { children: ReactNode }) {
  const [miffyPos, setMiffyPos] = useState({ x: 0, y: 0 });
  const [miffyActivated, setMiffyActivated] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [miffyTongue, setMiffyTongue] = useState(false);
  const [runFrame, setRunFrame] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isBouncing, setIsBouncing] = useState<
    "left" | "right" | "top" | "bottom" | null
  >(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const initialMiffyRef = useRef<HTMLDivElement>(null);
  const miffyPosRef = useRef(miffyPos);
  miffyPosRef.current = miffyPos;

  // Run frame animation
  useEffect(() => {
    if (!isDragging && !isMoving) return;
    const speed = isRunning ? 50 : 100;
    const interval = setInterval(() => {
      setRunFrame((prev) => (prev === 0 ? 1 : 0));
    }, speed);
    return () => clearInterval(interval);
  }, [isDragging, isMoving, isRunning]);

  // Keyboard movement
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

    const triggerBounce = (dir: "left" | "right" | "top" | "bottom") => {
      const bounceBack = shiftHeld ? 30 : 15;
      setMiffyPos((prev) => {
        let { x, y } = prev;
        if (dir === "left") x += bounceBack;
        if (dir === "right") x -= bounceBack;
        if (dir === "top") y += bounceBack;
        if (dir === "bottom") y -= bounceBack;
        return { x, y };
      });

      if (currentBounceDir !== dir) {
        currentBounceDir = dir;
        setIsBouncing(dir);
      }
      setMiffyTongue(true);

      clearTimeout(bounceTimeout);
      bounceTimeout = setTimeout(() => {
        setIsBouncing(null);
        setMiffyTongue(false);
        currentBounceDir = null;
      }, 200);
    };

    const tick = () => {
      if (keysHeld.size === 0) {
        setIsMoving(false);
        return;
      }
      setIsMoving(true);
      const step = shiftHeld ? RUN_STEP : STEP;
      setMiffyActivated(true);
      setMiffyPos((prev) => {
        let { x, y } = prev;
        if (!miffyActivated && initialMiffyRef.current) {
          const rect = initialMiffyRef.current.getBoundingClientRect();
          x = rect.left;
          y = rect.top;
        }
        if (keysHeld.has("ArrowUp") || keysHeld.has("w")) y -= step;
        if (keysHeld.has("ArrowDown") || keysHeld.has("s")) y += step;
        if (keysHeld.has("ArrowLeft") || keysHeld.has("a")) x -= step;
        if (keysHeld.has("ArrowRight") || keysHeld.has("d")) x += step;

        const maxX = window.innerWidth - MIFFY_SIZE;
        const maxY = window.innerHeight - MIFFY_SIZE;

        if (x <= 0) triggerBounce("left");
        if (x >= maxX) triggerBounce("right");
        if (y <= 0) triggerBounce("top");
        if (y >= maxY) triggerBounce("bottom");

        x = Math.max(0, Math.min(maxX, x));
        y = Math.max(0, Math.min(maxY, y));
        return { x, y };
      });
      animationId = requestAnimationFrame(tick);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "Shift") {
        shiftHeld = true;
        setIsRunning(true);
      }
      if (e.key === " ") {
        e.preventDefault();
        const now = Date.now();
        if (now - lastSpaceTime < 300) {
          setMiffyTongue(true);
          setTimeout(() => setMiffyTongue(false), 1000);
        }
        lastSpaceTime = now;
        return;
      }
      const moveKeys = [
        "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
        "w", "a", "s", "d", "W", "A", "S", "D",
      ];
      if (!moveKeys.includes(e.key)) return;
      e.preventDefault();
      const key = e.key.startsWith("Arrow") ? e.key : e.key.toLowerCase();
      if (!keysHeld.has(key)) {
        keysHeld.add(key);
        if (keysHeld.size === 1) animationId = requestAnimationFrame(tick);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        shiftHeld = false;
        setIsRunning(false);
      }
      const key = e.key.startsWith("Arrow") ? e.key : e.key.toLowerCase();
      keysHeld.delete(key);
      if (keysHeld.size === 0) setIsMoving(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(animationId);
      clearTimeout(bounceTimeout);
    };
  }, []);

  // Mouse handlers
  const handleMouseMove = useCallback((e: MouseEvent) => {
    e.preventDefault();
    const MIFFY_SIZE = 70;
    const x = Math.max(0, Math.min(window.innerWidth - MIFFY_SIZE, e.clientX - dragOffsetRef.current.x));
    const y = Math.max(0, Math.min(window.innerHeight - MIFFY_SIZE, e.clientY - dragOffsetRef.current.y));
    setMiffyPos({ x, y });
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      dragOffsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      if (!miffyActivated) {
        setMiffyPos({ x: rect.left, y: rect.top });
        setMiffyActivated(true);
      }
      setIsDragging(true);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [handleMouseMove, handleMouseUp, miffyActivated]
  );

  // Touch handlers
  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    const MIFFY_SIZE = 70;
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(window.innerWidth - MIFFY_SIZE, touch.clientX - dragOffsetRef.current.x));
    const y = Math.max(0, Math.min(window.innerHeight - MIFFY_SIZE, touch.clientY - dragOffsetRef.current.y));
    setMiffyPos({ x, y });
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    window.removeEventListener("touchmove", handleTouchMove);
    window.removeEventListener("touchend", handleTouchEnd);
  }, [handleTouchMove]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      dragOffsetRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
      if (!miffyActivated) {
        setMiffyPos({ x: rect.left, y: rect.top });
        setMiffyActivated(true);
      }
      setIsDragging(true);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd);
    },
    [handleTouchMove, handleTouchEnd, miffyActivated]
  );

  const handleDoubleClick = useCallback(() => {
    setMiffyTongue(true);
    setTimeout(() => setMiffyTongue(false), 1000);
  }, []);

  useEffect(() => {
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <MiffyCtx.Provider
      value={{
        miffyPos,
        miffyActivated,
        miffyPosRef,
        handleMouseDown,
        handleTouchStart,
        handleDoubleClick,
        initialMiffyRef,
      }}
    >
      {/* Floating Miffy */}
      {miffyActivated && (
        <div
          className="fixed z-50 cursor-grab active:cursor-grabbing select-none touch-none group"
          style={{
            transform: `translate3d(${miffyPos.x}px, ${miffyPos.y}px, 0)`,
            willChange: "transform",
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onDoubleClick={handleDoubleClick}
        >
          {!isDragging && !isMoving && (
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#AD606E] text-white text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              isa&apos;s miffy
            </span>
          )}
          <img
            src={
              miffyTongue
                ? "/miffy-tongue.png"
                : isDragging || isMoving
                ? runFrame === 0
                  ? "/miffy-left.png"
                  : "/miffy-right.png"
                : "/miffy2.png"
            }
            alt="miffy"
            width={70}
            height={70}
            className={`drop-shadow-lg pointer-events-none shrink-0 ${
              isBouncing
                ? `miffy-wall-bounce-${isBouncing}`
                : "miffy-wobble"
            }`}
            draggable={false}
          />
        </div>
      )}
      {children}
    </MiffyCtx.Provider>
  );
}
