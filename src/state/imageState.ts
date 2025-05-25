import {
  DEFAULT_SCALEBAR_LENGTH,
  DEFAULT_SCALEBAR_STATE,
} from "@/constant/config";
import { LoadedImage, Scalebar } from "@/type/imageState";
import {
  InvertedObjlensOption,
  MagnificationConfig,
  MicroscopeType,
  UprightObjlensOption,
} from "@/type/options";
import {
  isInvertedObjlensOption,
  isSafeLoadedImage,
  isUprightObjlensOption,
} from "@/util/judgeMicrosocpeType";
import { atom } from "jotai";

export const imageAtom = atom<LoadedImage[]>([]);
export const imageUpdaterAtom = atom(
  null,
  (get, set, newImageItems: Partial<LoadedImage>, id: Symbol) => {
    const image = get(imageAtom).find((element) => element.id === id);
    if (!image) return;
    set(imageAtom, (prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const newItem = {
          ...item,
          ...newImageItems,
        };
        if (isSafeLoadedImage(newItem)) {
          return newItem;
        } else return item;
      })
    );
  }
);
export const imageAdderAtom = atom(null, (_, set, image: LoadedImage) => {
  set(imageAtom, (prev) => [...prev, image]);
});
export const imageDeleterAtom = atom(null, (get, set, id: Symbol) => {
  const image = get(imageAtom).find((element) => element.id === id);
  if (!image) return;
  set(imageAtom, (prev) => prev.filter((element) => element.id !== id));
});

export const selectedIdAtom = atom<Symbol | undefined>(undefined);
export const selectedImageAtom = atom<LoadedImage | undefined>((get) => {
  const loadedImages = get(imageAtom);
  const selectedId = get(selectedIdAtom);
  const image = loadedImages.find((element) => element.id === selectedId);
  return image;
});

const getFromLocalStorage = (): Scalebar | null => {
  const value: string | null = localStorage.getItem("scalebar");
  if (!value) return null;
  return JSON.parse(value);
};

export const getScalebarInitialState = () => {
  return { ...DEFAULT_SCALEBAR_STATE, ...getFromLocalStorage() };
};
export const scalebarAtom = atom<Scalebar>({ ...getScalebarInitialState() });

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
