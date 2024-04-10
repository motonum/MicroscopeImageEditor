import {
  DEFAULT_MAGNIFICATION_CONFIG,
  DEFAULT_SCALEBAR_STATE,
} from "@/constant/config";
import { LoadedImage, Magnification, Scalebar } from "@/type/imageState";
import { atom } from "jotai";

export const imageState = atom<LoadedImage[]>([]);

export const onWorkbenchIndexState = atom<number>(0);

export const scalebarState = atom<Scalebar>({ ...DEFAULT_SCALEBAR_STATE });

export const magnificationConfigState = atom<Magnification>({
  ...DEFAULT_MAGNIFICATION_CONFIG,
});
