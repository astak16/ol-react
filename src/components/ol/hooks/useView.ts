import { Extent } from "ol/extent";
import { Coordinate } from "ol/coordinate";
import { useMap } from "./useMap";

export const useView = () => {
  const map = useMap();

  const setZoom = (zoom: number) => {
    map.getView().setZoom(zoom);
  };

  const setCenter = (center: Coordinate) => {
    map.getView().setCenter(center);
  };

  const setExtent = (
    extent: Extent,
    options?: { padding?: number[]; duration?: number }
  ) => {
    map.getView().fit(extent, options);
  };

  const setMaxZoom = (maxZoom: number) => {
    map.getView().setMaxZoom(maxZoom);
  };

  const setMinZoom = (minZoom: number) => {
    map.getView().setMinZoom(minZoom);
  };

  return { setZoom, setCenter, setExtent, setMaxZoom, setMinZoom };
};
