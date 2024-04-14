import { DEFAULT_MAGNIFICATION_CONFIG } from "@/constant/config";
import {
  SCALEBAR_COLOR_OPTIONS,
  FONT_WEIGHT_OPTIONS,
  FontWeightOption,
  ScalebarColorOption,
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
  workbenchIndexAtom,
  imageUpdaterAtom,
} from "@/state/imageState";
import { useCallback, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import NumericInput from "@/components/NumericInput";

const SettingPanel = () => {
  const [{ fontSize, lineWidth, fontWeight }] = useAtom(scalebarAtom);
  const [loadedImages, setLoadedImages] = useAtom(imageAtom);
  const [magConf, setMagConf] = useAtom(magnificationConfigAtom);
  const [, updateScalebarConfig] = useAtom(scalebarUpdaterAtom);
  const [workbenchIndex] = useAtom(workbenchIndexAtom);
  const [, updateLoadedImage] = useAtom(imageUpdaterAtom);
  const { objLens = "x200", color = "white" } = useMemo(() => {
    if (workbenchIndex === undefined || !loadedImages?.[workbenchIndex])
      return {
        image: undefined,
        name: undefined,
        objLens: undefined,
        color: undefined,
      };
    return loadedImages[workbenchIndex];
  }, [loadedImages, workbenchIndex]);

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
      setLoadedImages((prev) => {
        if (workbenchIndex === undefined) return prev;
        return prev.toSpliced(workbenchIndex, 1, {
          ...prev[workbenchIndex],
          objLens: v,
        });
      });
  };

  // スケールバーの色の型であるかのテスト
  const isScalebarColor = useCallback(
    (str: string): str is ScalebarColorOption => {
      return SCALEBAR_COLOR_OPTIONS.some((item) => item === str);
    },
    [SCALEBAR_COLOR_OPTIONS]
  );

  // スケールバーの色の切り替え
  const handleScalebarColorChange = (v: string) => {
    isScalebarColor(v) &&
      workbenchIndex !== undefined &&
      updateLoadedImage(workbenchIndex, { color: v });
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
    <div className="min-w-72 p-6 h-screen">
      <ScrollArea className="h-[calc(100vh-3rem-40px)]">
        <div className="mx-1">
          <div>倍率</div>
          <Select
            value={objLens ?? "x200"}
            onValueChange={handleObjLensChange}
            disabled={workbenchIndex === undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="倍率" />
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

          <div>色</div>
          <Select
            value={color}
            onValueChange={handleScalebarColorChange}
            disabled={workbenchIndex === undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="スケールバーの色" />
            </SelectTrigger>
            <SelectContent>
              {SCALEBAR_COLOR_OPTIONS.map((item) => {
                return (
                  <SelectItem value={`${item}`} key={item}>
                    {item}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <Separator className="my-4" />

          <div>スケールバーの長さ</div>
          <div className="flex gap-3">
            <NumericInput
              outerState={magConf[objLens].length}
              setState={(value: number) => {
                setMagConf((prev) => {
                  return {
                    ...prev,
                    [objLens]: {
                      ...prev[objLens],
                      length: value,
                    },
                  };
                });
              }}
              disabled={workbenchIndex === undefined}
            />
            <div className="flex items-center">um</div>
          </div>

          <Separator className="my-4" />

          <div>スケールバーの太さ</div>
          <div className="flex gap-3">
            <NumericInput
              setState={(value) =>
                updateScalebarConfig({
                  lineWidth: value,
                })
              }
              outerState={lineWidth}
              disabled={workbenchIndex === undefined}
            />
            <div className="flex items-center">px</div>
          </div>

          <Separator className="my-4" />

          <div>文字の大きさ</div>
          <div className="flex gap-3">
            <NumericInput
              setState={(value) => updateScalebarConfig({ fontSize: value })}
              outerState={fontSize}
              disabled={workbenchIndex === undefined}
            />
            <div className="flex items-center">px</div>
          </div>

          <Separator className="my-4" />

          <div>文字の太さ</div>
          <Select
            value={fontWeight}
            onValueChange={handleFontWeightChange}
            disabled={workbenchIndex === undefined}
          >
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
      </ScrollArea>
    </div>
  );
};

export default SettingPanel;
