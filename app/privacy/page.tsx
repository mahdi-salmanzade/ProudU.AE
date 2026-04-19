import type { Metadata } from "next";
import { PrivacyContent } from "./PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Policy · ProudU.AE",
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
