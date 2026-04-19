"use client";

import { useLanguage } from "@/lib/hooks/useLanguage";
import { POST_FORMATS, type PostFormatId } from "@/lib/canvas/postTemplates";

type Props = {
  value: PostFormatId;
  onChange: (id: PostFormatId) => void;
};

export function FormatSelector({ value, onChange }: Props) {
  const { t } = useLanguage();
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-600">
        {t.proudPost.chooseFormat}
      </h3>
      <div className="flex flex-wrap gap-2">
        {POST_FORMATS.map(({ id, format }) => {
          const active = value === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-pressed={active}
              className={`min-h-[44px] border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EF3340] focus-visible:ring-offset-2 ${
                active
                  ? "border-[#EF3340] bg-[#EF3340] text-white"
                  : "border-black bg-white text-black hover:bg-black hover:text-white"
              }`}
            >
              <span>{t.proudPost.formats[id]}</span>
              <span className={`ms-2 text-[10px] ${active ? "text-white/70" : "text-neutral-500"}`}>
                {format.w}×{format.h}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
