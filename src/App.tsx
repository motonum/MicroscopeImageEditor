import "@/App.css";
import SettingPanel from "@/components/SettingPanel";
import LoadedImages from "@/components/LoadedImages";
import Workbench from "@/components/Workbench";
import { Separator } from "@/components/ui/separator";
import { useDropzone } from "react-dropzone";
import { useCallback } from "react";
import { readFiles } from "@/util/readFile";
import { useAtom } from "jotai";
import { imageAdderAtom } from "@/state/imageState";

const App = () => {
  const [, addLoadedImage] = useAtom(imageAdderAtom);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    readFiles(addLoadedImage)(acceptedFiles);
  }, []);

  const { getRootProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    noClick: true,
  });

  return (
    <div className="flex min-h-screen" {...getRootProps()}>
      <LoadedImages />
      <Separator orientation="vertical" className="h-screen" />
      <Workbench />
      <Separator orientation="vertical" className="h-screen" />
      <SettingPanel />
    </div>
  );
};

export default App;
