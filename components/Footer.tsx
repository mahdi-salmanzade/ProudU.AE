"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/hooks/useLanguage";

type Props = {
  variant?: "dark" | "light";
};

export function Footer({ variant = "dark" }: Props) {
  const { t } = useLanguage();
  const isLight = variant === "light";

  if (isLight) {
    return (
      <footer className="bg-white px-4 py-12 text-center text-sm text-black">
        <div className="mx-auto max-w-3xl space-y-3">
          <p className="font-serif text-lg">{t.footer.madeWith}</p>
          <p>
            <a
              href="https://proudu.ae"
              className="font-mono text-black hover:underline"
            >
              proudu.ae
            </a>
            <span className="mx-2 text-neutral-500">·</span>
            v1.0
            <span className="mx-2 text-neutral-500">·</span>
            April 2026
          </p>
          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs">
            <Link href="/about" className="hover:underline">
              {t.footer.about}
            </Link>
            <span aria-hidden className="text-neutral-500">
              ·
            </span>
            <Link href="/privacy" className="hover:underline">
              {t.footer.privacy}
            </Link>
            <span aria-hidden className="text-neutral-500">
              ·
            </span>
            <Link href="/terms" className="hover:underline">
              {t.footer.terms}
            </Link>
            <span aria-hidden className="text-neutral-500">
              ·
            </span>
            <Link href="/flag-guidelines" className="hover:underline">
              {t.footer.flagGuidelines}
            </Link>
          </nav>
          <div className="flex justify-center gap-4 pt-1">
            <a
              href="https://github.com/mahdi-salmanzade/MCP-Dubai"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-neutral-600 transition-colors hover:text-black"
            >
              <GithubIcon />
            </a>
            <a
              href="https://www.linkedin.com/in/mahdisalmanzade/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-neutral-600 transition-colors hover:text-black"
            >
              <LinkedinIcon />
            </a>
          </div>
          <p className="whitespace-pre-line text-xs text-neutral-700">
            {t.footer.disclaimer}
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-white/10 px-4 py-10 text-center text-sm text-white/70">
      <div className="mx-auto max-w-3xl space-y-3">
        <p className="text-base font-semibold text-white">{t.footer.madeWith}</p>
        <p>
          <a
            href="https://proudu.ae"
            className="font-mono text-white/85 hover:text-white"
          >
            proudu.ae
          </a>
          <span className="mx-2 text-white/40">·</span>
          v1.0
          <span className="mx-2 text-white/40">·</span>
          April 2026
        </p>
        <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-white/70">
          <Link href="/about" className="hover:text-white">
            {t.footer.about}
          </Link>
          <span aria-hidden className="text-white/40">
            ·
          </span>
          <Link href="/privacy" className="hover:text-white">
            {t.footer.privacy}
          </Link>
          <span aria-hidden className="text-white/40">
            ·
          </span>
          <Link href="/terms" className="hover:text-white">
            {t.footer.terms}
          </Link>
          <span aria-hidden className="text-white/40">
            ·
          </span>
          <Link href="/flag-guidelines" className="hover:text-white">
            {t.footer.flagGuidelines}
          </Link>
        </nav>
        <div className="flex justify-center gap-4 pt-1">
          <a
            href="https://github.com/mahdi-salmanzade/MCP-Dubai"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-white/60 transition-colors hover:text-white"
          >
            <GithubIcon />
          </a>
          <a
            href="https://www.linkedin.com/in/mahdisalmanzade/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-white/60 transition-colors hover:text-white"
          >
            <LinkedinIcon />
          </a>
        </div>
        <p className="whitespace-pre-line text-xs text-white/55">
          {t.footer.disclaimer}
        </p>
      </div>
    </footer>
  );
}

function GithubIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
