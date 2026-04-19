"use client";

import { useEffect } from "react";
import { useLanguage } from "@/lib/hooks/useLanguage";
import { labelForTag } from "@/lib/wallpaperTagLabels";

type Variant = "mobile" | "desktop";

type WallpaperItem = {
  name: string;
  tags: string[];
  url: string;
  thumb: string;
  variant: Variant;
};

type Props = {
  item: WallpaperItem | null;
  onClose: () => void;
};

export function WallpaperModalV2({ item, onClose }: Props) {
  const { t, lang } = useLanguage();

  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [item, onClose]);

  if (!item) return null;

  const fullSrc = item.url;
  const isMobile = item.variant === "mobile";

  async function download() {
    if (!item) return;
    try {
      const res = await fetch(fullSrc);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${item.name}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(fullSrc, "_blank");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-3xl border border-black bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label={t.wallpapers.close}
          className="absolute top-4 end-4 grid h-10 w-10 place-items-center border border-black bg-white text-black transition hover:bg-black hover:text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <h3 className="mb-1 font-serif text-2xl font-bold text-black">
          {isMobile ? t.wallpapers.tabs.phone : t.wallpapers.tabs.desktop}
        </h3>
        <div className="mb-4 flex flex-wrap gap-1">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="border border-black bg-white px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-neutral-600"
            >
              {labelForTag(lang, tag)}
            </span>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4">
          <div
            className={`w-full overflow-hidden border border-black bg-neutral-100 ${
              isMobile ? "max-w-[280px] aspect-[9/16]" : "aspect-video"
            }`}
          >
            <img
              src={fullSrc}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={download}
            className="min-h-[48px] w-full max-w-[320px] bg-[#EF3340] px-4 py-2 text-sm font-semibold text-white transition hover:bg-black"
          >
            {t.wallpapers.download}
          </button>
        </div>
      </div>
    </div>
  );
}
