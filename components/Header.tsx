"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/hooks/useLanguage";
import { UAELottie } from "./UAELottie";

type Props = {
  variant?: "dark" | "light";
};

export function Header({ variant = "dark" }: Props) {
  const { t, lang, setLang } = useLanguage();
  const pathname = usePathname();
  const isLight = variant === "light";

  const navItems: { href: string; label: string }[] = [
    { href: "/flag-my-photo", label: t.nav.flagMyPhoto },
    { href: "/post-maker", label: t.nav.proudPost },
    { href: "/wallpapers", label: t.nav.wallpapers },
  ].map((item) =>
    pathname === item.href ? { href: "/", label: t.nav.home } : item,
  );

  const navLinkClass = isLight
    ? "transition hover:opacity-60"
    : "transition hover:text-white";

  const borderClass = isLight ? "border-black" : "border-white/30";
  const containerBg = isLight ? "bg-white" : "bg-black";

  return (
    <header
      className={
        isLight
          ? "sticky top-0 z-40 w-full bg-white pb-2 pt-1 sm:pt-3"
          : "sticky top-0 z-40 w-full bg-black pb-2 pt-1 sm:pt-3"
      }
    >
      <div className="mx-auto flex w-fit max-w-full flex-col items-center px-2 sm:px-4">
        <div dir="ltr" className="flex max-w-full items-end">
          <UAELottie className="h-[52px] w-[52px] shrink-0 origin-bottom -me-[32px] -scale-x-100 -rotate-[60deg] sm:-me-12 sm:h-[77px] sm:w-[77px]" />

          <div
            className={`flex items-center border ${borderClass} ${containerBg} px-3 py-2.5 sm:px-7 sm:py-4`}
          >
            <nav
              className={
                "flex items-center gap-3 text-[13px] font-medium sm:gap-6 sm:text-sm " +
                (isLight ? "text-black" : "text-white/90")
              }
            >
              {navItems.map((item) => (
                <Link key={item.href + item.label} href={item.href} className={navLinkClass}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <UAELottie className="h-[52px] w-[52px] shrink-0 origin-bottom -ms-[32px] rotate-[60deg] sm:-ms-12 sm:h-[77px] sm:w-[77px]" />
        </div>

        <div
          className={
            "mt-3 flex items-center gap-3 text-xs " +
            (isLight ? "text-black" : "text-white/85")
          }
        >
          <button
            type="button"
            onClick={() => setLang("en")}
            className={
              "transition focus-visible:outline-none focus-visible:underline " +
              (lang === "en"
                ? "font-semibold underline"
                : "opacity-60 hover:opacity-100")
            }
            aria-pressed={lang === "en"}
          >
            English
          </button>
          <span
            aria-hidden
            className={isLight ? "text-neutral-400" : "text-white/30"}
          >
            /
          </span>
          <button
            type="button"
            onClick={() => setLang("ar")}
            style={{ fontFamily: "var(--font-tajawal), system-ui, sans-serif" }}
            className={
              "transition focus-visible:outline-none focus-visible:underline " +
              (lang === "ar"
                ? "font-semibold underline"
                : "opacity-60 hover:opacity-100")
            }
            aria-pressed={lang === "ar"}
          >
            العربية
          </button>
        </div>
      </div>
    </header>
  );
}
