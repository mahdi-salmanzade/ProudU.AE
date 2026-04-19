import { FORMATS, type CanvasFormat } from "./geometry";

export type FlagFormatId = "profile" | "story" | "lockscreen";

export const FLAG_FORMATS: { id: FlagFormatId; format: CanvasFormat }[] = [
  { id: "profile", format: FORMATS.square },
  { id: "story", format: FORMATS.story },
  { id: "lockscreen", format: FORMATS.lockscreen },
];

export function flagFormat(id: FlagFormatId): CanvasFormat {
  return FLAG_FORMATS.find((f) => f.id === id)!.format;
}
