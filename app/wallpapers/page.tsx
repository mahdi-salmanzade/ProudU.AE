import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WallpaperGalleryV2 } from "@/components/wallpapers/WallpaperGalleryV2";

export const metadata: Metadata = {
  title: "UAE Patriotic Wallpapers · ProudU.AE 🇦🇪",
  description:
    "Free patriotic UAE wallpapers for phone and desktop. No signup, no ads, no tracking.",
};

export default function WallpapersPage() {
  return (
    <div className="bg-white text-black">
      <Header variant="light" />
      <main className="flex-1">
        <WallpaperGalleryV2 />
      </main>
      <Footer variant="light" />
    </div>
  );
}
