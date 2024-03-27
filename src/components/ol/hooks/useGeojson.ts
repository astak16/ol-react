import Feature from "ol/Feature";
import GeoJSON from "ol/format/GeoJSON";
import { GeoJsonObject } from "../geojson";
import { useMemo } from "react";
import { useMap } from "./useMap";

export const useGeojsonSource = (dataProjection: OLProjection, geojson?: GeoJsonObject | null) => {
  const map = useMap();
  return useMemo(
    () =>
      new GeoJSON().readFeatures(geojson, {
        dataProjection,
        featureProjection: map.getView().getProjection().getCode(),
      }) as Feature[],
    [dataProjection, geojson]
  );
};
