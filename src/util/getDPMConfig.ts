import { DPM_CONFIG } from "@/constant/config";
import { MicroscopeType, ObjlensOption } from "@/type/options";
import {
  isInvertedObjlensOption,
  isUprightObjlensOption,
} from "@/util/judgeMicrosocpeType";

export const getDPMConfig = (mt: MicroscopeType, ol: ObjlensOption) => {
  if (isUprightObjlensOption(ol) && mt === "upright") {
    return DPM_CONFIG[mt][ol];
  }
  if (isInvertedObjlensOption(ol) && mt === "inverted") {
    return DPM_CONFIG[mt][ol];
  }
  return DPM_CONFIG["upright"][ol];
};
