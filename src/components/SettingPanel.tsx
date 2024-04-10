import { Input } from "@/components/ui/input";
import { DEFAULT_MAGNIFICATION_CONFIG } from "@/constant/config";
import {
  SCALEBAR_COLOR,
  FONT_WEIGHT_OPTIONS,
  FontWeightOption,
  ScalebarColor,
  OBJLENS_OPTIONS,
  ObjlensOption,
} from "@/type/options";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAtom } from "jotai";
import {
  scalebarAtom,
  imageAtom,
  magnificationConfigAtom,
  scalebarUpdaterAtom,
  onWorkbenchIndexAtom,
} from "@/state/imageState";
import { useCallback, useMemo } from "react";

const SettingPanel = () => {
  const [{ fontSize, lineWidth, fontWeight, color }] = useAtom(scalebarAtom);
  const [loadedImages, setLoadedImages] = useAtom(imageAtom);
  const [magConf, setMagConf] = useAtom(magnificationConfigAtom);
  const [, updateScalebarConfig] = useAtom(scalebarUpdaterAtom);
  const [onWorkbenchIndex] = useAtom(onWorkbenchIndexAtom);
  const { objLens = "x200" } = useMemo(() => {
    const imageState = loadedImages?.[onWorkbenchIndex];
    if (!imageState)
      return { image: undefined, name: undefined, objLens: undefined };
    return imageState;
  }, [loadedImages, onWorkbenchIndex]);

  // 対物レンズの倍率の型であることのテスト
  const isObjLensOption = useCallback(
    (str: string): str is ObjlensOption => {
      return OBJLENS_OPTIONS.some((item) => item === str);
    },
    [OBJLENS_OPTIONS]
  );

  // 倍率の切り替え
  const handleObjLensChange = (v: string) => {
    isObjLensOption(v) &&
      setLoadedImages((prev) =>
        prev.toSpliced(onWorkbenchIndex, 1, {
          ...prev[onWorkbenchIndex],
          objLens: v,
        })
      );
  };

  // スケールバーの色の型であるかのテスト
  const isScalebarColor = useCallback(
    (str: string): str is ScalebarColor => {
      return SCALEBAR_COLOR.some((item) => item === str);
    },
    [SCALEBAR_COLOR]
  );

  // スケールバーの色の切り替え
  const handleScalebarColorChange = (v: string) => {
    isScalebarColor(v) && updateScalebarConfig({ color: "black" });
  };

  // 文字の太さの型であるかのテスト
  const isFontWeight = useCallback(
    (str: string): str is FontWeightOption => {
      return FONT_WEIGHT_OPTIONS.some((item) => item === str);
    },
    [FONT_WEIGHT_OPTIONS]
  );

  // 文字の太さの切り替え
  const handleFontWeightChange = (v: string) => {
    isFontWeight(v) && updateScalebarConfig({ fontWeight: v });
  };

  return (
    <div className="min-w-72 p-6">
      <span>倍率</span>
      <Select
        value={objLens ?? "x200"}
        onValueChange={handleObjLensChange}
        disabled={!loadedImages.length}
      >
        <SelectTrigger>
          <SelectValue placeholder="スケールバーの色" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(DEFAULT_MAGNIFICATION_CONFIG).map((item) => {
            return (
              <SelectItem value={`${item}`} key={item}>
                {item}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <Separator className="my-4" />
      <span>色</span>
      <Select value={color} onValueChange={handleScalebarColorChange}>
        <SelectTrigger>
          <SelectValue placeholder="スケールバーの色" />
        </SelectTrigger>
        <SelectContent>
          {SCALEBAR_COLOR.map((item) => {
            return (
              <SelectItem value={`${item}`} key={item}>
                {item}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <Separator className="my-4" />
      <span>スケールバーの長さ</span>
      <Input
        type="number"
        onChange={(e) =>
          setMagConf((prev) => {
            return {
              ...prev,
              [objLens]: {
                ...prev[objLens],
                length: Number(e.target.value) || 0,
              },
            };
          })
        }
        value={magConf[objLens].length}
      />
      <Separator className="my-4" />
      <span>スケールバーの太さ</span>
      <Input
        type="number"
        onChange={(e) =>
          updateScalebarConfig({ lineWidth: Number(e.target.value) || 0 })
        }
        value={lineWidth}
      />
      <Separator className="my-4" />
      <span>文字の大きさ</span>
      <Input
        type="number"
        onChange={(e) =>
          updateScalebarConfig({ fontSize: Number(e.target.value) || 0 })
        }
        value={fontSize}
      />
      <Separator className="my-4" />
      <span>文字の太さ</span>
      <Select value={fontWeight} onValueChange={handleFontWeightChange}>
        <SelectTrigger>
          <SelectValue placeholder="文字の太さ" />
        </SelectTrigger>
        <SelectContent>
          {FONT_WEIGHT_OPTIONS.map((item) => {
            return (
              <SelectItem value={`${item}`} key={item}>
                {item}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SettingPanel;
