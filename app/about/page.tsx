import type { Metadata } from "next";
import { AboutContent } from "./AboutContent";

export const metadata: Metadata = {
  title: "About · ProudU.AE",
};

export default function AboutPage() {
  return <AboutContent />;
}
