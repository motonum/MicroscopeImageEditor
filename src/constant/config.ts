import { Scalebar } from "@/type/imageState";
import { MagnificationConfig } from "@/type/options";

export const DPM_CONFIG: MagnificationConfig<number> = {
  upright: {
    x40: 689812.36,
    x100: 1724660.68,
    x200: 3449528.42,
    x400: 6877051.66,
    x500: 8572662.97,
  },
  inverted: {
    x100: 2208661.13,
    x200: 4263696.05,
    x400: 5791752.76,
  },
};

export const DEFAULT_SCALEBAR_STATE: Scalebar = {
  lineWidth: 10,
  fontSize: 75,
  fontWeight: "normal",
  scalebarPosX: 100,
  scalebarPosY: 75,
};

export const DEFAULT_SCALEBAR_LENGTH: MagnificationConfig<number> = {
  upright: {
    x40: 200,
    x100: 100,
    x200: 50,
    x400: 20,
    x500: 20,
  },
  inverted: {
    x100: 100,
    x200: 50,
    x400: 20,
  },
};
