export async function readExifOrientation(file: File): Promise<number> {
  try {
    const buf = await file.slice(0, 64 * 1024).arrayBuffer();
    const view = new DataView(buf);
    if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) return 1;

    let offset = 2;
    while (offset < view.byteLength) {
      if (offset + 4 > view.byteLength) return 1;
      const marker = view.getUint16(offset);
      offset += 2;
      if (marker === 0xffe1) {
        const size = view.getUint16(offset);
        offset += 2;
        if (offset + 6 > view.byteLength) return 1;
        const exifHeader = view.getUint32(offset);
        if (exifHeader !== 0x45786966) return 1;
        const tiffStart = offset + 6;
        if (tiffStart + 8 > view.byteLength) return 1;
        const byteAlign = view.getUint16(tiffStart);
        const little = byteAlign === 0x4949;
        const get16 = (o: number) => view.getUint16(o, little);
        const get32 = (o: number) => view.getUint32(o, little);
        if (get16(tiffStart + 2) !== 0x002a) return 1;
        const ifdOffset = get32(tiffStart + 4);
        const ifd0 = tiffStart + ifdOffset;
        if (ifd0 + 2 > view.byteLength) return 1;
        const numEntries = get16(ifd0);
        for (let i = 0; i < numEntries; i++) {
          const entry = ifd0 + 2 + i * 12;
          if (entry + 12 > view.byteLength) break;
          const tag = get16(entry);
          if (tag === 0x0112) {
            return get16(entry + 8) || 1;
          }
        }
        return 1;
      } else if ((marker & 0xff00) !== 0xff00) {
        return 1;
      } else {
        if (offset + 2 > view.byteLength) return 1;
        const size = view.getUint16(offset);
        offset += size;
      }
    }
  } catch {}
  return 1;
}

export function applyOrientation(
  ctx: CanvasRenderingContext2D,
  orientation: number,
  w: number,
  h: number,
) {
  switch (orientation) {
    case 2:
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
      break;
    case 3:
      ctx.translate(w, h);
      ctx.rotate(Math.PI);
      break;
    case 4:
      ctx.translate(0, h);
      ctx.scale(1, -1);
      break;
    case 5:
      ctx.rotate(0.5 * Math.PI);
      ctx.scale(1, -1);
      break;
    case 6:
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(0, -h);
      break;
    case 7:
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(w, -h);
      ctx.scale(-1, 1);
      break;
    case 8:
      ctx.rotate(-0.5 * Math.PI);
      ctx.translate(-w, 0);
      break;
  }
}

export function orientationSwapsAxes(orientation: number) {
  return orientation >= 5 && orientation <= 8;
}
