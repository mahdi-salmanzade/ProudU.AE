export type Transform = { scale: number; x: number; y: number };

export type Viewport = { w: number; h: number };

export type ContentSize = { w: number; h: number };

export const IDENTITY: Transform = { scale: 1, x: 0, y: 0 };

export function fitContain(content: ContentSize, viewport: Viewport): Transform {
  const s = Math.max(viewport.w / content.w, viewport.h / content.h);
  return {
    scale: s,
    x: (viewport.w - content.w * s) / 2,
    y: (viewport.h - content.h * s) / 2,
  };
}

export function clampTransform(
  t: Transform,
  content: ContentSize,
  viewport: Viewport,
  minScale = 0.5,
  maxScale = 6,
): Transform {
  const scale = Math.min(maxScale, Math.max(minScale, t.scale));
  const scaledW = content.w * scale;
  const scaledH = content.h * scale;
  let x = t.x;
  let y = t.y;
  const minX = viewport.w - scaledW;
  const minY = viewport.h - scaledH;
  if (scaledW <= viewport.w) {
    x = (viewport.w - scaledW) / 2;
  } else {
    if (x > 0) x = 0;
    if (x < minX) x = minX;
  }
  if (scaledH <= viewport.h) {
    y = (viewport.h - scaledH) / 2;
  } else {
    if (y > 0) y = 0;
    if (y < minY) y = minY;
  }
  return { scale, x, y };
}

export function pan(t: Transform, dx: number, dy: number): Transform {
  return { scale: t.scale, x: t.x + dx, y: t.y + dy };
}

export function zoomAt(
  t: Transform,
  factor: number,
  px: number,
  py: number,
): Transform {
  const newScale = t.scale * factor;
  const k = newScale / t.scale;
  return {
    scale: newScale,
    x: px - (px - t.x) * k,
    y: py - (py - t.y) * k,
  };
}

export function applyTransform(ctx: CanvasRenderingContext2D, t: Transform) {
  ctx.translate(t.x, t.y);
  ctx.scale(t.scale, t.scale);
}

export function distance(ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax;
  const dy = by - ay;
  return Math.sqrt(dx * dx + dy * dy);
}

export function midpoint(ax: number, ay: number, bx: number, by: number) {
  return { x: (ax + bx) / 2, y: (ay + by) / 2 };
}
