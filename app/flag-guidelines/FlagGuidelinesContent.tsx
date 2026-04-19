"use client";

import { TrustPageLayout } from "@/components/TrustPageLayout";
import { ProudUBrand } from "@/components/ProudUBrand";
import { useLanguage } from "@/lib/hooks/useLanguage";

export function FlagGuidelinesContent() {
  const { lang } = useLanguage();

  if (lang === "ar") {
    return (
      <TrustPageLayout title="إرشادات علم الإمارات">
        <p>
          علم الإمارات يعبّر عن قيم وتاريخ دولتنا. تضمن هذه الإرشادات أن
          يُعامَل دائمًا باحترام.
        </p>
        <h2>ماذا تمثّل الألوان</h2>
        <ul>
          <li>
            <strong>الأحمر</strong>: الشجاعة والتضحية
          </li>
          <li>
            <strong>الأخضر</strong>: النمو والازدهار
          </li>
          <li>
            <strong>الأبيض</strong>: السلام والصدق
          </li>
          <li>
            <strong>الأسود</strong>: القوة والعزيمة
          </li>
        </ul>
        <h2>افعل</h2>
        <ul>
          <li>اعرضه بالنِّسَب الصحيحة (2:1 للطول مقابل العرض)</li>
          <li>حافظ عليه نظيفًا وبحالة جيدة</li>
          <li>تعامل مع جميع تمثيلاته باحترام</li>
        </ul>
        <h2>لا تفعل</h2>
        <ul>
          <li>تغيير ألوانه أو تصميمه أو نِسَبه</li>
          <li>استخدامه كعلامة تجارية أو في الإعلانات</li>
          <li>طباعته على مواد قابلة للرمي</li>
          <li>استخدامه كزينة أو زي أو غطاء</li>
        </ul>
        <h2>
          كيف تلتزم <ProudUBrand /> بهذه الإرشادات
        </h2>
        <p>
          كل علم في <ProudUBrand /> يستخدم الألوان الرسمية والنِّسَب الصحيحة
          2:1. بدون تشويه، بدون تعديل، بحكم التصميم.
        </p>
      </TrustPageLayout>
    );
  }

  return (
    <TrustPageLayout title="UAE Flag Guidelines">
      <p>
        The UAE flag represents our nation&apos;s values and history. These
        guidelines ensure it&apos;s always treated with respect.
      </p>
      <h2>What the colors represent</h2>
      <ul>
        <li>
          <strong>Red</strong>: Courage and sacrifice
        </li>
        <li>
          <strong>Green</strong>: Growth and prosperity
        </li>
        <li>
          <strong>White</strong>: Peace and honesty
        </li>
        <li>
          <strong>Black</strong>: Strength and determination
        </li>
      </ul>
      <h2>Do</h2>
      <ul>
        <li>Display in correct proportions (2:1 length to width)</li>
        <li>Keep clean and in good condition</li>
        <li>Treat all representations with respect</li>
      </ul>
      <h2>Don&apos;t</h2>
      <ul>
        <li>Alter the flag&apos;s colors, design, or proportions</li>
        <li>Use as a trademark or for advertising</li>
        <li>Print on disposable materials</li>
        <li>Use as decoration, costume, or covering</li>
      </ul>
      <h2>
        How <ProudUBrand /> follows these
      </h2>
      <p>
        Every flag in <ProudUBrand /> uses official colors and correct 2:1
        proportions. No distortions, no alterations, by design.
      </p>
    </TrustPageLayout>
  );
}
