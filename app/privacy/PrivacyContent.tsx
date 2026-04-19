"use client";

import { TrustPageLayout } from "@/components/TrustPageLayout";
import { ProudUBrand } from "@/components/ProudUBrand";
import { useLanguage } from "@/lib/hooks/useLanguage";

export function PrivacyContent() {
  const { lang } = useLanguage();

  if (lang === "ar") {
    return (
      <TrustPageLayout title="سياسة الخصوصية">
        <p>
          صُممت <ProudUBrand /> بحيث تكون الخصوصية ميزة أساسية فيها.
        </p>
        <h2>ما الذي تقدّمه أنت</h2>
        <ul>
          <li>الصور التي ترفعها لأداة &laquo;صورتي بالعلم&raquo;</li>
          <li>الشعارات التي ترفعها لأداة &laquo;منشور الفخر&raquo;</li>
        </ul>
        <h2>كيف تعمل</h2>
        <p>
          تتم جميع المعالجة محلياً داخل متصفحك باستخدام HTML Canvas API. صورك
          لا تغادر جهازك أبداً، ولا تُرفع إلى أي خادم.
        </p>
        <h2>ما الذي نحفظه</h2>
        <p>
          لا كوكيز. لا حسابات. فقط عنصر واحد في الذاكرة المحلية لمتصفحك:
          تفضيلك للغة (EN أو AR). هذا كل شيء.
        </p>
        <h2>ما الذي لا نفعله أبداً</h2>
        <ul>
          <li>رفع صورك إلى أي خادم</li>
          <li>تخزين صورك</li>
          <li>طلب تسجيل الدخول أو إنشاء حساب</li>
          <li>عرض الإعلانات</li>
          <li>بيع البيانات</li>
        </ul>
        <h2>الأطراف الثالثة</h2>
        <p>
          <ProudUBrand /> مستضافة على Vercel، التي قد تجمع سجلات خادم قياسية
          (عناوين IP وطلبات الصفحات). راجع سياسة خصوصية Vercel للتفاصيل.
        </p>
        <p>
          نستخدم Vercel Analytics: بدون كوكيز وصديقة للخصوصية. مشاهدات صفحات
          مجهولة فقط. بدون أي تعقّب عبر المواقع.
        </p>
        <h2>حماية البيانات في الإمارات</h2>
        <p>
          متوافقة مع قانون حماية البيانات الشخصية في دولة الإمارات بحكم
          التصميم، لا بحكم السياسة. ببساطة لا نجمع أي بيانات شخصية.
        </p>
        <h2>تواصل معنا</h2>
        <p>
          أسئلة؟{" "}
          <a href="mailto:mahdi@clrtstudio.com">mahdi@clrtstudio.com</a>
        </p>
      </TrustPageLayout>
    );
  }

  return (
    <TrustPageLayout title="Privacy Policy">
      <p>
        <ProudUBrand /> is designed with privacy as a core feature.
      </p>
      <h2>What you provide</h2>
      <ul>
        <li>Photos you upload for Flag My Photo</li>
        <li>Logos you upload for Proud Post Maker</li>
      </ul>
      <h2>How it works</h2>
      <p>
        All processing happens locally in your browser using the HTML Canvas
        API. Your photos never leave your device. They&apos;re never uploaded
        to any server.
      </p>
      <h2>What we save</h2>
      <p>
        No cookies. No accounts. Just one item in local storage: your language
        preference (EN or AR). That&apos;s it.
      </p>
      <h2>What we never do</h2>
      <ul>
        <li>Upload your photos to any server</li>
        <li>Store your images</li>
        <li>Require login or accounts</li>
        <li>Serve ads</li>
        <li>Sell data</li>
      </ul>
      <h2>Third parties</h2>
      <p>
        <ProudUBrand />{" "}is hosted on Vercel, which may collect standard
        server logs (IP address, page requests). See Vercel&apos;s privacy
        policy for details.
      </p>
      <p>
        We use Vercel Analytics: cookieless and privacy-friendly. Anonymous
        page views only. No cross-site tracking.
      </p>
      <h2>UAE Data Protection</h2>
      <p>
        Compliant with the UAE Personal Data Protection Law, by design, not by
        policy. We simply don&apos;t collect personal data.
      </p>
      <h2>Contact</h2>
      <p>
        Questions?{" "}
        <a href="mailto:mahdi@clrtstudio.com">mahdi@clrtstudio.com</a>
      </p>
    </TrustPageLayout>
  );
}
