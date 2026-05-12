"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/hooks/useLanguage";
import { ImageUploader } from "@/components/ImageUploader";
import { downloadCanvas } from "@/components/ShareButtons";
import { fontsReady } from "@/lib/fonts/ready";
import {
  FLAG_FORMATS,
  flagFormat,
  type FlagFormatId,
} from "@/lib/canvas/flagPhotoFormats";
import type { FrameStyle } from "@/lib/canvas/photoFrames";
import { BeforeAfterExamples } from "./BeforeAfterExamples";
import { FrameSelector } from "./FrameSelector";
import { PhotoEditor, type PhotoEditorHandle } from "./PhotoEditor";
import { PhotoCropper } from "./PhotoCropper";
import { ExportBar } from "./ExportBar";

export function FlagMyPhotoV2() {
  const { t } = useLanguage();
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [cropped, setCropped] = useState<HTMLImageElement | null>(null);
  const [formatId, setFormatId] = useState<FlagFormatId>("profile");
  const [style, setStyle] = useState<FrameStyle>("archLeft");
  const editorRef = useRef<PhotoEditorHandle>(null);

  const handleUpload = (img: HTMLImageElement) => {
    setCropped(null);
    setImage(img);
  };

  const handleReupload = () => {
    setCropped(null);
    setImage(null);
  };

  useEffect(() => {
    fontsReady();
  }, []);

  useEffect(() => {
    if (!image) return;
    const ratio = image.naturalWidth / image.naturalHeight;
    let bestId: FlagFormatId = "profile";
    let bestDiff = Infinity;
    for (const { id, format } of FLAG_FORMATS) {
      const diff = Math.abs(ratio - format.w / format.h);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestId = id;
      }
    }
    setFormatId(bestId);
  }, [image]);

  const format = flagFormat(formatId);
  const isSquareSource =
    !!image && image.naturalWidth === image.naturalHeight;
  const needsCrop =
    !!image && formatId === "profile" && !isSquareSource && !cropped;
  const editorImage =
    image && formatId === "profile" ? cropped ?? image : image;
  const filename = `proudu-photo-${formatId}-${style}.png`;

  const handleDownload = async () => {
    const c = editorRef.current?.getCanvas();
    if (c) await downloadCanvas(c, filename);
  };

  return (
    <section className="bg-white px-4 py-12 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-4xl font-bold text-black sm:text-6xl">
            {t.flagMyPhoto.heading}
          </h1>
          <p className="mt-3 text-neutral-700">{t.flagMyPhoto.sub}</p>
        </div>

        {!image ? (
          <div className="mx-auto max-w-xl space-y-10">
            <BeforeAfterExamples />
            <ImageUploader onImage={handleUpload} />
          </div>
        ) : needsCrop ? (
          <PhotoCropper
            image={image}
            onConfirm={setCropped}
            onCancel={handleReupload}
          />
        ) : (
          editorImage && (
            <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
              <div className="space-y-5 border border-black bg-white p-4 sm:p-6">
                <PhotoEditor
                  ref={editorRef}
                  image={editorImage}
                  format={format}
                  style={style}
                />
                <ExportBar
                  onDownload={handleDownload}
                  onReupload={handleReupload}
                />
              </div>

              <FrameSelector
                image={editorImage}
                format={format}
                value={style}
                onChange={setStyle}
              />
            </div>
          )
        )}
      </div>
    </section>
  );
}
