import { Coordinate } from "ol/coordinate";
import { Extent } from "ol/extent";
import * as Proj from "ol/proj";
import { ProjectionLike, transform } from "ol/proj";

export const conversionEPSG = (
  coordinates: Coordinate[][],
  destination: ProjectionLike
) => {
  if (destination === "EPSG:3857") {
    // 4326 转 3857
    return [
      coordinates[0].map((item) => transform(item, "EPSG:4326", destination)),
    ];
  } else if (destination === "EPSG:4326") {
    // 3857 转 4326
    return [
      coordinates[0].map((item) => transform(item, "EPSG:3857", destination)),
    ];
  } else {
    // 啥都不做
    console.warn("没有进行转换");
    return coordinates;
  }
};

export const transformExtent = (
  extent: Extent,
  source: Proj.ProjectionLike,
  destination: Proj.ProjectionLike
) => Proj.transformExtent(extent, source, destination);

export const transformExtentTo3857 = (extent: Extent) =>
  transformExtent(extent, "EPSG:4326", "EPSG:3857");

export const transformExtentTo4326 = (extent: Extent) =>
  transformExtent(extent, "EPSG:3857", "EPSG:4326");

export const transformCoordinateTo4326 = (coordinate: Coordinate) =>
  transform(coordinate, "EPSG:3857", "EPSG:4326");

export const transformCoordinateTo3857 = (coordinate: Coordinate) =>
  transform(coordinate, "EPSG:4326", "EPSG:3857");
