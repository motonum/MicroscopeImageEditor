import { Magnification, Scalebar } from "@/type/imageState";

export const DEFAULT_MAGNIFICATION_CONFIG: Magnification = {
  // dpm は dots per meter
  x40: { dpm: 689812.36, length: 200 },
  x100: { dpm: 1724660.68, length: 100 },
  x200: { dpm: 3449528.42, length: 50 },
  x400: { dpm: 6877051.66, length: 20 },
  x500: { dpm: 8572662.97, length: 20 },
} as const;

export const DEFAULT_SCALEBAR_STATE: Scalebar = {
  color: "white",
  lineWidth: 10,
  fontSize: 75,
  fontWeight: "normal",
  scalebarPosX: 100,
  scalebarPosY: 75,
};
