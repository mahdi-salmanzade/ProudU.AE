"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/hooks/useLanguage";
import {
  clampTransform,
  distance,
  fitContain,
  type Transform,
} from "@/lib/canvas/photoTransform";

type Props = {
  image: HTMLImageElement;
  onConfirm: (cropped: HTMLImageElement) => void;
  onCancel: () => void;
};

type PointerInfo = { id: number; x: number; y: number };

const OUTPUT_SIZE = 1080;
const ZOOM_MIN = 1;
const ZOOM_MAX = 4;
const ZOOM_STEP = 0.01;

export function PhotoCropper({ image, onConfirm, onCancel }: Props) {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const transformRef = useRef<Transform>({ scale: 1, x: 0, y: 0 });
  const baseScaleRef = useRef<number>(1);
  const pointersRef = useRef<PointerInfo[]>([]);
  const initialPinchRef = useRef<{
    dist: number;
    transform: Transform;
    cx: number;
    cy: number;
  } | null>(null);
  const lastPanRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [busy, setBusy] = useState(false);

  const draw = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, 0, c.width, c.height);
    const tr = transformRef.current;
    ctx.save();
    ctx.translate(tr.x, tr.y);
    ctx.scale(tr.scale, tr.scale);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(image, 0, 0);
    ctx.restore();
  }, [image]);

  const schedule = useCallback(() => {
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      draw();
    });
  }, [draw]);

  const reset = useCallback(() => {
    const fit = fitContain(
      { w: image.naturalWidth, h: image.naturalHeight },
      { w: OUTPUT_SIZE, h: OUTPUT_SIZE },
    );
    baseScaleRef.current = fit.scale;
    transformRef.current = fit;
    setZoom(1);
    schedule();
  }, [image, schedule]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width = OUTPUT_SIZE;
    c.height = OUTPUT_SIZE;
    reset();
  }, [reset]);

  const applyZoom = useCallback(
    (next: number) => {
      const clamped = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, next));
      const newScale = baseScaleRef.current * clamped;
      const cur = transformRef.current;
      if (cur.scale === 0) return;
      const k = newScale / cur.scale;
      const cx = OUTPUT_SIZE / 2;
      const cy = OUTPUT_SIZE / 2;
      const t: Transform = {
        scale: newScale,
        x: cx - (cx - cur.x) * k,
        y: cy - (cy - cur.y) * k,
      };
      transformRef.current = clampTransform(
        t,
        { w: image.naturalWidth, h: image.naturalHeight },
        { w: OUTPUT_SIZE, h: OUTPUT_SIZE },
      );
      setZoom(clamped);
      schedule();
    },
    [image, schedule],
  );

  const toCanvasCoords = useCallback((clientX: number, clientY: number) => {
    const c = canvasRef.current;
    if (!c) return { x: 0, y: 0 };
    const rect = c.getBoundingClientRect();
    const sx = c.width / rect.width;
    const sy = c.height / rect.height;
    return {
      x: (clientX - rect.left) * sx,
      y: (clientY - rect.top) * sy,
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const p = toCanvasCoords(e.clientX, e.clientY);
    pointersRef.current.push({ id: e.pointerId, x: p.x, y: p.y });

    if (pointersRef.current.length === 2) {
      const [a, b] = pointersRef.current;
      initialPinchRef.current = {
        dist: distance(a.x, a.y, b.x, b.y),
        transform: { ...transformRef.current },
        cx: (a.x + b.x) / 2,
        cy: (a.y + b.y) / 2,
      };
    } else if (pointersRef.current.length === 1) {
      lastPanRef.current = { x: p.x, y: p.y };
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const idx = pointersRef.current.findIndex((p) => p.id === e.pointerId);
    if (idx === -1) return;
    e.preventDefault();
    const p = toCanvasCoords(e.clientX, e.clientY);
    pointersRef.current[idx] = { id: e.pointerId, x: p.x, y: p.y };

    if (pointersRef.current.length === 2 && initialPinchRef.current) {
      const [a, b] = pointersRef.current;
      const dist = distance(a.x, a.y, b.x, b.y);
      const init = initialPinchRef.current;
      const factor = dist / init.dist;
      const newScale = init.transform.scale * factor;
      const k = newScale / init.transform.scale;
      const cx = (a.x + b.x) / 2;
      const cy = (a.y + b.y) / 2;
      const dx = cx - init.cx;
      const dy = cy - init.cy;
      const tr: Transform = {
        scale: newScale,
        x: init.cx - (init.cx - init.transform.x) * k + dx,
        y: init.cy - (init.cy - init.transform.y) * k + dy,
      };
      transformRef.current = clampTransform(
        tr,
        { w: image.naturalWidth, h: image.naturalHeight },
        { w: OUTPUT_SIZE, h: OUTPUT_SIZE },
      );
      setZoom(
        Math.min(
          ZOOM_MAX,
          Math.max(ZOOM_MIN, transformRef.current.scale / baseScaleRef.current),
        ),
      );
    } else if (pointersRef.current.length === 1 && lastPanRef.current) {
      const dx = p.x - lastPanRef.current.x;
      const dy = p.y - lastPanRef.current.y;
      lastPanRef.current = { x: p.x, y: p.y };
      const cur = transformRef.current;
      transformRef.current = clampTransform(
        { scale: cur.scale, x: cur.x + dx, y: cur.y + dy },
        { w: image.naturalWidth, h: image.naturalHeight },
        { w: OUTPUT_SIZE, h: OUTPUT_SIZE },
      );
    }
    schedule();
  };

  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    pointersRef.current = pointersRef.current.filter(
      (p) => p.id !== e.pointerId,
    );
    if (pointersRef.current.length < 2) initialPinchRef.current = null;
    if (pointersRef.current.length === 0) lastPanRef.current = null;
  };

  const handleConfirm = async () => {
    const c = canvasRef.current;
    if (!c) return;
    setBusy(true);
    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        c.toBlob(resolve, "image/png"),
      );
      if (!blob) {
        setBusy(false);
        return;
      }
      const url = URL.createObjectURL(blob);
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = reject;
        el.src = url;
      });
      onConfirm(img);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-5 border border-black bg-white p-4 sm:p-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-black sm:text-3xl">
          {t.flagMyPhoto.crop.title}
        </h2>
        <p className="mt-1 text-xs text-neutral-600">
          {t.flagMyPhoto.crop.hint}
        </p>
      </div>
      <div className="relative mx-auto aspect-square w-full max-w-[440px] overflow-hidden border border-black bg-neutral-100">
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="block h-full w-full touch-none select-none"
        />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-neutral-600">−</span>
        <input
          type="range"
          min={ZOOM_MIN}
          max={ZOOM_MAX}
          step={ZOOM_STEP}
          value={zoom}
          onChange={(e) => applyZoom(Number(e.target.value))}
          aria-label="Zoom"
          className="flex-1 accent-[#EF3340]"
        />
        <span className="text-xs font-semibold text-neutral-600">+</span>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 min-h-[44px] border-2 border-black bg-white px-4 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
        >
          {t.flagMyPhoto.crop.cancel}
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={busy}
          className="flex-1 min-h-[44px] border-2 border-[#EF3340] bg-[#EF3340] px-4 text-sm font-semibold text-white transition hover:bg-[#c9282f] disabled:opacity-60"
        >
          {t.flagMyPhoto.crop.confirm}
        </button>
      </div>
    </div>
  );
}
