import { ScrollArea } from "@/components/ui/scroll-area";
import {
  imageAdderAtom,
  imageAtom,
  workbenchIndexAtom,
} from "@/state/imageState";
import { expectMagnification } from "@/util/expectMagnification";
import { useAtom } from "jotai";

import { useCallback, useRef } from "react";
import LoadedImageItem from "@/components/LoadedImageItem";
import { Button } from "@/components/ui/button";
import { ExecDownloadRef } from "@/type/execDownloadRef";
import { useDropzone } from "react-dropzone";

const LoadedImages = () => {
  const [loadedImages] = useAtom(imageAtom);
  const [workbenchIndex] = useAtom(workbenchIndexAtom);
  const [, addLoadedImage] = useAtom(imageAdderAtom);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef<Map<Symbol, ExecDownloadRef>>();

  const getMap = () => {
    if (!imagesRef.current) {
      imagesRef.current = new Map();
    }
    return imagesRef.current;
  };

  const readFiles = (files: File[]) => {
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

  // 画像を読み込んだときのハンドラ
  const handleInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      readFiles(fileArray);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    readFiles(acceptedFiles);
  }, []);

  const { getRootProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    noClick: true,
  });

  return (
    <div className="min-w-72 p-6 h-screen" {...getRootProps()}>
      <input
        type="file"
        onChange={handleInputFile}
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        multiple
      />
      <Button
        className="w-full"
        variant="outline"
        onClick={() => {
          fileInputRef.current?.click();
        }}
      >
        ファイルを選択
      </Button>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        {loadedImages.map((loadedImage, index) => (
          <LoadedImageItem
            {...{ loadedImage, index }}
            key={index}
            active={index === workbenchIndex}
            ref={(node) => {
              const map = getMap();
              if (node) {
                map.set(loadedImage.id, node);
              } else {
                map.delete(loadedImage.id);
              }
            }}
          />
        ))}
      </ScrollArea>
      <Button
        onClick={() => {
          imagesRef.current?.forEach((ref) => {
            ref.execDownload();
          });
        }}
        className="h-10 w-full box-border"
      >
        すべて保存
      </Button>
    </div>
  );
};

export default LoadedImages;
