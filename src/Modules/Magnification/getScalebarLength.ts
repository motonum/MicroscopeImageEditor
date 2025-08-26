import { DEFAULT_SCALEBAR_LENGTH } from "@/constant/config";
import {
  MagnificationConfig,
  MicroscopeType,
  ObjlensOption,
} from "@/type/options";
import {
  isInvertedObjlensOption,
  isUprightObjlensOption,
} from "@/Modules/Magnification/judgeMicroscopeType";

// スケールバーの長さを取得する関数
export const getScalebarLength = (
  scalebarLengthDict: MagnificationConfig<number>,
  mt: MicroscopeType,
  ol: ObjlensOption
) => {
  if (isUprightObjlensOption(ol) && mt === "upright") {
    return scalebarLengthDict[mt][ol];
  }
  if (isInvertedObjlensOption(ol) && mt === "inverted") {
    return scalebarLengthDict[mt][ol];
  }
  return DEFAULT_SCALEBAR_LENGTH["upright"][ol];
};
