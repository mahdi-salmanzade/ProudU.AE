import { FORMATS, type CanvasFormat } from "./geometry";
import {
  FLAG_COLORS,
  UAE,
  drawContained,
  drawUAEFlag,
  hexAlpha,
  wrapText,
} from "./utils";

export type PostTemplate =
  | "mashreq"
  | "wave"
  | "story"
  | "cleanCard";

export const POST_TEMPLATES: PostTemplate[] = [
  "mashreq",
  "wave",
  "cleanCard",
  "story",
];

export type PostAudience = "personal" | "business" | "both";
export type PostTag = "minimal" | "bold" | "personal" | "business";

export type PostMeta = {
  id: PostTemplate;
  audience: PostAudience;
  tags: PostTag[];
  defaultFormat: PostFormatId;
};

export type PostFormatId = "square" | "portrait" | "story" | "landscape";

export const POST_FORMATS: { id: PostFormatId; format: CanvasFormat }[] = [
  { id: "square", format: FORMATS.square },
  { id: "portrait", format: FORMATS.portrait },
  { id: "story", format: FORMATS.story },
  { id: "landscape", format: FORMATS.landscape },
];

export function postFormat(id: PostFormatId): CanvasFormat {
  return POST_FORMATS.find((f) => f.id === id)!.format;
}

export const POST_META: Record<PostTemplate, PostMeta> = {
  mashreq: {
    id: "mashreq",
    audience: "business",
    tags: ["business", "bold"],
    defaultFormat: "square",
  },
  wave: {
    id: "wave",
    audience: "business",
    tags: ["business", "bold"],
    defaultFormat: "square",
  },
  story: {
    id: "story",
    audience: "both",
    tags: ["bold"],
    defaultFormat: "story",
  },
  cleanCard: {
    id: "cleanCard",
    audience: "personal",
    tags: ["personal", "minimal"],
    defaultFormat: "square",
  },
};

export function getTemplateSize(template: PostTemplate) {
  if (template === "story") return { w: 1080, h: 1920 };
  return { w: 1080, h: 1080 };
}

export type PostOptions = {
  message: string;
  logo: HTMLImageElement | null;
  lang: "en" | "ar";
};

export function drawPost(
  ctx: CanvasRenderingContext2D,
  template: PostTemplate,
  options: PostOptions,
) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  ctx.clearRect(0, 0, w, h);

  switch (template) {
    case "mashreq":
      mashreq(ctx, w, h, options);
      break;
    case "wave":
      wave(ctx, w, h, options);
      break;
    case "story":
      story(ctx, w, h, options);
      break;
    case "cleanCard":
      cleanCard(ctx, w, h, options);
      break;
  }
}

function cleanCard(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  o: PostOptions,
) {
  ctx.fillStyle = "#0A0F1C";
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = `rgba(255,255,255,${0.04 + (i % 5) * 0.01})`;
    ctx.beginPath();
    ctx.arc((i * 137) % w, (i * 211) % h, ((i * 13) % 6) + 1, 0, Math.PI * 2);
    ctx.fill();
  }

  const cardW = Math.min(w * 0.82, h * 0.78);
  const cardH = Math.min(h * 0.6, cardW * 1.15);
  const cardX = (w - cardW) / 2;
  const cardY = (h - cardH) / 2;
  const radius = cardW * 0.04;

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.55)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = "#FFFFFF";
  roundRect(ctx, cardX, cardY, cardW, cardH, radius);
  ctx.fill();
  ctx.restore();

  const stripeH = Math.max(8, cardH * 0.035);
  const stripeW = cardW / 4;
  ctx.save();
  ctx.beginPath();
  roundRect(ctx, cardX, cardY, cardW, stripeH * 1.5, radius);
  ctx.clip();
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = FLAG_COLORS[i];
    ctx.fillRect(cardX + i * stripeW, cardY, stripeW, stripeH);
  }
  ctx.restore();

  if (o.logo) {
    drawContained(
      ctx,
      o.logo,
      w / 2,
      cardY + stripeH + cardH * 0.12,
      cardW * 0.35,
      cardH * 0.18,
    );
  }

  const message =
    o.message.trim() ||
    (o.lang === "ar" ? "فخورين بالإمارات" : "Proud of UAE");
  setFontFor(ctx, o.lang, 700, cardW * 0.075);
  ctx.fillStyle = "#0A0F1C";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const lines = wrapText(ctx, message, cardW * 0.78);
  const lineHeight = cardW * 0.075 * 1.2;
  const totalH = lines.length * lineHeight;
  const startY = cardY + cardH / 2 + (o.logo ? cardH * 0.08 : 0) - totalH / 2 + lineHeight / 2;
  lines.forEach((ln, i) => ctx.fillText(ln, w / 2, startY + i * lineHeight));

  drawWatermark(ctx, w / 2, cardY + cardH - cardH * 0.08, cardW * 0.028);
}

function drawWatermark(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  fontSize: number,
) {
  const base = "ProudU.";
  const a = "A";
  const e = "E";
  ctx.save();
  setFontFor(ctx, "en", 700, fontSize);
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  const baseW = ctx.measureText(base).width;
  const aW = ctx.measureText(a).width;
  const eW = ctx.measureText(e).width;
  const totalW = baseW + aW + eW;
  let x = cx - totalW / 2;
  ctx.fillStyle = "#9CA3AF";
  ctx.fillText(base, x, cy);
  x += baseW;
  ctx.fillStyle = UAE.red;
  ctx.fillText(a, x, cy);
  x += aW;
  ctx.fillStyle = UAE.green;
  ctx.fillText(e, x, cy);
  ctx.restore();
}

function setFontFor(
  ctx: CanvasRenderingContext2D,
  lang: "en" | "ar",
  weight: number,
  size: number,
) {
  if (lang === "ar") {
    ctx.font = `${weight} ${size}px Tajawal, "Noto Sans Arabic", system-ui, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
    ctx.direction = "rtl";
  } else {
    ctx.font = `${weight} ${size}px Inter, system-ui, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
    ctx.direction = "ltr";
  }
}

function drawMessage(
  ctx: CanvasRenderingContext2D,
  message: string,
  cx: number,
  y: number,
  maxWidth: number,
  fontSize: number,
  lang: "en" | "ar",
  color: string,
) {
  if (!message.trim()) return y;
  setFontFor(ctx, lang, 700, fontSize);
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const lines = wrapText(ctx, message, maxWidth);
  const lineHeight = fontSize * 1.18;
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], cx, y + i * lineHeight);
  }
  return y + lines.length * lineHeight;
}

function mashreq(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  o: PostOptions,
) {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "#0a1a3a");
  grad.addColorStop(0.6, "#1e3a6a");
  grad.addColorStop(1, "#3a6aa8");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 60; i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.4 + 0.1})`;
    ctx.beginPath();
    ctx.arc(Math.random() * w, Math.random() * h * 0.6, Math.random() * 1.5 + 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  const ribbonY = h * 0.62;
  const stripeH = h * 0.05;
  const amp = h * 0.05;
  ctx.save();
  ctx.globalAlpha = 0.95;
  for (let i = 0; i < 4; i++) {
    const y0 = ribbonY + i * stripeH;
    ctx.fillStyle = FLAG_COLORS[i];
    ctx.beginPath();
    ctx.moveTo(-50, y0);
    ctx.bezierCurveTo(w * 0.3, y0 - amp, w * 0.7, y0 + amp, w + 50, y0);
    ctx.lineTo(w + 50, y0 + stripeH);
    ctx.bezierCurveTo(
      w * 0.7,
      y0 + stripeH + amp,
      w * 0.3,
      y0 + stripeH - amp,
      -50,
      y0 + stripeH,
    );
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  setFontFor(ctx, "en", 800, w * 0.085);
  ctx.fillText("PROUD OF UAE", w / 2, h * 0.18);
  setFontFor(ctx, "ar", 700, w * 0.07);
  ctx.fillText("فخورين بالإمارات", w / 2, h * 0.28);

  if (o.message.trim()) {
    drawMessage(
      ctx,
      o.message,
      w / 2,
      h * 0.42,
      w * 0.78,
      w * 0.038,
      o.lang,
      "rgba(255,255,255,0.92)",
    );
  }

  if (o.logo) {
    drawContained(ctx, o.logo, w - w * 0.13, h * 0.1, w * 0.16, w * 0.16);
  }
}

function wave(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  o: PostOptions,
) {
  drawUAEFlag(ctx, 0, 0, w, h);
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fillRect(0, 0, w, h);

  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "rgba(0,0,0,0.6)");
  grad.addColorStop(0.5, "rgba(0,0,0,0.2)");
  grad.addColorStop(1, "rgba(0,0,0,0.7)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  drawMessage(
    ctx,
    o.message || (o.lang === "ar" ? "فخورين بالإمارات" : "Proud of UAE"),
    w / 2,
    h * 0.36,
    w * 0.82,
    w * 0.075,
    o.lang,
    "#FFFFFF",
  );

  if (o.logo) {
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.6)";
    ctx.shadowBlur = 16;
    drawContained(ctx, o.logo, w - w * 0.14, h - h * 0.12, w * 0.18, w * 0.1);
    ctx.restore();
  }
}

function story(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  o: PostOptions,
) {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "#0a0f1c");
  grad.addColorStop(1, "#101a30");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  if (o.logo) {
    drawContained(ctx, o.logo, w / 2, h * 0.14, w * 0.4, w * 0.2);
  }

  const fontSize = w * 0.1;
  const fallback = o.lang === "ar" ? "فخورين بالإمارات" : "PROUD OF UAE";
  const lines = o.message.trim() || fallback;

  setFontFor(ctx, o.lang, 800, fontSize);
  const textGrad = ctx.createLinearGradient(0, h * 0.4, w, h * 0.6);
  textGrad.addColorStop(0, UAE.red);
  textGrad.addColorStop(0.33, UAE.green);
  textGrad.addColorStop(0.66, "#ffffff");
  textGrad.addColorStop(1, "#ffffff");
  ctx.fillStyle = textGrad;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const wrapped = wrapText(ctx, lines, w * 0.85);
  const lineH = fontSize * 1.15;
  const startY = h * 0.5 - ((wrapped.length - 1) * lineH) / 2;
  wrapped.forEach((ln, i) => ctx.fillText(ln, w / 2, startY + i * lineH));

  const ribbonY = h * 0.78;
  const stripeH = h * 0.035;
  const amp = h * 0.04;
  ctx.save();
  ctx.globalAlpha = 0.95;
  for (let i = 0; i < 4; i++) {
    const y0 = ribbonY + i * stripeH;
    ctx.fillStyle = FLAG_COLORS[i];
    ctx.beginPath();
    ctx.moveTo(-50, y0);
    ctx.bezierCurveTo(w * 0.3, y0 - amp, w * 0.7, y0 + amp, w + 50, y0);
    ctx.lineTo(w + 50, y0 + stripeH);
    ctx.bezierCurveTo(
      w * 0.7,
      y0 + stripeH + amp,
      w * 0.3,
      y0 + stripeH - amp,
      -50,
      y0 + stripeH,
    );
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
