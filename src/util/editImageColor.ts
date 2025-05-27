import { ColorOption } from "@/type/color";

type RGB = [number, number, number];

const rgb2gray = ([r, g, b]: RGB) => {
  const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  return y;
};

const rgb2mono = (rgb: RGB, color: ColorOption): RGB => {
  const y = rgb2gray(rgb);
  switch (color) {
    case "red": {
      return [y, 0, 0];
    }
    case "green": {
      return [0, y, 0];
    }
    case "blue": {
      return [0, 0, y];
    }
    case "yellow": {
      return [y, y, 0];
    }
    case "cyan": {
      return [0, y, y];
    }
    case "default": {
      return [...rgb];
    }
  }
};

export const editImageColor = (
  image: HTMLImageElement,
  color: ColorOption | "default"
): HTMLImageElement => {
  if (color === "default") return image;
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return image;
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(
    0,
    0,
    image.naturalWidth,
    image.naturalHeight
  );

  const dist = ctx.createImageData(image.naturalWidth, image.naturalHeight);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    const a = imageData.data[i + 3];

    const [nr, ng, nb] = rgb2mono([r, g, b], color);

    dist.data[i] = nr;
    dist.data[i + 1] = ng;
    dist.data[i + 2] = nb;
    dist.data[i + 3] = a;
  }
  ctx.putImageData(dist, 0, 0);

  const uri = canvas.toDataURL();
  if (!uri) {
    return image;
  }
  const newImage = new Image();
  newImage.src = uri;
  return newImage;
};
