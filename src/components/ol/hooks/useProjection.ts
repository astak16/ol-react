import { useMap } from "./useMap";

export function useProjection() {
  const map = useMap();
  return map.getView().getProjection().getCode() as string;
}

export function useProjectionCode() {
  const projection = useProjection();
  return projection.split(":")[1] as "4326" | "3857";
}
