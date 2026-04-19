"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/hooks/useLanguage";
import desktopContent from "@/public/wallpapers/desktop/content.json";
import mobileContent from "@/public/wallpapers/mobile/content.json";
import { labelForTag } from "@/lib/wallpaperTagLabels";
import { WallpaperModalV2 } from "./WallpaperModalV2";

type Variant = "mobile" | "desktop";

type WallpaperItem = {
  name: string;
  tags: string[];
  url: string;
  thumb: string;
  variant: Variant;
};

const DESKTOP_ITEMS: WallpaperItem[] = desktopContent.wallpapers
  .filter((w) => !w.tags.includes("arabic"))
  .map((w) => ({
    ...w,
    variant: "desktop" as const,
  }));
const MOBILE_ITEMS: WallpaperItem[] = mobileContent.wallpapers
  .filter((w) => !w.tags.includes("arabic"))
  .map((w) => ({
    ...w,
    variant: "mobile" as const,
  }));

export function WallpaperGalleryV2() {
  const { t, lang } = useLanguage();
  const [tab, setTab] = useState<Variant>("mobile");
  const [active, setActive] = useState<WallpaperItem | null>(null);

  const items = tab === "mobile" ? MOBILE_ITEMS : DESKTOP_ITEMS;
  const tabs: { id: Variant; label: string }[] = [
    { id: "mobile", label: t.wallpapers.tabs.phone },
    { id: "desktop", label: t.wallpapers.tabs.desktop },
  ];

  return (
    <section className="bg-white px-4 py-12 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-4xl font-bold text-black sm:text-6xl">
            {t.wallpapers.heading}
          </h1>
          <p className="mt-3 text-neutral-700">{t.wallpapers.sub}</p>
        </div>

        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {tabs.map(({ id, label }) => {
            const isActive = tab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                aria-pressed={isActive}
                className={`min-h-[40px] border px-4 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EF3340] focus-visible:ring-offset-2 ${
                  isActive
                    ? "border-[#EF3340] bg-[#EF3340] text-white"
                    : "border-black bg-white text-black hover:bg-black hover:text-white"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div
          className={`grid gap-3 md:gap-4 ${
            tab === "mobile"
              ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {items.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setActive(item)}
              className="group overflow-hidden border border-black bg-white transition hover:border-[#EF3340] hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EF3340] focus-visible:ring-offset-2"
            >
              <div
                className={`w-full bg-neutral-100 ${
                  tab === "mobile" ? "aspect-[9/16]" : "aspect-video"
                }`}
              >
                <img
                  src={item.thumb}
                  alt={item.name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="border-t border-black bg-white px-2 py-2">
                <div className="mt-0.5 flex flex-wrap justify-center gap-1">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="border border-black bg-white px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-neutral-600"
                    >
                      {labelForTag(lang, tag)}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <WallpaperModalV2 item={active} onClose={() => setActive(null)} />
    </section>
  );
}
