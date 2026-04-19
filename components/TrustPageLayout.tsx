import { Header } from "./Header";
import { Footer } from "./Footer";

export function TrustPageLayout({
  title,
  children,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white text-black">
      <Header variant="light" />
      <main className="flex-1 px-4 py-20 sm:py-28">
        <article className="mx-auto max-w-3xl text-neutral-800">
          <h1 className="font-serif text-4xl font-bold text-black sm:text-5xl">
            {title}
          </h1>
          <div className="mt-8 max-w-none space-y-4 text-neutral-700 [&_a]:text-[#EF3340] [&_a]:underline [&_a:hover]:text-black [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-black [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-black [&_ul]:list-disc [&_ul]:ps-6 [&_li]:mt-1 [&_strong]:text-black">
            {children}
          </div>
        </article>
      </main>
      <Footer variant="light" />
    </div>
  );
}
