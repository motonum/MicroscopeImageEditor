import CheckIcon from "@/components/Icon/CheckIcon";
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
        return {
          background:
            "linear-gradient(45deg,transparent 0%,transparent 46%,#cbd5e1 46%,#cbd5e1 54%,transparent 54%,transparent 100%)",
        };
      case "red":
        return { backgroundColor: "#f55" };
      case "green":
        return { backgroundColor: "#5f5" };
      case "blue":
        return { backgroundColor: "#55f" };
      case "yellow":
        return { backgroundColor: "#ff5" };
      case "cyan":
        return { backgroundColor: "#5ff" };
    }
  }, [color]);
  return (
    <div
      className="rounded-lg aspect-square border-slate-300 border-2"
      style={style}
      onClick={onClick}
    >
      {isSelected && <CheckIcon color="#333" />}
    </div>
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
