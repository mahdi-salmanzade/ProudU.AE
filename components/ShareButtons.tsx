"use client";

import { useLanguage } from "@/lib/hooks/useLanguage";

const SITE_URL = "https://proudu.ae";

export function ShareButtons() {
  const { t } = useLanguage();

  const openWA = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(t.share.message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const openTelegram = () => {
    const text = t.share.message.replace(/\s*proudu\.ae\s*/i, " ").trim();
    const url = `https://t.me/share/url?url=${encodeURIComponent(
      SITE_URL,
    )}&text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const openLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      SITE_URL,
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const openSMS = () => {
    const url = `sms:?&body=${encodeURIComponent(t.share.message)}`;
    window.location.href = url;
  };

  const openX = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      t.share.message,
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const baseBtn =
    "flex-1 min-w-0 border-2 bg-white px-2 py-2.5 text-[9px] sm:text-[10.5px] font-semibold text-center transition";

  return (
    <div className="flex w-full gap-2">
      <button
        onClick={openSMS}
        className={`${baseBtn} border-black text-black hover:bg-black hover:text-white`}
      >
        {t.share.sms}
      </button>
      <button
        onClick={openWA}
        className={`${baseBtn} border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white`}
      >
        {t.share.whatsapp}
      </button>
      <button
        onClick={openTelegram}
        className={`${baseBtn} border-[#229ED9] text-[#229ED9] hover:bg-[#229ED9] hover:text-white`}
      >
        {t.share.telegram}
      </button>
      <button
        onClick={openLinkedIn}
        className={`${baseBtn} border-[#0A66C2] text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white`}
      >
        {t.share.linkedin}
      </button>
      <button
        onClick={openX}
        className={`${baseBtn} border-black text-black hover:bg-black hover:text-white`}
      >
        {t.share.twitter}
      </button>
    </div>
  );
}

export async function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string,
) {
  return new Promise<void>((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return resolve();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      resolve();
    }, "image/png");
  });
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}
