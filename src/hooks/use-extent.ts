import { Coordinate } from "ol/coordinate";
import { useEffect } from "react";
import { create } from "zustand";

type ExtentType = {
  chinaExtent: Coordinate;
  extent: Coordinate | null;
  setExtent: (extent: ExtentType["extent"]) => void;
};
export const useExtent = create<ExtentType>((set) => ({
  chinaExtent: [73.4872055053711, 18.159370422363338, 135.0872039794922, 53.56178283691406],
  extent: [73.4872055053711, 18.159370422363338, 135.0872039794922, 53.56178283691406],
  setExtent: (extent) => set({ extent }),
}));

export const useJumpToExtent = (extent?: ExtentType["extent"], isUnmount = true) => {
  const { setExtent, chinaExtent } = useExtent();
  useEffect(() => {
    if (extent) setExtent(extent);
    return () => {
      isUnmount && setExtent(chinaExtent);
    };
  }, [extent, isUnmount]);
  return setExtent;
};
