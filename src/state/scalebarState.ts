import {
  DEFAULT_SCALEBAR_STATE,
  DEFAULT_SCALEBAR_LENGTH,
} from "@/constant/config";
import { Scalebar } from "@/type/imageState";
import {
  MagnificationConfig,
  MicroscopeType,
  UprightObjlensOption,
  InvertedObjlensOption,
} from "@/type/options";
import {
  isUprightObjlensOption,
  isInvertedObjlensOption,
} from "@/Modules/Magnification/judgeMicroscopeType";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const scalebarAtom = atomWithStorage<Scalebar>(
  "scalebar",
  { ...DEFAULT_SCALEBAR_STATE },
  undefined,
  { getOnInit: true }
);

export const scalebarUpdaterAtom = atom(
  null,
  (_, set, newConfigItems: Partial<Scalebar>) => {
    set(scalebarAtom, (prev) => ({ ...prev, ...newConfigItems }));
  }
);

export const scalebarLengthAtom = atom<MagnificationConfig<number>>({
  ...DEFAULT_SCALEBAR_LENGTH,
});

export const scalebarLengthUpdaterAtom = atom(
  null,
  (
    _,
    set,
    microscopeType: MicroscopeType,
    objlens: UprightObjlensOption | InvertedObjlensOption,
    length: number
  ) => {
    set(scalebarLengthAtom, (prev) => {
      const clone = structuredClone(prev);
      if (microscopeType === "upright" && isUprightObjlensOption(objlens)) {
        clone["upright"][objlens] = length;
      }
      if (microscopeType === "inverted" && isInvertedObjlensOption(objlens)) {
        clone["inverted"][objlens] = length;
      }
      return clone;
    });
  }
);
