import {
  SCALEBAR_COLOR_OPTIONS,
  FONT_WEIGHT_OPTIONS,
  FontWeightOption,
  ScalebarColorOption,
  ObjlensOption,
  UPRIGHT_OBJLENS_OPTIONS,
  INVERTED_OBJLENS_OPTIONS,
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
  imageAtom,
  selectedIdAtom,
  imageUpdaterAtom,
  selectedImageAtom,
} from "@/state/imageState";
import {
  scalebarAtom,
  scalebarUpdaterAtom,
  scalebarLengthAtom,
  scalebarLengthUpdaterAtom,
} from "@/state/scalebarState";
import { useCallback, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import NumericInput from "@/components/NumericInput";
import { updateObject } from "@/util/updateObject";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getScalebarLength,
  isInvertedObjlensOption,
  isMicroscopeType,
  isSafeLoadedImage,
  isUprightObjlensOption,
} from "@/Modules/Magnification";
import ColorSelector from "@/components/ColorSelector";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DEFAULT_SCALEBAR_LENGTH, DEFAULT_SCALEBAR_STATE } from "@/constant/config";

const SettingPanel = () => {
  const [scalebarConfig] = useAtom(scalebarAtom);
  const [, setLoadedImages] = useAtom(imageAtom);
  const [, updateScalebarConfig] = useAtom(scalebarUpdaterAtom);
  const [selectedId] = useAtom(selectedIdAtom);
  const [, updateLoadedImage] = useAtom(imageUpdaterAtom);
  const [scalebarLength] = useAtom(scalebarLengthAtom);
  const [, updateScalebarLength] = useAtom(scalebarLengthUpdaterAtom);
  const [selectedImage] = useAtom(selectedImageAtom);
  const {
    objLens = "x200",
    scalebarColor = "white",
    microscopeType = "upright",
    scalebarBackground = false,
  } = useMemo(() => {
    if (!selectedImage)
      return {
        objLens: undefined,
        scalebarColor: undefined,
        microscopeType: undefined,
        scalebarBackground: undefined,
      };
    return selectedImage;
  }, [selectedImage]);

  // 対物レンズの倍率の型であることのテスト
  const isObjLensOption = useCallback(
    (str: string): str is ObjlensOption => {
      return [...UPRIGHT_OBJLENS_OPTIONS, ...INVERTED_OBJLENS_OPTIONS].some(
        (item) => item === str
      );
    },
    [UPRIGHT_OBJLENS_OPTIONS, INVERTED_OBJLENS_OPTIONS]
  );

  // 倍率の切り替え
  const handleObjLensChange = (v: string) => {
    isObjLensOption(v) &&
      setLoadedImages((prev) => {
        if (selectedId === undefined) return prev;
        return prev.map((item) => {
          if (item.id !== selectedId) return item;
          const newItem = {
            ...item,
            objLens: v,
          };
          if (isSafeLoadedImage(newItem)) return newItem;
          else return item;
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
      selectedId !== undefined &&
      updateLoadedImage({ scalebarColor: v }, selectedId);
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
    if (isFontWeight(v)) {
      localStorage.setItem(
        "scalebar",
        JSON.stringify(updateObject(scalebarConfig, { fontWeight: v }))
      );
      updateScalebarConfig({ fontWeight: v });
    }
  };

  const handleMicroscopeTypeChange = useCallback(
    (sid: Symbol | undefined, objLens: ObjlensOption) => (e: string) => {
      if (sid) {
        if (!isMicroscopeType(e)) return;
        if (e === "upright") {
          updateLoadedImage(
            {
              microscopeType: e,
              objLens: isUprightObjlensOption(objLens) ? objLens : "x200",
            },
            sid
          );
        }
        if (e === "inverted") {
          updateLoadedImage(
            {
              microscopeType: e,
              objLens: isInvertedObjlensOption(objLens) ? objLens : "x200",
            },
            sid
          );
        }
      }
    },
    [
      isMicroscopeType,
      updateLoadedImage,
      isUprightObjlensOption,
      isInvertedObjlensOption,
    ]
  );

  return (
    <div className="w-72 p-6 h-full flex-grow-0 flex-shrink-0">
      <ScrollArea className="h-full">
        <div className="mx-1">
          <Tabs
            value={microscopeType}
            onValueChange={handleMicroscopeTypeChange(selectedId, objLens)}
          >
            <TabsList className="w-full">
              <TabsTrigger
                value="upright"
                className="flex-grow"
                disabled={selectedId === undefined}
              >
                正立顕微鏡
              </TabsTrigger>
              <TabsTrigger
                value="inverted"
                className="flex-grow"
                disabled={selectedId === undefined}
              >
                倒立顕微鏡
              </TabsTrigger>
            </TabsList>

            <Separator className="my-2 invisible" />

            <div>倍率</div>

            <TabsContent value="upright">
              <Select
                value={objLens ?? "x200"}
                onValueChange={handleObjLensChange}
                disabled={selectedId === undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder="倍率" />
                </SelectTrigger>
                <SelectContent>
                  {UPRIGHT_OBJLENS_OPTIONS.map((item) => {
                    return (
                      <SelectItem value={`${item}`} key={item}>
                        {item}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </TabsContent>

            <TabsContent value="inverted">
              <Select
                value={objLens ?? "x200"}
                onValueChange={handleObjLensChange}
                disabled={selectedId === undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder="倍率" />
                </SelectTrigger>
                <SelectContent>
                  {INVERTED_OBJLENS_OPTIONS.map((item) => {
                    return (
                      <SelectItem value={`${item}`} key={item}>
                        {item}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </TabsContent>
          </Tabs>

          <Separator className="my-4" />

          <div>色合成</div>
          <Separator className="my-1 invisible" />
          <ColorSelector />

          <Separator className="my-4" />

          <div>スケールバーの色</div>
          <Select
            value={scalebarColor}
            onValueChange={handleScalebarColorChange}
            disabled={selectedId === undefined}
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

          {/* スケールバーの背景 */}
          <Separator className="my-2 invisible" />
          <div className="flex">
            <Checkbox
              id="bg_toggle"
              disabled={selectedId === undefined}
              checked={scalebarBackground}
              onCheckedChange={(e) => {
                selectedId &&
                  updateLoadedImage({ scalebarBackground: !!e }, selectedId);
              }}
            />
            <Label htmlFor="bg_toggle" className="cursor-pointer pl-2">
              背景
            </Label>
          </div>

          <Separator className="my-4" />

          <div>スケールバーの長さ</div>
          <div className="flex gap-3">
            <NumericInput
              outerState={getScalebarLength(
                scalebarLength,
                microscopeType,
                objLens
              )}
              setOuterState={(value: number) => {
                updateScalebarLength(microscopeType, objLens, value);
              }}
              disabled={selectedId === undefined}
              rejectNegative
              defaultValue={getScalebarLength(
                DEFAULT_SCALEBAR_LENGTH,
                microscopeType,
                objLens
              )}
            />
            <div className="flex items-center">um</div>
          </div>

          <Separator className="my-4" />

          <div>スケールバーの太さ</div>
          <div className="flex gap-3">
            <NumericInput
              setOuterState={(value) => {
                localStorage.setItem(
                  "scalebar",
                  JSON.stringify(
                    updateObject(scalebarConfig, { lineWidth: value })
                  )
                );
                updateScalebarConfig({
                  lineWidth: value,
                });
              }}
              outerState={scalebarConfig.lineWidth}
              disabled={selectedId === undefined}
              rejectNegative
              defaultValue={DEFAULT_SCALEBAR_STATE.lineWidth}
            />
            <div className="flex items-center">px</div>
          </div>

          <Separator className="my-4" />

          <div>文字の大きさ</div>
          <div className="flex gap-3">
            <NumericInput
              setOuterState={(value) => {
                localStorage.setItem(
                  "scalebar",
                  JSON.stringify(
                    updateObject(scalebarConfig, { fontSize: value })
                  )
                );
                updateScalebarConfig({ fontSize: value });
              }}
              outerState={scalebarConfig.fontSize}
              disabled={selectedId === undefined}
              rejectNegative
              defaultValue={DEFAULT_SCALEBAR_STATE.fontSize}
            />
            <div className="flex items-center">px</div>
          </div>

          <Separator className="my-4" />

          <div>文字の太さ</div>
          <Select
            value={scalebarConfig.fontWeight}
            onValueChange={handleFontWeightChange}
            disabled={selectedId === undefined}
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
