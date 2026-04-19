"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/hooks/useLanguage";
import { downloadCanvas } from "@/components/ShareButtons";
import { fontsReady } from "@/lib/fonts/ready";
import {
  drawPost,
  POST_META,
  postFormat,
  type PostFormatId,
  type PostTemplate,
} from "@/lib/canvas/postTemplates";
import { AudienceSelector, type Audience } from "./AudienceSelector";
import { FormatSelector } from "./FormatSelector";
import { TemplateSelector } from "./TemplateSelector";
import { MessageInput } from "./MessageInput";
import { LogoUploader } from "./LogoUploader";
import { ExportBar } from "./ExportBar";

export function ProudPostMakerV2() {
  const { t, lang } = useLanguage();
  const [audience, setAudience] = useState<Audience>("personal");
  const [formatId, setFormatId] = useState<PostFormatId>("square");
  const [template, setTemplate] = useState<PostTemplate>("cleanCard");
  const [logo, setLogo] = useState<HTMLImageElement | null>(null);
  const [message, setMessage] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fontsReady();
  }, []);

  useEffect(() => {
    if (audience === "personal" && POST_META[template].audience === "business") {
      setTemplate("cleanCard");
    }
    if (audience === "business" && POST_META[template].audience === "personal") {
      setTemplate("mashreq");
    }
  }, [audience, template]);

  const effectiveFormat =
    template === "story" ? postFormat("story") : postFormat(formatId);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width = effectiveFormat.w;
    c.height = effectiveFormat.h;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    drawPost(ctx, template, { logo, message, lang });
  }, [template, effectiveFormat.w, effectiveFormat.h, logo, message, lang]);

  const filename = `proudu-post-${template}-${formatId}.png`;
  const handleDownload = async () => {
    if (canvasRef.current) await downloadCanvas(canvasRef.current, filename);
  };

  const isVertical = effectiveFormat.h > effectiveFormat.w;

  return (
    <section className="bg-white px-4 py-12 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-4xl font-bold text-black sm:text-6xl">
            {t.proudPost.heading}
          </h1>
          <p className="mt-3 text-neutral-700">{t.proudPost.sub}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[340px_1fr_320px]">
          <div className="space-y-6">
            <AudienceSelector value={audience} onChange={setAudience} />
            {audience === "business" && (
              <LogoUploader logo={logo} onLogo={setLogo} />
            )}
            <MessageInput value={message} onChange={setMessage} />
          </div>

          <div className="space-y-5 border border-black bg-white p-4 sm:p-6">
            <FormatSelector value={formatId} onChange={setFormatId} />
            <div
              className="mx-auto overflow-hidden border border-black bg-white"
              style={{
                aspectRatio: `${effectiveFormat.w} / ${effectiveFormat.h}`,
                maxWidth: isVertical ? "260px" : "440px",
              }}
            >
              <canvas ref={canvasRef} className="block h-full w-full" />
            </div>
            <ExportBar onDownload={handleDownload} />
          </div>

          <TemplateSelector
            audience={audience}
            formatId={formatId}
            message={message}
            logo={logo}
            value={template}
            onChange={setTemplate}
          />
        </div>
      </div>
    </section>
  );
}
