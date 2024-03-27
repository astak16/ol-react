import { Coordinate } from "ol/coordinate";
import { useMap } from "./useMap";
import { useCallback } from "react";
import { Extent } from "ol/extent";
import { useCalcCenter, useCalcExtent } from "./useCalc";

const isExtent = (extent: Extent | Coordinate[]): extent is Extent =>
  typeof extent[0] === "number" && extent.length === 4;

export const useFlyToExtent = () => {
  const map = useMap();
  const calcExtent = useCalcExtent();
  return useCallback((coordinate: Extent | Coordinate[]) => {
    const extent = isExtent(coordinate) ? coordinate : calcExtent(coordinate);
    return map.getView().fit(extent, { duration: 300 });
  }, []);
};

export const useFlyToCenter = () => {
  const flyTo = useFlyTo();
  const calcCenter = useCalcCenter();
  return useCallback((coordinate: Coordinate[] | Coordinate) => {
    let center: Coordinate;
    // 计算地块的中心点
    if (typeof coordinate[0] === "number") {
      center = coordinate as Coordinate;
    } else {
      center = calcCenter(coordinate as Coordinate[]);
    }
    return flyTo(center);
  }, []);
};

const useFlyTo = () => {
  const map = useMap();
  return useCallback(
    (coordinate: Coordinate) =>
      map.getView().animate({ center: coordinate, duration: 300, zoom: 16 }),
    []
  );
};
