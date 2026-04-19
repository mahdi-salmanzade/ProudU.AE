"use client";

import Link from "next/link";
import { TrustPageLayout } from "@/components/TrustPageLayout";
import { ProudUBrand } from "@/components/ProudUBrand";
import { useLanguage } from "@/lib/hooks/useLanguage";

export function TermsContent() {
  const { lang } = useLanguage();

  if (lang === "ar") {
    return (
      <TrustPageLayout title="شروط الاستخدام">
        <p>
          <ProudUBrand /> مجانية للاستخدام. هذه الشروط توضّح ما هو متوقّع منك.
        </p>
        <h2>ما يمكنك فعله</h2>
        <ul>
          <li>إنشاء محتوى للاستخدام الشخصي أو التجاري</li>
          <li>التنزيل والمشاركة بحرية</li>
          <li>الاستخدام التجاري (منشورات لعملك الخاص)</li>
        </ul>
        <h2>ما هو غير مسموح</h2>
        <ul>
          <li>عدم احترام علم الإمارات أو الرموز الوطنية</li>
          <li>نشر الكراهية أو المعلومات المضلّلة أو المحتوى الضار</li>
          <li>إعادة توزيع هذه الأداة أو نسبها إلى نفسك</li>
        </ul>
        <h2>احترام علم الإمارات</h2>
        <p>
          جميع تصاميم العلم تتبع الإرشادات الرسمية لعلم دولة الإمارات. يُتوقّع
          من المستخدمين التعامل مع المحتوى باحترام.
        </p>
        <p>
          <Link href="/flag-guidelines">← إرشادات العلم</Link>
        </p>
        <h2>إخلاء المسؤولية</h2>
        <p>
          <ProudUBrand /> أداة مجتمعية مستقلّة، غير مرتبطة بأي جهة حكومية في
          الإمارات ولا تمثّل أيًا منها.
        </p>
        <h2>المسؤولية</h2>
        <p>
          <ProudUBrand /> تُقدَّم كما هي. أنت مسؤول عن كيفية استخدام ما
          تُنشئه.
        </p>
      </TrustPageLayout>
    );
  }

  return (
    <TrustPageLayout title="Terms of Use">
      <p>
        <ProudUBrand />{" "}is free to use. These terms explain what&apos;s
        expected.
      </p>
      <h2>What you can do</h2>
      <ul>
        <li>Create content for personal or business use</li>
        <li>Download and share freely</li>
        <li>Use commercially (your own business posts)</li>
      </ul>
      <h2>What&apos;s not allowed</h2>
      <ul>
        <li>Disrespecting the UAE flag or national symbols</li>
        <li>Spreading hate, misinformation, or harmful content</li>
        <li>Redistributing this tool or claiming it as your own</li>
      </ul>
      <h2>UAE Flag Respect</h2>
      <p>
        All flag designs follow official UAE flag guidelines. Users are
        expected to use content respectfully.
      </p>
      <p>
        <Link href="/flag-guidelines">→ View flag guidelines</Link>
      </p>
      <h2>Disclaimer</h2>
      <p>
        <ProudUBrand /> is an independent community tool, not affiliated with,
        endorsed by, or connected to any UAE government entity.
      </p>
      <h2>Liability</h2>
      <p>
        <ProudUBrand />{" "}is provided as-is. You&apos;re responsible for how you
        use what you create.
      </p>
    </TrustPageLayout>
  );
}
