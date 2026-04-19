type FontSpec = { weight: number; family: string; size?: number };

const REQUIRED: FontSpec[] = [
  { weight: 400, family: "Inter" },
  { weight: 700, family: "Inter" },
  { weight: 800, family: "Inter" },
  { weight: 700, family: "Tajawal" },
  { weight: 800, family: "Tajawal" },
];

let cached: Promise<void> | null = null;

export function fontsReady(): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();
  if (cached) return cached;
  cached = (async () => {
    if (!("fonts" in document)) return;
    try {
      await Promise.all(
        REQUIRED.map((f) =>
          document.fonts.load(`${f.weight} ${f.size ?? 16}px ${f.family}`),
        ),
      );
      await document.fonts.ready;
    } catch {}
  })();
  return cached;
}
