"use client";

import { TrustPageLayout } from "@/components/TrustPageLayout";
import { ProudUBrand } from "@/components/ProudUBrand";
import { useLanguage } from "@/lib/hooks/useLanguage";

export function AboutContent() {
  const { lang } = useLanguage();

  if (lang === "ar") {
    return (
      <TrustPageLayout
        title={
          <>
            عن <ProudUBrand />
          </>
        }
      >
        <p>
          <ProudUBrand /> أداة مجانية لإنشاء محتوى وطني، مصممة لأهل وشركات
          الإمارات.
        </p>
        <p>
          طُوِّرت وتُدار بشكل مستقل داخل الإمارات بواسطة مهدي. <ProudUBrand />{" "}
          غير مرتبطة بأي جهة حكومية في الإمارات ولا تمثّل أيًا منها.
        </p>
        <h2>لماذا وُجدت</h2>
        <p>
          الشركات لديها فرق تصميم، أما الأفراد فلا. <ProudUBrand /> تسدّ هذه
          الفجوة. مجانية، بدون تسجيل دخول، وستبقى كذلك.
        </p>
        <p>لا رفع للصور، لا حسابات. كل شيء يحدث على جهازك.</p>
        <h2>تواصل معنا</h2>
        <p>
          لديك ملاحظات أو تريد مشاركة ما صنعت؟ يسعدنا سماعك.{" "}
          <a href="mailto:mahdi@clrtstudio.com">mahdi@clrtstudio.com</a>
        </p>
      </TrustPageLayout>
    );
  }

  return (
    <TrustPageLayout
      title={
        <>
          About <ProudUBrand />
        </>
      }
    >
      <p>
        <ProudUBrand />{" "}is a free tool for creating patriotic content, built
        for the people and businesses of the UAE.
      </p>
      <p>
        It is built and maintained independently in the UAE by Mahdi.{" "}
        <ProudUBrand />{" "}is not affiliated with, endorsed by, or connected to
        any UAE government entity.
      </p>
      <h2>Why this exists</h2>
      <p>
        Brands have design teams. Regular people don&apos;t. <ProudUBrand />{" "}
        closes that gap. Free, no login, and it&apos;ll stay that way.
      </p>
      <p>No uploads. No accounts. Everything happens on your device.</p>
      <h2>Contact</h2>
      <p>
        Got feedback or want to share what you made? I&apos;d love to hear from
        you.{" "}
        <a href="mailto:mahdi@clrtstudio.com">mahdi@clrtstudio.com</a>
      </p>
    </TrustPageLayout>
  );
}
