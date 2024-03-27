import { PbfLayer } from "../../components/ol";
import { Stroke, Style, Text, Fill } from "ol/style";
import { FeatureLike } from "ol/Feature";
import { useState } from "react";
import { BaseLayer } from "../../components/ol";
import Map from "../../components/map";
import styled from "styled-components";
import { Button } from "antd";

const urls = {
  0: "http://tb-web-business.gago.top:31257/api/v1/wb/monitor/pbf/{z}/{x}/{y}?startDate=2023-03-15&endDate=2024-03-15&level=0&code=all",
  1: "http://tb-web-business.gago.top:31257/api/v1/wb/monitor/pbf/{z}/{x}/{y}?startDate=2023-03-18&endDate=2024-03-18&level=0&code=130000",
};

const a = {
  "120000": { code: "120000", name: "天津市", color: "#5bbff7" },
  "130000": { code: "130000", name: "河北省", color: "#5bbff7" },
  "140000": { code: "140000", name: "山西省", color: "rgba(49, 197, 148, 1)" },
  "210000": { code: "210000", name: "辽宁省", color: "rgba(255, 51, 102, 1)" },
  "230000": { code: "230000", name: "黑龙江省", color: "rgba(49, 197, 148, 1)" },
  "320000": { code: "320000", name: "江苏省", color: "rgba(49, 197, 148, 1)" },
  "330000": { code: "330000", name: "浙江省", color: "rgba(49, 197, 148, 1)" },
  "350000": { code: "350000", name: "福建省", color: "rgba(49, 197, 148, 1)" },
  "360000": { code: "360000", name: "江西省", color: "rgba(49, 197, 148, 1)" },
  "370000": { code: "370000", name: "山东省", color: "rgba(49, 197, 148, 1)" },
  "410000": { code: "410000", name: "河南省", color: "rgba(49, 197, 148, 1)" },
  "420000": { code: "420000", name: "湖北省", color: "rgba(49, 197, 148, 1)" },
  "430000": { code: "430000", name: "湖南省", color: "rgba(49, 197, 148, 1)" },
  "440000": { code: "440000", name: "广东省", color: "rgba(49, 197, 148, 1)" },
  "450000": { code: "450000", name: "广西壮族自治区", color: "rgba(49, 197, 148, 1)" },
  "520000": { code: "520000", name: "贵州省", color: "rgba(49, 197, 148, 1)" },
  "610000": { code: "610000", name: "陕西省", color: "rgba(49, 197, 148, 1)" },
  "620000": { code: "620000", name: "甘肃省", color: "rgba(49, 197, 148, 1)" },
  "630000": { code: "630000", name: "青海省", color: "rgba(49, 197, 148, 1)" },
  "110000000": { code: "110000000", name: "北京市", color: "#5bbff7" },
};
const b = {
  "130100": { code: "130100", name: "石家庄市", color: "#5bbff7" },
  "130400": { code: "130400", name: "邯郸市", color: "rgba(49, 197, 148, 1)" },
};

const Pbf = () => {
  const [showAnnotation, setShowAnnotation] = useState(true);
  const [type, setType] = useState<"satellite" | "vector">("satellite");
  const [url, setUrl] = useState(urls[0]);
  const [codeColor, setCodeColor] = useState<Record<string, any>>(a);

  const style = (feature: FeatureLike) => {
    const code = feature.get("areaCode") ?? "";
    const color = codeColor[code]?.color;
    return new Style({
      stroke: new Stroke({ width: 2, color: "rgba(71, 231, 255,1)" }),
      fill: new Fill({ color: color ?? "rgba(158, 213, 240,0.2)" }),
      text: new Text({
        maxAngle: 1,
        stroke: new Stroke({ color: "#000000" }),
        fill: new Fill({ color: "#fff" }),
        text: feature.get("name"),
        font: "14px Helvetica Neue Helvetica Arial Microsoft Yahei Hiragino Sans GB Heiti SC WenQuanYi Micro Hei sans-serif",
        overflow: true,
      }),
    });
  };

  const hoverStyle = (feature: FeatureLike) => {
    return new Style({
      stroke: new Stroke({ width: 2, color: "red" }),
      fill: new Fill({ color: "rgba(18, 213, 240,0.6)" }),
      text: new Text({
        maxAngle: 1,
        stroke: new Stroke({ color: "#000000" }),
        fill: new Fill({ color: "#fff" }),
        text: feature.get("name"),
        font: "14px Helvetica Neue Helvetica Arial Microsoft Yahei Hiragino Sans GB Heiti SC WenQuanYi Micro Hei sans-serif",
        overflow: true,
      }),
    });
  };

  const onClickDown = () => {
    setCodeColor(b);
    setUrl(urls[1]);
  };

  const onClickUp = () => {
    setCodeColor(a);
    setUrl(urls[0]);
  };

  return (
    <Map>
      <BaseLayer type={type} showAnnotation={showAnnotation} />
      <PbfLayer
        layerName="boundary"
        url={url}
        token={"bJ9jG12ordnuWwFTnHcMbbAyP7WLMdea"}
        filed="name"
        hover
        hoverStyle={hoverStyle}
        onClick={(p) => {
          setCodeColor(b);
          setUrl(urls[1]);
        }}
        onMove={(a) => {
          // console.log(a);
        }}
        style={style}
      />
      <BottomStyled>
        <Button onClick={onClickDown}>下钻</Button>
        <Button onClick={onClickUp}>返回</Button>
      </BottomStyled>
    </Map>
  );
};

const BottomStyled = styled.div`
  position: absolute;
  z-index: 1;
`;

export default Pbf;
