import { useState } from "react";
import { BaseLayer, LercLayer } from "../../components/ol";
import Map from "../../components/map";

const Lerc = () => {
  const [showAnnotation, setShowAnnotation] = useState(true);
  const [type, setType] = useState<"satellite" | "vector">("satellite");
  const lercurl =
    "http://tb-web-business.gago.top:31257/api/v1/wb/loss/details/lerc/1004/GS23022120240301001/{z}/{x}/{y}.lerc";
  return (
    <Map>
      <BaseLayer type={type} showAnnotation={showAnnotation} />
      <LercLayer
        url={lercurl}
        token={"uAStrkZafi2mnFpz87B6qwJWqw9hMazG"}
        stops={[
          [0.9, 1.9, "#4aaa73", "#4aaa73"],
          [1.9, 2.9, "#e2ed56", "#e2ed56"],
          [2.9, 3.9, "#fdd868", "#fdd868"],
          [3.9, 4.9, "#f98659", "#f98659"],
          [4.9, 5.9, "#d53553", "#d53553"],
        ]}
        gradientType="exponential"
        zIndex={1005}
      />
    </Map>
  );
};

export default Lerc;
