"use client";

import { useCallback, useEffect, useRef } from "react";
import { useLanguage } from "@/lib/hooks/useLanguage";
import {
  defaultPlacementFor,
  drawFrame,
  FRAME_STYLES,
  MOBILE_ONLY_STYLES,
  onOverlayReady,
  type FrameStyle,
} from "@/lib/canvas/photoFrames";
import type { CanvasFormat } from "@/lib/canvas/geometry";

type Props = {
  image: HTMLImageElement;
  format: CanvasFormat;
  value: FrameStyle;
  onChange: (s: FrameStyle) => void;
};

const THUMB_LONG_EDGE = 200;

export function FrameSelector({ image, format, value, onChange }: Props) {
  const { t } = useLanguage();
  const refs = useRef<Record<string, HTMLCanvasElement | null>>({});

  const renderThumbs = useCallback(() => {
    const longest = Math.max(format.w, format.h);
    const scale = THUMB_LONG_EDGE / longest;
    const cw = Math.round(format.w * scale);
    const ch = Math.round(format.h * scale);
    FRAME_STYLES.forEach((s) => {
      const c = refs.current[s];
      if (!c) return;
      c.width = cw;
      c.height = ch;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      drawFrame(ctx, image, s, { placement: defaultPlacementFor(s) });
    });
  }, [image, format]);

  useEffect(() => {
    renderThumbs();
  }, [renderThumbs]);

  useEffect(() => onOverlayReady(renderThumbs), [renderThumbs]);

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-600">
        {t.flagMyPhoto.chooseStyle}
      </h3>
      <div className="grid grid-cols-3 gap-3 lg:grid-cols-2">
        {FRAME_STYLES.map((s) => {
          const active = value === s;
          const mobileOnly = MOBILE_ONLY_STYLES.has(s);
          return (
            <button
              key={s}
              type="button"
              onClick={() => onChange(s)}
              aria-pressed={active}
              className={`group flex flex-col items-stretch gap-1.5 focus-visible:outline-none ${
                mobileOnly ? "sm:hidden" : ""
              }`}
            >
              <div
                className={`relative aspect-square overflow-hidden border-2 transition focus-visible:ring-2 focus-visible:ring-[#EF3340] focus-visible:ring-offset-2 ${
                  active
                    ? "border-[#EF3340]"
                    : "border-black group-hover:border-[#EF3340]"
                }`}
              >
                <canvas
                  ref={(el) => {
                    refs.current[s] = el;
                  }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <span
                className={`text-center text-[11px] font-semibold transition ${
                  active ? "text-[#EF3340]" : "text-black"
                }`}
              >
                {t.flagMyPhoto.styles[s]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
