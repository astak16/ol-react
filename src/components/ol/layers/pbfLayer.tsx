import { FC, useEffect, useMemo, useRef } from "react";
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from "ol/source/VectorTile";
import { Style } from "ol/style";
import MVT from "ol/format/MVT";
import { useEvent } from "../hooks/useEvent";
import { useMap } from "../hooks/useMap";
import { useMount, useUnmount } from "../hooks/useMount";
import { FeatureLike } from "ol/Feature";
import { StyleFnType } from "../types/styled";
import { Extent } from "ol/extent";
import Projection from "ol/proj/Projection";
import { defaultHoverStyle, defaultStyle } from "../style";
import { PbfLayerIndex } from "../shared/layerIndex";

interface PbfLayerProps {
  layerName: string;
  url: string;
  zIndex?: number;
  filed?: string;
  hover?: boolean;
  token?: string;
  style?: StyleFnType;
  hoverStyle?: (feature: FeatureLike) => Style;
  onClick?: (properties?: any) => void;
  onMove?: (properties?: any) => void;
}

export const PbfLayer: FC<PbfLayerProps> = (props) => {
  const {
    url,
    zIndex = PbfLayerIndex,
    filed = "",
    token,
    onClick,
    onMove,
    style,
    hoverStyle,
    layerName,
    hover,
  } = props;
  const config = useMemo(() => ({ method: "GET", headers: { token: token ?? "" } }), [token]);
  const tileLoadFunction = useTileLoadFunction(config);

  const { layer, source } = useLayer({
    layerName,
    zIndex,
    url,
    filed,
    hover,
    onMove,
    onClick,
    style,
    hoverStyle,
  });

  useEffect(() => {
    if (!token) return;
    source.setTileLoadFunction(tileLoadFunction);
  }, [token]);

  useEffect(() => {
    if (!zIndex) return;
    layer.setZIndex(zIndex);
  }, [zIndex]);

  useEffect(() => {
    if (!url) return;
    source.setUrl(url);
    source.refresh();
  }, [url]);
  return <></>;
};

const useLayer = ({
  layerName,
  zIndex,
  url,
  hover = false,
  filed,
  style,
  hoverStyle,
  onClick,
  onMove,
}: {
  layerName: string;
  filed: string;
  zIndex: number;
  hover?: boolean;
  url: string;
  style?: PbfLayerProps["style"];
  hoverStyle?: PbfLayerProps["hoverStyle"];
  onClick?: PbfLayerProps["onClick"];
  onMove?: PbfLayerProps["onMove"];
}) => {
  const map = useMap();
  const selectionRef = useRef<Record<string, string> | {}>({});

  const vectorTileSource = useMemo(
    () =>
      new VectorTileSource({
        url,
        format: new MVT({ layerName }),
        projection: map.getView().getProjection().getCode(),
      }),
    []
  );

  const styleEvent = useEvent(style ? style : defaultStyle(filed));
  const selectedStyled = useEvent((feature: FeatureLike) => {
    const text = feature.get(filed);
    if (text in selectionRef.current) {
      return hoverStyle ? hoverStyle(feature) : defaultHoverStyle(filed)(feature);
    }
  });

  const vectorTileLayer = useMemo(
    () =>
      new VectorTileLayer({
        source: vectorTileSource,
        zIndex,
        style: styleEvent,
      }),
    []
  );

  const selectionLayer = useMemo(
    () =>
      new VectorTileLayer({
        renderMode: "vector",
        source: vectorTileSource,
        zIndex: zIndex + 1,
        style: selectedStyled,
      }),
    []
  );

  const pointermove = useEvent((event: any) => {
    if (!hover) return;
    selectionRef.current = {};
    vectorTileLayer.getFeatures(event.pixel).then((features) => {
      if (!features.length) {
        selectionLayer.changed();
        return;
      }
      const feature = features[0];
      if (!feature) return;
      onMove?.(feature.getProperties());
      const fid: string = feature.get(filed);
      // @ts-ignore
      selectionRef.current[fid] = fid;
      selectionLayer.changed();
    });
  });

  const singleClick = useEvent((e: any) => {
    const feature = map.forEachFeatureAtPixel(e.pixel, (feature) => feature);
    const properties = feature?.getProperties();
    onClick?.(properties);
  });

  const mouseout = useEvent(() => {
    selectionRef.current = {};
    selectionLayer.changed();
  });

  useMount(() => {
    map.addLayer(vectorTileLayer);
    map.addLayer(selectionLayer);
    map.on("pointermove", pointermove);
    map.on("singleclick", singleClick);
    map.getViewport().addEventListener("mouseout", mouseout);
  });
  useUnmount(() => {
    map.un("pointermove", pointermove);
    map.un("singleclick", singleClick);
    map.getViewport().removeEventListener("mouseout", mouseout);
    map.removeLayer(selectionLayer);
    map.removeLayer(vectorTileLayer);
  });
  return { layer: vectorTileLayer, source: vectorTileSource };
};

const useTileLoadFunction = (config: { method: string; headers: { token: string } }) => {
  return useMemo(
    () => (tile: any, url: string) => {
      tile.setLoader(function (extent: Extent, resolution: number, projection: Projection) {
        fetch(url, config).then(function (response) {
          response.arrayBuffer().then(function (data) {
            const format = tile.getFormat();
            const features = format.readFeatures(data, {
              extent: extent,
              featureProjection: projection,
            });
            tile.setFeatures(features);
          });
        });
      });
    },
    []
  );
};

export default PbfLayer;
