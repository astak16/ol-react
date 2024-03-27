import { Stroke, Style, Text, Fill } from "ol/style";
import { getTransparentColor } from "../shared";
import { StyleFnType } from "../types/styled";

export const defaultStyle: (field?: string | string[]) => StyleFnType = (field) => (feature) => {
  let text: string = "";
  if (typeof field === "string") {
    text = feature.get(field);
  } else if (Array.isArray(field)) {
    text = field.map((f) => feature.get(f)).join("\n");
  }
  return new Style({
    stroke: new Stroke({
      color: getTransparentColor("#000", 5),
      width: 2,
      lineDashOffset: 10,
    }),
    fill: new Fill({ color: getTransparentColor("#fff", 5) }),
    text: new Text({
      text,
      font: "bold 14px 微软雅黑 Helvetica Neue Helvetica Arial Microsoft Yahei Hiragino Sans GB Heiti SC WenQuanYi Micro Hei sans-serif",
      overflow: true,
      fill: new Fill({ color: "#fff" }),
      stroke: new Stroke({ color: "#000", width: 4 }),
    }),
  });
};

export const defaultHoverStyle: (field?: string | string[]) => StyleFnType = (field) => (feature) => {
  let text: string = "";
  if (typeof field === "string") {
    text = feature.get(field);
  } else if (Array.isArray(field)) {
    text = field.map((f) => feature.get(f)).join("\n");
  }
  return new Style({
    stroke: new Stroke({
      color: getTransparentColor("#faa138", 8),
      width: 2,
      lineDashOffset: 10,
    }),
    fill: new Fill({ color: "#20648d" }),
    text: new Text({
      text,
      font: "bold 14px 微软雅黑 Helvetica Neue Helvetica Arial Microsoft Yahei Hiragino Sans GB Heiti SC WenQuanYi Micro Hei sans-serif",
      overflow: true,
      fill: new Fill({ color: "#052E45" }),
      stroke: new Stroke({ color: "rgba(255,255,255,0.9)", width: 2 }),
    }),
  });
};
