import { Coordinate } from "ol/coordinate";
import { boundingExtent, getCenter } from "ol/extent";
import { conversionEPSG } from "..";
import { useMap } from "./useMap";
import { useCallback } from "react";

export const useCalcExtent = () => {
  const map = useMap();
  return (coordinate: Coordinate[]) => {
    const extent = boundingExtent(
      conversionEPSG(
        [coordinate] as Coordinate[][],
        map.getView().getProjection().getCode()
      )[0]
    );
    return extent;
  };
};

export const useCalcCenter = () => {
  const calcExtent = useCalcExtent();

  return useCallback((coordinate: Coordinate[]) => {
    return getCenter(calcExtent(coordinate));
  }, []);
};
