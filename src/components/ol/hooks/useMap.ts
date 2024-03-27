import { useContext } from "react";
import { MapContext } from "../core";

export const useMap = () => {
  const map = useContext(MapContext);

  if (!map) {
    throw new Error("useMap 必须在 MapProvider 中使用");
  }
  return map;
};
