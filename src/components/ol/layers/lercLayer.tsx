import { FC, useEffect, useMemo } from "react";
import { XYZ } from "ol/source";
import TileLayer from "ol/layer/Tile";
import { useMap } from "../hooks/useMap";
import * as Lerc from "lerc";
import TileState from "ol/TileState";
import { useMount, useUnmount } from "../hooks/useMount";
import { LercLayerIndex } from "../shared/layerIndex";
import { Fill, Style } from "ol/style";
import MultiPolygon from "ol/geom/MultiPolygon";
import { getVectorContext } from "ol/render";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJsonObject } from "../geojson/index";
import { useGeojsonSource } from "../hooks/useGeojson";
import RenderEvent from "ol/render/Event";
import { useEvent } from "../hooks/useEvent";

export type GradientType = "exponential" | "interval";

type IntervalStops = [number, string][];
type ExponentialStops = [number, number, string, string][];

type IStops = [number, number[]][];
type EStops = [number, number, number[], number[]][];

interface Props {
  url: string;
  zIndex?: number;
  stops: IntervalStops | ExponentialStops;
  gradientType: GradientType;
  token?: string;
  maxZoom?: number;
  minZoom?: number;
  maskData?: GeoJsonObject;
  id?: string;
}

export const LercLayer: FC<Props> = (props) => {
  const {
    id = "mask-layer",
    url,
    maskData,
    zIndex = LercLayerIndex,
    stops: _stops,
    gradientType,
    token,
    maxZoom,
    minZoom,
  } = props;

  const { layer, source } = useTileLayer({ zIndex, url, maxZoom, minZoom });
  const stops = useStops({ stops: _stops, gradientType });
  const tileLoadFunction = useTileLoadFunction({ stops, gradientType, token });

  const { layer: geojsonLayer } = useGeojsonLayer({ id, geojson: maskData });
  useCropping(layer, geojsonLayer, !!maskData);

  useEffect(() => {
    if (!zIndex) return;
    layer.setZIndex(zIndex);
  }, [zIndex]);

  useEffect(() => {
    if (!url || !stops) return;
    source.setUrl(url);
    source.refresh();
  }, [url, stops]);

  useEffect(() => {
    if (source) {
      source.setTileLoadFunction(tileLoadFunction);
    }
  }, [source, tileLoadFunction]);

  return <></>;
};

const useGeojsonLayer = ({ id, geojson }: { id: string; geojson?: GeoJsonObject }) => {
  const source = useMemo(() => new VectorSource({ features: useGeojsonSource("EPSG:4326", geojson) }), []);
  const layer = useMemo(() => {
    const layer = new VectorLayer({ source });
    layer.set("$$eventProxy", id);
    return layer;
  }, [source]);
  return { source, layer } as {
    source: VectorSource;
    layer: VectorLayer<VectorSource>;
  };
};

const useTileLayer = ({
  zIndex,
  url,
  maxZoom,
  minZoom,
}: {
  zIndex: number;
  url: string;
  maxZoom?: number;
  minZoom?: number;
}) => {
  const map = useMap();

  const source = useMemo(
    () => new XYZ({ url, projection: map.getView().getProjection().getCode(), maxZoom, minZoom }),
    []
  );
  const layer = useMemo(() => new TileLayer({ source, zIndex, visible: true }), []);
  useMount(() => map.addLayer(layer));
  useUnmount(() => map.removeLayer(layer));
  return { layer, source };
};

const useTileLoadFunction = ({
  stops,
  gradientType,
  token,
}: {
  stops: IStops | EStops;
  gradientType: GradientType;
  token?: string;
}) => {
  const lercNoDataValue = 0;

  return useMemo(
    () => (tile: any, src: string) => {
      (async () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        try {
          await Lerc.load({
            locateFile: () => {
              return `/lerc-wasm.wasm`;
            },
          });
          const config = token ? { headers: { token } } : {};
          const arrayBuffer = await fetch(src, config).then((response) => {
            if (response.status === 200) {
              return response.arrayBuffer();
            }
            return new ArrayBuffer(0);
          });
          if (arrayBuffer.byteLength <= 0) return (tile.getImage().src = "");

          const image = Lerc.decode(arrayBuffer);
          canvas.width = image.width;
          canvas.height = image.height;
          const imgData = ctx.createImageData(image.width, image.width); // 按照给的切片大小，To create a new, blank ImageData object

          const pixels = image.pixels[0]; // 取到像素值，Uint16Array 数组 [0~255],RGBA 像素值
          if (gradientType === "interval") {
            let j = 0;
            for (let i = 0; i < pixels.length; i++) {
              const pixel = pixels[i];
              let rgba = [0, 0, 0, 0];
              let its = (stops as IStops).find((item) => item[0] === pixel);
              if (its) {
                rgba = its[1];
              }
              imgData.data[j] = rgba[0]; // r
              imgData.data[j + 1] = rgba[1]; // g
              imgData.data[j + 2] = rgba[2]; // b
              imgData.data[j + 3] = pixel === 0 ? lercNoDataValue : rgba[3] * 255; // a
              j += 4;
            }
          } else {
            let j = 0;
            for (let i = 0; i < pixels.length; i++) {
              const pixel = pixels[i];
              let rgba = [0, 0, 0, 0];
              let items = (stops as EStops).find((item) => pixel >= item[0] && pixel < item[1]);
              if (items) {
                const factor = (pixel - items[0]) / (items[1] - items[0]); // 计算该值在两边界值中间的比例
                const colors1 = items[2];
                const colors2 = items[3];
                rgba[0] = colors2[0] + Math.round((colors1[0] - colors2[0]) * factor); // 通过比例计算中间值颜色
                rgba[1] = colors2[1] + Math.round((colors1[1] - colors2[1]) * factor);
                rgba[2] = colors2[2] + Math.round((colors1[2] - colors2[2]) * factor);
                rgba[3] = Math.abs(colors2[3] + colors1[3]) / 2;
              }
              imgData.data[j] = rgba[0]; // r
              imgData.data[j + 1] = rgba[1]; // g
              imgData.data[j + 2] = rgba[2]; // b
              imgData.data[j + 3] = pixel === 0 ? lercNoDataValue : rgba[3] * 255; // a
              j += 4;
            }
          }
          ctx.putImageData(imgData, 0, 0);
          // @ts-ignore
          tile.getImage().src = canvas.toDataURL();
        } catch (e) {
          // 如果不catch 必须都进行赋值像素值
          tile.setState(TileState.ERROR);
          const imgData = ctx.createImageData(256, 256);
          ctx.putImageData(imgData, 0, 0);
          // @ts-ignore
          tile.getImage().src = canvas.toDataURL();
        }
      })();
    },
    [stops, gradientType]
  );
};

const useStops = ({ stops, gradientType }: { stops: IntervalStops | ExponentialStops; gradientType: GradientType }) => {
  const reg = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
  return (
    gradientType === "interval"
      ? useMemo(() => {
          return (stops as IntervalStops).map((item) => {
            const color = item[1];
            return [item[0], reg.test(color) ? hexToRgba(color) : color.match(/\d+/g)?.map(Number) || [0, 0, 0, 0]];
          });
        }, [gradientType, stops])
      : useMemo(() => {
          return (stops as ExponentialStops).map((item) => {
            const color = item[2];
            const color2 = item[3];
            return [
              item[0],
              item[1],
              reg.test(color) ? hexToRgba(color) : color.match(/\d+/g)?.map(Number) || [0, 0, 0, 0],
              reg.test(color2) ? hexToRgba(color2) : color2.match(/\d+/g)?.map(Number) || [0, 0, 0, 0],
            ];
          });
        }, [gradientType, stops])
  ) as IStops | EStops;
};

function hexToRgba(match: string, alpha: number = 1) {
  //如果是三位数的颜色值，就扩展成六位数
  if (match.length === 4) {
    match = match.replace(/([0-9a-fA-F])/g, "$1$1");
  }
  //将16进制转换成10进制
  const r = parseInt("0x" + match.slice(1, 3));
  const g = parseInt("0x" + match.slice(3, 5));
  const b = parseInt("0x" + match.slice(5, 7));
  return [r, g, b, alpha];
}

function useCropping(tileLayer: TileLayer<XYZ>, vectorLayer: VectorLayer<VectorSource>, isMask: boolean = false) {
  const prerenderEvent = useEvent((e: RenderEvent) => {
    const polygons: any = [];
    const vectorContext = getVectorContext(e);
    const style = new Style({
      fill: new Fill({
        color: "rgba(0,0,0,0)",
      }),
    });
    if (e && e.context) {
      vectorLayer.getSource()?.forEachFeature(function (feature) {
        const geometry = feature.getGeometry();
        const type = geometry?.getType();
        if (type === "Polygon") {
          // @ts-ignore
          polygons.push(geometry?.getCoordinates());
        } else if (type === "MultiPolygon") {
          // @ts-ignore
          Array.prototype.push.apply(polygons, geometry?.getCoordinates());
        }
      });
      if (!(e.context instanceof CanvasRenderingContext2D)) return;
      e.context.globalCompositeOperation = "source-over";
      const ctx = e.context;
      ctx.save();
      vectorContext.setStyle(style);
      vectorContext.drawGeometry(new MultiPolygon(polygons)); // 可以对边界设置一个样式
      ctx.clip();
      tileLayer.setExtent(new MultiPolygon(polygons).getExtent());
    }
  });
  const postRenderEvent = useEvent((event: RenderEvent) => {
    const ctx = event.context;
    if (ctx instanceof CanvasRenderingContext2D) ctx.restore();
  });

  useEffect(() => {
    isMask && init();
  }, [isMask]);

  const init = () => {
    tileLayer.on("prerender", prerenderEvent);
    tileLayer.on("postrender", postRenderEvent);
  };

  useUnmount(() => {
    tileLayer.un("prerender", prerenderEvent);
    tileLayer.un("postrender", postRenderEvent);
  });
}
