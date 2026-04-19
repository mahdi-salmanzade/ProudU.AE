import { FORMATS, type CanvasFormat } from "./geometry";
import { applyTransform, type Transform } from "./photoTransform";
import {
  FLAG_COLORS,
  drawCenterCropped,
  drawUAEFlag,
  hexAlpha,
} from "./utils";

export type FrameStyle =
  | "corner"
  | "gradient"
  | "circle"
  | "border"
  | "banner"
  | "archLeft"
  | "archRight"
  | "ribbonTail"
  | "fullCircle";

export const FRAME_STYLES: FrameStyle[] = [
  "archLeft",
  "corner",
  "gradient",
  "circle",
  "border",
  "banner",
  "archRight",
  "ribbonTail",
  "fullCircle",
];

export const MOBILE_ONLY_STYLES: ReadonlySet<FrameStyle> = new Set([
  "fullCircle",
]);

const overlayCache: Record<string, HTMLImageElement> = {};
const overlayWaiters = new Set<() => void>();

export function onOverlayReady(cb: () => void) {
  overlayWaiters.add(cb);
  return () => {
    overlayWaiters.delete(cb);
  };
}

function getOverlay(src: string): HTMLImageElement | null {
  let img = overlayCache[src];
  if (!img) {
    img = new Image();
    img.decoding = "async";
    img.src = src;
    img.onload = () => {
      overlayWaiters.forEach((cb) => cb());
    };
    overlayCache[src] = img;
  }
  return img.complete && img.naturalWidth > 0 ? img : null;
}

function overlayAspect(src: string, fallback: number): number {
  const img = overlayCache[src];
  if (img && img.complete && img.naturalWidth > 0) {
    return img.naturalWidth / img.naturalHeight;
  }
  return fallback;
}

if (typeof window !== "undefined") {
  [
    "/flags/4.png",
    "/flags/5.png",
    "/flags/6.png",
    "/flags/7.png",
    "/ae.png",
  ].forEach((src) => getOverlay(src));
}

function drawOverlayFitCentered(
  ctx: CanvasRenderingContext2D,
  src: string,
  cx: number,
  cy: number,
  w: number,
  h: number,
  rotation = 0,
) {
  const overlay = getOverlay(src);
  if (!overlay) return;
  const ow = overlay.naturalWidth;
  const oh = overlay.naturalHeight;
  const scale = Math.min(w / ow, h / oh);
  const dw = ow * scale;
  const dh = oh * scale;
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.drawImage(overlay, -dw / 2, -dh / 2, dw, dh);
  ctx.restore();
}

export type OverlayPlacement = {
  dx: number;
  dy: number;
  rotation: number;
  scale: number;
  thickness: number;
  opacity: number;
};

export const DEFAULT_PLACEMENT: OverlayPlacement = {
  dx: 0,
  dy: 0,
  rotation: 0,
  scale: 1,
  thickness: 1,
  opacity: 1,
};

export function defaultPlacementFor(style: FrameStyle): OverlayPlacement {
  switch (style) {
    case "fullCircle":
      return { ...DEFAULT_PLACEMENT, opacity: 0.2 };
    default:
      return DEFAULT_PLACEMENT;
  }
}

export type OverlayBox = {
  cx: number;
  cy: number;
  w: number;
  h: number;
  rotation: number;
};

const DRAGGABLE_OVERLAY_STYLES = new Set<FrameStyle>([
  "corner",
  "banner",
  "archLeft",
  "archRight",
  "ribbonTail",
]);

export function isDraggableOverlay(style: FrameStyle): boolean {
  return DRAGGABLE_OVERLAY_STYLES.has(style);
}

export function overlayBox(
  format: { w: number; h: number },
  style: FrameStyle,
  placement: OverlayPlacement = DEFAULT_PLACEMENT,
): OverlayBox | null {
  const w = format.w;
  const h = format.h;
  const s = Math.min(w, h);
  switch (style) {
    case "corner": {
      const fw = s * 0.28 * placement.scale;
      const fh = fw / 2;
      const defCx = w - fw / 2 - s * 0.06;
      const defCy = h - fh / 2 - s * 0.08;
      return {
        cx: defCx + placement.dx,
        cy: defCy + placement.dy,
        w: fw,
        h: fh,
        rotation: placement.rotation,
      };
    }
    case "banner": {
      const bandH = h * 0.4;
      return {
        cx: w / 2 + w * 0.1 + placement.dx,
        cy: h - bandH / 2 + placement.dy,
        w,
        h: bandH,
        rotation: placement.rotation,
      };
    }
    case "archLeft": {
      const aspect = overlayAspect("/flags/6.png", 6);
      const dw = w * placement.scale;
      const dh = dw / aspect;
      return {
        cx: w / 2 + placement.dx,
        cy: h - dh / 2 + h * 0.05 + placement.dy,
        w: dw,
        h: dh,
        rotation: placement.rotation,
      };
    }
    case "archRight": {
      const aspect = overlayAspect("/flags/7.png", 1);
      let dw = s * 0.55 * placement.scale;
      let dh = dw / aspect;
      if (aspect < 1) {
        dh = s * 0.55 * placement.scale;
        dw = dh * aspect;
      }
      return {
        cx: w / 2 + placement.dx,
        cy: h - dh / 2 + placement.dy,
        w: dw,
        h: dh,
        rotation: placement.rotation,
      };
    }
    case "ribbonTail": {
      const size = s * 0.32;
      return {
        cx: s * 0.04 + size / 2 + w * 0.3 + placement.dx,
        cy: h - s * 0.04 - size / 2 + placement.dy,
        w: size,
        h: size,
        rotation: placement.rotation,
      };
    }
    default:
      return null;
  }
}

export type DrawFrameOptions = {
  format?: CanvasFormat;
  transform?: Transform;
  placement?: OverlayPlacement;
};

export function drawFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  style: FrameStyle,
  options: DrawFrameOptions = {},
) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const transform = options.transform;
  const placement = options.placement;

  switch (style) {
    case "corner":
      cornerFlag(ctx, img, w, h, transform, placement);
      break;
    case "gradient":
      gradientOverlay(ctx, img, w, h, transform);
      break;
    case "circle":
      circleFrame(ctx, img, w, h, transform, placement);
      break;
    case "border":
      flagBorder(ctx, img, w, h, transform, placement);
      break;
    case "banner":
      bannerOverlay(ctx, img, w, h, transform, placement);
      break;
    case "archLeft":
      archLeft(ctx, img, w, h, transform, placement);
      break;
    case "archRight":
      archRight(ctx, img, w, h, transform, placement);
      break;
    case "ribbonTail":
      ribbonTail(ctx, img, w, h, transform, placement);
      break;
    case "fullCircle":
      fullCircleFrame(ctx, img, w, h, transform, placement);
      break;
  }
}

function drawPhoto(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  transform?: Transform,
) {
  if (!transform) {
    drawCenterCropped(ctx, img, x, y, w, h);
    return;
  }
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.translate(x, y);
  applyTransform(ctx, transform);
  ctx.drawImage(img, 0, 0);
  ctx.restore();
}

function cornerFlag(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
  t?: Transform,
  placement?: OverlayPlacement,
) {
  drawPhoto(ctx, img, 0, 0, w, h, t);
  const box = overlayBox({ w, h }, "corner", placement ?? DEFAULT_PLACEMENT);
  if (!box) return;
  ctx.save();
  ctx.translate(box.cx, box.cy);
  ctx.rotate(box.rotation);
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = "#000";
  ctx.fillRect(-box.w / 2 - 2, -box.h / 2 - 2, box.w + 4, box.h + 4);
  ctx.restore();
  drawUAEFlag(ctx, -box.w / 2, -box.h / 2, box.w, box.h);
  ctx.restore();
}

function gradientOverlay(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
  t?: Transform,
) {
  drawPhoto(ctx, img, 0, 0, w, h, t);
  const overlayY = h * 0.7;
  const overlayH = h * 0.3;
  const dim = ctx.createLinearGradient(0, overlayY, 0, overlayY + overlayH);
  dim.addColorStop(0, "rgba(0,0,0,0)");
  dim.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.fillStyle = dim;
  ctx.fillRect(0, overlayY, w, overlayH);
  const colW = w / 4;
  for (let i = 0; i < 4; i++) {
    const g = ctx.createLinearGradient(0, overlayY, 0, overlayY + overlayH);
    g.addColorStop(0, hexAlpha(FLAG_COLORS[i], 0));
    g.addColorStop(1, hexAlpha(FLAG_COLORS[i], 0.85));
    ctx.fillStyle = g;
    ctx.fillRect(i * colW, overlayY, colW, overlayH);
  }
}

function circleFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
  t?: Transform,
  placement?: OverlayPlacement,
) {
  const place = placement ?? DEFAULT_PLACEMENT;
  ctx.fillStyle = "#0A0F1C";
  ctx.fillRect(0, 0, w, h);
  const s = Math.min(w, h);
  const cx = w / 2;
  const cy = h / 2;
  const margin = s * 0.01;
  const outerR = s / 2 - margin;
  const borderW = s * 0.05 * place.thickness;
  const photoR = Math.max(s * 0.12, outerR - borderW);
  const strokeW = outerR - photoR;
  const midR = photoR + strokeW / 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, photoR, 0, Math.PI * 2);
  ctx.clip();
  drawPhoto(ctx, img, 0, 0, w, h, t);
  ctx.restore();

  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.arc(
      cx,
      cy,
      midR,
      -Math.PI / 2 + (i * Math.PI) / 2 + place.rotation,
      -Math.PI / 2 + ((i + 1) * Math.PI) / 2 + place.rotation,
    );
    ctx.lineWidth = strokeW;
    ctx.strokeStyle = FLAG_COLORS[i];
    ctx.stroke();
  }
}

function flagBorder(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
  t?: Transform,
  placement?: OverlayPlacement,
) {
  const place = placement ?? DEFAULT_PLACEMENT;
  const s = Math.min(w, h);
  const bw = s * 0.05;
  drawPhoto(ctx, img, 0, 0, w, h, t);

  const steps = ((Math.round(place.rotation / (Math.PI / 2)) % 4) + 4) % 4;
  const sides = [
    FLAG_COLORS[(0 + steps) % 4],
    FLAG_COLORS[(1 + steps) % 4],
    FLAG_COLORS[(2 + steps) % 4],
    FLAG_COLORS[(3 + steps) % 4],
  ];

  ctx.fillStyle = sides[0];
  ctx.fillRect(0, 0, w, bw);
  ctx.fillStyle = sides[2];
  ctx.fillRect(0, h - bw, w, bw);
  ctx.fillStyle = sides[3];
  ctx.fillRect(0, 0, bw, h);
  ctx.fillStyle = sides[1];
  ctx.fillRect(w - bw, 0, bw, h);
}

function bannerOverlay(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
  t?: Transform,
  placement?: OverlayPlacement,
) {
  drawPhoto(ctx, img, 0, 0, w, h, t);
  const box = overlayBox({ w, h }, "banner", placement ?? DEFAULT_PLACEMENT);
  if (!box) return;
  drawOverlayFitCentered(ctx, "/flags/5.png", box.cx, box.cy, box.w, box.h, box.rotation);
}

function archLeft(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
  t?: Transform,
  placement?: OverlayPlacement,
) {
  drawPhoto(ctx, img, 0, 0, w, h, t);
  const box = overlayBox({ w, h }, "archLeft", placement ?? DEFAULT_PLACEMENT);
  if (!box) return;
  drawOverlayFitCentered(ctx, "/flags/6.png", box.cx, box.cy, box.w, box.h, box.rotation);
}

function archRight(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
  t?: Transform,
  placement?: OverlayPlacement,
) {
  drawPhoto(ctx, img, 0, 0, w, h, t);
  const box = overlayBox({ w, h }, "archRight", placement ?? DEFAULT_PLACEMENT);
  if (!box) return;
  drawOverlayFitCentered(ctx, "/flags/7.png", box.cx, box.cy, box.w, box.h, box.rotation);
}

function ribbonTail(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
  t?: Transform,
  placement?: OverlayPlacement,
) {
  drawPhoto(ctx, img, 0, 0, w, h, t);
  const box = overlayBox({ w, h }, "ribbonTail", placement ?? DEFAULT_PLACEMENT);
  if (!box) return;
  drawOverlayFitCentered(ctx, "/flags/4.png", box.cx, box.cy, box.w, box.h, box.rotation);
}

function fullCircleFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
  t?: Transform,
  placement?: OverlayPlacement,
) {
  const place = placement ?? DEFAULT_PLACEMENT;
  drawPhoto(ctx, img, 0, 0, w, h, t);
  const size = Math.max(w, h);
  ctx.save();
  ctx.globalAlpha = Math.min(1, Math.max(0, place.opacity));
  drawOverlayFitCentered(ctx, "/ae.png", w / 2, h / 2, size, size);
  ctx.restore();
}

export const SQUARE_FORMAT = FORMATS.square;
