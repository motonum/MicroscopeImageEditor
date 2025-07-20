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
import { Layer, Stage, Image, Group, Text, Line, Rect } from "react-konva";
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
import { DEFAULT_SCALEBAR_BACKGROUND_PADDING } from "@/constant/config";

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
      scalebarBackground = false,
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
          scalebarBackground: undefined,
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
    const [
      displayScalebarLength,
      scalebarGroupWidth,
      scalebarGroupHeight,
      scaleTextWidth,
    ] = useMemo(
      () => {
        const dispSclLen =
          getScalebarLength(scalebarLength, microscopeType, objLens) *
          getDPMConfig(microscopeType, objLens) *
          1e-6;

        const sclGrpWid =
          Math.max(
            calcTextWidth(
              `${getScalebarLength(scalebarLength, microscopeType, objLens)}um`,
              fontSize
            ) || 0,
            dispSclLen
          ) +
          (scalebarBackground ? DEFAULT_SCALEBAR_BACKGROUND_PADDING * 2 : 0);

        const sclGrpHeit =
          fontSize +
          lineWidth +
          (scalebarBackground ? DEFAULT_SCALEBAR_BACKGROUND_PADDING * 2 : 0);

        const sclTxtWid =
          calcTextWidth(
            `${getScalebarLength(scalebarLength, microscopeType, objLens)}um`,
            fontSize
          ) || 0;
        return [dispSclLen, sclGrpWid, sclGrpHeit, sclTxtWid];
      }, // um単位であるため
      [
        getScalebarLength,
        getDPMConfig,
        scalebarLength,
        microscopeType,
        objLens,
        fontSize,
        lineWidth,
        scalebarBackground,
      ]
    );

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
          (imageHeight || 1200) - scalebarGroupHeight
        )
      );
    }, [
      originImage,
      imageWidth,
      imageHeight,
      scalebarGroupRef,
      scalebarGroupWidth,
      scalebarGroupHeight,
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
              scalebarPosX: imageWidth - (x + scalebarGroupWidth / 2),
              scalebarPosY: imageHeight - (y + scalebarGroupHeight / 2),
            })
          )
        );
        updateScalebarConfig({
          scalebarPosX: imageWidth - (x + scalebarGroupWidth / 2),
          scalebarPosY: imageHeight - (y + scalebarGroupHeight / 2),
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
                    x={imageWidth - (scalebarPosX + scalebarGroupWidth / 2)}
                    y={imageHeight - (scalebarPosY + scalebarGroupHeight / 2)}
                    draggable={draggable}
                    ref={scalebarGroupRef}
                    height={scalebarGroupHeight}
                    width={scalebarGroupWidth}
                    onDragMove={handleDragMove}
                    onDragEnd={handleDragEnd}
                  >
                    {scalebarBackground && (
                      <Rect
                        x={0}
                        y={0}
                        height={scalebarGroupHeight}
                        width={scalebarGroupWidth}
                        fill={
                          scalebarColor === "black"
                            ? "#ffffff"
                            : scalebarColor === "white"
                            ? "#000000"
                            : "#ffffff"
                        }
                      />
                    )}
                    <Text
                      text={`${getScalebarLength(
                        scalebarLength,
                        microscopeType,
                        objLens
                      )}um`}
                      fontSize={fontSize}
                      x={(scalebarGroupWidth - scaleTextWidth) / 2}
                      y={
                        scalebarBackground
                          ? DEFAULT_SCALEBAR_BACKGROUND_PADDING
                          : 0
                      }
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
                      y={
                        scalebarGroupHeight -
                        lineWidth / 2 -
                        (scalebarBackground
                          ? DEFAULT_SCALEBAR_BACKGROUND_PADDING
                          : 0)
                      }
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
