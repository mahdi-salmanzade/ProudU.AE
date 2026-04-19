"use client";

import { useLanguage } from "@/lib/hooks/useLanguage";
import { ShareButtons } from "@/components/ShareButtons";

type Props = {
  onDownload: () => void;
};

export function ExportBar({ onDownload }: Props) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={onDownload}
        className="min-h-[48px] bg-[#EF3340] px-5 py-3 text-sm font-bold text-white transition hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
      >
        {t.proudPost.download}
      </button>
      <ShareButtons />
    </div>
  );
}
