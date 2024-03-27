import { FC, useEffect } from "react";
import { Coordinate } from "ol/coordinate";
import { useView } from "../hooks/useView";
import { Extent } from "ol/extent";
import { isVoid } from "../shared";
import { viewConfig } from "../shared/viewConfig";

interface MapPositionProps {
  zoom?: number;
  maxZoom?: number;
  minZoom?: number;
  center?: Coordinate;
  extent?: Extent;
  duration?: number;
  padding?: number[];
}

export const MapPosition: FC<MapPositionProps> = ({
  center,
  zoom,
  extent,
  maxZoom,
  minZoom,
  padding,
  duration = 300,
}) => {
  if (!center && !extent) {
    throw new Error("center 和 extent 不能同时为空");
  }

  if (center && isVoid(zoom)) {
    throw new Error("center 和 zoom 需要一起传入");
  }

  if (!isVoid(maxZoom) && !isVoid(minZoom) && maxZoom < minZoom) {
    throw new Error("maxZoom 不能小于 minZoom");
  }

  const { setZoom, setCenter, setExtent, setMinZoom, setMaxZoom } = useView();

  viewConfig.duration = duration;
  viewConfig.zoom = zoom || 0;
  viewConfig.padding = padding || [0, 0, 0, 0];

  useEffect(() => {
    zoom && setZoom(zoom);
  }, [zoom]);

  useEffect(() => {
    center && setCenter(center);
  }, [center]);

  useEffect(() => {
    const options = { padding, duration };
    extent && setExtent(extent, options);
  }, [extent, padding, duration]);

  useEffect(() => {
    !isVoid(minZoom) && setMinZoom(minZoom);
  }, [minZoom]);

  useEffect(() => {
    !isVoid(maxZoom) && setMaxZoom(maxZoom);
  }, [maxZoom]);

  return <></>;
};
