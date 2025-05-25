import { LoadedImage } from "@/type/imageState";
import { inferMagnification } from "@/util/inferMagnification";

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
              image: image,
              name: file.name,
              color: "white",
              ...magOption,
            });
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };
