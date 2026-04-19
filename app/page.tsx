import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroV2 } from "@/components/home/HeroV2";
import { TrustBadges } from "@/components/home/TrustBadges";
import { ToolsRow } from "@/components/home/ToolsRow";

export default function Home() {
  return (
    <div className="bg-white text-black">
      <Header variant="light" />
      <main className="flex-1">
        <HeroV2 />
        <TrustBadges />
        <ToolsRow />
      </main>
      <Footer variant="light" />
    </div>
  );
}
