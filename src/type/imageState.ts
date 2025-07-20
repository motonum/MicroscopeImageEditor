import { ColorOption } from "@/type/color";
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

export type LoadedImageCore = {
  id: Symbol;
  originImage: HTMLImageElement;
  imageColor: ColorOption;
  editedImage: HTMLImageElement;
  name: string;
  scalebarColor: ScalebarColorOption;
  scalebarBackground: boolean;
  scalebarBackgroundPadding: number;
} & {
  length?: number;
};

export type LoadedImage = LoadedImageCore & MagnificationOption;

export type Scalebar = {
  fontSize: number;
  lineWidth: number;
  scalebarPosX: number;
  scalebarPosY: number;
  fontWeight: FontWeightOption;
};
