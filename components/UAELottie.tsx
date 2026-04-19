"use client";

import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

type Props = {
  className?: string;
};

let cachedUrl: Promise<string> | null = null;

function loadLottieUrl(): Promise<string> {
  if (!cachedUrl) {
    cachedUrl = fetch("/uae.lottie", { cache: "force-cache" })
      .then((r) => r.blob())
      .then((blob) => URL.createObjectURL(blob))
      .catch((err) => {
        cachedUrl = null;
        throw err;
      });
  }
  return cachedUrl;
}

if (typeof window !== "undefined") {
  ReactDOM.preload("/uae.lottie", { as: "fetch" });
  loadLottieUrl().catch(() => {});
}

export function UAELottie({ className }: Props) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    loadLottieUrl()
      .then((url) => {
        if (alive) setSrc(url);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className={`overflow-hidden ${className ?? ""}`} aria-hidden>
      {src && (
        <DotLottieReact
          src={src}
          autoplay
          loop
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
}
