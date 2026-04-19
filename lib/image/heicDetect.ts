export async function isHeicFile(file: File): Promise<boolean> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".heic") || name.endsWith(".heif")) return true;
  const type = file.type.toLowerCase();
  if (type === "image/heic" || type === "image/heif") return true;
  try {
    const head = await file.slice(0, 32).arrayBuffer();
    const bytes = new Uint8Array(head);
    const ascii = String.fromCharCode(...bytes.slice(4, 12));
    if (ascii.startsWith("ftypheic")) return true;
    if (ascii.startsWith("ftypheix")) return true;
    if (ascii.startsWith("ftypmif1")) return true;
    if (ascii.startsWith("ftypheim")) return true;
    if (ascii.startsWith("ftypheis")) return true;
  } catch {}
  return false;
}
