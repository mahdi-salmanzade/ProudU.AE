"use client";

import { useLanguage } from "@/lib/hooks/useLanguage";
import { PRESET_MESSAGES } from "@/lib/content/presets";

type Props = {
  value: string;
  onChange: (s: string) => void;
};

export function MessageInput({ value, onChange }: Props) {
  const { t, lang } = useLanguage();
  const presets = PRESET_MESSAGES[lang];
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-neutral-600">
        {t.proudPost.yourMessage}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t.proudPost.messagePlaceholder}
        rows={3}
        dir="auto"
        className="w-full resize-none border border-black bg-white px-4 py-3 text-sm text-black placeholder:text-neutral-400 focus:border-[#EF3340] focus:outline-none focus:ring-2 focus:ring-[#EF3340] focus:ring-offset-2"
      />
      <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
        {t.proudPost.presetsHeader}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {presets.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className="border border-black bg-white px-3 py-1.5 text-xs text-black transition hover:bg-black hover:text-white"
            dir="auto"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
