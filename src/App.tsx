import "@/App.css";
import React, { useState, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  FONT_WEIGHT_OPTIONS,
  FontWeightOption,
  OBJLENS_OPTIONS,
  ObjlensOption,
  SCALEBAR_COLOR,
  ScalebarColor,
} from "@/type/options";
import Picture from "@/components/Picture";
import { Input } from "@/components/ui/input";
import { DEFAULT_MAGNIFICATION_CONFIG } from "@/constant/config";
import { useAtom } from "jotai";
import {
  imageState,
  onWorkbenchIndexState,
  scalebarState,
} from "@/state/imageState";
import { Scalebar } from "@/type/imageState";
import { updateObjState } from "@/util/updateObjState";
import { expectMagnification } from "@/util/expectMagnification";

const App = () => {
  // const [image, setImage] = useState<HTMLImageElement | undefined>(undefined);
  const [microScaleLength, setMicroScaleLength] = useState<number>();

  const [{ fontSize, lineWidth, fontWeight, color }, setScalebarConfig] =
    useAtom(scalebarState);

  const [images, setLoadedImage] = useAtom(imageState);

  const [onWorkbenchIndex, setOnWorkBenchIndex] = useAtom(
    onWorkbenchIndexState
  );

  // スケールバーの設定を更新する関数
  const updateScalebarConfig = (
    key: keyof Scalebar,
    value: Scalebar[keyof Scalebar]
  ) => {
    setScalebarConfig(updateObjState(key, value));
  };

  // 画像を読み込んだときのハンドラ
  const handleInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) {
      return;
    }

    const fileArray = Array.from(files);

    fileArray.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result;
        if (typeof result === "string") {
          const image = new window.Image();
          image.src = result;
          setLoadedImage([
            {
              image: image,
              name: file.name,
              objLens: expectMagnification(file.name) ?? "x200",
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // 対物レンズの倍率の型であることのテスト
  const isObjlensOption = useCallback(
    (str: string): str is ObjlensOption => {
      return OBJLENS_OPTIONS.some((item) => item === str);
    },
    [OBJLENS_OPTIONS]
  );

  // スケールバーが表す長さ
  const getScaleLength = () => {
    const objlens = images?.[0]?.objLens;
    if (!objlens || !isObjlensOption(objlens)) {
      return 0;
    }
    return DEFAULT_MAGNIFICATION_CONFIG[objlens].LENGTH;
  };

  // 現在選択されている倍率におけるdots per meterを返す
  const getDPM = () => {
    const objlens = images?.[0]?.objLens;
    if (!objlens || !isObjlensOption(objlens)) {
      return DEFAULT_MAGNIFICATION_CONFIG["x200"].LENGTH;
    }
    return DEFAULT_MAGNIFICATION_CONFIG[objlens].DPM;
  };

  // 倍率の切り替え
  const handleObjlensChange = (v: string) => {
    isObjlensOption(v) &&
      setLoadedImage((prev) =>
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
    isScalebarColor(v) && updateScalebarConfig("color", "black");
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
    isFontWeight(v) && updateScalebarConfig("fontWeight", v);
  };

  return (
    <>
      <div className="flex min-h-screen">
        <div className="min-w-72 p-6">
          <span>倍率</span>
          <Select
            value={images?.[onWorkbenchIndex]?.objLens ?? "x200"}
            onValueChange={handleObjlensChange}
            disabled={!images.length}
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
            onChange={(e) => setMicroScaleLength(Number(e.target.value) || 0)}
            value={microScaleLength ?? getScaleLength()}
          />
          <Separator className="my-4" />
          <span>スケールバーの太さ</span>
          <Input
            type="number"
            onChange={(e) =>
              updateScalebarConfig("lineWidth", Number(e.target.value) || 0)
            }
            value={lineWidth}
          />
          <Separator className="my-4" />
          <span>文字の大きさ</span>
          <Input
            type="number"
            onChange={(e) =>
              updateScalebarConfig("fontSize", Number(e.target.value) || 0)
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
        <div className="grow min-w-0">
          <Input
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleInputFile}
            className="max-w-2xl m-6"
          />
          <Picture
            image={images?.[onWorkbenchIndex]?.image}
            microScaleLength={microScaleLength || getScaleLength()}
            fontSize={fontSize}
            scalebarColor={color}
            dpm={getDPM()}
            lineWidth={lineWidth}
            className="max-w-2xl"
            fontWeight={fontWeight}
            downloadable
            draggable
          />
        </div>
      </div>
    </>
  );
};

export default App;
