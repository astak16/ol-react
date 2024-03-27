import { FC, ReactNode, RefObject, useEffect, useMemo, useRef } from "react";
import { Vector as VectorSource, Cluster } from "ol/source";
import VectorLayer from "ol/layer/Vector";
import { Style, Icon } from "ol/style";
import Select, { SelectEvent } from "ol/interaction/Select";
import Overlay from "ol/Overlay";
import styled from "styled-components";
import { useMap } from "../hooks/useMap";
import markerIcon from "../images/marker-icon.png";
import { Coordinate } from "ol/coordinate";
import { MarkerIndex } from "../shared/layerIndex";
import { useGeojsonSource } from "../hooks/useGeojson";
import { GeoJsonObject } from "../geojson";
import { StyleFnType } from "../types/styled";
import { useMount, useUnmount } from "../hooks/useMount";
import Feature from "ol/Feature";
import { useEvent } from "../hooks/useEvent";
import { SelectOptions } from "../types/ol";

interface Points {
  [key: string]: Coordinate;
}
interface MarkProps {
  id?: string;
  points?: Points;
  image?: string;
  scale?: number;
  popover?: ReactNode;
  zIndex?: number;
  condition?: SelectOptions["condition"];
  onSelect?: (id: string) => void;
}

export const MarkerLayer: FC<MarkProps> = (props) => {
  const {
    id = "mark-layer",
    points,
    image = markerIcon,
    scale = 1,
    condition,
    onSelect,
    popover,
    zIndex = MarkerIndex,
  } = props;
  const ref = useRef<HTMLDivElement>(null);
  const geojson = useGeojson(points);
  const iconStyle = () => new Style({ image: new Icon({ scale, src: image }) });

  const geojsonSource = useGeojsonSource("EPSG:4326", geojson);
  const overlay = useOverlay({ id, element: ref });
  const pointLayer = useCluster({ zIndex, id, style: iconStyle, features: geojsonSource });
  useInteraction({
    id,
    style: iconStyle,
    condition,
    layers: [pointLayer],
    onSelect: onSelect
      ? (e) => {
          const { selected } = e;
          if (selected.length) {
            const [feature] = selected;
            const _feature = feature.get("features")[0];
            const id = _feature.get("id");
            const coordinate = feature.get("geometry").flatCoordinates;
            overlay.setPosition(coordinate);
            onSelect(id);
          } else {
            overlay.setPosition(undefined);
          }
        }
      : undefined,
  });

  return (
    // 这个div用来解决这个报错：Uncaught DOMException: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.
    <div>
      <PopoverStyled ref={ref}>{popover}</PopoverStyled>
    </div>
  );
};

const useCluster = ({
  features,
  zIndex,
  id,
  style,
}: {
  features: Feature[];
  zIndex: number;
  id: string;
  style: StyleFnType;
}) => {
  const map = useMap();
  const pointSource = useMemo(() => new VectorSource({ features }), []);
  const clusterSource = useMemo(() => new Cluster({ source: pointSource, distance: 50 }), []);
  const pointLayer = useMemo(() => new VectorLayer({ className: id, source: clusterSource, zIndex, style }), []);
  useMount(() => map.addLayer(pointLayer));
  useUnmount(() => map.removeLayer(pointLayer));
  return pointLayer;
};

const useOverlay = ({ id, element }: { id: string; element: RefObject<HTMLDivElement> }) => {
  const map = useMap();
  const overlay = useMemo(() => new Overlay({ id, autoPan: true }), []);
  useEffect(() => {
    if (!element.current) return;
    overlay.setElement(element.current);
  }, [element]);
  useMount(() => map.addOverlay(overlay));
  useUnmount(() => map.removeOverlay(overlay));
  return overlay;
};

const useInteraction = ({
  id,
  layers,
  condition,
  style,
  onSelect,
}: {
  id: string;
  layers: SelectOptions["layers"];
  condition: SelectOptions["condition"];
  style: StyleFnType;
  onSelect?: (e: SelectEvent) => void;
}) => {
  const map = useMap();
  const selectInteraction = useMemo(() => new Select({ condition, hitTolerance: 1, layers, style }), []);
  const selectInteractionEvent = useEvent(onSelect);
  useMount(() => {
    if (onSelect) selectInteraction.on("select", selectInteractionEvent);
    selectInteraction.set(id, "mark");
    map.addInteraction(selectInteraction);
  });
  useUnmount(() => {
    map.removeInteraction(selectInteraction);
    if (onSelect) selectInteractionEvent.un("select", selectInteractionEvent);
  });
  return selectInteraction;
};

const useGeojson = (points?: Points) => {
  return useMemo(
    () =>
      points
        ? ({
            type: "FeatureCollection",
            features: Object.keys(points).map((key) => ({
              type: "Feature",
              properties: { id: key },
              geometry: { type: "Point", coordinates: points[key] },
            })),
          } as GeoJsonObject)
        : null,
    [points]
  );
};

// const Popover = forwardRef((props: PropsWithChildren<any>, ref: ForwardedRef<HTMLDivElement>) => {
//   return <PopoverStyled ref={ref}>{props.children}</PopoverStyled>;
// });

const PopoverStyled = styled.div`
  position: absolute;
  background-color: #fff;
  box-shadow: 0 1px 4px rgb(0 0 0 / 20%);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  white-space: nowrap;
`;
