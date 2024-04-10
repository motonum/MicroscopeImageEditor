import { FontWeightOption, ObjlensOption, ScalebarColor } from "@/type/options";

export type LoadedImage = {
  image: HTMLImageElement;
  name: string;
  objLens: ObjlensOption;
};

export type Scalebar = {
  fontSize: number;
  color: ScalebarColor;
  lineWidth: number;
  scalebarPosX: number;
  scalebarPosY: number;
  // microScaleLength?: number;
  fontWeight: FontWeightOption;
};

export type Magnification = {
  [key in ObjlensOption]: { DPM: number; LENGTH: number };
};
