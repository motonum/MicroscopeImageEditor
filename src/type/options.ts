export const UPRIGHT_OBJLENS_OPTIONS = [
  "x40",
  "x100",
  "x200",
  "x400",
  "x500",
] as const;
export const MICROSCOPE_TYPES = ["upright", "inverted"] as const;
export type MicroscopeType = (typeof MICROSCOPE_TYPES)[number];
export const INVERTED_OBJLENS_OPTIONS = ["x100", "x200", "x400"] as const;
export type UprightObjlensOption = (typeof UPRIGHT_OBJLENS_OPTIONS)[number];
export type InvertedObjlensOption = (typeof INVERTED_OBJLENS_OPTIONS)[number];
export type ObjlensOption = UprightObjlensOption | InvertedObjlensOption;
export const SCALEBAR_COLOR_OPTIONS = ["white", "black"] as const;
export type ScalebarColorOption = (typeof SCALEBAR_COLOR_OPTIONS)[number];
export const FONT_WEIGHT_OPTIONS = ["normal", "bold"] as const;
export type FontWeightOption = (typeof FONT_WEIGHT_OPTIONS)[number];

export type MagnificationConfig<T> = {
  upright: {
    [key in UprightObjlensOption]: T;
  };
  inverted: {
    [key in InvertedObjlensOption]: T;
  };
};
