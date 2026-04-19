import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FlagMyPhotoV2 } from "@/components/flag-photo/FlagMyPhotoV2";

export const metadata: Metadata = {
  title: "Flag My Photo · ProudU.AE 🇦🇪",
  description:
    "Add a patriotic UAE frame to your profile picture in seconds. Free, no upload, your photo stays on your device.",
};

export default function FlagMyPhotoPage() {
  return (
    <div className="bg-white text-black">
      <Header variant="light" />
      <main className="flex-1">
        <FlagMyPhotoV2 />
      </main>
      <Footer variant="light" />
    </div>
  );
}
