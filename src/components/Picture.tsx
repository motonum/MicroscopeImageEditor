import { useMeasure } from "@react-hookz/web";
import Konva from "konva";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Layer, Stage, Image, Group, Text, Line } from "react-konva";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { scalebarAtom, scalebarUpdaterAtom } from "@/state/imageState";
import { useAtom } from "jotai";

type Props = {
  image?: HTMLImageElement;
  microScaleLength: number;
  dpm: number;
  className?: string;
  downloadable?: boolean;
  draggable?: boolean;
};

const Picture: React.FC<Props> = ({
  image,
  microScaleLength,
  dpm,
  className = "",
  downloadable = false,
  draggable = false,
}) => {
  const [measurements, canvasContainerRef] = useMeasure<HTMLDivElement>();
  const imageRef = useRef<Konva.Image>(null);
  const scalebarGroupRef = useRef<Konva.Group>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const scaleTextRef = useRef<Konva.Text>(null);
  const [imageWidth, setImageWidth] = useState<number>(1920);
  const [imageHeight, setImageHeight] = useState<number>(1200);
  const [
    { fontSize, lineWidth, fontWeight, color, scalebarPosX, scalebarPosY },
  ] = useAtom(scalebarAtom);
  const [, updateScalebarConfig] = useAtom(scalebarUpdaterAtom);

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
    link.download = "test.jpg";
    link.click();
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
  const getDisplayScalebarLength = useCallback(
    () => microScaleLength * dpm * 1e-6, // um単位であるため
    [dpm, microScaleLength]
  );

  // 文字も含めたスケールバーの幅
  const scalebarGroupWidth = useMemo(() => {
    return Math.max(
      calcTextWidth(`${microScaleLength}um`, fontSize) || 0,
      getDisplayScalebarLength()
    );
  }, [calcTextWidth, microScaleLength, fontSize, getDisplayScalebarLength]);

  // 文字も含めたスケールバーの高さ
  const scalebarGroupHeight = useMemo(() => {
    return fontSize + lineWidth;
  }, [fontSize, lineWidth]);

  // スケールバーのテキストの横幅
  const scaleTextWidth = useMemo(() => {
    return calcTextWidth(`${microScaleLength}um`, fontSize) || 0;
  }, [calcTextWidth, microScaleLength, fontSize]);

  // スケールバーの横幅
  const drawnScalebarLength = useMemo(() => {
    return getDisplayScalebarLength();
  }, [getDisplayScalebarLength]);

  // 画像の縦横の寸法を取得
  useEffect(() => {
    if (!image) return;
    setImageHeight(image.naturalHeight);
    setImageWidth(image.naturalWidth);
  }, [image]);

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
  }, [scalebarGroupRef, image]);

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
    image,
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
    if (x !== undefined && y !== undefined)
      updateScalebarConfig({
        scalebarPosX: imageWidth - (x + scalebarGroupWidth),
        scalebarPosY: imageHeight - (y + scalebarGroupHeight),
      });
  }, [image, scalebarGroupRef, fontSize, lineWidth, scalebarGroupWidth]);

  return (
    <ContextMenu>
      <ContextMenuTrigger disabled={!downloadable}>
        <div
          ref={canvasContainerRef}
          className={`m-6 p-0 ${className}`}
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
                image={image}
                ref={imageRef}
                width={imageWidth}
                height={imageHeight}
              />
            </Layer>
            {image && (
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
                    text={`${microScaleLength}um`}
                    fontSize={fontSize}
                    x={(scalebarGroupWidth - scaleTextWidth) / 2}
                    y={0}
                    fill={
                      color === "black"
                        ? "#000000"
                        : color === "white"
                        ? "#ffffff"
                        : "#ffffff"
                    }
                    wrap="none"
                    ref={scaleTextRef}
                    fontStyle={fontWeight}
                  />
                  <Line
                    x={(scalebarGroupWidth - drawnScalebarLength) / 2}
                    y={fontSize + lineWidth / 2}
                    points={[0, 0, drawnScalebarLength, 0]}
                    stroke={
                      color === "black"
                        ? "#000000"
                        : color === "white"
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
};

export default Picture;
