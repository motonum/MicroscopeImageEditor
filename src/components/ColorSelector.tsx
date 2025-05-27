import {
  imageColorSwitcherAtom,
  selectedIdAtom,
  selectedImageAtom,
} from "@/state/imageState";
import { COLOR_OPTIONS, ColorOption } from "@/type/color";
import { useAtom } from "jotai";
import { useMemo } from "react";

const ColorCircle = ({
  color,
  onClick,
  isSelected = false,
}: {
  color: ColorOption;
  onClick: () => void;
  isSelected: boolean;
}) => {
  const style = useMemo(() => {
    switch (color) {
      case "default":
        const slashColor = isSelected ? "#334155" : "#cbd5e1";
        return {
          background: `linear-gradient(45deg,transparent 0%,transparent 46%,${slashColor} 46%,${slashColor} 54%,transparent 54%,transparent 100%)`,
        };
      case "red":
        return { backgroundColor: isSelected ? "#f00" : "#f99" };
      case "green":
        return { backgroundColor: isSelected ? "#0f0" : "#9f9" };
      case "blue":
        return { backgroundColor: isSelected ? "#00f" : "#99f" };
      case "yellow":
        return { backgroundColor: isSelected ? "#ff0" : "#ffb" };
      case "cyan":
        return { backgroundColor: isSelected ? "#0ff" : "#9ff" };
    }
  }, [color, isSelected]);
  return (
    <div
      className={`rounded-lg aspect-square border-2 ${
        isSelected ? "border-slate-700" : "border-slate-300"
      }`}
      style={style}
      onClick={onClick}
    ></div>
  );
};

const ColorSelector = () => {
  const [, setImageColor] = useAtom(imageColorSwitcherAtom);
  const [selectedId] = useAtom(selectedIdAtom);
  const [selectedImage] = useAtom(selectedImageAtom);
  return (
    <div className="grid grid-cols-6 gap-3 px-2">
      {COLOR_OPTIONS.map((color, i) => {
        return (
          <ColorCircle
            color={color}
            key={i}
            onClick={() => {
              if (!selectedImage || !selectedId) return;
              if (selectedImage.microscopeType === "upright") return;
              setImageColor(color, selectedId);
            }}
            isSelected={
              !!selectedImage
                ? (selectedImage.microscopeType === "upright" &&
                    color === "default") ||
                  (selectedImage.microscopeType === "inverted" &&
                    selectedImage.imageColor === color)
                : false
            }
          />
        );
      })}
    </div>
  );
};

export default ColorSelector;
