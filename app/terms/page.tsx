import type { Metadata } from "next";
import { TermsContent } from "./TermsContent";

export const metadata: Metadata = {
  title: "Terms of Use · ProudU.AE",
};

export default function TermsPage() {
  return <TermsContent />;
}
