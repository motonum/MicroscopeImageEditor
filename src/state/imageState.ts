import { ColorOption } from "@/type/color";
import { LoadedImage } from "@/type/imageState";
import { editImageColor } from "@/util/editImageColor";
import { isSafeLoadedImage } from "@/util/judgeMicrosocpeType";
import { atom } from "jotai";

export const imageAtom = atom<LoadedImage[]>([]);
export const imageUpdaterAtom = atom(
  null,
  (
    get,
    set,
    newImageItems: Partial<Omit<LoadedImage, "color" | "editedImage">>,
    id: Symbol
  ) => {
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
export const imageColorSwitcherAtom = atom(
  null,
  (_, set, color: ColorOption, id: Symbol) => {
    // const image = get(imageAtom).find((element) => element.id === id);
    // if (!image) return;
    set(imageAtom, (prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (item.imageColor === color) return item;
        const editedImage = editImageColor(item.originImage, color);
        return { ...item, imageColor: color, editedImage };
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
