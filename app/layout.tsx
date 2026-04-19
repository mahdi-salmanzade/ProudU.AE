import type { Metadata, Viewport } from "next";
import { Amiri, Inter, Playfair_Display, Tajawal } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { LanguageProvider } from "@/lib/hooks/useLanguage";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://proudu.ae"),
  title: "ProudU.AE · Show Your Pride 🇦🇪",
  description:
    "Free tool to create patriotic UAE content. Flag your profile photo, create branded posts, download wallpapers. Made with love for the UAE.",
  openGraph: {
    title: "ProudU.AE · Show Your Pride 🇦🇪",
    description: "Free patriotic content generator for the UAE",
    url: "https://proudu.ae",
    siteName: "ProudU.AE",
    locale: "en_AE",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "ProudU.AE · Show Your Pride",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ProudU.AE · Show Your Pride 🇦🇪",
    description: "Free patriotic content generator for the UAE",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${inter.variable} ${playfair.variable} ${tajawal.variable} ${amiri.variable} h-full antialiased`}
    >
      <body className="min-h-full w-full max-w-[100vw] overflow-x-clip flex flex-col bg-background text-foreground">
        <LanguageProvider>{children}</LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
