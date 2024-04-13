import {
  FontWeightOption,
  ObjlensOption,
  ScalebarColorOption,
} from "@/type/options";

export type LoadedImage = {
  id: Symbol;
  image: HTMLImageElement;
  name: string;
  objLens: ObjlensOption;
  color: ScalebarColorOption;
} & Partial<Scalebar> & {
    length?: number;
  };

export type Scalebar = {
  fontSize: number;
  lineWidth: number;
  scalebarPosX: number;
  scalebarPosY: number;
  fontWeight: FontWeightOption;
};

export type Magnification = {
  [key in ObjlensOption]: { dpm: number; length: number };
};
