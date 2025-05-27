import {
  LoadedImage,
  LoadedImageCore,
  MagnificationOption,
} from "@/type/imageState";
import {
  INVERTED_OBJLENS_OPTIONS,
  InvertedObjlensOption,
  MICROSCOPE_TYPES,
  MicroscopeType,
  ObjlensOption,
  UPRIGHT_OBJLENS_OPTIONS,
  UprightObjlensOption,
} from "@/type/options";

export const isUprightObjlensOption = (
  objlens: string
): objlens is UprightObjlensOption => {
  return UPRIGHT_OBJLENS_OPTIONS.some((item) => item === objlens);
};

export const isInvertedObjlensOption = (
  objlens: string
): objlens is InvertedObjlensOption => {
  return INVERTED_OBJLENS_OPTIONS.some((item) => item === objlens);
};

export const isMicroscopeType = (str: string): str is MicroscopeType => {
  return MICROSCOPE_TYPES.some((item) => item === str);
};

export const isSafeMTypeOLPair = (obj: {
  microscopeType: string;
  objLens: string;
}): obj is MagnificationOption => {
  if (!isMicroscopeType(obj.microscopeType)) return false;
  switch (obj.microscopeType) {
    case "upright": {
      return isUprightObjlensOption(obj.objLens);
    }
    case "inverted": {
      return isInvertedObjlensOption(obj.objLens);
    }
  }
};

export type IncompleteLoadedImage = LoadedImageCore & {
  microscopeType: MicroscopeType;
  objLens: ObjlensOption;
};

export const isSafeLoadedImage = (
  ili: IncompleteLoadedImage
): ili is LoadedImage => {
  return isSafeMTypeOLPair({
    microscopeType: ili.microscopeType,
    objLens: ili.objLens,
  });
};
