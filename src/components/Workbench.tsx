import Picture from "@/components/Picture";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { imageAtom, selectedIdAtom } from "@/state/imageState";
import { ExecDownloadRef } from "@/type/execDownloadRef";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { useMeasure } from "@react-hookz/web";
import { useAtom } from "jotai";
import { useEffect, useMemo, useRef } from "react";

const Workbench = () => {
  const [selectedId, setSelectedId] = useAtom(selectedIdAtom);
  const [loadedImages] = useAtom(imageAtom);
  const execDownloadRef = useRef<ExecDownloadRef>(null);
  const [fileNameSize, fileNameRef] = useMeasure<HTMLDivElement>();
  const [fileNameWrapperSize, fileNameWrapperRef] =
    useMeasure<HTMLDivElement>();
  const imageName = useMemo(() => {
    const image = loadedImages.find((element) => element.id === selectedId);
    if (selectedId === undefined || image === undefined) return "";
    return image.name;
  }, [loadedImages, selectedId]);

  useEffect(() => {
    if (
      selectedId !== undefined &&
      !loadedImages.find((element) => element.id === selectedId)
    ) {
      setSelectedId(undefined);
    }
  }, [selectedId, loadedImages, setSelectedId]);

  return (
    <div className="grow min-w-0 px-6 mt-6">
      <Picture
        imageId={selectedId}
        className="max-w-2xl mx-auto p-0"
        downloadable
        draggable
        ref={execDownloadRef}
      />
      {selectedId !== undefined && (
        <div className="flex max-w-2xl mx-auto mt-3 gap-2">
          <div
            ref={fileNameWrapperRef}
            className="flex-grow flex items-center text-nowrap max-w-full overflow-hidden"
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    ref={fileNameRef}
                    className="max-w-full text-ellipsis overflow-hidden"
                  >
                    {imageName}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="z-10">
                  {fileNameSize?.width &&
                    fileNameWrapperSize?.width &&
                    fileNameSize.width === fileNameWrapperSize.width && (
                      <Card className="max-w-2xl text-wrap p-2">
                        {imageName}
                      </Card>
                    )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Button onClick={() => execDownloadRef.current?.execDownload()}>
            保存
          </Button>
        </div>
      )}
    </div>
  );
};

export default Workbench;
