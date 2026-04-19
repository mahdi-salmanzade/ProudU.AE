"use client";

import { useLanguage } from "@/lib/hooks/useLanguage";

export type Audience = "personal" | "business";

type Props = {
  value: Audience;
  onChange: (a: Audience) => void;
};

export function AudienceSelector({ value, onChange }: Props) {
  const { t } = useLanguage();
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-600">
        {t.proudPost.audience}
      </h3>
      <div className="grid grid-cols-2 gap-0 border border-black bg-white">
        {(["personal", "business"] as const).map((a) => {
          const active = value === a;
          return (
            <button
              key={a}
              type="button"
              onClick={() => onChange(a)}
              aria-pressed={active}
              className={`min-h-[44px] px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EF3340] focus-visible:ring-offset-2 ${
                active
                  ? "bg-[#EF3340] text-white"
                  : "bg-white text-black hover:bg-black hover:text-white"
              }`}
            >
              {t.proudPost.audiences[a]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
