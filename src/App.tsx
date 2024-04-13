import "@/App.css";
import SettingPanel from "@/components/SettingPanel";
import LoadedImages from "@/components/LoadedImages";
import Workbench from "@/components/Workbench";
import { Separator } from "@/components/ui/separator";

const App = () => {
  return (
    <div className="flex min-h-screen">
      <LoadedImages />
      <Separator orientation="vertical" className="h-screen" />
      <Workbench />
      <Separator orientation="vertical" className="h-screen" />
      <SettingPanel />
    </div>
  );
};

export default App;
