"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/hooks/useLanguage";

export function ToolsRow() {
  const { t } = useLanguage();
  const tools = [
    {
      href: "/flag-my-photo",
      title: t.nav.flagMyPhoto,
      desc: t.home.flagDesc,
      icon: "/flag.svg",
    },
    {
      href: "/post-maker",
      title: t.nav.proudPost,
      desc: t.home.postDesc,
      icon: "/edit-file.svg",
    },
    {
      href: "/wallpapers",
      title: t.nav.wallpapers,
      desc: t.home.wallDesc,
      icon: "/shutterstock.svg",
    },
  ];

  return (
    <section className="bg-white px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <div>
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex items-center justify-between gap-6 py-6 transition hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
            >
              <div className="min-w-0 flex-1 ps-3">
                <h3 className="flex items-center gap-2 font-serif text-xl font-semibold">
                  <img
                    src={tool.icon}
                    alt=""
                    aria-hidden
                    className="h-6 w-6 shrink-0 group-hover:invert"
                  />
                  {tool.title}
                </h3>
                <p className="mt-1 text-sm text-neutral-700 group-hover:text-neutral-300">
                  {tool.desc}
                </p>
              </div>
              <span className="flex shrink-0 items-center gap-2 pe-3 text-xs font-semibold uppercase tracking-wider text-[#EF3340] group-hover:text-white">
                {t.tools.open}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="rtl:rotate-180"
                  aria-hidden
                >
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
