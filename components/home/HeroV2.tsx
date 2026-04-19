"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/hooks/useLanguage";
import mbrQuotes from "@/public/mbr_quotes_verified.json";

type Quote = {
  id: number;
  en: string;
  ar: string;
  category_en: string;
  category_ar: string;
  source_id: number;
};

const QUOTES = mbrQuotes.quotes as Quote[];
const SOURCE = mbrQuotes.metadata?.source ?? null;

export function HeroV2() {
  const { t, lang } = useLanguage();
  const [imgError, setImgError] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [quote, setQuote] = useState<Quote>(() => QUOTES[0]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  return (
    <section className="relative flex min-h-[100svh] items-center bg-white px-5 pt-6 pb-16 sm:px-12 sm:pt-12 sm:pb-28 lg:px-20">
      <div className="mx-auto w-full max-w-6xl md:-translate-y-16">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16 lg:gap-20">
          <div className="mx-auto w-full max-w-xl md:max-w-none">
            <div className="relative aspect-square w-full overflow-hidden bg-white">
              {!imgError ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src="/sheikhmohammed.webp"
                  alt={t.sheikh.name}
                  className="absolute inset-0 h-full w-full object-cover rtl:-scale-x-100"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-white px-4 text-center">
                  <p className="font-serif text-xs italic text-neutral-500">
                    /public/sheikhmohammed.webp
                  </p>
                </div>
              )}
            </div>
            <div className="mt-5 space-y-3 text-center md:text-start">
              <p className="text-xs leading-relaxed text-black">
                <span className="block font-semibold">{t.sheikh.name}</span>
                <span className="block">{t.sheikh.titleLine1}</span>
                <span className="block">{t.sheikh.titleLine2}</span>
              </p>
              <p className="font-serif text-sm italic leading-snug text-black">
                &ldquo;{quote[lang]}&rdquo;
              </p>
              <p className="text-[11px] leading-relaxed text-neutral-600">
                <a
                  href={`https://sheikhmohammed.ae/${lang}/quotes/${quote.source_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-2 hover:underline"
                >
                  {SOURCE ?? "sheikhmohammed.ae"}
                </a>
                <span className="mx-1.5 text-neutral-400">·</span>
                <span>{lang === "ar" ? quote.category_ar : quote.category_en}</span>
              </p>
            </div>
          </div>

          <div className="text-center md:text-start">
            <h1 className="font-serif text-5xl font-bold leading-tight tracking-tight text-black sm:text-6xl md:text-7xl">
              {t.hero.title}
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-neutral-700 sm:text-lg md:mx-0">
              {t.hero.subtitle}
            </p>
            <div className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:gap-4 md:mx-0">
              <Link
                href="/flag-my-photo"
                className="inline-flex min-h-[52px] w-full items-center justify-center bg-[#EF3340] px-7 py-3 text-sm font-semibold text-white transition hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 sm:w-[220px] sm:min-w-[220px]"
              >
                {t.hero.ctaPhoto}
              </Link>
              <Link
                href="/post-maker"
                className="inline-flex min-h-[52px] w-full items-center justify-center bg-black px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#EF3340] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 sm:w-[220px] sm:min-w-[220px]"
              >
                {t.hero.ctaBusiness}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className={`pointer-events-none absolute bottom-[84px] left-1/2 hidden -translate-x-1/2 text-black/40 transition-opacity duration-300 md:block ${
          scrolled ? "opacity-0" : "opacity-100"
        }`}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  );
}
