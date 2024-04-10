export const OBJLENS_OPTIONS = ["x40", "x100", "x200", "x400", "x500"] as const;
export type ObjlensOption = (typeof OBJLENS_OPTIONS)[number];
export const SCALEBAR_COLOR = ["white", "black"] as const;
export type ScalebarColor = (typeof SCALEBAR_COLOR)[number];
export const FONT_WEIGHT_OPTIONS = ["normal", "bold"] as const;
export type FontWeightOption = (typeof FONT_WEIGHT_OPTIONS)[number];
