import { useMeasure } from "@react-hookz/web";
import Konva from "konva";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Layer, Stage, Image, Group, Text, Line } from "react-konva";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  imageAtom,
  scalebarAtom,
  scalebarLengthAtom,
  scalebarUpdaterAtom,
} from "@/state/imageState";
import { useAtom } from "jotai";
import { ExecDownloadRef } from "@/type/execDownloadRef";
import { updateObject } from "@/util/updateObject";
import { getDPMConfig } from "@/util/getDPMConfig";
import { getScalebarLength } from "@/util/getScalebarLength";

type Props = {
  imageId?: Symbol;
  className?: string;
  downloadable?: boolean;
  draggable?: boolean;
};

const Picture = forwardRef<ExecDownloadRef, Props>(
  (
    { imageId, className = "", downloadable = false, draggable = false },
    ref
  ) => {
    const [measurements, canvasContainerRef] = useMeasure<HTMLDivElement>();
    const imageRef = useRef<Konva.Image>(null);
    const scalebarGroupRef = useRef<Konva.Group>(null);
    const scaleTextRef = useRef<Konva.Text>(null);
    const [imageWidth, setImageWidth] = useState<number>(0);
    const [imageHeight, setImageHeight] = useState<number>(0);
    const [loadedImages] = useAtom(imageAtom);
    const stageRef = useRef<Konva.Stage>(null);
    const [scalebarConfig] = useAtom(scalebarAtom);
    const [scalebarLength] = useAtom(scalebarLengthAtom);
    const { fontSize, lineWidth, fontWeight, scalebarPosX, scalebarPosY } =
      scalebarConfig;
    const [, updateScalebarConfig] = useAtom(scalebarUpdaterAtom);

    const {
      editedImage,
      originImage,
      name = "noname",
      objLens = "x200",
      scalebarColor = "white",
      microscopeType = "upright",
    } = useMemo(() => {
      const image = loadedImages.find((element) => element.id === imageId);
      if (imageId === undefined || !image)
        return {
          editedImage: undefined,
          originImage: undefined,
          name: undefined,
          objLens: undefined,
          scalebarColor: undefined,
          microscopeType: undefined,
          imageColor: undefined,
        };
      return image;
    }, [loadedImages, imageId]);

    useImperativeHandle(ref, () => {
      return {
        execDownload: () => {
          execDownload();
        },
      };
    });

    // 拡大倍率
    const scale = useMemo(() => {
      const parentWidth = measurements?.width;
      if (!parentWidth || !imageWidth) return 1;
      return parentWidth / imageWidth;
    }, [measurements?.width, imageWidth]);

    // ダウンロードする関数
    const execDownload = () => {
      const uri =
        stageRef?.current?.toDataURL({ pixelRatio: 1 / scale }) || undefined;
      if (!uri) {
        return;
      }
      const link = window.document.createElement("a");
      link.href = uri;
      link.download = name;
      link.style.display = "none";
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    };

    // テキストを描画したときの幅を取得する関数
    const calcTextWidth = useCallback((text: string, fontSize: number) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.font = `${fontSize}px arial`;
      return ctx.measureText(text).width;
    }, []);

    // 画像上のスケールバーの長さの計算関数
    const displayScalebarLength = useMemo(
      () =>
        getScalebarLength(scalebarLength, microscopeType, objLens) *
        getDPMConfig(microscopeType, objLens) *
        1e-6, // um単位であるため
      [getScalebarLength, getDPMConfig, scalebarLength, microscopeType, objLens]
    );

    // 文字も含めたスケールバーの幅
    const scalebarGroupWidth = useMemo(() => {
      return Math.max(
        calcTextWidth(
          `${getScalebarLength(scalebarLength, microscopeType, objLens)}um`,
          fontSize
        ) || 0,
        displayScalebarLength
      );
    }, [
      displayScalebarLength,
      calcTextWidth,
      scalebarLength,
      fontSize,
      objLens,
      microscopeType,
    ]);

    // 文字も含めたスケールバーの高さ
    const scalebarGroupHeight = useMemo(() => {
      return fontSize + lineWidth;
    }, [fontSize, lineWidth]);

    // スケールバーのテキストの横幅
    const scaleTextWidth = useMemo(() => {
      return (
        calcTextWidth(
          `${getScalebarLength(scalebarLength, microscopeType, objLens)}um`,
          fontSize
        ) || 0
      );
    }, [
      calcTextWidth,
      getScalebarLength,
      scalebarLength,
      microscopeType,
      objLens,
      fontSize,
    ]);

    // 画像の縦横の寸法を取得
    useEffect(() => {
      if (!originImage) return;
      setImageHeight(originImage.naturalHeight);
      setImageWidth(originImage.naturalWidth);
    }, [originImage]);

    // スケールバーをドラッグで動かすときにカーソルを十字の矢印に変える
    useEffect(() => {
      if (!draggable) return;
      scalebarGroupRef.current?.on("mouseover", () => {
        document.body.style.cursor = "move";
      });
      scalebarGroupRef.current?.on("mouseout", () => {
        document.body.style.cursor = "auto";
      });
      return () => {
        scalebarGroupRef.current?.off("mouseover");
        scalebarGroupRef.current?.off("mouseout");
      };
    }, [scalebarGroupRef, editedImage]);

    // ドラッグ操作中のハンドリング
    const handleDragMove = useCallback(() => {
      scalebarGroupRef.current?.x(
        Math.min(
          Math.max(scalebarGroupRef.current?.x(), 0),
          (imageWidth || 1920) - scalebarGroupWidth
        )
      );
      scalebarGroupRef.current?.y(
        Math.min(
          Math.max(scalebarGroupRef.current?.y(), 0),
          (imageHeight || 1200) - (fontSize + lineWidth)
        )
      );
    }, [
      originImage,
      imageWidth,
      imageHeight,
      scalebarGroupRef,
      fontSize,
      lineWidth,
      scalebarGroupWidth,
    ]);

    // ドラッグ操作後のハンドリング
    const handleDragEnd = useCallback(() => {
      const x = scalebarGroupRef.current?.x();
      const y = scalebarGroupRef.current?.y();
      if (x !== undefined && y !== undefined) {
        localStorage.setItem(
          "scalebar",
          JSON.stringify(
            updateObject(scalebarConfig, {
              scalebarPosX: imageWidth - (x + scalebarGroupWidth),
              scalebarPosY: imageHeight - (y + scalebarGroupHeight),
            })
          )
        );
        updateScalebarConfig({
          scalebarPosX: imageWidth - (x + scalebarGroupWidth),
          scalebarPosY: imageHeight - (y + scalebarGroupHeight),
        });
      }
    }, [
      editedImage,
      scalebarGroupRef,
      fontSize,
      lineWidth,
      scalebarGroupWidth,
      imageId,
      imageWidth,
      imageHeight,
    ]);

    return (
      <ContextMenu>
        <ContextMenuTrigger disabled={!downloadable}>
          <div
            ref={canvasContainerRef}
            className={className}
            style={{
              aspectRatio: `${`${imageWidth} / ${imageHeight}`}`,
            }}
          >
            <Stage
              width={measurements?.width}
              height={
                ((measurements?.width || 0) / (imageWidth || 1)) *
                (imageHeight || 0)
              }
              scale={{ x: scale, y: scale }}
              ref={stageRef}
            >
              <Layer>
                <Image
                  image={
                    microscopeType === "upright" ? originImage : editedImage
                  }
                  ref={imageRef}
                  width={imageWidth}
                  height={imageHeight}
                />
              </Layer>
              {editedImage && (
                <Layer>
                  <Group
                    x={imageWidth - (scalebarPosX + scalebarGroupWidth)}
                    y={imageHeight - (scalebarPosY + scalebarGroupHeight)}
                    draggable={draggable}
                    ref={scalebarGroupRef}
                    height={fontSize + lineWidth}
                    width={scalebarGroupWidth}
                    onDragMove={handleDragMove}
                    onDragEnd={handleDragEnd}
                  >
                    <Text
                      text={`${getScalebarLength(
                        scalebarLength,
                        microscopeType,
                        objLens
                      )}um`}
                      fontSize={fontSize}
                      x={(scalebarGroupWidth - scaleTextWidth) / 2}
                      y={0}
                      fill={
                        scalebarColor === "black"
                          ? "#000000"
                          : scalebarColor === "white"
                          ? "#ffffff"
                          : "#ffffff"
                      }
                      wrap="none"
                      ref={scaleTextRef}
                      fontStyle={fontWeight}
                    />
                    <Line
                      x={(scalebarGroupWidth - displayScalebarLength) / 2}
                      y={fontSize + lineWidth / 2}
                      points={[0, 0, displayScalebarLength, 0]}
                      stroke={
                        scalebarColor === "black"
                          ? "#000000"
                          : scalebarColor === "white"
                          ? "#ffffff"
                          : "#ffffff"
                      }
                      strokeWidth={lineWidth}
                    />
                  </Group>
                </Layer>
              )}
            </Stage>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={execDownload}>保存</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  }
);

export default Picture;
