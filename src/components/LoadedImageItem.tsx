import DeleteIcon from "@/components/Icon/DeleteIcon";
import Picture from "@/components/Picture";
import { Button } from "@/components/ui/button";
import { imageDeleterAtom, workbenchIndexAtom } from "@/state/imageState";
import { ExecDownloadRef } from "@/type/execDownloadRef";
import { LoadedImage } from "@/type/imageState";
import { useAtom } from "jotai";
import { forwardRef, useState } from "react";

type Props = {
  index: number;
  loadedImage: LoadedImage;
  active: boolean;
};

const LoadedImageItem = forwardRef<ExecDownloadRef, Props>(
  ({ index, loadedImage, active }, ref) => {
    const [, deleteLoadedImage] = useAtom(imageDeleterAtom);
    const [workbenchIndex, setWorkbenchIndex] = useAtom(workbenchIndexAtom);
    const [hover, setHover] = useState(false);

    return (
      <div
        className="p-4 relative"
        onClick={() => setWorkbenchIndex(index)}
        key={index}
        onMouseOver={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div
          className={`relative rounded overflow-hidden border-2 border-primary  ${
            active ? "" : "border-transparent"
          }`}
        >
          <Picture imageIndex={index} ref={ref} />
          {hover && (
            <Button
              className="absolute top-1 right-1 hover:bg-destructive"
              onClick={(e) => {
                e.stopPropagation();
                if (index === workbenchIndex) {
                  setWorkbenchIndex(undefined);
                }
                deleteLoadedImage(index);
              }}
            >
              <DeleteIcon color={"#ffffff"} />
            </Button>
          )}
        </div>
        <div>{loadedImage.name}</div>
      </div>
    );
  }
);

export default LoadedImageItem;
