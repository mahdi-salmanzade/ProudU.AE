import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProudPostMakerV2 } from "@/components/post-maker/ProudPostMakerV2";

export const metadata: Metadata = {
  title: "Proud Post Maker · ProudU.AE 🇦🇪",
  description:
    "Create a branded patriotic UAE post for your business or yourself. Free, no login, runs entirely in your browser.",
};

export default function PostMakerPage() {
  return (
    <div className="bg-white text-black">
      <Header variant="light" />
      <main className="flex-1">
        <ProudPostMakerV2 />
      </main>
      <Footer variant="light" />
    </div>
  );
}
