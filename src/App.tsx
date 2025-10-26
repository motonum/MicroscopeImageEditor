import "@/App.css";
import SettingPanel from "@/components/SettingPanel";
import LoadedImages from "@/components/LoadedImages";
import Workbench from "@/components/Workbench";
import { Separator } from "@/components/ui/separator";
import { useDropzone } from "react-dropzone";
import { useCallback, useEffect } from "react";
import { readFiles } from "@/util/readFile";
import { useAtom } from "jotai";
import { imageAdderAtom } from "@/state/imageState";
import Header from "@/components/Header";
import FoldableSidebar from "@/components/FoldableSidebar";
import { Toaster } from "@/components/ui/sonner";

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

  const handleUnload = useCallback((e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = "";
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-grow min-h-0" {...getRootProps()}>
        <LoadedImages className="hidden lg:flex" />
        <Separator orientation="vertical" className="h-full hidden lg:block" />
        <FoldableSidebar />
        <Workbench />
        <Separator orientation="vertical" className="h-full" />
        <SettingPanel />
      </div>
      <Toaster />
    </div>
  );
};

export default App;
