import Picture from "@/components/Picture";
import { Button } from "@/components/ui/button";
import { imageAtom, workbenchIndexAtom } from "@/state/imageState";
import { ExecDownloadRef } from "@/type/execDownloadRef";
import { useAtom } from "jotai";
import { useMemo, useRef } from "react";

const Workbench = () => {
  const [workbenchIndex] = useAtom(workbenchIndexAtom);
  const [loadedImages] = useAtom(imageAtom);
  const execDownloadRef = useRef<ExecDownloadRef>(null);
  const imageName = useMemo(() => {
    if (
      workbenchIndex === undefined ||
      loadedImages[workbenchIndex] === undefined
    )
      return "";
    return loadedImages[workbenchIndex].name;
  }, [loadedImages, workbenchIndex]);

  return (
    <div className="grow min-w-0 px-6 mt-6">
      <Picture
        imageIndex={workbenchIndex}
        className="max-w-2xl mx-auto p-0"
        downloadable
        draggable
        ref={execDownloadRef}
      />
      {workbenchIndex !== undefined && (
        <div className="flex max-w-2xl mx-auto mt-3">
          <div className="flex-grow flex items-center">{imageName}</div>
          <Button onClick={() => execDownloadRef.current?.execDownload()}>
            保存
          </Button>
        </div>
      )}
    </div>
  );
};

export default Workbench;
