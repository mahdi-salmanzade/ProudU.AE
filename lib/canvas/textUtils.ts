import { wrapText } from "./utils";

export type FontSpec = {
  family: string;
  weight: number;
  lineHeight?: number;
};

export function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxHeight: number,
  font: FontSpec,
  minSize: number,
  maxSize: number,
): { fontSize: number; lines: string[]; lineHeight: number } {
  const lh = font.lineHeight ?? 1.18;
  let lo = minSize;
  let hi = maxSize;
  let best = {
    fontSize: minSize,
    lines: [text],
    lineHeight: minSize * lh,
  };

  for (let i = 0; i < 14; i++) {
    if (hi - lo < 0.5) break;
    const mid = (lo + hi) / 2;
    ctx.font = `${font.weight} ${mid}px ${font.family}`;
    const lines = wrapText(ctx, text, maxWidth);
    const totalH = lines.length * mid * lh;
    if (totalH <= maxHeight && lines.every((l) => ctx.measureText(l).width <= maxWidth)) {
      best = { fontSize: mid, lines, lineHeight: mid * lh };
      lo = mid;
    } else {
      hi = mid;
    }
  }

  ctx.font = `${font.weight} ${best.fontSize}px ${font.family}`;
  return best;
}

export function drawFittedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  box: { x: number; y: number; w: number; h: number },
  font: FontSpec,
  minSize: number,
  maxSize: number,
  color: string,
  align: "center" | "start" | "end" = "center",
) {
  if (!text.trim()) return;
  const fit = fitText(ctx, text, box.w, box.h, font, minSize, maxSize);
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  const totalH = fit.lines.length * fit.lineHeight;
  const startY = box.y + (box.h - totalH) / 2 + fit.lineHeight / 2;
  const x =
    align === "center"
      ? box.x + box.w / 2
      : align === "start"
        ? box.x
        : box.x + box.w;
  fit.lines.forEach((line, i) => {
    ctx.fillText(line, x, startY + i * fit.lineHeight);
  });
}
