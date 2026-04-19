import { FLAG_COLORS, UAE, drawUAEFlag } from "./utils";

export type WallpaperId =
  | "waves"
  | "geometric"
  | "gradient"
  | "stars"
  | "minimal"
  | "bokeh"
  | "ribbons"
  | "proud"
  | "mountain"
  | "mosaic";

export type WallpaperLabel = "phone" | "desktop" | "minimal" | "bold";

export type WallpaperMeta = {
  id: WallpaperId;
  name: { en: string; ar: string };
  labels: WallpaperLabel[];
};

export const WALLPAPERS: WallpaperMeta[] = [
  {
    id: "waves",
    name: { en: "Flag Waves", ar: "موجات العلم" },
    labels: ["phone", "bold"],
  },
  {
    id: "geometric",
    name: { en: "Geometric Pride", ar: "هندسة الفخر" },
    labels: ["phone", "bold"],
  },
  {
    id: "gradient",
    name: { en: "Gradient Flow", ar: "تدرج لوني" },
    labels: ["phone", "desktop", "minimal"],
  },
  {
    id: "stars",
    name: { en: "Seven Stars", ar: "سبع نجوم" },
    labels: ["phone", "bold"],
  },
  {
    id: "minimal",
    name: { en: "Minimal Flag", ar: "علم بسيط" },
    labels: ["desktop", "minimal"],
  },
  {
    id: "bokeh",
    name: { en: "Bokeh Lights", ar: "أضواء" },
    labels: ["phone", "bold"],
  },
  {
    id: "ribbons",
    name: { en: "Ribbon Dance", ar: "رقص الشرائط" },
    labels: ["phone", "bold"],
  },
  {
    id: "proud",
    name: { en: "Proud Text", ar: "نص الفخر" },
    labels: ["desktop", "bold"],
  },
  {
    id: "mountain",
    name: { en: "Mountain Skyline", ar: "أفق الجبال" },
    labels: ["phone", "desktop", "minimal"],
  },
  {
    id: "mosaic",
    name: { en: "Mosaic", ar: "فسيفساء" },
    labels: ["phone", "bold"],
  },
];

export function drawWallpaper(
  ctx: CanvasRenderingContext2D,
  id: WallpaperId,
) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#0A0F1C";
  ctx.fillRect(0, 0, w, h);

  switch (id) {
    case "waves":
      waves(ctx, w, h);
      break;
    case "geometric":
      geometric(ctx, w, h);
      break;
    case "gradient":
      gradientFlow(ctx, w, h);
      break;
    case "stars":
      sevenStars(ctx, w, h);
      break;
    case "minimal":
      minimalFlag(ctx, w, h);
      break;
    case "bokeh":
      bokeh(ctx, w, h);
      break;
    case "ribbons":
      ribbonDance(ctx, w, h);
      break;
    case "proud":
      proudText(ctx, w, h);
      break;
    case "mountain":
      mountain(ctx, w, h);
      break;
    case "mosaic":
      mosaic(ctx, w, h);
      break;
  }
}

function waves(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const bandH = h / 4;
  const amp = h * 0.04;
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = FLAG_COLORS[i];
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    const baseY = i * bandH;
    ctx.moveTo(0, baseY);
    for (let x = 0; x <= w; x += 10) {
      const y = baseY + Math.sin((x / w) * Math.PI * 4 + i) * amp;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, baseY + bandH);
    ctx.lineTo(0, baseY + bandH);
    ctx.closePath();
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function geometric(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const size = Math.min(w, h) * 0.08;
  ctx.globalAlpha = 0.65;
  for (let y = -size; y < h + size; y += size * 1.5) {
    for (let x = -size; x < w + size; x += size * 1.7) {
      const offset = ((y / size) | 0) % 2 === 0 ? 0 : size * 0.85;
      const idx = (((x + y) / size) | 0) % 4;
      ctx.fillStyle = FLAG_COLORS[(idx + 4) % 4];
      ctx.beginPath();
      ctx.moveTo(x + offset, y);
      ctx.lineTo(x + offset + size, y);
      ctx.lineTo(x + offset + size / 2, y + size);
      ctx.closePath();
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}

function gradientFlow(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, UAE.red);
  grad.addColorStop(0.33, UAE.green);
  grad.addColorStop(0.66, "#222");
  grad.addColorStop(1, UAE.black);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  const overlay = ctx.createRadialGradient(
    w / 2,
    h / 2,
    0,
    w / 2,
    h / 2,
    Math.max(w, h) * 0.6,
  );
  overlay.addColorStop(0, "rgba(255,255,255,0.18)");
  overlay.addColorStop(1, "rgba(0,0,0,0.5)");
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, w, h);
}

function sevenStars(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const stripeH = h / 4;
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = FLAG_COLORS[i];
    ctx.globalAlpha = 0.35;
    ctx.fillRect(0, i * stripeH, w, stripeH);
  }
  ctx.globalAlpha = 1;
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) * 0.07;
  ctx.fillStyle = "#FFFFFF";
  drawStar(ctx, cx, cy, r, 5);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    drawStar(
      ctx,
      cx + Math.cos(a) * r * 3.5,
      cy + Math.sin(a) * r * 3.5,
      r * 0.7,
      5,
    );
  }
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  points: number,
) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? r : r * 0.42;
    const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}

function minimalFlag(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const fw = Math.min(w * 0.6, h * 0.5);
  const fh = fw / 2;
  drawUAEFlag(ctx, (w - fw) / 2, (h - fh) / 2, fw, fh);
}

function bokeh(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const colors = [...FLAG_COLORS];
  for (let i = 0; i < 80; i++) {
    const x = (i * 977) % w;
    const y = (i * 613) % h;
    const r = ((i * 31) % 80) + 20;
    const c = colors[i % 4];
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, c + "cc");
    grad.addColorStop(1, c + "00");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function ribbonDance(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.lineWidth = h * 0.04;
  ctx.lineCap = "round";
  for (let i = 0; i < 6; i++) {
    ctx.strokeStyle = FLAG_COLORS[i % 4];
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    const offset = i * h * 0.07;
    ctx.moveTo(-50, h * 0.2 + offset);
    ctx.bezierCurveTo(
      w * 0.3,
      h * 0.4 + offset,
      w * 0.7,
      h * 0.1 + offset,
      w + 50,
      h * 0.5 + offset,
    );
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function proudText(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grad = ctx.createLinearGradient(0, 0, w, 0);
  grad.addColorStop(0, UAE.red);
  grad.addColorStop(0.33, UAE.green);
  grad.addColorStop(0.66, "#FFFFFF");
  grad.addColorStop(1, "#777");
  ctx.fillStyle = grad;
  const fontSize = Math.min(w, h) * 0.28;
  ctx.font = `900 ${fontSize}px Inter, system-ui, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("PROUD", w / 2, h / 2 - fontSize * 0.1);
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = `500 ${fontSize * 0.18}px Inter, system-ui, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
  ctx.fillText("OF UAE 🇦🇪", w / 2, h / 2 + fontSize * 0.55);
}

function mountain(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, UAE.red);
  sky.addColorStop(0.4, "#7a1b22");
  sky.addColorStop(0.7, "#0a0f1c");
  sky.addColorStop(1, "#000");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.arc(w * 0.75, h * 0.22, Math.min(w, h) * 0.05, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(0, h * 0.7);
  ctx.lineTo(w * 0.18, h * 0.55);
  ctx.lineTo(w * 0.32, h * 0.68);
  ctx.lineTo(w * 0.5, h * 0.5);
  ctx.lineTo(w * 0.66, h * 0.62);
  ctx.lineTo(w * 0.82, h * 0.48);
  ctx.lineTo(w, h * 0.6);
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();
}

function mosaic(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const tile = Math.min(w, h) * 0.04;
  for (let y = 0; y < h; y += tile) {
    for (let x = 0; x < w; x += tile) {
      const idx = ((x * 7 + y * 13) | 0) % 8;
      ctx.fillStyle =
        idx < 4 ? FLAG_COLORS[idx] : "rgba(255,255,255,0.04)";
      ctx.globalAlpha = idx < 4 ? 0.9 : 1;
      ctx.fillRect(x, y, tile - 2, tile - 2);
    }
  }
  ctx.globalAlpha = 1;
}
