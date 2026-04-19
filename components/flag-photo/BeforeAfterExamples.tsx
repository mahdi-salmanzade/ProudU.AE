"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/hooks/useLanguage";

const EXAMPLES = ["/1.webp", "/2.webp", "/3.webp"];

export function BeforeAfterExamples() {
  const { t } = useLanguage();

  return (
    <div>
      <p className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-neutral-600">
        {t.flagMyPhoto.beforeAfter}
      </p>
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {EXAMPLES.map((src) => (
          <div
            key={src}
            className="relative aspect-square overflow-hidden border border-black bg-white"
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(max-width: 640px) 33vw, 220px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
