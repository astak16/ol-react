import Map from "../../components/map";
import styled from "styled-components";
import { Button, Space } from "antd";
import { BaseLayer } from "../../components/ol";
import { useState } from "react";
import changqing from "./chongqing.json";
import { GeojsonLayer } from "../../components/ol";
import { GeoJsonObject } from "../../components/ol/geojson";
import { Stroke, Style, Text, Fill } from "ol/style";
import { getTransparentColor } from "../../components/ol/shared";
import { feature } from "../../components/ol/geojson/geojson.helper";
import { FeatureLike } from "ol/Feature";

const Geojson = () => {
  const [showAnnotation, setShowAnnotation] = useState(true);
  const [type, setType] = useState<"satellite" | "vector">("satellite");

  // const style = (feature: FeatureLike) =>
  //   new Style({
  //     stroke: new Stroke({
  //       color: getTransparentColor("rgba(71, 231, 255,1)", 5),
  //       width: 2,
  //       lineDashOffset: 10,
  //     }),
  //     fill: new Fill({ color: getTransparentColor("rgba(112, 255, 160,1)", 5) }),
  //     text: new Text({
  //       text: feature.get("name"),
  //       font: "bold 14px 微软雅黑 Helvetica Neue Helvetica Arial Microsoft Yahei Hiragino Sans GB Heiti SC WenQuanYi Micro Hei sans-serif",
  //       overflow: true,
  //       fill: new Fill({ color: "#fff" }),
  //       stroke: new Stroke({ color: "#000", width: 4 }),
  //     }),
  //   });
  return (
    <Map>
      <BaseLayer type={type} showAnnotation={showAnnotation} />
      <GeojsonLayer geojson={changqing as GeoJsonObject} field={"name"} zIndex={1005} />
    </Map>
  );
};

export default Geojson;
