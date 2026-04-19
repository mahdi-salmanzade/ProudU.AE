"use client";

import { useEffect, useMemo, useRef } from "react";
import { useLanguage } from "@/lib/hooks/useLanguage";
import {
  drawPost,
  POST_META,
  POST_TEMPLATES,
  postFormat,
  type PostFormatId,
  type PostTemplate,
} from "@/lib/canvas/postTemplates";
import type { Audience } from "./AudienceSelector";

type Props = {
  audience: Audience;
  formatId: PostFormatId;
  message: string;
  logo: HTMLImageElement | null;
  value: PostTemplate;
  onChange: (t: PostTemplate) => void;
};

export function TemplateSelector({
  audience,
  formatId,
  message,
  logo,
  value,
  onChange,
}: Props) {
  const { t, lang } = useLanguage();
  const refs = useRef<Record<string, HTMLCanvasElement | null>>({});

  const visible = useMemo(() => {
    return POST_TEMPLATES.filter((id) => {
      const meta = POST_META[id];
      if (audience === "personal" && meta.audience === "business") return false;
      if (audience === "business" && meta.audience === "personal") return false;
      return true;
    });
  }, [audience]);

  useEffect(() => {
    visible.forEach((tpl) => {
      const c = refs.current[tpl];
      if (!c) return;
      const meta = POST_META[tpl];
      const targetFormat =
        meta.id === "story" ? postFormat("story") : postFormat(formatId);
      const longest = Math.max(targetFormat.w, targetFormat.h);
      const scale = 220 / longest;
      c.width = Math.round(targetFormat.w * scale);
      c.height = Math.round(targetFormat.h * scale);
      const ctx = c.getContext("2d");
      if (!ctx) return;
      drawPost(ctx, tpl, {
        message:
          message.trim() || (lang === "ar" ? "رسالتك هنا" : "Your message"),
        logo,
        lang,
      });
    });
  }, [visible, formatId, message, logo, lang]);

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-600">
        {t.proudPost.chooseTemplate}
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {visible.map((tpl) => {
          const active = value === tpl;
          return (
            <button
              key={tpl}
              type="button"
              onClick={() => onChange(tpl)}
              aria-pressed={active}
              className={`flex h-full flex-col overflow-hidden rounded-sm border-2 bg-neutral-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EF3340] focus-visible:ring-offset-2 ${
                active
                  ? "border-[#EF3340] shadow-sm"
                  : "border-neutral-200 hover:border-[#EF3340]"
              }`}
            >
              <div className="flex flex-1 items-center justify-center bg-neutral-50 p-2">
                <canvas
                  ref={(el) => {
                    refs.current[tpl] = el;
                  }}
                  className="block h-full w-full"
                />
              </div>
              <span className="mt-auto block border-t border-neutral-200 bg-white px-1 py-1.5 text-[10px] font-semibold text-neutral-700">
                {t.proudPost.templates[tpl]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
