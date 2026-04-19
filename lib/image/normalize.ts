import { applyOrientation, orientationSwapsAxes, readExifOrientation } from "./exif";
import { isHeicFile } from "./heicDetect";

export type NormalizeError =
  | { code: "heic" }
  | { code: "too-large"; maxMB: number }
  | { code: "unsupported" }
  | { code: "load-failed" };

export type NormalizeOptions = {
  maxDimension?: number;
  maxSizeMB?: number;
};

export async function normalizeImage(
  file: File,
  opts: NormalizeOptions = {},
): Promise<HTMLImageElement> {
  const maxDimension = opts.maxDimension ?? 2048;
  const maxSizeMB = opts.maxSizeMB ?? 20;

  if (await isHeicFile(file)) {
    throw { code: "heic" } satisfies NormalizeError;
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    throw { code: "too-large", maxMB: maxSizeMB } satisfies NormalizeError;
  }
  if (!file.type.startsWith("image/")) {
    throw { code: "unsupported" } satisfies NormalizeError;
  }

  const orientation = file.type === "image/jpeg" ? await readExifOrientation(file) : 1;

  const dataUrl = await readAsDataURL(file);
  const raw = await loadImageEl(dataUrl);

  const swap = orientationSwapsAxes(orientation);
  const srcW = swap ? raw.naturalHeight : raw.naturalWidth;
  const srcH = swap ? raw.naturalWidth : raw.naturalHeight;

  const scale = Math.min(1, maxDimension / Math.max(srcW, srcH));
  const outW = Math.round(srcW * scale);
  const outH = Math.round(srcH * scale);

  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw { code: "load-failed" } satisfies NormalizeError;
  ctx.imageSmoothingQuality = "high";

  ctx.save();
  if (orientation > 1) {
    applyOrientation(ctx, orientation, outW, outH);
  }
  if (swap) {
    ctx.drawImage(raw, 0, 0, outH, outW);
  } else {
    ctx.drawImage(raw, 0, 0, outW, outH);
  }
  ctx.restore();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );
  if (!blob) throw { code: "load-failed" } satisfies NormalizeError;

  const url = URL.createObjectURL(blob);
  return loadImageEl(url);
}

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function loadImageEl(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject({ code: "load-failed" } satisfies NormalizeError);
    img.src = src;
  });
}

export function isNormalizeError(e: unknown): e is NormalizeError {
  return !!e && typeof e === "object" && "code" in (e as Record<string, unknown>);
}
