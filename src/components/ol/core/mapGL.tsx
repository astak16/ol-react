import { PropsWithChildren } from "react";
import { MapContextProvider, MapGLProps } from ".";

export const MapGL = ({
  children,
  ...restProps
}: PropsWithChildren<MapGLProps>) => {
  return <MapContextProvider {...restProps}>{children}</MapContextProvider>;
};
