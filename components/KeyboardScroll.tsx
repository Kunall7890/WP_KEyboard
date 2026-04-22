"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const TOTAL_FRAMES = 290;
const FOG_HEX = "#ECECEC";

type OverlayBeat = {
  key: string;
  title: string;
  body: string;
  accent: string;
  align: "left" | "center" | "right";
  vertical: "top" | "bottom";
  start: number;
  end: number;
};

const overlayBeats: OverlayBeat[] = [
  {
    key: "intro",
    title: "Meet the WpDev Founder Edition.",
    body: "Precision typing. Quiet confidence. Built for people who ship.",
    accent: "Now accepting reservations",
    align: "center",
    vertical: "bottom",
    start: 0,
    end: 0.18,
  },
  {
    key: "precision",
    title: "Speed without compromise.",
    body: "Sub-1ms response keeps your flow uninterrupted from ideation to deployment.",
    accent: "Performance architecture",
    align: "left",
    vertical: "top",
    start: 0.2,
    end: 0.42,
  },
  {
    key: "layers",
    title: "Engineered from the inside out.",
    body: "Layered materials tune feel, sound, and stability for long deep-work sessions.",
    accent: "Acoustic + structural stack",
    align: "right",
    vertical: "top",
    start: 0.54,
    end: 0.75,
  },
  {
    key: "cta",
    title: "Built. Tuned. Ready to own.",
    body: "Limited founder inventory is live - reserve yours today.",
    accent: "Founder Drop 01",
    align: "center",
    vertical: "bottom",
    start: 0.86,
    end: 1,
  },
];

function resolveFrameSource(index: number): string[] {
  return [
    `/ezgif-frame-${(index + 1).toString().padStart(3, "0")}.jpg`,
  ];
}

export default function KeyboardScroll() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(Array(TOTAL_FRAMES).fill(null));
  const loadedCountRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastDrawnFrameRef = useRef<number>(-1);
  const [loadedCount, setLoadedCount] = useState(0);
  const [activeBeat, setActiveBeat] = useState<string>(overlayBeats[0].key);
  const [isSequenceReady, setIsSequenceReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const activeBeatData = useMemo(() => {
    return overlayBeats.find((beat) => beat.key === activeBeat) ?? overlayBeats[0];
  }, [activeBeat]);
  const [scrollProgressPercent, setScrollProgressPercent] = useState(0);

  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    const image = imagesRef.current[frameIndex];
    if (!canvas || !image) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cssWidth = canvas.clientWidth;
    const cssHeight = canvas.clientHeight;
    if (cssWidth === 0 || cssHeight === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const targetWidth = Math.floor(cssWidth * dpr);
    const targetHeight = Math.floor(cssHeight * dpr);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssWidth, cssHeight);
    ctx.fillStyle = FOG_HEX;
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    const scale = Math.max(cssWidth / image.naturalWidth, cssHeight / image.naturalHeight);
    const drawWidth = image.naturalWidth * scale;
    const drawHeight = image.naturalHeight * scale;
    const x = (cssWidth - drawWidth) * 0.5;
    const y = (cssHeight - drawHeight) * 0.5;

    ctx.drawImage(image, x, y, drawWidth, drawHeight);
    lastDrawnFrameRef.current = frameIndex;
  }, []);

  const queueDraw = useCallback(
    (frameIndex: number) => {
      if (lastDrawnFrameRef.current === frameIndex) return;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        drawFrame(frameIndex);
      });
    },
    [drawFrame]
  );

  useEffect(() => {
    let isCancelled = false;

    const loadSingleFrame = (frameIndex: number) =>
      new Promise<void>((resolve) => {
        const trySources = (sources: string[], sourceIndex: number) => {
          const src = sources[sourceIndex];
          if (!src) {
            imagesRef.current[frameIndex] = null;
            loadedCountRef.current += 1;
            if (!isCancelled) {
              setLoadedCount(loadedCountRef.current);
            }
            resolve();
            return;
          }

          const img = new Image();
          img.decoding = "async";
          img.src = src;

          img.onload = () => {
            imagesRef.current[frameIndex] = img;
            loadedCountRef.current += 1;

            if (!isCancelled) {
              setLoadedCount(loadedCountRef.current);
              if (frameIndex === 0) {
                queueDraw(0);
              }
            }
            resolve();
          };

          img.onerror = () => {
            trySources(sources, sourceIndex + 1);
          };
        };

        trySources(resolveFrameSource(frameIndex), 0);
      });

    Promise.all(Array.from({ length: TOTAL_FRAMES }, (_, i) => loadSingleFrame(i))).then(() => {
      if (isCancelled) return;
      setIsSequenceReady(true);
      queueDraw(lastDrawnFrameRef.current >= 0 ? lastDrawnFrameRef.current : 0);
    });

    return () => {
      isCancelled = true;
    };
  }, [queueDraw]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const clamped = Math.min(1, Math.max(0, latest));
    setScrollProgressPercent(Math.round(clamped * 100));
    const frameIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(clamped * (TOTAL_FRAMES - 1))));
    queueDraw(frameIndex);

    const matchedBeat =
      overlayBeats.find((beat) => clamped >= beat.start && clamped <= beat.end) ?? overlayBeats[overlayBeats.length - 1];
    setActiveBeat((prev) => (prev === matchedBeat.key ? prev : matchedBeat.key));
  });

  useEffect(() => {
    const handleResize = () => {
      const indexToDraw = lastDrawnFrameRef.current >= 0 ? lastDrawnFrameRef.current : 0;
      queueDraw(indexToDraw);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [queueDraw]);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const loadProgress = Math.round((loadedCount / TOTAL_FRAMES) * 100);
  const positionClass =
    activeBeatData.align === "left"
      ? "items-start text-left px-5 md:px-12"
      : activeBeatData.align === "right"
        ? "items-end text-right px-5 md:px-12"
        : "items-center text-center px-5";
  const verticalClass = activeBeatData.vertical === "top" ? "items-start pt-24 md:pt-32" : "items-end pb-20 md:pb-24";

  return (
    <section ref={wrapperRef} className="relative h-[400vh] bg-fog">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-fog">
        <canvas ref={canvasRef} className="h-screen w-full bg-fog" aria-label="WpDev keyboard sequence" />

        <div className="pointer-events-none absolute left-1/2 top-8 z-10 hidden w-[min(720px,82vw)] -translate-x-1/2 items-center justify-between rounded-full border border-black/10 bg-white/65 px-5 py-3 backdrop-blur md:flex">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-black/50">WpDev Scrollytelling</p>
          <div className="h-[3px] w-56 overflow-hidden rounded-full bg-black/10">
            <div className="h-full rounded-full bg-black/50 transition-all duration-200" style={{ width: `${scrollProgressPercent}%` }} />
          </div>
          <p className="text-[11px] tabular-nums tracking-tight text-black/55">{scrollProgressPercent}%</p>
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(255,255,255,0.7),rgba(236,236,236,0.15)_45%,rgba(236,236,236,0)_70%)]" />

        <div className={`pointer-events-none absolute inset-0 flex ${verticalClass}`}>
          <motion.div
            key={activeBeatData.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.55, ease: [0.2, 0.65, 0.2, 1] }}
            className={`flex w-full flex-col gap-2.5 ${positionClass}`}
          >
            <div className="bg-transparent px-4 py-3 md:px-5 md:py-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-black/45 md:text-[11px]">{activeBeatData.accent}</p>
              <h1 className="font-display mt-2 max-w-[15ch] text-3xl font-semibold tracking-[-0.03em] text-black/90 md:text-5xl">{activeBeatData.title}</h1>
              <p className="mt-2 max-w-[24ch] text-sm font-normal tracking-tight text-black/60 md:text-lg">{activeBeatData.body}</p>
            </div>
          </motion.div>
        </div>

        {scrollProgressPercent > 83 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 md:bottom-10"
          >
            <button
              type="button"
              className="rounded-full border border-black/10 bg-black px-7 py-3 text-sm font-semibold tracking-tight text-white shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition hover:-translate-y-0.5 hover:bg-black/90"
            >
              Reserve Founder Edition
            </button>
          </motion.div>
        )}

        {!isSequenceReady && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-fog/95 backdrop-blur-[1px]">
            <div className="flex flex-col items-center gap-4">
              <span className="h-10 w-10 animate-spin rounded-full border-2 border-black/20 border-t-black/65" />
              <p className="text-sm tracking-tight text-black/60 md:text-base">Loading WpDev sequence... {loadProgress}%</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
