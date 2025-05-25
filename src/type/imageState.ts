import {
  FontWeightOption,
  InvertedObjlensOption,
  ScalebarColorOption,
  UprightObjlensOption,
} from "@/type/options";

export type MagnificationOption =
  | {
      microscopeType: "upright";
      objLens: UprightObjlensOption;
    }
  | {
      microscopeType: "inverted";
      objLens: InvertedObjlensOption;
    };

export type LoadedImage = {
  id: Symbol;
  image: HTMLImageElement;
  name: string;
  color: ScalebarColorOption;
} & {
  length?: number;
} & MagnificationOption;

export type Scalebar = {
  fontSize: number;
  lineWidth: number;
  scalebarPosX: number;
  scalebarPosY: number;
  fontWeight: FontWeightOption;
};
