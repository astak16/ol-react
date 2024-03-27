import { FC, useEffect, useMemo } from "react";
import { Group as LayerGroup, Tile as TileLayer } from "ol/layer";
import type Tile from "ol/Tile";
import XYZ from "ol/source/XYZ";
import { urls } from "../config";
import { useMap } from "../hooks/useMap";
import { useProjection, useProjectionCode } from "../hooks/useProjection";
import { useMount, useUnmount } from "../hooks/useMount";
import { TileLayerOptions, XYZOptions } from "../types/ol";
import { AnnotationIndex, BaseMapIndex } from "../shared/layerIndex";
import TileState from "ol/TileState";

export interface RequestOptions {
  method: "GET" | "get" | "POST" | "post";
  headers?: Record<string, string>;
  fail?: <T extends any>(res: T) => void;
  success?: <T extends any>(res: T) => void;
}

interface BaseLayerProps {
  type: "satellite" | "vector";
  showAnnotation?: boolean;
  requestOptions?: RequestOptions;
  // XYZ 文档 https://openlayers.org/en/latest/apidoc/module-ol_source_XYZ-XYZ.html
  sourceOptions?: XYZOptions;
  // TileLayer 文档 https://openlayers.org/en/latest/apidoc/module-ol_layer_Tile-TileLayer.html
  layerOptions?: TileLayerOptions;
}

export const BaseLayer: FC<BaseLayerProps> = (props) => {
  const { showAnnotation = true, type, requestOptions, sourceOptions, layerOptions } = props;
  const { xyzSource, xyzSourceAnnotation, xyzLayerAnnotation } = useLayerGroup(sourceOptions, layerOptions);

  const tileLoadFunction = useTileLoadFunction(requestOptions);
  const url = urls[useProjectionCode()];

  const baseMapUrl = useMemo(() => {
    if (!url) return;
    return url[type];
  }, [type, url]);

  const annotationMapUrl = useMemo(() => {
    if (!url) return;
    return url[`${type}Annotation`];
  }, [type, url]);

  useEffect(() => {
    if (!baseMapUrl || !annotationMapUrl) return;
    xyzSource.setUrl(baseMapUrl);
    xyzSourceAnnotation.setUrl(annotationMapUrl);
  }, [type, baseMapUrl, annotationMapUrl]);

  useEffect(() => {
    xyzLayerAnnotation.setVisible(showAnnotation);
  }, [showAnnotation]);

  useEffect(() => {
    if (requestOptions) {
      xyzSource.setTileLoadFunction(tileLoadFunction);
      xyzSourceAnnotation.setTileLoadFunction(tileLoadFunction);
    }
  }, [requestOptions]);

  return <></>;
};

const useLayerGroup = (
  sourceOptions: BaseLayerProps["sourceOptions"],
  layerOptions: BaseLayerProps["layerOptions"]
) => {
  const map = useMap();
  const [xyzSource, xyzLayer] = useCreateXYZ(sourceOptions, {
    ...layerOptions,
    zIndex: BaseMapIndex,
  });
  const [xyzSourceAnnotation, xyzLayerAnnotation] = useCreateXYZ(sourceOptions, {
    ...layerOptions,
    zIndex: AnnotationIndex,
  });

  const layerGroup = useMemo(() => new LayerGroup({ layers: [xyzLayer, xyzLayerAnnotation] }), []);

  useMount(() => map.addLayer(layerGroup));
  useUnmount(() => map.removeLayer(layerGroup));

  return {
    xyzSource,
    xyzLayer,
    xyzSourceAnnotation,
    xyzLayerAnnotation,
  };
};

const useCreateXYZ = (sourceOptions: BaseLayerProps["sourceOptions"], layerOptions: BaseLayerProps["layerOptions"]) => {
  const projection = useProjection();
  const xyzSource = useMemo(() => new XYZ({ projection, ...sourceOptions }), []);
  const xyzLayer = useMemo(() => new TileLayer({ source: xyzSource, ...layerOptions }), []);
  return [xyzSource, xyzLayer] as [XYZ, TileLayer<XYZ>];
};

const useTileLoadFunction = (options: BaseLayerProps["requestOptions"]) => {
  const method = (options?.method || "GET").toUpperCase();
  const headers = options?.headers || {};
  const fail = options?.fail || (() => {});
  const success = options?.success || (() => {});

  return useMemo(
    () => (tile: Tile, src: string) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, src);
      xhr.setRequestHeader("Content-Type", "application/json");
      Object.keys(headers).forEach((key) => {
        const value = headers[key];
        xhr.setRequestHeader(key, value);
      });
      xhr.onload = function () {
        if (xhr.status === 200) {
          // @ts-ignore
          tile.getImage().src = URL.createObjectURL(xhr.response);
          success?.(xhr.response);
        } else {
          fail?.(xhr.response);
          tile.setState(TileState.ERROR);
        }
      };
      xhr.onerror = function (err) {
        fail?.(err);
        tile.setState(TileState.ERROR);
      };
      const data = { url: src };
      xhr.responseType = "blob";
      xhr.send(JSON.stringify(data));
    },
    []
  );
};
