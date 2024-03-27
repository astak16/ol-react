import { PropsWithChildren, useState, useMemo, CSSProperties } from "react";
import { MapGL, MapPosition, BaseLayer, transformExtentTo3857 } from "../ol";
import { useExtent } from "../../hooks/use-extent";

const Map = ({ children, style }: PropsWithChildren<{ style?: CSSProperties }>) => {
  const [projection] = useState("EPSG:3857");
  const [id] = useState("uccs");

  const { extent } = useExtent();
  const extentAdaptation = useMemo(() => extent && transformExtentTo3857(extent), [extent]);

  return (
    <MapGL id={id} projection={projection} style={style}>
      {extentAdaptation ? (
        <MapPosition maxZoom={18} minZoom={1} padding={[0, 200, 0, 200]} extent={extentAdaptation} />
      ) : null}
      {children}
    </MapGL>
  );
};

export default Map;
