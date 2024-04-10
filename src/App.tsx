import "@/App.css";
import React, { useMemo } from "react";

import Picture from "@/components/Picture";
import { Input } from "@/components/ui/input";
import { useAtom } from "jotai";
import { imageAtom, onWorkbenchIndexAtom } from "@/state/imageState";
import { expectMagnification } from "@/util/expectMagnification";
import SettingPanel from "@/components/SettingPanel";

const App = () => {
  const [loadedImages, setLoadedImages] = useAtom(imageAtom);
  const [onWorkbenchIndex] = useAtom(onWorkbenchIndexAtom);

  const { image, objLens = "x200" } = useMemo(() => {
    const imageState = loadedImages?.[onWorkbenchIndex];
    if (!imageState)
      return { image: undefined, name: undefined, objLens: undefined };
    return imageState;
  }, [loadedImages, onWorkbenchIndex]);

  // 画像を読み込んだときのハンドラ
  const handleInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) {
      return;
    }

    const fileArray = Array.from(files);

    fileArray.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result;
        if (typeof result === "string") {
          const image = new window.Image();
          image.src = result;
          setLoadedImages([
            {
              image: image,
              name: file.name,
              objLens: expectMagnification(file.name) ?? "x200",
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <>
      <div className="flex min-h-screen">
        <SettingPanel />
        <div className="grow min-w-0">
          <Input
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleInputFile}
            className="max-w-2xl m-6"
          />
          <Picture
            image={image}
            objLens={objLens}
            className="max-w-2xl"
            downloadable
            draggable
          />
        </div>
      </div>
    </>
  );
};

export default App;
