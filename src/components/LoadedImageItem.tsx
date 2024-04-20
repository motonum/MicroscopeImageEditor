import DeleteIcon from "@/components/Icon/DeleteIcon";
import Picture from "@/components/Picture";
import { Button } from "@/components/ui/button";
import { imageDeleterAtom, selectedIdAtom } from "@/state/imageState";
import { ExecDownloadRef } from "@/type/execDownloadRef";
import { LoadedImage } from "@/type/imageState";
import { useAtom } from "jotai";
import { forwardRef, useState } from "react";

type Props = {
  loadedImage: LoadedImage;
  active: boolean;
};

const LoadedImageItem = forwardRef<ExecDownloadRef, Props>(
  ({ loadedImage, active }, ref) => {
    const [, deleteLoadedImage] = useAtom(imageDeleterAtom);
    const [selectedId, setSelectedId] = useAtom(selectedIdAtom);
    const [hover, setHover] = useState(false);

    return (
      <div
        className="p-4 relative w-[15rem]"
        onClick={() => setSelectedId(loadedImage.id)}
        onMouseOver={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div
          className={`w-full relative rounded overflow-hidden border-2 border-primary  ${
            active ? "" : "border-transparent"
          }`}
        >
          <Picture imageId={loadedImage.id} ref={ref} />
          {hover && (
            <Button
              className="absolute top-1 right-1 hover:bg-destructive"
              onClick={(e) => {
                e.stopPropagation();
                if (loadedImage.id === selectedId) {
                  setSelectedId(undefined);
                }
                deleteLoadedImage(loadedImage.id);
              }}
            >
              <DeleteIcon color={"#ffffff"} />
            </Button>
          )}
        </div>
        <div className="overflow-ellipsis overflow-hidden text-nowrap w-full">
          {loadedImage.name}
        </div>
      </div>
    );
  }
);

export default LoadedImageItem;
