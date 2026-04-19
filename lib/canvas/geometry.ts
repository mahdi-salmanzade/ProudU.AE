export type FormatType =
  | "square"
  | "portrait"
  | "story"
  | "landscape"
  | "lockscreen"
  | "dp";

export type CanvasFormat = {
  id: string;
  type: FormatType;
  w: number;
  h: number;
};

export const FORMATS = {
  square: { id: "square", type: "square", w: 1080, h: 1080 } as CanvasFormat,
  portrait: { id: "portrait", type: "portrait", w: 1080, h: 1350 } as CanvasFormat,
  story: { id: "story", type: "story", w: 1080, h: 1920 } as CanvasFormat,
  landscape: {
    id: "landscape",
    type: "landscape",
    w: 1920,
    h: 1080,
  } as CanvasFormat,
  lockscreen: {
    id: "lockscreen",
    type: "lockscreen",
    w: 1080,
    h: 2340,
  } as CanvasFormat,
  dp: { id: "dp", type: "dp", w: 500, h: 500 } as CanvasFormat,
} as const;

export type Rect = { x: number; y: number; w: number; h: number };

export function rect(x: number, y: number, w: number, h: number): Rect {
  return { x, y, w, h };
}

export function relRect(
  format: CanvasFormat,
  rx: number,
  ry: number,
  rw: number,
  rh: number,
): Rect {
  return {
    x: rx * format.w,
    y: ry * format.h,
    w: rw * format.w,
    h: rh * format.h,
  };
}

export type SafeZones = {
  logo?: Rect;
  text?: Rect;
  flag?: Rect;
};

export function scaleRect(r: Rect, sx: number, sy: number): Rect {
  return { x: r.x * sx, y: r.y * sy, w: r.w * sx, h: r.h * sy };
}

export function transformZonesForFormat(
  base: CanvasFormat,
  zones: SafeZones,
  target: CanvasFormat,
): SafeZones {
  const sx = target.w / base.w;
  const sy = target.h / base.h;
  const out: SafeZones = {};
  if (zones.logo) out.logo = scaleRect(zones.logo, sx, sy);
  if (zones.text) out.text = scaleRect(zones.text, sx, sy);
  if (zones.flag) out.flag = scaleRect(zones.flag, sx, sy);
  return out;
}
