"use client";

import { useLanguage } from "@/lib/hooks/useLanguage";
import { ShareButtons } from "@/components/ShareButtons";

type Props = {
  onDownload: () => void;
  onReupload?: () => void;
};

export function ExportBar({ onDownload, onReupload }: Props) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onDownload}
          className="flex-1 min-h-[48px] bg-[#EF3340] px-5 py-3 text-sm font-bold text-white transition hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        >
          {t.flagMyPhoto.download}
        </button>
        {onReupload && (
          <>
            <button
              type="button"
              onClick={onReupload}
              className="hidden min-h-[48px] border border-black bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-black hover:text-white sm:inline-flex sm:items-center"
            >
              {t.common.reupload}
            </button>
            <button
              type="button"
              onClick={onReupload}
              aria-label={t.common.reupload}
              className="grid h-12 w-12 place-items-center border border-black bg-white text-black sm:hidden"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
            </button>
          </>
        )}
      </div>
      <ShareButtons />
    </div>
  );
}
