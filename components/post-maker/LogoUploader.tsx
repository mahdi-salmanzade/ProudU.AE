"use client";

import { useLanguage } from "@/lib/hooks/useLanguage";
import { ImageUploader } from "@/components/ImageUploader";

type Props = {
  logo: HTMLImageElement | null;
  onLogo: (l: HTMLImageElement | null) => void;
};

export function LogoUploader({ logo, onLogo }: Props) {
  const { t } = useLanguage();
  return (
    <div className="border-s-2 border-[#EF3340] ps-3">
      <label className="mb-2 block text-sm font-bold uppercase tracking-wider text-black">
        {t.proudPost.uploadLogo}
      </label>
      {logo ? (
        <div className="flex items-center gap-3 border border-black bg-white p-3">
          <div className="grid h-14 w-14 place-items-center overflow-hidden bg-neutral-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.src}
              alt="logo preview"
              className="max-h-full max-w-full"
            />
          </div>
          <button
            type="button"
            onClick={() => onLogo(null)}
            className="ms-auto min-h-[44px] border border-black bg-white px-4 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
          >
            {t.common.remove}
          </button>
        </div>
      ) : (
        <ImageUploader
          onImage={onLogo}
          compact
          label={t.proudPost.uploadLogo}
          accept="image/jpeg,image/png,image/webp,image/svg+xml"
        />
      )}
    </div>
  );
}
