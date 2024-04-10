import {
  DEFAULT_MAGNIFICATION_CONFIG,
  DEFAULT_SCALEBAR_STATE,
} from "@/constant/config";
import { LoadedImage, Magnification, Scalebar } from "@/type/imageState";
import { atom } from "jotai";

export const imageAtom = atom<LoadedImage[]>([]);

export const onWorkbenchIndexAtom = atom<number>(0);

export const scalebarAtom = atom<Scalebar>({ ...DEFAULT_SCALEBAR_STATE });

export const scalebarUpdaterAtom = atom(
  null,
  (_, set, newConfigItems: Partial<Scalebar>) => {
    set(scalebarAtom, (prev) => ({ ...prev, ...newConfigItems }));
  }
);

export const magnificationConfigAtom = atom<Magnification>({
  ...DEFAULT_MAGNIFICATION_CONFIG,
});
