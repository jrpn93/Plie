import { ms, mvs, s, vs } from "react-native-size-matters";

export const h = (height: number) => vs(height);
export const w = (width: number) => s(width);
export const mh = (moderateHeight: number, factor?: number) =>
  mvs(moderateHeight, factor);
export const mw = (moderateWidth: number, factor?: number) =>
  ms(moderateWidth, factor);
