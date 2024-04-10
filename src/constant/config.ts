import { Magnification, Scalebar } from "@/type/imageState";

export const DEFAULT_MAGNIFICATION_CONFIG: Magnification = {
  // DPM は dots per meter
  x40: { DPM: 689812.36, LENGTH: 200 },
  x100: { DPM: 1724660.68, LENGTH: 100 },
  x200: { DPM: 3449528.42, LENGTH: 50 },
  x400: { DPM: 6877051.66, LENGTH: 20 },
  x500: { DPM: 8572662.97, LENGTH: 20 },
} as const;

export const DEFAULT_SCALEBAR_STATE: Scalebar = {
  color: "white",
  lineWidth: 10,
  fontSize: 75,
  fontWeight: "normal",
  scalebarPosX: 100,
  scalebarPosY: 75,
};
