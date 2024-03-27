import tinycolor from "tinycolor2";

export const isFalsy = (value: unknown) => (value === 0 ? false : !value);

// 带类型守卫
export const isVoid = (value: unknown): value is undefined | null | "" =>
  value === undefined || value === null || value === "";

export const isNumber = (num: any): boolean => !isNaN(num) && num !== null && !Array.isArray(num);

export function round(num: number, decimalPlaces: number = 0) {
  const factor = Math.pow(10, decimalPlaces);
  const tempNum = num * factor;
  const roundedTempNum = Math.round(tempNum);
  return roundedTempNum / factor;
}

export const getTransparentColor = (color: string, index: number) =>
  tinycolor(color).setAlpha([0.02, 0.04, 0.09, 0.15, 0.25, 0.45, 0.7, 0.9, 1][index]).toRgbString();
