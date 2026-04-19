"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useLanguage } from "@/lib/hooks/useLanguage";
import {
  DEFAULT_PLACEMENT,
  defaultPlacementFor,
  drawFrame,
  isDraggableOverlay,
  onOverlayReady,
  overlayBox,
  type FrameStyle,
  type OverlayPlacement,
} from "@/lib/canvas/photoFrames";
import {
  clampTransform,
  distance,
  fitContain,
  IDENTITY,
  type Transform,
} from "@/lib/canvas/photoTransform";
import type { CanvasFormat } from "@/lib/canvas/geometry";

type Props = {
  image: HTMLImageElement;
  format: CanvasFormat;
  style: FrameStyle;
};

export type PhotoEditorHandle = {
  getCanvas: () => HTMLCanvasElement | null;
};

type PointerInfo = { id: number; x: number; y: number };

const DOUBLE_TAP_MS = 280;
const DOUBLE_TAP_DIST = 30;

export const PhotoEditor = forwardRef<PhotoEditorHandle, Props>(
  function PhotoEditor({ image, format, style }, ref) {
    const { t } = useLanguage();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const transformRef = useRef<Transform>(IDENTITY);
    const baseScaleRef = useRef<number>(1);
    const pointersRef = useRef<PointerInfo[]>([]);
    const initialPinchRef = useRef<{
      dist: number;
      transform: Transform;
      cx: number;
      cy: number;
    } | null>(null);
    const lastPanRef = useRef<{ x: number; y: number } | null>(null);
    const lastTapRef = useRef<{ t: number; x: number; y: number } | null>(null);
    const rafRef = useRef<number | null>(null);
    const [hint, setHint] = useState(true);
    const [zoom, setZoom] = useState(1);
    const [circlePreview, setCirclePreview] = useState(false);
    const [placement, setPlacement] = useState<OverlayPlacement>(() =>
      defaultPlacementFor(style),
    );
    const placementRef = useRef<OverlayPlacement>(defaultPlacementFor(style));
    const flagDragRef = useRef<{ startCx: number; startCy: number; px: number; py: number } | null>(
      null,
    );
    const ROTATABLE_SLIDER_STYLES: FrameStyle[] = [
      "circle",
      "border",
      "banner",
      "archRight",
      "ribbonTail",
    ];
    const isCorner = style === "corner";
    const isBorder = style === "border";
    const isFullCircle = style === "fullCircle";
    const supportsRotationSlider =
      !isFullCircle && ROTATABLE_SLIDER_STYLES.includes(style);
    const supportsThickness = !isFullCircle && style === "circle";
    const supportsDrag = !isFullCircle && isDraggableOverlay(style);
    const rotationStep = isBorder ? 90 : 1;
    const isBanner = style === "banner";
    const rotationMin = isBanner ? -90 : -180;
    const rotationMax = isBanner ? 90 : 180;

    const ZOOM_MIN = 1;
    const ZOOM_MAX = 4;
    const ZOOM_STEP = 0.01;
    const THICKNESS_MIN = 0.3;
    const THICKNESS_MAX = 3;
    const THICKNESS_STEP = 0.05;

    useImperativeHandle(ref, () => ({
      getCanvas: () => canvasRef.current,
    }));

    const schedule = useCallback(() => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const c = canvasRef.current;
        if (!c) return;
        const ctx = c.getContext("2d");
        if (!ctx) return;
        drawFrame(ctx, image, style, {
          format,
          transform: transformRef.current,
          placement: placementRef.current,
        });
      });
    }, [image, style, format]);

    useEffect(() => {
      placementRef.current = placement;
      schedule();
    }, [placement, schedule]);

    useEffect(() => {
      if (!isCorner) return;
      const deg = Math.round((placementRef.current.rotation * 180) / Math.PI);
      if (deg !== 0 && deg !== 90) {
        const next: OverlayPlacement = {
          ...placementRef.current,
          rotation: 0,
        };
        placementRef.current = next;
        setPlacement(next);
      }
    }, [isCorner]);

    useEffect(() => {
      if (!isFullCircle) return;
      const next = defaultPlacementFor("fullCircle");
      placementRef.current = next;
      setPlacement(next);
    }, [isFullCircle]);

    const reset = useCallback(() => {
      const fit = fitContain(
        { w: image.naturalWidth, h: image.naturalHeight },
        { w: format.w, h: format.h },
      );
      baseScaleRef.current = fit.scale;
      transformRef.current = fit;
      const nextPlacement = defaultPlacementFor(style);
      placementRef.current = nextPlacement;
      setPlacement(nextPlacement);
      setZoom(1);
      schedule();
    }, [image, format, schedule, style]);

    const applyZoom = useCallback(
      (next: number) => {
        const clamped = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, next));
        const newScale = baseScaleRef.current * clamped;
        const cur = transformRef.current;
        if (cur.scale === 0) return;
        const k = newScale / cur.scale;
        const cx = format.w / 2;
        const cy = format.h / 2;
        const t: Transform = {
          scale: newScale,
          x: cx - (cx - cur.x) * k,
          y: cy - (cy - cur.y) * k,
        };
        transformRef.current = clampTransform(
          t,
          { w: image.naturalWidth, h: image.naturalHeight },
          { w: format.w, h: format.h },
        );
        setZoom(clamped);
        schedule();
      },
      [image, format, schedule],
    );

    useEffect(() => {
      const c = canvasRef.current;
      if (!c) return;
      c.width = format.w;
      c.height = format.h;
      reset();
    }, [format, reset]);

    useEffect(() => {
      schedule();
    }, [style, schedule]);

    useEffect(() => onOverlayReady(schedule), [schedule]);

    const toCanvasCoords = useCallback(
      (clientX: number, clientY: number) => {
        const c = canvasRef.current;
        if (!c) return { x: 0, y: 0 };
        const rect = c.getBoundingClientRect();
        const sx = c.width / rect.width;
        const sy = c.height / rect.height;
        return {
          x: (clientX - rect.left) * sx,
          y: (clientY - rect.top) * sy,
        };
      },
      [],
    );

    const isInsideOverlay = (px: number, py: number) => {
      if (!supportsDrag) return false;
      const box = overlayBox(format, style, placementRef.current);
      if (!box) return false;
      const dx = px - box.cx;
      const dy = py - box.cy;
      const cos = Math.cos(-box.rotation);
      const sin = Math.sin(-box.rotation);
      const lx = dx * cos - dy * sin;
      const ly = dx * sin + dy * cos;
      return Math.abs(lx) <= box.w / 2 && Math.abs(ly) <= box.h / 2;
    };

    const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      const p = toCanvasCoords(e.clientX, e.clientY);
      pointersRef.current.push({ id: e.pointerId, x: p.x, y: p.y });

      if (pointersRef.current.length === 2) {
        flagDragRef.current = null;
        const [a, b] = pointersRef.current;
        initialPinchRef.current = {
          dist: distance(a.x, a.y, b.x, b.y),
          transform: { ...transformRef.current },
          cx: (a.x + b.x) / 2,
          cy: (a.y + b.y) / 2,
        };
      } else if (pointersRef.current.length === 1) {
        const now = Date.now();
        const last = lastTapRef.current;
        if (
          last &&
          now - last.t < DOUBLE_TAP_MS &&
          distance(last.x, last.y, p.x, p.y) < DOUBLE_TAP_DIST * (canvasRef.current!.width / canvasRef.current!.getBoundingClientRect().width)
        ) {
          reset();
          lastTapRef.current = null;
        } else {
          lastTapRef.current = { t: now, x: p.x, y: p.y };
        }
        if (isInsideOverlay(p.x, p.y)) {
          const box = overlayBox(format, style, placementRef.current);
          if (box) {
            flagDragRef.current = {
              startCx: box.cx,
              startCy: box.cy,
              px: p.x,
              py: p.y,
            };
            lastPanRef.current = null;
          } else {
            flagDragRef.current = null;
            lastPanRef.current = { x: p.x, y: p.y };
          }
        } else {
          flagDragRef.current = null;
          lastPanRef.current = { x: p.x, y: p.y };
        }
      }
      setHint(false);
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
        const t: Transform = {
          scale: newScale,
          x: init.cx - (init.cx - init.transform.x) * k + dx,
          y: init.cy - (init.cy - init.transform.y) * k + dy,
        };
        transformRef.current = clampTransform(
          t,
          { w: image.naturalWidth, h: image.naturalHeight },
          { w: format.w, h: format.h },
        );
        setZoom(
          Math.min(
            ZOOM_MAX,
            Math.max(ZOOM_MIN, transformRef.current.scale / baseScaleRef.current),
          ),
        );
      } else if (pointersRef.current.length === 1 && flagDragRef.current) {
        const startBox = overlayBox(format, style, DEFAULT_PLACEMENT);
        if (!startBox) return;
        const drag = flagDragRef.current;
        const newCx = drag.startCx + (p.x - drag.px);
        const newCy = drag.startCy + (p.y - drag.py);
        const next: OverlayPlacement = {
          ...placementRef.current,
          dx: newCx - startBox.cx,
          dy: newCy - startBox.cy,
        };
        placementRef.current = next;
        setPlacement(next);
      } else if (pointersRef.current.length === 1 && lastPanRef.current) {
        const dx = p.x - lastPanRef.current.x;
        const dy = p.y - lastPanRef.current.y;
        lastPanRef.current = { x: p.x, y: p.y };
        const cur = transformRef.current;
        transformRef.current = clampTransform(
          { scale: cur.scale, x: cur.x + dx, y: cur.y + dy },
          { w: image.naturalWidth, h: image.naturalHeight },
          { w: format.w, h: format.h },
        );
      }
      schedule();
    };

    const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
      pointersRef.current = pointersRef.current.filter(
        (p) => p.id !== e.pointerId,
      );
      if (pointersRef.current.length < 2) initialPinchRef.current = null;
      if (pointersRef.current.length === 0) {
        lastPanRef.current = null;
        flagDragRef.current = null;
      }
    };

    const setRotationDeg = (deg: number) => {
      const next: OverlayPlacement = {
        ...placementRef.current,
        rotation: (deg * Math.PI) / 180,
      };
      placementRef.current = next;
      setPlacement(next);
    };

    const setThickness = (value: number) => {
      const clamped = Math.min(THICKNESS_MAX, Math.max(THICKNESS_MIN, value));
      const next: OverlayPlacement = {
        ...placementRef.current,
        thickness: clamped,
      };
      placementRef.current = next;
      setPlacement(next);
    };

    const FLAG_SIZE_MIN = 0.5;
    const FLAG_SIZE_MAX = 2.5;
    const FLAG_SIZE_STEP = 0.05;
    const setFlagSize = (value: number) => {
      const clamped = Math.min(FLAG_SIZE_MAX, Math.max(FLAG_SIZE_MIN, value));
      const next: OverlayPlacement = {
        ...placementRef.current,
        scale: clamped,
      };
      placementRef.current = next;
      setPlacement(next);
    };

    const setOpacity = (value: number) => {
      const clamped = Math.min(1, Math.max(0, value));
      const next: OverlayPlacement = {
        ...placementRef.current,
        opacity: clamped,
      };
      placementRef.current = next;
      setPlacement(next);
    };

    return (
      <div className="relative">
        <div
          className="relative mx-auto overflow-hidden border border-black bg-white"
          style={{
            aspectRatio: `${format.w} / ${format.h}`,
            maxWidth: format.h > format.w ? "260px" : "440px",
          }}
        >
          <canvas
            ref={canvasRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="block h-full w-full touch-none select-none"
          />
          {circlePreview && (
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle closest-side, transparent 99%, rgba(0,0,0,0.5) 100%)",
              }}
              aria-hidden
            />
          )}
        </div>
        <div className="mt-3 flex items-center gap-3">
          {isFullCircle ? (
            <>
              <span className="text-xs font-semibold text-neutral-600">○</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={placement.opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                aria-label="Flag opacity"
                className="flex-1 accent-[#EF3340]"
              />
              <span className="text-xs font-semibold text-neutral-600">●</span>
            </>
          ) : (
            <>
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
              <button
                type="button"
                onClick={() => setCirclePreview((v) => !v)}
                aria-pressed={circlePreview}
                aria-label="Circle profile preview"
                title="Circle profile preview"
                className={`grid h-8 w-8 place-items-center border-2 bg-white transition ${
                  circlePreview
                    ? "border-[#EF3340] text-[#EF3340]"
                    : "border-black text-black hover:border-[#EF3340] hover:text-[#EF3340]"
                }`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  aria-hidden
                >
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </button>
            </>
          )}
          <button
            type="button"
            onClick={reset}
            className="border-2 border-black bg-white px-3 py-1.5 text-xs font-semibold text-black transition hover:border-[#EF3340] hover:text-[#EF3340]"
          >
            {t.flagMyPhoto.reset}
          </button>
        </div>
        {isCorner && (
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setRotationDeg(0)}
              aria-pressed={
                Math.round((placement.rotation * 180) / Math.PI) === 0
              }
              className={`flex-1 min-h-[40px] border-2 bg-white px-3 py-2 text-xs font-semibold transition ${
                Math.round((placement.rotation * 180) / Math.PI) === 0
                  ? "border-[#EF3340] text-[#EF3340]"
                  : "border-black text-black hover:border-[#EF3340] hover:text-[#EF3340]"
              }`}
            >
              {t.flagMyPhoto.horizontal}
            </button>
            <button
              type="button"
              onClick={() => setRotationDeg(90)}
              aria-pressed={
                Math.round((placement.rotation * 180) / Math.PI) === 90
              }
              className={`flex-1 min-h-[40px] border-2 bg-white px-3 py-2 text-xs font-semibold transition ${
                Math.round((placement.rotation * 180) / Math.PI) === 90
                  ? "border-[#EF3340] text-[#EF3340]"
                  : "border-black text-black hover:border-[#EF3340] hover:text-[#EF3340]"
              }`}
            >
              {t.flagMyPhoto.vertical}
            </button>
          </div>
        )}
        {isCorner && (
          <div className="mt-3 flex items-center gap-3">
            <span className="text-xs font-semibold text-neutral-600">▫</span>
            <input
              type="range"
              min={FLAG_SIZE_MIN}
              max={FLAG_SIZE_MAX}
              step={FLAG_SIZE_STEP}
              value={placement.scale}
              onChange={(e) => setFlagSize(Number(e.target.value))}
              aria-label="Flag size"
              className="flex-1 accent-[#EF3340]"
            />
            <span className="text-xs font-semibold text-neutral-600">▪</span>
          </div>
        )}
        {supportsRotationSlider && (
          <div className="mt-3 flex items-center gap-3">
            <span className="text-xs font-semibold text-neutral-600">↺</span>
            <input
              type="range"
              min={rotationMin}
              max={rotationMax}
              step={rotationStep}
              value={Math.round((placement.rotation * 180) / Math.PI)}
              onChange={(e) => setRotationDeg(Number(e.target.value))}
              aria-label="Rotation"
              className="flex-1 accent-[#EF3340]"
            />
            <span className="text-xs font-semibold text-neutral-600">↻</span>
          </div>
        )}
        {supportsThickness && (
          <div className="mt-3 flex items-center gap-3">
            <span className="text-xs font-semibold text-neutral-600">▏</span>
            <input
              type="range"
              min={THICKNESS_MIN}
              max={THICKNESS_MAX}
              step={THICKNESS_STEP}
              value={placement.thickness}
              onChange={(e) => setThickness(Number(e.target.value))}
              aria-label="Border thickness"
              className="flex-1 accent-[#EF3340]"
            />
            <span className="text-xs font-semibold text-neutral-600">▍</span>
          </div>
        )}
        {hint && (
          <p className="mt-2 text-xs text-neutral-600">
            {t.flagMyPhoto.pinchHint}
          </p>
        )}
      </div>
    );
  },
);
