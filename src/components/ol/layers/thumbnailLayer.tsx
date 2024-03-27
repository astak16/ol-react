import { Coordinate } from "ol/coordinate";
import { FC, useEffect, useRef } from "react";
import tinycolor from "tinycolor2";

interface ThumbnailLayerProps {
  width: number;
  height: number;
  coordinates: Coordinate[][];
  color?: string;
}

export const ThumbnailLayer: FC<ThumbnailLayerProps> = (props) => {
  const { coordinates, width, height, color } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const _coordinates = coordinates;
    const longitudesAndLatitudes = getLongitudesAndLatitudes(_coordinates);

    const scale = calcScale(longitudesAndLatitudes);
    const offset = calcOffset(longitudesAndLatitudes, scale);
    const processingCompleteCoordinates = scaleCoordinates(_coordinates, scale, offset, longitudesAndLatitudes);
    draw(processingCompleteCoordinates);
  }, [coordinates]);

  const getLongitudesAndLatitudes = (coordinates: Coordinate[][]) => {
    return coordinates[0].reduce(
      (pre, cur) => {
        pre.longitudes.push(cur[0]);
        pre.latitudes.push(cur[1]);
        return pre;
      },
      { longitudes: [] as number[], latitudes: [] as number[] }
    );
  };

  const calcScale = ({ longitudes, latitudes }: { longitudes: number[]; latitudes: number[] }) => {
    const xScale = width / Math.abs(Math.max(...longitudes) - Math.min(...longitudes));
    const yScale = height / Math.abs(Math.max(...latitudes) - Math.min(...latitudes));
    return xScale < yScale ? xScale : yScale;
  };

  const calcOffset = ({ longitudes, latitudes }: { longitudes: number[]; latitudes: number[] }, scale: number) => {
    const xOffset = (width - Math.abs(Math.max(...longitudes) - Math.min(...longitudes)) * scale) / 2;
    const yOffset = (height - Math.abs(Math.max(...latitudes) - Math.min(...latitudes)) * scale) / 2;
    return { xOffset, yOffset };
  };

  const scaleCoordinates = (
    coordinates: Coordinate[][],
    scale: number,
    offset: ReturnType<typeof calcOffset>,
    { longitudes, latitudes }: { longitudes: number[]; latitudes: number[] }
  ) => {
    return coordinates[0]
      .map((item) => {
        item[0] = item[0] - Math.min(...longitudes);
        item[1] = Math.max(...latitudes) - item[1];
        return item;
      })
      .map((item) => {
        item[0] = item[0] * scale;
        item[1] = item[1] * scale;
        return item;
      })
      .map((item) => {
        item[0] = item[0] + offset.xOffset;
        item[1] = item[1] + offset.yOffset;
        return item;
      });
  };

  const draw = (coordinates: Coordinate[]) => {
    const canvas = canvasRef.current!;
    if (!canvas.getContext) return;
    const ctx = canvas!.getContext("2d")!;

    ctx.fillStyle = tinycolor(color || "#c7c2c2")
      .setAlpha(0.3)
      .toRgbString();
    ctx.strokeStyle = color || "#c7c2c2";
    ctx.beginPath();
    ctx.moveTo(coordinates[0][0], coordinates[0][1]);
    for (let i = 1; i < coordinates.length; i++) {
      ctx.lineTo(coordinates[i][0], coordinates[i][1]);
    }
    ctx.closePath(); // 闭合
    ctx.stroke(); // 描边
    ctx.fill(); // 填充
  };
  return <canvas width={width} height={height} ref={canvasRef} />;
};
