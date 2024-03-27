import { CSSProperties, PropsWithChildren, createContext, useEffect, useState } from "react";
import Map from "ol/Map";
import Projection from "ol/proj/Projection";
import View from "ol/View";
import styled from "styled-components";
import { PREFIX } from "../config";
import { defaults } from "ol/control";

export type MapGLProps = {
  projection: Projection | string;
  id?: string;
  style?: CSSProperties;
};

export const MapContext = createContext<Map | null>(null);

const initialMap = ({ id, projection }: MapGLProps) =>
  new Map({
    target: id,
    view: new View({ projection }),
    controls: defaults({ zoom: false }),
  });

export const MapContextProvider = ({
  id,
  projection,
  children,
  style
}: PropsWithChildren<MapGLProps>) => {
  const mapId = id || PREFIX;

  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    const map = initialMap({ id: mapId, projection });
    map.on("loadstart", () => map.getTargetElement().classList.add("spinner"));
    map.on("loadend", () => map.getTargetElement().classList.remove("spinner"));
    setMap(map);
    return () => {
      setMap(null);
    };
  }, []);

  return (
    <>
      <MapContext.Provider value={map}>
        <Rooted id={mapId} style={style} />
        {map && children}
      </MapContext.Provider>
    </>
  );
};

const Rooted = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 1;
  cursor: pointer;
  .${PREFIX}__hidden {
    display: none !important;
  }
`;
