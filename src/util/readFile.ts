import { LoadedImage } from "@/type/imageState";
import { expectMagnification } from "@/util/expectMagnification";

export const readFiles =
  (addLoadedImage: (loadImage: LoadedImage) => void) => (files: File[]) => {
    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result;
        if (typeof result === "string") {
          const image = new window.Image();
          image.src = result;
          addLoadedImage({
            id: Symbol(),
            image: image,
            name: file.name,
            objLens: expectMagnification(file.name) ?? "x200",
            color: "white",
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };
