import DoubleArrow from "@/components/Icon/DoubleArrow";
import LoadedImages from "@/components/LoadedImages";
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet";

const FoldableSidebar = () => {
  return (
    <div className="block lg:hidden">
      <Sheet>
        <SheetTrigger className="w-10 h-full bg-accent border border-border">
          <DoubleArrow color="#0c0a09" className="text-base" />
        </SheetTrigger>
        <SheetContent side={"left"} className=" w-80 p-0">
          <LoadedImages />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default FoldableSidebar;
