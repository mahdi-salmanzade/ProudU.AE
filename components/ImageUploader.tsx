"use client";

import { useCallback, useRef, useState } from "react";
import { useLanguage } from "@/lib/hooks/useLanguage";
import {
  isNormalizeError,
  normalizeImage,
  type NormalizeError,
} from "@/lib/image/normalize";

type Props = {
  onImage: (img: HTMLImageElement) => void;
  label?: string;
  hint?: string;
  accept?: string;
  maxSizeMB?: number;
  compact?: boolean;
};

export function ImageUploader({
  onImage,
  label,
  hint,
  accept = "image/jpeg,image/png,image/webp",
  maxSizeMB = 20,
  compact = false,
}: Props) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const messageFor = useCallback(
    (e: NormalizeError) => {
      switch (e.code) {
        case "heic":
          return t.flagMyPhoto.errors.heic;
        case "too-large":
          return t.flagMyPhoto.errors.tooLarge;
        case "unsupported":
          return t.flagMyPhoto.errors.unsupported;
        case "load-failed":
          return t.flagMyPhoto.errors.loadFailed;
      }
    },
    [t],
  );

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setBusy(true);
      try {
        const img = await normalizeImage(file, { maxSizeMB });
        onImage(img);
      } catch (e) {
        if (isNormalizeError(e)) {
          setError(messageFor(e));
        } else {
          setError(t.flagMyPhoto.errors.loadFailed);
        }
      } finally {
        setBusy(false);
      }
    },
    [maxSizeMB, messageFor, onImage, t],
  );

  return (
    <div>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center border-2 border-dashed px-6 text-center transition focus-within:ring-2 focus-within:ring-[#EF3340] focus-within:ring-offset-2 ${
          compact ? "py-6" : "py-12"
        } ${
          dragOver
            ? "border-[#EF3340] bg-[#EF3340]/5"
            : "border-black bg-white hover:bg-neutral-50"
        } ${busy ? "opacity-60" : ""}`}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-black"
          aria-hidden
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p className="mt-3 text-sm font-semibold text-black">
          {label ?? t.flagMyPhoto.upload}
        </p>
        <p className="mt-1 text-xs text-neutral-600">
          {hint ?? t.flagMyPhoto.dragDrop}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          disabled={busy}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </label>
      {error && (
        <p
          role="alert"
          className="mt-2 text-xs leading-relaxed text-[#EF3340]"
        >
          {error}
        </p>
      )}
    </div>
  );
}
