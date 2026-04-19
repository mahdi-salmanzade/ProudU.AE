export const UAE = {
  red: "#EF3340",
  green: "#00843D",
  white: "#FFFFFF",
  black: "#000000",
} as const;

export const FLAG_COLORS = [UAE.red, UAE.green, UAE.white, UAE.black];

export function drawCenterCropped(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
) {
  const iw = (img as HTMLImageElement).naturalWidth || (img as HTMLImageElement).width;
  const ih = (img as HTMLImageElement).naturalHeight || (img as HTMLImageElement).height;
  if (!iw || !ih) return;
  const targetAspect = dw / dh;
  const srcAspect = iw / ih;
  let sx: number, sy: number, sw: number, sh: number;
  if (srcAspect > targetAspect) {
    sh = ih;
    sw = ih * targetAspect;
    sx = (iw - sw) / 2;
    sy = 0;
  } else {
    sw = iw;
    sh = iw / targetAspect;
    sx = 0;
    sy = (ih - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
}

export function drawContained(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  cx: number,
  cy: number,
  maxW: number,
  maxH: number,
) {
  const iw = (img as HTMLImageElement).naturalWidth || (img as HTMLImageElement).width;
  const ih = (img as HTMLImageElement).naturalHeight || (img as HTMLImageElement).height;
  if (!iw || !ih) return;
  const scale = Math.min(maxW / iw, maxH / ih);
  const w = iw * scale;
  const h = ih * scale;
  ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h);
}

export function drawUAEFlag(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const stripeW = w / 4;
  ctx.fillStyle = UAE.red;
  ctx.fillRect(x, y, stripeW, h);
  ctx.fillStyle = UAE.green;
  ctx.fillRect(x + stripeW, y, w - stripeW, h / 3);
  ctx.fillStyle = UAE.white;
  ctx.fillRect(x + stripeW, y + h / 3, w - stripeW, h / 3);
  ctx.fillStyle = UAE.black;
  ctx.fillRect(x + stripeW, y + (2 * h) / 3, w - stripeW, h / 3);
}

export function hexAlpha(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
