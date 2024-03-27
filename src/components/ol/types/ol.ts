import Overlay from "ol/Overlay";
import Draw from "ol/interaction/Draw";
import Modify from "ol/interaction/Modify";
import Select from "ol/interaction/Select";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import XYZ from "ol/source/XYZ";
import Icon from "ol/style/Icon";

export type VectorSourceOptions = ConstructorParameters<typeof VectorSource>[0];

export type IconOption = Omit<NonNullable<ConstructorParameters<typeof Icon>[0]>, "src">;
export type StyleType = NonNullable<ConstructorParameters<typeof VectorLayer<VectorSource>>[0]>["style"];

export type XYZOptions = Omit<NonNullable<ConstructorParameters<typeof XYZ>[0]>, "url" | "tileLoadFunction">;

export type TileLayerOptions = Omit<NonNullable<ConstructorParameters<typeof TileLayer>[0]>, "source">;

export type DrawOptions = ConstructorParameters<typeof Draw>[0];
export type SelectOptions = NonNullable<ConstructorParameters<typeof Select>[0]>;

export type ModifyOptions = ConstructorParameters<typeof Modify>[0];

export type OverlayOptions = Omit<NonNullable<ConstructorParameters<typeof Overlay>[0]>, "element">;
