import { FC, useEffect, useMemo } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { useMap } from "../hooks/useMap";
import { useMount, useUnmount } from "../hooks/useMount";
import { GeoJsonObject } from "../geojson";
import { GeojsonLayerIndex } from "../shared/layerIndex";
import { useGeojsonSource } from "../hooks/useGeojson";
import { defaultStyle } from "../style";
import { StyleFnType } from "../types/styled";
// import { useMapEvent } from "../hooks/useMapEvent";
import styled from "styled-components";

type FieldType = Parameters<typeof defaultStyle>[number];

interface GeojsonLayerProps {
  geojson: GeoJsonObject;
  id?: string;
  zIndex?: number;
  field?: FieldType;
  onClick?: (properties?: Record<string, any>) => void;
  style?: StyleFnType;
}
let count = 1;

export const GeojsonLayer: FC<GeojsonLayerProps> = ({
  geojson,
  onClick,
  id = "geojson-layer",
  field,
  zIndex = GeojsonLayerIndex,
  style,
}) => {
  const map = useMap();
  // const olEvent = useMapEvent();
  const uuid = useMemo(() => `${id}_${count++}`, [id]);
  const geojsonSource = useGeojsonSource("EPSG:4326", geojson);
  const { source, layer } = useGeojsonLayer(uuid);
  useStyle(layer, style)(field);

  useEffect(() => {
    // onClick && (olEvent[uuid] = onClick);
  }, []);

  useEffect(() => {
    source.clear();
    source.addFeatures(geojsonSource);
  }, [geojson]);

  useEffect(() => {
    layer.setZIndex(zIndex);
  }, [zIndex]);

  useMount(() => map.addLayer(layer));
  useUnmount(() => map.removeLayer(layer));

  return <></>;
};

const useGeojsonLayer = (id: string) => {
  const source = useMemo(() => new VectorSource({ features: [] }), []);
  const layer = useMemo(() => {
    const layer = new VectorLayer({ source });
    layer.set("$$eventProxy", id);
    return layer;
  }, []);
  return { source, layer } as {
    source: VectorSource;
    layer: VectorLayer<VectorSource>;
  };
};

const useStyle: (layer: VectorLayer<VectorSource>, style?: StyleFnType) => (field: FieldType) => void =
  (layer, style) => (field) =>
    useMemo(() => {
      layer.setStyle(style ? style : defaultStyle(field));
    }, [style, field]);
