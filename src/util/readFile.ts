import { DEFAULT_SCALEBAR_BACKGROUND_PADDING } from "@/constant/config";
import { LoadedImage } from "@/type/imageState";
import { inferMagnification } from "@/Modules/Magnification/inferMagnification";

export const readFiles =
  (addLoadedImage: (loadImage: LoadedImage) => void) => (files: File[]) => {
    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result;
        if (typeof result === "string") {
          const image = new window.Image();
          image.src = result;
          image.addEventListener("load", () => {
            const magOption = inferMagnification(file.name, {
              height: image.naturalHeight,
              width: image.naturalWidth,
            });
            addLoadedImage({
              id: Symbol(),
              originImage: image,
              editedImage: image,
              imageColor: "default",
              name: file.name,
              scalebarColor: "white",
              scalebarBackground: false,
              scalebarBackgroundPadding: DEFAULT_SCALEBAR_BACKGROUND_PADDING,
              ...magOption,
            });
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };
